import { mkdir, readFile, writeFile } from "fs/promises";
import { existsSync } from "fs";
import path from "path";
import { Redis } from "@upstash/redis";

function parseEnvFile(filePath) {
  if (!existsSync(filePath)) return {};
  return readFile(filePath, "utf8").then((raw) =>
    Object.fromEntries(
      raw
        .split("\n")
        .map((line) => line.trim())
        .filter((line) => line && !line.startsWith("#") && line.includes("="))
        .map((line) => {
          const idx = line.indexOf("=");
          return [line.slice(0, idx), line.slice(idx + 1)];
        })
    )
  );
}

function toStringList(raw) {
  if (raw == null) return [];
  if (Array.isArray(raw)) return raw.map(String);
  if (raw instanceof Set) return Array.from(raw, (v) => String(v));
  if (typeof raw === "object") {
    if (Array.isArray(raw.result)) return raw.result.map(String);
    if (Array.isArray(raw.keys)) return raw.keys.map(String);
    if (Array.isArray(raw.members)) return raw.members.map(String);
  }
  return [];
}

function unwrapRedisResult(raw) {
  if (raw == null) return raw;
  if (typeof raw !== "object" || Array.isArray(raw)) return raw;
  if ("result" in raw) return raw.result;
  return raw;
}

function parsePostRecord(raw) {
  if (raw == null) return null;
  if (typeof raw === "string") {
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  }
  if (typeof raw === "object") return raw;
  return null;
}

async function main() {
  const cwd = process.cwd();
  const env = await parseEnvFile(path.join(cwd, ".env.production"));
  const url = env.UPSTASH_REDIS_REST_URL || process.env.UPSTASH_REDIS_REST_URL;
  const token = env.UPSTASH_REDIS_REST_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) {
    throw new Error("UPSTASH_REDIS_REST_URL/TOKEN are required in .env.production");
  }

  const redis = new Redis({ url, token });
  const POST_SLUGS_SET = "marsmedia:posts:v2:slugs";
  const POST_ITEM_KEY_PREFIX = "marsmedia:posts:v2:item:";
  const localFile = path.join(cwd, ".local", "remote-posts.json");

  let slugs = toStringList(await redis.smembers(POST_SLUGS_SET));
  if (slugs.length === 0) {
    const keys = toStringList(await redis.keys(`${POST_ITEM_KEY_PREFIX}*`));
    slugs = keys
      .map((k) => (k.startsWith(POST_ITEM_KEY_PREFIX) ? k.slice(POST_ITEM_KEY_PREFIX.length) : ""))
      .filter(Boolean);
  }
  if (slugs.length === 0) {
    console.log("No posts found in Upstash.");
    return;
  }

  const values = unwrapRedisResult(await redis.mget(...slugs.map((s) => `${POST_ITEM_KEY_PREFIX}${s}`)));
  const arr = Array.isArray(values) ? values : values == null ? [] : [values];
  const posts = arr.map(parsePostRecord).filter(Boolean);

  await mkdir(path.dirname(localFile), { recursive: true });
  await writeFile(localFile, `${JSON.stringify(posts, null, 2)}\n`, "utf8");
  console.log(`Migrated ${posts.length} posts to ${localFile}`);
}

main().catch((e) => {
  console.error(e instanceof Error ? e.message : e);
  process.exit(1);
});
