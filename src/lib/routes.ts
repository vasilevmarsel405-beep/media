import type { Post } from "./types";

const prefix: Record<Post["kind"], string> = {
  news: "/novosti",
  article: "/stati",
  analytics: "/analitika",
  interview: "/intervyu",
  video: "/video",
};

export function postHref(post: Pick<Post, "kind" | "slug">) {
  return `${prefix[post.kind]}/${post.slug}`;
}
