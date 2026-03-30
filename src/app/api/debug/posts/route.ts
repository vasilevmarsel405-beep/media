import { NextResponse } from "next/server";
import { readRemotePostsRaw, getPostsStorageMode } from "@/lib/redis-posts";
import { getAllPosts } from "@/lib/posts-service";

export const dynamic = "force-dynamic";

export async function GET() {
  const mode = getPostsStorageMode();
  const feedMode = process.env.POSTS_FEED_MODE ?? "(not set)";

  let rawPosts: { slug: string; kind: string; title: string }[] = [];
  let rawError: string | null = null;
  try {
    const raw = await readRemotePostsRaw();
    rawPosts = raw.map((p) => ({ slug: p.slug, kind: p.kind, title: p.title }));
  } catch (e) {
    rawError = e instanceof Error ? e.message : String(e);
  }

  let cachedPosts: { slug: string; kind: string; title: string }[] = [];
  let cachedError: string | null = null;
  try {
    const cached = await getAllPosts();
    cachedPosts = cached.map((p) => ({ slug: p.slug, kind: p.kind, title: p.title }));
  } catch (e) {
    cachedError = e instanceof Error ? e.message : String(e);
  }

  return NextResponse.json({
    storageMode: mode,
    feedMode,
    redis: {
      count: rawPosts.length,
      error: rawError,
      posts: rawPosts,
    },
    cached: {
      count: cachedPosts.length,
      error: cachedError,
      posts: cachedPosts,
    },
  });
}
