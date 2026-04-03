import { revalidatePath } from "next/cache";
import { authorById, authors } from "./content";
import { invalidatePostsCache } from "./posts-service";
import type { Post } from "./types";

const KIND_PREFIX: Record<Post["kind"], string> = {
  news: "/novosti",
  article: "/stati",
  analytics: "/analitika",
  interview: "/intervyu",
  video: "/video",
};

/**
 * Только `revalidatePath` (без сброса памяти) — вызывать после `invalidatePostsCache()` отдельно;
 * так webhook не блокирует worker на тяжёлом сбросе до ответа Make.
 */
export function revalidatePostPathsLight(post: Post | null, opts?: { slugDeleted?: string }) {
  revalidatePath("/");
  if (post) {
    const base = KIND_PREFIX[post.kind];
    revalidatePath(base);
    revalidatePath(`${base}/${post.slug}`);
  }
  if (opts?.slugDeleted) {
    for (const base of Object.values(KIND_PREFIX)) {
      revalidatePath(`${base}/${opts.slugDeleted}`);
    }
  }
}

/**
 * Максимально “узкое” on-demand переcоздание:
 * только список для конкретного вида (base) и точная страница материала (base/slug).
 * Это снижает риск подвисаний относительно полного revalidate.
 */
export function revalidatePostPathsExact(post: Post | null, opts?: { slugDeleted?: string }) {
  if (post) {
    const base = KIND_PREFIX[post.kind];
    revalidatePath(base);
    revalidatePath(`${base}/${post.slug}`);
    return;
  }

  if (opts?.slugDeleted) {
    // При delete мы не знаем kind — поэтому минимально обновим точные маршруты по всем видам.
    for (const base of Object.values(KIND_PREFIX)) {
      revalidatePath(`${base}/${opts.slugDeleted}`);
    }
  }
}

/** Полный сброс кеша списков и страниц материала после ingest из Make. */
export function revalidateAfterPostChange(post: Post | null, opts?: { slugDeleted?: string }) {
  invalidatePostsCache();

  const roots = [
    "/",
    "/poisk",
    "/novosti",
    "/stati",
    "/analitika",
    "/intervyu",
    "/video",
    "/podkasty",
    "/rubriki",
    "/teg",
  ];

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
