import { authorById, authors, rubricBySlug, tagBySlug } from "@/lib/content";
import { postHref } from "@/lib/routes";
import { absoluteContentUrl } from "@/lib/seo/post-metadata";
import { siteUrl } from "@/lib/site";
import type { Post } from "@/lib/types";

/** Schema.org NewsArticle / Article для сниппетов и ИИ-поиска. */
export function ArticleJsonLd({ post }: { post: Post }) {
  const author = authorById(post.authorId) ?? authors[0];
  const url = `${siteUrl}${postHref(post)}`;
  const schemaType = post.kind === "news" ? "NewsArticle" : "Article";
  const firstRubric = post.rubricSlugs[0] ? rubricBySlug(post.rubricSlugs[0]) : undefined;
  const keywordNames = post.tagSlugs
    .map((s) => tagBySlug(s)?.name)
    .filter(Boolean) as string[];
  const plainText = [post.title, post.lead, ...post.paragraphs].join(" ");
  const wordCount = Math.max(1, Math.round(plainText.replace(/\s+/g, " ").trim().split(/\s+/).length));

  const json = {
    "@context": "https://schema.org",
    "@type": schemaType,
    headline: post.title,
    description: (post.seoDescription?.trim() || post.lead).slice(0, 500),
    image: [absoluteContentUrl(post.image)],
    datePublished: post.publishedAt,
    dateModified: post.publishedAt,
    isAccessibleForFree: true,
    ...(firstRubric ? { articleSection: firstRubric.name } : {}),
    ...(keywordNames.length ? { keywords: keywordNames.join(", ") } : {}),
    wordCount,
    author: {
      "@type": "Person",
      name: author?.name ?? "Редакция КриптоМарс Медиа",
      ...(author ? { url: `${siteUrl}/avtor/${author.slug}` } : {}),
    },
    publisher: {
      "@type": "Organization",
      name: "КриптоМарс Медиа",
      url: siteUrl,
      logo: {
        "@type": "ImageObject",
        url: `${siteUrl}/icon`,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": url,
    },
    inLanguage: "ru-RU",
    ...(post.readMin ? { timeRequired: `PT${post.readMin}M` } : {}),
  };

  return (
    <script
      type="application/ld+json"
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: JSON.stringify(json) }}
    />
  );
}
