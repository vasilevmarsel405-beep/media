import { authorById, authors } from "@/lib/content";
import { postHref } from "@/lib/routes";
import { siteUrl } from "@/lib/site";
import { absoluteContentUrl } from "@/lib/seo/post-metadata";
import type { Post } from "@/lib/types";

export function VideoJsonLd({ post }: { post: Post }) {
  const author = authorById(post.authorId) ?? authors[0];
  const pageUrl = `${siteUrl}${postHref(post)}`;
  const embedUrl = post.youtubeId ? `https://www.youtube.com/embed/${post.youtubeId}` : undefined;

  const json = {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    name: post.title,
    description: (post.seoDescription?.trim() || post.lead).slice(0, 500),
    thumbnailUrl: [absoluteContentUrl(post.image)],
    uploadDate: post.publishedAt,
    contentUrl: embedUrl,
    embedUrl,
    url: pageUrl,
    author: {
      "@type": "Person",
      name: author?.name ?? "КриптоМарс Медиа",
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
  };

  return (
    <script
      type="application/ld+json"
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: JSON.stringify(json) }}
    />
  );
}
