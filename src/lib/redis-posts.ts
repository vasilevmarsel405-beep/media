import { existsSync } from "fs";
import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";
import { Redis } from "@upstash/redis";
import type { Post } from "./types";

/** Старый формат: один огромный JSON — каждый upsert читал/писал всё (nginx 504 при большом каталоге). */
const LEGACY_POSTS_KEY = "marsmedia:posts:v1";

/** Новый формат: пост отдельно, индекс — Redis SET slug'ов. */
const POST_SLUGS_SET = "marsmedia:posts:v2:slugs";

/** Версия коллекции постов (для синхронизации in-memory кеша между воркерами PM2). */
const POSTS_VERSION_KEY = "marsmedia:posts:v2:version";
const POST_ITEM_KEY_PREFIX = "marsmedia:posts:v2:item:";

function postItemKey(slug: string): string {
  return `${POST_ITEM_KEY_PREFIX}${slug}`;
}

const MGET_CHUNK = 120;

function localPostsFile(): string {
  return path.join(process.cwd(), ".local", "remote-posts.json");
}

function hasUpstash(): boolean {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  return Boolean(url && token);
}

export type PostsStorageMode = "upstash" | "local" | "off";

/**
 * upstash — облако (Upstash Redis): прод, Make, аналитика.
 * local — только development: JSON в .local/remote-posts.json без регистрации.
 * off — production без переменных: чтение материалов только из кода, правки недоступны.
 */
export function getPostsStorageMode(): PostsStorageMode {
  if (hasUpstash()) return "upstash";
  if (process.env.NODE_ENV === "development" && process.env.DISABLE_LOCAL_POSTS_FILE !== "1") {
    return "local";
  }
  return "off";
}

/** Подключён ли облачный Redis (то же хранилище, что и для аналитики). */
export function hasUpstashRedis(): boolean {
  return hasUpstash();
}

/** Можно ли сохранять/удалять материалы через API и админку. */
export function isRemotePostsConfigured(): boolean {
  return getPostsStorageMode() !== "off";
}

/** Один клиент на процесс — меньше накладных расходов и риска вложенных коннектов. */
let cachedRedis: Redis | null = null;

function upstashRetry() {
  const raw = process.env.UPSTASH_REDIS_RETRIES?.trim();
  const n = raw ? Math.min(5, Math.max(0, parseInt(raw, 10) || 2)) : 2;
  return {
    retries: n,
    backoff: (retryCount: number) => Math.min(400 * (retryCount + 1), 2500),
  };
}

function getClient(): Redis | null {
  if (!hasUpstash()) return null;
  if (cachedRedis) return cachedRedis;
  cachedRedis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL!,
    token: process.env.UPSTASH_REDIS_REST_TOKEN!,
    /** По умолчанию в SDK 5 попыток и exp backoff — при тупняке сети страница «висит» минутами. */
    retry: upstashRetry(),
  });
  return cachedRedis;
}

/** Текущая версия постов в Redis. При изменении (upsert/delete) воркеры должны перечитать ленту. */
export async function getPostsCacheVersion(): Promise<number> {
  const redis = getClient();
  if (!redis) return 0;
  const raw = await redis.get(POSTS_VERSION_KEY);
  if (raw == null) return 0;
  const n = typeof raw === "number" ? raw : parseInt(String(raw), 10);
  return Number.isFinite(n) ? n : 0;
}

function hasPipelineError(value: unknown): string | null {
  if (value == null) return null;
  if (Array.isArray(value)) {
    for (const item of value) {
      const err = hasPipelineError(item);
      if (err) return err;
    }
    return null;
  }
  if (typeof value === "object") {
    const rec = value as Record<string, unknown>;
    if (typeof rec.error === "string" && rec.error.trim()) return rec.error;
    if (typeof rec.result === "string" && /^ERR\b/i.test(rec.result)) return rec.result;
    return null;
  }
  if (typeof value === "string" && /^ERR\b/i.test(value)) return value;
  return null;
}

function assertPipelineOk(result: unknown): void {
  const err = hasPipelineError(result);
  if (err) throw new Error(`Redis pipeline error: ${err}`);
}

function redisReadTimeoutMs(): number {
  const raw = process.env.REDIS_READ_TIMEOUT_MS?.trim();
  const n = raw ? Number(raw) : 12_000;
  if (!Number.isFinite(n)) return 12_000;
  return Math.min(120_000, Math.max(4000, n));
}

async function withTimeout<T>(label: string, ms: number, fn: () => Promise<T>): Promise<T> {
  let timer: ReturnType<typeof setTimeout> | undefined;
  const timeout = new Promise<never>((_, rej) => {
    timer = setTimeout(() => rej(new Error(`${label}: timeout ${ms}ms`)), ms);
  });
  try {
    return await Promise.race([fn(), timeout]);
  } finally {
    if (timer) clearTimeout(timer);
  }
}

function parsePostsArray(raw: unknown): Post[] {
  if (raw == null) return [];
  try {
    const parsed = typeof raw === "string" ? JSON.parse(raw) : raw;
    if (!Array.isArray(parsed)) return [];
    return parsed as Post[];
  } catch {
    return [];
  }
}

/**
 * Все параллельные запросы ждут одну и ту же миграцию.
 * Раньше `migrationDone = true` ставился до `await get` — второй запрос выходил сразу и не ждал первого → гонки и 504.
 */
let migrationPromise: Promise<void> | null = null;

async function migrateLegacyToV2IfPresent(redis: Redis): Promise<void> {
  if (!migrationPromise) {
    migrationPromise = (async () => {
      const legacyRaw = await redis.get(LEGACY_POSTS_KEY);
      if (legacyRaw == null) return;

      const posts = parsePostsArray(legacyRaw);
      const pipe = redis.pipeline();
      for (const p of posts) {
        if (!p?.slug) continue;
        pipe.set(postItemKey(p.slug), JSON.stringify(p));
        pipe.sadd(POST_SLUGS_SET, p.slug);
      }
      pipe.del(LEGACY_POSTS_KEY);
      const res = await pipe.exec();
      assertPipelineOk(res);
    })().catch((e) => {
      migrationPromise = null;
      throw e;
    });
  }
  await migrationPromise;
}

async function ensureSlugsIndexType(redis: Redis): Promise<void> {
  const t = await redis.type(POST_SLUGS_SET);
  const type = String(t ?? "");
  if (type === "" || type === "none" || type === "set") return;
  // WRONGTYPE на индексе ломает публикации: SADD/SMEMBERS тихо деградируют в pipeline.
  await redis.del(POST_SLUGS_SET);
}

async function rebuildSlugsIndexFromItems(redis: Redis): Promise<number> {
  const keys = await redis.keys(`${POST_ITEM_KEY_PREFIX}*`);
  const list = Array.isArray(keys) ? keys.map(String) : [];
  if (list.length === 0) return 0;
  const pipe = redis.pipeline();
  for (const k of list) {
    const slug = k.startsWith(POST_ITEM_KEY_PREFIX) ? k.slice(POST_ITEM_KEY_PREFIX.length) : "";
    if (!slug) continue;
    pipe.sadd(POST_SLUGS_SET, slug);
  }
  const res = await pipe.exec();
  assertPipelineOk(res);
  return list.length;
}

async function mgetValues(redis: Redis, keys: string[]): Promise<(string | object | null)[]> {
  if (keys.length === 0) return [];
  const out: (string | object | null)[] = [];
  for (let i = 0; i < keys.length; i += MGET_CHUNK) {
    const slice = keys.slice(i, i + MGET_CHUNK);
    const raw = await redis.mget(...slice);
    const batch = Array.isArray(raw) ? raw : raw == null ? [] : [raw];
    for (const item of batch) {
      if (item == null) out.push(null);
      else if (typeof item === "string") out.push(item);
      else if (typeof item === "object") out.push(item);
      else out.push(String(item));
    }
  }
  return out;
}

function parsePostRecord(raw: string | object): Post | null {
  if (typeof raw === "string") {
    try {
      return JSON.parse(raw) as Post;
    } catch {
      return null;
    }
  }
  if (typeof raw === "object" && raw != null) {
    return raw as Post;
  }
  return null;
}

async function readFromLocalFile(): Promise<Post[]> {
  const file = localPostsFile();
  try {
    if (!existsSync(file)) return [];
    const raw = await readFile(file, "utf8");
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed as Post[];
  } catch {
    return [];
  }
}

async function writeToLocalFile(posts: Post[]): Promise<void> {
  const file = localPostsFile();
  await mkdir(path.dirname(file), { recursive: true });
  await writeFile(file, `${JSON.stringify(posts, null, 2)}\n`, "utf8");
}

async function readRemotePostsFromUpstash(): Promise<Post[]> {
  const redis = getClient();
  if (!redis) return [];
  await migrateLegacyToV2IfPresent(redis);
  await ensureSlugsIndexType(redis);

  let slugs = await redis.smembers(POST_SLUGS_SET);
  let list = Array.isArray(slugs) ? slugs.map(String) : [];
  if (list.length === 0) {
    const version = await getPostsCacheVersion();
    if (version > 0) {
      const repaired = await rebuildSlugsIndexFromItems(redis);
      if (repaired > 0) {
        slugs = await redis.smembers(POST_SLUGS_SET);
        list = Array.isArray(slugs) ? slugs.map(String) : [];
      }
    }
  }
  if (list.length === 0) return [];

  const keys = list.map(postItemKey);
  const values = await mgetValues(redis, keys);
  const posts: Post[] = [];
  for (let i = 0; i < values.length; i++) {
    const v = values[i];
    if (v == null) continue;
    const post = parsePostRecord(v);
    if (post) posts.push(post);
  }
  return posts;
}

export async function readRemotePostsRaw(): Promise<Post[]> {
  const mode = getPostsStorageMode();
  if (mode === "upstash") {
    const ms = redisReadTimeoutMs();
    try {
      return await withTimeout("readRemotePostsRaw", ms, () => readRemotePostsFromUpstash());
    } catch (e) {
      console.error("[redis-posts] readRemotePostsRaw failed — отдаём пустой remote, сайт не должен висеть", e);
      return [];
    }
  }
  if (mode === "local") {
    return readFromLocalFile();
  }
  return [];
}

export async function writeRemotePostsRaw(posts: Post[]): Promise<void> {
  const mode = getPostsStorageMode();
  if (mode === "upstash") {
    const redis = getClient();
    if (!redis) throw new Error("Redis is not configured");
    await migrateLegacyToV2IfPresent(redis);
    await ensureSlugsIndexType(redis);

    const existing = await redis.smembers(POST_SLUGS_SET);
    const oldSlugs = new Set((Array.isArray(existing) ? existing : []).map(String));
    const pipe = redis.pipeline();
    for (const s of oldSlugs) {
      pipe.del(postItemKey(s));
    }
    pipe.del(POST_SLUGS_SET);
    for (const p of posts) {
      pipe.set(postItemKey(p.slug), JSON.stringify(p));
      pipe.sadd(POST_SLUGS_SET, p.slug);
    }
    // Одна инкремент-операция после полной перезаписи.
    pipe.incr(POSTS_VERSION_KEY);
    const res = await pipe.exec();
    assertPipelineOk(res);
    return;
  }
  if (mode === "local") {
    await writeToLocalFile(posts);
    return;
  }
  throw new Error("Redis is not configured");
}

export async function upsertRemotePost(post: Post): Promise<void> {
  const mode = getPostsStorageMode();
  if (mode === "upstash") {
    const redis = getClient();
    if (!redis) throw new Error("Redis is not configured");
    await migrateLegacyToV2IfPresent(redis);
    await ensureSlugsIndexType(redis);
    const pipe = redis.pipeline();
    pipe.set(postItemKey(post.slug), JSON.stringify(post));
    pipe.sadd(POST_SLUGS_SET, post.slug);
    pipe.incr(POSTS_VERSION_KEY);
    const res = await pipe.exec();
    assertPipelineOk(res);
    return;
  }
  if (mode === "local") {
    const list = await readFromLocalFile();
    const idx = list.findIndex((p) => p.slug === post.slug);
    if (idx >= 0) list[idx] = post;
    else list.push(post);
    await writeToLocalFile(list);
    return;
  }
  throw new Error("Redis is not configured");
}

export async function deleteRemotePost(slug: string): Promise<boolean> {
  const mode = getPostsStorageMode();
  if (mode === "upstash") {
    const redis = getClient();
    if (!redis) throw new Error("Redis is not configured");
    await migrateLegacyToV2IfPresent(redis);
    const key = postItemKey(slug);
    const prev = await redis.get(key);
    if (prev == null) return false;
    await redis.del(key);
    await redis.srem(POST_SLUGS_SET, slug);
    await redis.incr(POSTS_VERSION_KEY);
    return true;
  }
  if (mode === "local") {
    const list = await readFromLocalFile();
    const next = list.filter((p) => p.slug !== slug);
    if (next.length === list.length) return false;
    await writeToLocalFile(next);
    return true;
  }
  throw new Error("Redis is not configured");
}
