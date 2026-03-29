import { authors, rubrics, tags } from "./content";

/** Допустимые `kind` в теле webhook Make / админ API. */
export const MAKE_POST_KINDS = ["news", "article", "analytics", "interview", "video"] as const;

/** Справочник из `content.ts` — те же значения, что проверяет `validatePostRefs` в webhook. */
export const makeIngestReference = {
  authors: authors.map((a) => ({ id: a.id, slug: a.slug, name: a.name })),
  rubricSlugs: rubrics.map((r) => r.slug),
  tagSlugs: tags.map((t) => t.slug),
  kinds: [...MAKE_POST_KINDS],
} as const;
