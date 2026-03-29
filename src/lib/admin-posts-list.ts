import { getAllPosts } from "@/lib/posts-service";
import { readRemotePostsRaw } from "@/lib/redis-posts";
import type { Post } from "@/lib/types";

export type AdminPostRow = { post: Post; source: "static" | "remote" };

export async function getAdminPostsList(): Promise<AdminPostRow[]> {
  const [all, remote] = await Promise.all([getAllPosts(), readRemotePostsRaw()]);
  const remoteSlugs = new Set(remote.map((p) => p.slug));
  return all.map((post) => ({
    post,
    source: remoteSlugs.has(post.slug) ? "remote" : "static",
  }));
}
