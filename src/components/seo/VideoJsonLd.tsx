import { authorById, authors } from "@/lib/content";
import { postHref } from "@/lib/routes";
import { siteUrl } from "@/lib/site";
import { absoluteContentUrl } from "@/lib/seo/post-metadata";
import type { Post } from "@/lib/types";
import { resolvePostImage } from "@/lib/youtube-thumbnail";

export function VideoJsonLd({
  post,
  youtubeDescription,
  youtubeThumbnailUrl,
}: {
  post: Post;
  /** Полное описание из YouTube Data API (при наличии ключа). */
  youtubeDescription?: string | null;
  youtubeThumbnailUrl?: string | null;
}) {
  const author = authorById(post.authorId) ?? authors[0];
  const pageUrl = `${siteUrl}${postHref(post)}`;
  const embedUrl = post.youtubeId ? `https://www.youtube.com/embed/${post.youtubeId}` : undefined;
  const cover = resolvePostImage(post);

  const descriptionRaw =
    youtubeDescription?.trim() || post.seoDescription?.trim() || post.lead;
  const description = descriptionRaw.slice(0, 5000);

  const thumbnailUrl: string[] = [];
  if (youtubeThumbnailUrl) thumbnailUrl.push(youtubeThumbnailUrl);
  thumbnailUrl.push(absoluteContentUrl(cover));

  const json = {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    name: post.title,
    description,
    thumbnailUrl,
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
