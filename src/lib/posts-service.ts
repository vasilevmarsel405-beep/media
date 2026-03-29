import { unstable_cache } from "next/cache";
import { authors, posts as staticPosts } from "./content";
import { readRemotePostsRaw } from "./redis-posts";
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

async function loadMergedPosts(): Promise<Post[]> {
  const remote = await readRemotePostsRaw();
  const merged = mergeBySlug(remote, staticPosts);
  const normalized = merged.map(normalizePostAuthor);
  return sortPostsByPublishedDesc(normalized);
}

/** Все посты: статика из репозитория + записи из Redis (Make / API). */
export const getAllPosts = unstable_cache(loadMergedPosts, ["merged-posts-v2"], {
  tags: ["posts"],
});

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

/** Герой: закреплённый (самый свежий из pinned) или самый свежий материал. */
export async function getFeaturedHero(): Promise<Post> {
  const all = await getAllPosts();
  const pinned = all.filter((p) => p.pinned);
  if (pinned.length) return pinned[0];
  return all[0] ?? staticPosts[0];
}

/** Свежие новости в колонку справа от героя (кроме текущего героя). */
export async function getSecondaryHero(): Promise<Post[]> {
  const all = await getAllPosts();
  const hero = await getFeaturedHero();
  return all.filter((p) => p.kind === "news" && p.slug !== hero.slug).slice(0, 4);
}

const URGENT_FEED_LIMIT = 8;

/**
 * Срочная лента: сначала все материалы с urgent (любой kind), по дате;
 * если слотов не хватает — добиваем свежими новостями без дубликатов.
 */
export async function getUrgentFeed(): Promise<Post[]> {
  const all = await getAllPosts();
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

export async function getPopularPosts(): Promise<Post[]> {
  const all = await getAllPosts();
  return [...all]
    .sort(
      (a, b) =>
        (b.readMin ?? 0) - (a.readMin ?? 0) ||
        +new Date(b.publishedAt) - +new Date(a.publishedAt)
    )
    .slice(0, 6);
}
