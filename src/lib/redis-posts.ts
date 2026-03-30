import { existsSync } from "fs";
import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";
import { Redis } from "@upstash/redis";
import type { Post } from "./types";

/** Старый формат: один огромный JSON — каждый upsert читал/писал всё (nginx 504 при большом каталоге). */
const LEGACY_POSTS_KEY = "marsmedia:posts:v1";

/** Новый формат: пост отдельно, индекс — Redis SET slug'ов. */
const POST_SLUGS_SET = "marsmedia:posts:v2:slugs";

function postItemKey(slug: string): string {
  return `marsmedia:posts:v2:item:${slug}`;
}

const MGET_CHUNK = 80;

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

function getClient(): Redis | null {
  if (!hasUpstash()) return null;
  if (cachedRedis) return cachedRedis;
  cachedRedis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL!,
    token: process.env.UPSTASH_REDIS_REST_TOKEN!,
  });
  return cachedRedis;
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
      await pipe.exec();
    })().catch((e) => {
      migrationPromise = null;
      throw e;
    });
  }
  await migrationPromise;
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

export async function readRemotePostsRaw(): Promise<Post[]> {
  const mode = getPostsStorageMode();
  if (mode === "upstash") {
    const redis = getClient();
    if (!redis) return [];
    await migrateLegacyToV2IfPresent(redis);

    const slugs = await redis.smembers(POST_SLUGS_SET);
    const list = Array.isArray(slugs) ? slugs.map(String) : [];
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
    await pipe.exec();
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
    const pipe = redis.pipeline();
    pipe.set(postItemKey(post.slug), JSON.stringify(post));
    pipe.sadd(POST_SLUGS_SET, post.slug);
    await pipe.exec();
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
