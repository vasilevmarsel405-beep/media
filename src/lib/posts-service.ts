import { authors, posts as staticPosts } from "./content";
import { postsMemoryCacheTtlMs } from "./posts-cache-config";
import { getPostsCacheVersion, getPostsStorageMode, readRemotePostsRaw } from "./redis-posts";
import type { Post } from "./types";

const DEFAULT_AUTHOR_ID = authors[0]?.id ?? "mv1";

function publishedAtMs(p: Post): number {
  const t = Date.parse(p.publishedAt);
  return Number.isNaN(t) ? 0 : t;
}

/** Новее — выше (для главной, списков и героя). */
export function sortPostsByPublishedDesc(posts: Post[]): Post[] {
  return [...posts].sort((a, b) => publishedAtMs(b) - publishedAtMs(a));
}

/** Запись из Redis может перезаписать статику без `authorId` или со старым id — тогда автор на странице не показывался. */
function normalizePostAuthor(post: Post): Post {
  const raw = post.authorId;
  const aid = typeof raw === "string" ? raw.trim() : "";
  if (aid && authors.some((a) => a.id === aid)) return post;
  return { ...post, authorId: DEFAULT_AUTHOR_ID };
}

function mergeBySlug(remote: Post[], local: Post[]): Post[] {
  const map = new Map<string, Post>();
  for (const p of local) map.set(p.slug, p);
  for (const p of remote) map.set(p.slug, p);
  return Array.from(map.values());
}

/** См. POSTS_FEED_MODE в .env — по умолчанию мерж статики и облака. */
function isRemoteOnlyFeed(): boolean {
  const m = process.env.POSTS_FEED_MODE?.trim().toLowerCase();
  return m === "remote_only" || m === "remote-only";
}

async function loadPostsForFeed(): Promise<Post[]> {
  const remote = await readRemotePostsRaw();
  if (isRemoteOnlyFeed()) {
    const normalized = remote.map(normalizePostAuthor);
    return sortPostsByPublishedDesc(normalized);
  }
  const merged = mergeBySlug(remote, staticPosts);
  const normalized = merged.map(normalizePostAuthor);
  return sortPostsByPublishedDesc(normalized);
}

let cachedPosts: Post[] | null = null;
let cacheTs = 0;
/** Один «стекер» загрузки между воркерами процесса. */
let loadInFlight: Promise<Post[]> | null = null;
let cachedVersion = 0;

export async function getAllPosts(): Promise<Post[]> {
  const now = Date.now();
  const ttl = postsMemoryCacheTtlMs();
  const mode = getPostsStorageMode();
  if (cachedPosts && now - cacheTs < ttl) {
    // Между воркерами PM2 in-memory кеш не шарится.
    // Сверяемся с версией в Redis (дешевый GET), чтобы все воркеры увидели обновление сразу.
    if (mode === "upstash") {
      // В upstash-режиме строго сверяемся с версией Redis на каждый запрос,
      // чтобы воркеры и клиентские переходы не видели "старую" ленту.
      const v = await getPostsCacheVersion();
      if (v === cachedVersion) return cachedPosts;
      // Если версия изменилась — обновим кеш ниже через полный reload.
    } else {
      return cachedPosts;
    }
  }
  if (loadInFlight) return loadInFlight;

  loadInFlight = (async () => {
    const data = await loadPostsForFeed();
    if (mode === "upstash") {
      cachedVersion = await getPostsCacheVersion();
    }
    cachedPosts = data;
    cacheTs = Date.now();
    loadInFlight = null;
    return data;
  })().catch((e) => {
    loadInFlight = null;
    throw e;
  });

  return loadInFlight;
}

export function invalidatePostsCache() {
  cachedPosts = null;
  cacheTs = 0;
  loadInFlight = null;
}

export async function getPostBySlug(slug: string): Promise<Post | undefined> {
  const all = await getAllPosts();
  return all.find((p) => p.slug === slug);
}

export async function getPostsByKind(kind: Post["kind"]): Promise<Post[]> {
  const all = await getAllPosts();
  return all.filter((p) => p.kind === kind);
}

export async function getPostsForRubric(slug: string): Promise<Post[]> {
  const all = await getAllPosts();
  return all.filter((p) => p.rubricSlugs.includes(slug));
}

export async function getPostsForTag(slug: string): Promise<Post[]> {
  const all = await getAllPosts();
  return all.filter((p) => p.tagSlugs.includes(slug));
}

export async function getPostsByAuthor(authorSlug: string): Promise<Post[]> {
  const a = authors.find((x) => x.slug === authorSlug);
  if (!a) return [];
  const all = await getAllPosts();
  return all.filter((p) => p.authorId === a.id);
}

export async function getRelatedPosts(post: Post, limit = 4): Promise<Post[]> {
  const all = await getAllPosts();
  const tagSet = new Set(post.tagSlugs);
  const scored = all
    .filter((x) => x.slug !== post.slug)
    .map((x) => ({
      x,
      s:
        x.rubricSlugs.filter((r) => post.rubricSlugs.includes(r)).length * 2 +
        x.tagSlugs.filter((t) => tagSet.has(t)).length,
    }))
    .sort((a, b) => b.s - a.s);
  return scored.slice(0, limit).map((z) => z.x);
}

export async function getPostAndRelatedBySlug(
  slug: string,
  opts?: { kind?: Post["kind"]; relatedLimit?: number }
): Promise<{ post?: Post; related: Post[] }> {
  const all = await getAllPosts();
  const post = all.find((p) => p.slug === slug);
  if (!post) return { post: undefined, related: [] };
  if (opts?.kind && post.kind !== opts.kind) return { post: undefined, related: [] };
  const limit = opts?.relatedLimit ?? 4;
  const tagSet = new Set(post.tagSlugs);
  const scored = all
    .filter((x) => x.slug !== post.slug)
    .map((x) => ({
      x,
      s:
        x.rubricSlugs.filter((r) => post.rubricSlugs.includes(r)).length * 2 +
        x.tagSlugs.filter((t) => tagSet.has(t)).length,
    }))
    .sort((a, b) => b.s - a.s);
  return { post, related: scored.slice(0, limit).map((z) => z.x) };
}

export async function searchPosts(q: string): Promise<Post[]> {
  const n = q.trim().toLowerCase();
  if (!n) return [];
  const all = await getAllPosts();
  return all.filter((p) => {
    const inText =
      p.title.toLowerCase().includes(n) ||
      p.lead.toLowerCase().includes(n) ||
      (p.subtitle?.toLowerCase().includes(n) ?? false) ||
      p.paragraphs.some((para) => para.toLowerCase().includes(n));
    const inTaxonomy =
      p.tagSlugs.some((t) => t.includes(n)) || p.rubricSlugs.some((r) => r.includes(n));
    return inText || inTaxonomy;
  });
}

const URGENT_FEED_LIMIT = 8;

/** Герой из уже загруженного списка (`getAllPosts` уже отсортирован по дате). */
export function pickFeaturedHero(all: Post[]): Post | null {
  if (all.length === 0) return null;
  const manualHero = all.filter((p) => p.homeHero);
  if (manualHero.length) return manualHero[0];
  const pinned = all.filter((p) => p.pinned);
  if (pinned.length) return pinned[0];
  return all[0];
}

/** Колонка справа от героя — без второго прохода по `getAllPosts`. */
export function pickSecondaryHero(all: Post[], hero: Post | null): Post[] {
  if (!hero) return all.slice(0, 4);
  return all.filter((p) => p.slug !== hero.slug).slice(0, 4);
}

/**
 * Срочная лента: сначала все материалы с urgent (любой kind), по дате;
 * если слотов не хватает — добиваем свежими новостями без дубликатов.
 */
export function pickUrgentFeed(all: Post[]): Post[] {
  const picked = new Set<string>();
  const out: Post[] = [];

  for (const p of all) {
    if (!p.urgent) continue;
    if (picked.has(p.slug) || out.length >= URGENT_FEED_LIMIT) continue;
    out.push(p);
    picked.add(p.slug);
  }

  for (const p of all) {
    if (p.kind !== "news") continue;
    if (picked.has(p.slug) || out.length >= URGENT_FEED_LIMIT) continue;
    out.push(p);
    picked.add(p.slug);
  }

  return out;
}

export function pickPopularPosts(all: Post[]): Post[] {
  return [...all]
    .sort(
      (a, b) =>
        (b.readMin ?? 0) - (a.readMin ?? 0) ||
        +new Date(b.publishedAt) - +new Date(a.publishedAt)
    )
    .slice(0, 6);
}

export async function getFeaturedHero(): Promise<Post | null> {
  return pickFeaturedHero(await getAllPosts());
}

export async function getSecondaryHero(): Promise<Post[]> {
  const all = await getAllPosts();
  return pickSecondaryHero(all, pickFeaturedHero(all));
}

export async function getUrgentFeed(): Promise<Post[]> {
  return pickUrgentFeed(await getAllPosts());
}

export async function getPopularPosts(): Promise<Post[]> {
  return pickPopularPosts(await getAllPosts());
}
