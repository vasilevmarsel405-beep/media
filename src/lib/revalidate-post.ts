import { revalidatePath, revalidateTag } from "next/cache";
import { authorById, authors } from "./content";
import type { Post } from "./types";

const KIND_PREFIX: Record<Post["kind"], string> = {
  news: "/novosti",
  article: "/stati",
  analytics: "/analitika",
  interview: "/intervyu",
  video: "/video",
};

/**
 * Только теги `posts` / `youtube-videos` — быстро, хватает для `unstable_cache` в `getAllPosts`.
 * На VPS при 504 после webhook задайте `MAKE_WEBHOOK_LIGHT_REVALIDATE=1` и используйте это вместо полного сброса путей.
 */
export function revalidatePostFeedTagsOnly() {
  revalidateTag("posts", "max");
  revalidateTag("youtube-videos", "max");
}

/** Сброс кеша списков и страниц материала после ingest из Make. */
export function revalidateAfterPostChange(post: Post | null, opts?: { slugDeleted?: string }) {
  revalidateTag("posts", "max");
  revalidateTag("youtube-videos", "max");

  const roots = ["/", "/poisk", "/novosti", "/stati", "/analitika", "/intervyu", "/video", "/rubriki", "/teg"];

  for (const p of roots) {
    revalidatePath(p);
  }

  if (post) {
    const base = KIND_PREFIX[post.kind];
    revalidatePath(base);
    revalidatePath(`${base}/${post.slug}`);

    for (const r of post.rubricSlugs) {
      revalidatePath(`/rubriki/${r}`);
    }
    for (const t of post.tagSlugs) {
      revalidatePath(`/teg/${t}`);
    }

    const author = authorById(post.authorId) ?? authors[0];
    if (author) revalidatePath(`/avtor/${author.slug}`);
  }

  if (opts?.slugDeleted) {
    for (const base of Object.values(KIND_PREFIX)) {
      revalidatePath(`${base}/${opts.slugDeleted}`);
    }
  }

  revalidatePath("/specproekty");
}
