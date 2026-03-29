import { z } from "zod";
import { extractYoutubeVideoId } from "./youtube-id";

const kindZ = z.enum(["news", "article", "analytics", "interview", "video"]);

const tocItemZ = z.object({
  id: z.string().min(1),
  label: z.string().min(1),
});

const quoteZ = z.object({
  text: z.string().min(1),
  attribution: z.string().optional(),
});

const timecodeZ = z.object({
  t: z.string().min(1),
  label: z.string().min(1),
});

const slugZ = z
  .string()
  .min(1)
  .max(120)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "slug: only a-z, 0-9 and hyphens");

/** Убирает управляющие символы и U+FFFC (часто даёт «OBJ» в браузере). */
function sanitizeIngestText(s: string): string {
  return s
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F-\u009F\uFEFF\uFFFC]/g, "")
    .trim();
}

/** Make по умолчанию шлёт toc «Введение / Суть / Итог» — он ломает смысл (1-й абзац ≠ введение). */
const MAKE_PLACEHOLDER_TOC_IDS = new Set(["vvedenie", "sut", "itog"]);

function shouldDropPlaceholderToc(toc: { id: string }[] | undefined): boolean {
  if (!toc || toc.length !== 3) return false;
  const ids = new Set(toc.map((t) => t.id.toLowerCase()));
  return ids.size === 3 && [...MAKE_PLACEHOLDER_TOC_IDS].every((id) => ids.has(id));
}

/** Ссылка watch/shortsyoutu.be или 11-символьный id → нормализованный id. */
const youtubeIdIngestZ = z
  .string()
  .max(500)
  .optional()
  .transform((s) => {
    if (s == null) return undefined;
    const t = s.trim();
    return t === "" ? undefined : t;
  })
  .refine(
    (s) => s == null || extractYoutubeVideoId(s) !== null || /^[a-zA-Z0-9_-]{11}$/.test(s),
    { message: "youtubeId: укажите корректную ссылку на YouTube или ID ролика (11 символов)" }
  )
  .transform((s) => (s == null ? undefined : extractYoutubeVideoId(s) ?? s));

export const makeIngestPostSchema = z
  .object({
    slug: slugZ,
    kind: kindZ,
    title: z.string().min(1).max(500),
    lead: z.string().min(1).max(4000),
    paragraphs: z.array(z.string().min(1)).optional(),
    image: z.string().min(1).max(2000),
    authorId: z.string().min(1),
    rubricSlugs: z.array(z.string().min(1)).default([]),
    tagSlugs: z.array(z.string().min(1)).default([]),
    publishedAt: z.string().min(1),
    subtitle: z.string().max(500).optional(),
    urgent: z.boolean().optional(),
    pinned: z.boolean().optional(),
    readMin: z.number().int().positive().max(999).optional(),
    youtubeId: youtubeIdIngestZ,
    durationLabel: z.string().max(32).optional(),
    guestName: z.string().max(200).optional(),
    guestBio: z.string().max(2000).optional(),
    materialType: z.string().max(120).optional(),
    quotes: z.array(quoteZ).optional(),
    keyPoints: z.array(z.string().min(1)).optional(),
    toc: z.array(tocItemZ).optional(),
    timecodes: z.array(timecodeZ).optional(),
    homeBadge: z.string().max(120).optional(),
    homeCta: z.string().max(120).optional(),
    seoTitle: z.string().min(1).max(70).optional(),
    seoDescription: z.string().min(1).max(320).optional(),
  })
  .strict();

export type MakeIngestPostInput = z.infer<typeof makeIngestPostSchema>;

export function normalizeIngestToPost(input: MakeIngestPostInput): import("./types").Post {
  const rawParagraphs =
    input.paragraphs?.length && input.paragraphs.length > 0
      ? input.paragraphs.map(sanitizeIngestText).filter((p) => p.length > 0)
      : [sanitizeIngestText(input.lead), "Материал обновляется — загляните позже за дополнениями."];

  const paragraphs = rawParagraphs.length > 0 ? rawParagraphs : [sanitizeIngestText(input.lead)];

  const tocForStore =
    input.toc !== undefined && !shouldDropPlaceholderToc(input.toc) ? input.toc : undefined;

  const base = {
    id: input.slug,
    slug: input.slug,
    kind: input.kind,
    title: sanitizeIngestText(input.title),
    lead: sanitizeIngestText(input.lead),
    paragraphs,
    image: input.image.trim(),
    authorId: input.authorId,
    rubricSlugs: input.rubricSlugs,
    tagSlugs: input.tagSlugs,
    publishedAt: input.publishedAt,
  };

  const optional = {
    ...(input.subtitle !== undefined ? { subtitle: sanitizeIngestText(input.subtitle) } : {}),
    ...(input.urgent !== undefined ? { urgent: input.urgent } : {}),
    ...(input.pinned !== undefined ? { pinned: input.pinned } : {}),
    ...(input.readMin !== undefined ? { readMin: input.readMin } : {}),
    ...(input.youtubeId !== undefined ? { youtubeId: input.youtubeId } : {}),
    ...(input.durationLabel !== undefined ? { durationLabel: input.durationLabel } : {}),
    ...(input.guestName !== undefined ? { guestName: sanitizeIngestText(input.guestName) } : {}),
    ...(input.guestBio !== undefined ? { guestBio: sanitizeIngestText(input.guestBio) } : {}),
    ...(input.materialType !== undefined ? { materialType: sanitizeIngestText(input.materialType) } : {}),
    ...(input.quotes !== undefined
      ? {
          quotes: input.quotes.map((q) => ({
            text: sanitizeIngestText(q.text),
            ...(q.attribution !== undefined ? { attribution: sanitizeIngestText(q.attribution) } : {}),
          })),
        }
      : {}),
    ...(input.keyPoints !== undefined
      ? { keyPoints: input.keyPoints.map(sanitizeIngestText).filter((k) => k.length > 0) }
      : {}),
    ...(tocForStore !== undefined ? { toc: tocForStore } : {}),
    ...(input.timecodes !== undefined ? { timecodes: input.timecodes } : {}),
    ...(input.homeBadge !== undefined ? { homeBadge: sanitizeIngestText(input.homeBadge) } : {}),
    ...(input.homeCta !== undefined ? { homeCta: sanitizeIngestText(input.homeCta) } : {}),
    ...(input.seoTitle !== undefined ? { seoTitle: sanitizeIngestText(input.seoTitle) } : {}),
    ...(input.seoDescription !== undefined ? { seoDescription: sanitizeIngestText(input.seoDescription) } : {}),
  };

  return { ...base, ...optional } as import("./types").Post;
}

export const makeIngestBodySchema = z.discriminatedUnion("action", [
  z
    .object({
      action: z.literal("upsert"),
      post: makeIngestPostSchema,
    })
    .strict(),
  z
    .object({
      action: z.literal("delete"),
      slug: slugZ,
    })
    .strict(),
]);

export type MakeIngestBody = z.infer<typeof makeIngestBodySchema>;
