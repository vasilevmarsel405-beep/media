import { existsSync } from "fs";
import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";
import { Redis } from "@upstash/redis";
import type { Post } from "./types";

const KEY = "marsmedia:posts:v1";

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

function getClient(): Redis | null {
  if (!hasUpstash()) return null;
  return new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL!,
    token: process.env.UPSTASH_REDIS_REST_TOKEN!,
  });
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
    const raw = await redis.get(KEY);
    if (raw == null) return [];
    try {
      const parsed = typeof raw === "string" ? JSON.parse(raw) : raw;
      if (!Array.isArray(parsed)) return [];
      return parsed as Post[];
    } catch {
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
    await redis.set(KEY, JSON.stringify(posts));
    return;
  }
  if (mode === "local") {
    await writeToLocalFile(posts);
    return;
  }
  throw new Error("Redis is not configured");
}

export async function upsertRemotePost(post: Post): Promise<void> {
  const list = await readRemotePostsRaw();
  const idx = list.findIndex((p) => p.slug === post.slug);
  if (idx >= 0) list[idx] = post;
  else list.push(post);
  await writeRemotePostsRaw(list);
}

export async function deleteRemotePost(slug: string): Promise<boolean> {
  const list = await readRemotePostsRaw();
  const next = list.filter((p) => p.slug !== slug);
  if (next.length === list.length) return false;
  await writeRemotePostsRaw(next);
  return true;
}
