import { Redis } from "@upstash/redis";
import type { PostKind } from "./types";

const P = "mars:analytics";

/** Лимит событий трекинга с одного IP в минуту (только при настроенном Redis). */
const TRACK_RL_MAX = 200;
const TRACK_RL_WINDOW_SEC = 60;

function client(): Redis | null {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;
  return new Redis({ url, token });
}

export function isAnalyticsConfigured(): boolean {
  return Boolean(process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN);
}

/** Возвращает false, если лимит превышен. Без Redis — пропускает (как и запись визитов). */
export async function checkTrackRateLimit(clientKey: string): Promise<boolean> {
  const redis = client();
  if (!redis) return true;
  const safe = clientKey.replace(/[^a-zA-Z0-9.:_-]/g, "").slice(0, 128) || "unknown";
  const key = `${P}:ratelimit:track:${safe}`;
  const n = await redis.incr(key);
  if (n === 1) await redis.expire(key, TRACK_RL_WINDOW_SEC);
  return n <= TRACK_RL_MAX;
}

/** /novosti/slug → news + slug */
export function parsePublicationPath(pathname: string): { kind: PostKind; slug: string } | null {
  const m = pathname.replace(/\/$/, "").match(/^\/(novosti|stati|analitika|intervyu|video)\/([^/]+)$/);
  if (!m) return null;
  const map: Record<string, PostKind> = {
    novosti: "news",
    stati: "article",
    analitika: "analytics",
    intervyu: "interview",
    video: "video",
  };
  const kind = map[m[1]];
  if (!kind) return null;
  return { kind, slug: m[2] };
}

function zsetPairs(raw: unknown): { member: string; score: number }[] {
  if (!Array.isArray(raw)) return [];
  const out: { member: string; score: number }[] = [];
  for (let i = 0; i + 1 < raw.length; i += 2) {
    out.push({ member: String(raw[i]), score: Number(raw[i + 1]) });
  }
  return out;
}

function dayKey(d: Date): string {
  return d.toISOString().slice(0, 10);
}

function monthKey(d: Date): string {
  return d.toISOString().slice(0, 7);
}

function lastNDayKeys(n: number): string[] {
  const keys: string[] = [];
  for (let i = 0; i < n; i++) {
    const d = new Date();
    d.setUTCDate(d.getUTCDate() - i);
    keys.push(`${P}:visitors:day:${dayKey(d)}`);
  }
  return keys;
}

export async function recordVisit(params: {
  visitorId: string;
  sessionId: string;
  path: string;
}): Promise<void> {
  const redis = client();
  if (!redis) return;

  const now = Date.now();
  const d = new Date();

  await redis.zadd(`${P}:presence`, { score: now, member: params.sessionId });
  await redis.zremrangebyscore(`${P}:presence`, 0, now - 5 * 60 * 1000);

  await redis.sadd(`${P}:visitors:all`, params.visitorId);
  await redis.sadd(`${P}:visitors:day:${dayKey(d)}`, params.visitorId);
  await redis.sadd(`${P}:visitors:month:${monthKey(d)}`, params.visitorId);

  const pub = parsePublicationPath(params.path);
  if (pub) {
    await redis.zincrby(`${P}:postviews`, 1, pub.slug);
  }

  await redis.zincrby(`${P}:paths`, 1, params.path);
}

export type AnalyticsSnapshot = {
  onlineNow: number;
  visitorsLifetime: number;
  visitorsWeek: number;
  visitorsMonth: number;
  topPosts: { slug: string; views: number }[];
  topPaths: { path: string; views: number }[];
};

/** Только «онлайн» за ~5 мин — для шапки сайта без тяжёлого снимка. */
export async function getOnlineNowCount(): Promise<number | null> {
  const redis = client();
  if (!redis) return null;
  const now = Date.now();
  await redis.zremrangebyscore(`${P}:presence`, 0, now - 5 * 60 * 1000);
  const n = await redis.zcard(`${P}:presence`);
  return n;
}

export async function getAnalyticsSnapshot(): Promise<AnalyticsSnapshot | null> {
  const redis = client();
  if (!redis) return null;

  const now = Date.now();
  await redis.zremrangebyscore(`${P}:presence`, 0, now - 5 * 60 * 1000);
  const onlineNow = await redis.zcard(`${P}:presence`);

  const visitorsLifetime = await redis.scard(`${P}:visitors:all`);

  const dayKeys = lastNDayKeys(7);
  const weekSeen = new Set<string>();
  for (const key of dayKeys) {
    const members = await redis.smembers(key);
    if (Array.isArray(members)) {
      for (const m of members) weekSeen.add(String(m));
    }
  }
  const visitorsWeek = weekSeen.size;

  const visitorsMonth = await redis.scard(`${P}:visitors:month:${monthKey(new Date())}`);

  const rawPosts = await redis.zrange(`${P}:postviews`, 0, 24, {
    rev: true,
    withScores: true,
  });
  const topPosts = zsetPairs(rawPosts).map(({ member, score }) => ({
    slug: member,
    views: Math.round(score),
  }));

  const rawPaths = await redis.zrange(`${P}:paths`, 0, 14, {
    rev: true,
    withScores: true,
  });
  const topPaths = zsetPairs(rawPaths).map(({ member, score }) => ({
    path: member,
    views: Math.round(score),
  }));

  return {
    onlineNow,
    visitorsLifetime,
    visitorsWeek,
    visitorsMonth,
    topPosts,
    topPaths,
  };
}
