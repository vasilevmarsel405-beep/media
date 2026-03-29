import { z } from "zod";

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
    youtubeId: z.string().max(32).optional(),
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
  const paragraphs =
    input.paragraphs?.length && input.paragraphs.length > 0
      ? input.paragraphs
      : [input.lead, "Материал обновляется — загляните позже за дополнениями."];

  const base = {
    id: input.slug,
    slug: input.slug,
    kind: input.kind,
    title: input.title,
    lead: input.lead,
    paragraphs,
    image: input.image,
    authorId: input.authorId,
    rubricSlugs: input.rubricSlugs,
    tagSlugs: input.tagSlugs,
    publishedAt: input.publishedAt,
  };

  const optional = {
    ...(input.subtitle !== undefined ? { subtitle: input.subtitle } : {}),
    ...(input.urgent !== undefined ? { urgent: input.urgent } : {}),
    ...(input.pinned !== undefined ? { pinned: input.pinned } : {}),
    ...(input.readMin !== undefined ? { readMin: input.readMin } : {}),
    ...(input.youtubeId !== undefined ? { youtubeId: input.youtubeId } : {}),
    ...(input.durationLabel !== undefined ? { durationLabel: input.durationLabel } : {}),
    ...(input.guestName !== undefined ? { guestName: input.guestName } : {}),
    ...(input.guestBio !== undefined ? { guestBio: input.guestBio } : {}),
    ...(input.materialType !== undefined ? { materialType: input.materialType } : {}),
    ...(input.quotes !== undefined ? { quotes: input.quotes } : {}),
    ...(input.keyPoints !== undefined ? { keyPoints: input.keyPoints } : {}),
    ...(input.toc !== undefined ? { toc: input.toc } : {}),
    ...(input.timecodes !== undefined ? { timecodes: input.timecodes } : {}),
    ...(input.homeBadge !== undefined ? { homeBadge: input.homeBadge } : {}),
    ...(input.homeCta !== undefined ? { homeCta: input.homeCta } : {}),
    ...(input.seoTitle !== undefined ? { seoTitle: input.seoTitle } : {}),
    ...(input.seoDescription !== undefined ? { seoDescription: input.seoDescription } : {}),
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
