import type { Metadata } from "next";
import { authorById, authors, rubricBySlug, tagBySlug } from "../content";
import { siteUrl } from "../site";
import type { Post } from "../types";

export function absoluteContentUrl(url: string): string {
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  const path = url.startsWith("/") ? url : `/${url}`;
  return `${siteUrl}${path}`;
}

export function buildPostMetadata(post: Post, canonicalPath: string): Metadata {
  const path = canonicalPath.startsWith("/") ? canonicalPath : `/${canonicalPath}`;
  const canonical = post.canonicalUrl?.trim() || `${siteUrl}${path}`;
  const title = post.seoTitle?.trim() || post.title;
  const rawDesc = post.seoDescription?.trim() || post.lead;
  const description = rawDesc.length > 200 ? `${rawDesc.slice(0, 197)}…` : rawDesc;
  const keywords =
    post.seoKeywords?.trim() ||
    post.tagSlugs
      .map((s) => tagBySlug(s)?.name)
      .filter(Boolean)
      .join(", ");

  const isVideo = post.kind === "video";
  const author = authorById(post.authorId) ?? authors[0];
  const sectionRubric = post.rubricSlugs[0] ? rubricBySlug(post.rubricSlugs[0]) : undefined;

  return {
    title,
    description,
    ...(keywords ? { keywords } : {}),
    ...(author
      ? {
          authors: [{ name: author.name, url: `${siteUrl}/avtor/${author.slug}` }],
        }
      : {}),
    alternates: { canonical },
    openGraph: {
      type: isVideo ? "video.other" : "article",
      locale: "ru_RU",
      url: canonical,
      title,
      description,
      ...(isVideo
        ? {}
        : {
            publishedTime: post.publishedAt,
            modifiedTime: post.publishedAt,
            ...(sectionRubric ? { section: sectionRubric.name } : {}),
          }),
      images: [{ url: absoluteContentUrl(post.image), alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
    robots: { index: !post.seoNoindex, follow: true },
  };
}
