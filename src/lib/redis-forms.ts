import { Redis } from "@upstash/redis";

const P = "mars:forms";

function client(): Redis | null {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;
  return new Redis({ url, token });
}

export function isFormsBackendAvailable(): boolean {
  return Boolean(process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN);
}

const EMAIL_KEY = `${P}:newsletter:emails`;
const CONTACT_KEY = `${P}:contact:log`;
const RL_NEWS = `${P}:ratelimit:newsletter`;
const RL_CONTACT = `${P}:ratelimit:contact`;

const RL_MAX = 10;
const RL_WINDOW_SEC = 3600;

async function incrRl(keyPrefix: string, clientKey: string): Promise<boolean> {
  const redis = client();
  if (!redis) return true;
  const safe = clientKey.replace(/[^a-zA-Z0-9.:_-]/g, "").slice(0, 128) || "unknown";
  const key = `${keyPrefix}:${safe}`;
  const n = await redis.incr(key);
  if (n === 1) await redis.expire(key, RL_WINDOW_SEC);
  return n <= RL_MAX;
}

export async function checkNewsletterRateLimit(ipKey: string): Promise<boolean> {
  return incrRl(RL_NEWS, ipKey);
}

export async function checkContactRateLimit(ipKey: string): Promise<boolean> {
  return incrRl(RL_CONTACT, ipKey);
}

export async function saveNewsletterEmail(email: string): Promise<void> {
  const redis = client();
  if (!redis) throw new Error("Redis unavailable");
  const e = email.trim().toLowerCase();
  await redis.sadd(EMAIL_KEY, e);
}

export async function saveContactMessage(payload: {
  name: string;
  email: string;
  message: string;
  createdAt: string;
}): Promise<void> {
  const redis = client();
  if (!redis) throw new Error("Redis unavailable");
  const line = JSON.stringify(payload);
  await redis.lpush(CONTACT_KEY, line);
  await redis.ltrim(CONTACT_KEY, 0, 499);
}
