import { Redis } from "@upstash/redis";

const KEY = "mars:contact:inbox";

function client(): Redis | null {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;
  return new Redis({ url, token });
}

export async function checkContactRateLimit(clientKey: string): Promise<boolean> {
  const redis = client();
  if (!redis) return true;
  const safe = clientKey.replace(/[^a-zA-Z0-9.:_-]/g, "").slice(0, 128) || "unknown";
  const k = `${KEY}:ratelimit:${safe}`;
  const n = await redis.incr(k);
  if (n === 1) await redis.expire(k, 3600);
  return n <= 5;
}

export async function appendContactMessage(entry: {
  email: string;
  message: string;
  name?: string;
}): Promise<boolean> {
  const redis = client();
  if (!redis) return false;
  const payload = JSON.stringify({
    ...entry,
    at: Date.now(),
  });
  await redis.lpush(KEY, payload);
  await redis.ltrim(KEY, 0, 499);
  return true;
}
