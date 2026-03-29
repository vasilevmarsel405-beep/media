import { Redis } from "@upstash/redis";

const PREFIX = "mars:newsletter";
const SET_KEY = `${PREFIX}:emails`;

function client(): Redis | null {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;
  return new Redis({ url, token });
}

export async function checkNewsletterRateLimit(clientKey: string): Promise<boolean> {
  const redis = client();
  if (!redis) return true;
  const safe = clientKey.replace(/[^a-zA-Z0-9.:_-]/g, "").slice(0, 128) || "unknown";
  const key = `${PREFIX}:ratelimit:${safe}`;
  const n = await redis.incr(key);
  if (n === 1) await redis.expire(key, 3600);
  return n <= 10;
}

/** Возвращает true если email новый, false если уже был в списке. */
export async function addNewsletterEmail(email: string): Promise<{ ok: boolean; duplicate: boolean }> {
  const redis = client();
  if (!redis) return { ok: false, duplicate: false };
  const added = await redis.sadd(SET_KEY, email.toLowerCase().trim());
  return { ok: true, duplicate: added === 0 };
}
