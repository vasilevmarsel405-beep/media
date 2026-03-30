import type { PostKind } from "./types";
import { updateStore } from "./vps-json-store";

/** Лимит событий трекинга с одного IP в минуту. */
const TRACK_RL_MAX = 200;
const TRACK_RL_WINDOW_SEC = 60;
const PRESENCE_WINDOW_MS = 5 * 60 * 1000;
const STORE = "analytics";

type AnalyticsStore = {
  presence: Record<string, number>;
  visitorsAll: string[];
  visitorsByDay: Record<string, string[]>;
  visitorsByMonth: Record<string, string[]>;
  postviews: Record<string, number>;
  paths: Record<string, number>;
  trackRateLimit: Record<string, { count: number; resetAt: number }>;
};

const FALLBACK: AnalyticsStore = {
  presence: {},
  visitorsAll: [],
  visitorsByDay: {},
  visitorsByMonth: {},
  postviews: {},
  paths: {},
  trackRateLimit: {},
};

export function isAnalyticsConfigured(): boolean {
  return process.env.DISABLE_LOCAL_ANALYTICS !== "1";
}

/** Возвращает false, если лимит превышен. */
export async function checkTrackRateLimit(clientKey: string): Promise<boolean> {
  const safe = clientKey.replace(/[^a-zA-Z0-9.:_-]/g, "").slice(0, 128) || "unknown";
  let allowed = true;
  await updateStore(STORE, FALLBACK, (prev) => {
    const now = Date.now();
    const rl = { ...prev.trackRateLimit };
    for (const [k, v] of Object.entries(rl)) {
      if (v.resetAt <= now) delete rl[k];
    }
    const cur = rl[safe];
    if (!cur || cur.resetAt <= now) {
      rl[safe] = { count: 1, resetAt: now + TRACK_RL_WINDOW_SEC * 1000 };
      allowed = true;
    } else {
      cur.count += 1;
      allowed = cur.count <= TRACK_RL_MAX;
    }
    return { ...prev, trackRateLimit: rl };
  });
  return allowed;
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

function dayKey(d: Date): string {
  return d.toISOString().slice(0, 10);
}

function monthKey(d: Date): string {
  return d.toISOString().slice(0, 7);
}

function lastNDayIds(n: number): string[] {
  const keys: string[] = [];
  for (let i = 0; i < n; i++) {
    const d = new Date();
    d.setUTCDate(d.getUTCDate() - i);
    keys.push(dayKey(d));
  }
  return keys;
}

export async function recordVisit(params: {
  visitorId: string;
  sessionId: string;
  path: string;
}): Promise<void> {
  const now = Date.now();
  const d = new Date();
  await updateStore(STORE, FALLBACK, (prev) => {
    const presence = { ...prev.presence, [params.sessionId]: now };
    for (const [sid, ts] of Object.entries(presence)) {
      if (ts < now - PRESENCE_WINDOW_MS) delete presence[sid];
    }

    const all = new Set(prev.visitorsAll);
    all.add(params.visitorId);

    const day = dayKey(d);
    const month = monthKey(d);
    const daySet = new Set(prev.visitorsByDay[day] ?? []);
    daySet.add(params.visitorId);
    const monthSet = new Set(prev.visitorsByMonth[month] ?? []);
    monthSet.add(params.visitorId);

    const postviews = { ...prev.postviews };
    const pub = parsePublicationPath(params.path);
    if (pub) postviews[pub.slug] = (postviews[pub.slug] ?? 0) + 1;

    const paths = { ...prev.paths, [params.path]: (prev.paths[params.path] ?? 0) + 1 };

    return {
      ...prev,
      presence,
      visitorsAll: [...all],
      visitorsByDay: { ...prev.visitorsByDay, [day]: [...daySet] },
      visitorsByMonth: { ...prev.visitorsByMonth, [month]: [...monthSet] },
      postviews,
      paths,
    };
  });
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
  if (!isAnalyticsConfigured()) return null;
  const now = Date.now();
  const state = await updateStore(STORE, FALLBACK, (prev) => {
    const presence = { ...prev.presence };
    for (const [sid, ts] of Object.entries(presence)) {
      if (ts < now - PRESENCE_WINDOW_MS) delete presence[sid];
    }
    return { ...prev, presence };
  });
  return Object.keys(state.presence).length;
}

export async function getAnalyticsSnapshot(): Promise<AnalyticsSnapshot | null> {
  if (!isAnalyticsConfigured()) return null;
  const now = Date.now();
  const state = await updateStore(STORE, FALLBACK, (prev) => {
    const presence = { ...prev.presence };
    for (const [sid, ts] of Object.entries(presence)) {
      if (ts < now - PRESENCE_WINDOW_MS) delete presence[sid];
    }
    return { ...prev, presence };
  });

  const onlineNow = Object.keys(state.presence).length;
  const visitorsLifetime = state.visitorsAll.length;

  const weekSeen = new Set<string>();
  for (const day of lastNDayIds(7)) {
    for (const id of state.visitorsByDay[day] ?? []) weekSeen.add(id);
  }
  const visitorsWeek = weekSeen.size;
  const visitorsMonth = (state.visitorsByMonth[monthKey(new Date())] ?? []).length;

  const topPosts = Object.entries(state.postviews)
    .map(([slug, views]) => ({ slug, views: Math.round(views) }))
    .sort((a, b) => b.views - a.views)
    .slice(0, 25);

  const topPaths = Object.entries(state.paths)
    .map(([path, views]) => ({ path, views: Math.round(views) }))
    .sort((a, b) => b.views - a.views)
    .slice(0, 15);

  return {
    onlineNow,
    visitorsLifetime,
    visitorsWeek,
    visitorsMonth,
    topPosts,
    topPaths,
  };
}
