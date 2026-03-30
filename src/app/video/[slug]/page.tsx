import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { VideoPublication } from "@/components/VideoPublication";
import { buildPostMetadata } from "@/lib/seo/post-metadata";
import { getPostAndRelatedBySlug, getPostBySlug, getPostsByKind } from "@/lib/posts-service";
import { getYoutubeVideoEnrichment } from "@/lib/youtube-enrichment";

type Props = { params: Promise<{ slug: string }> };

/** Видео тянет YouTube API при рендере — предрендер при build многократно обрывается по таймауту. */
export const revalidate = 30;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post || post.kind !== "video") return {};
  return buildPostMetadata(post, `/video/${slug}`);
}

export default async function VideoPage({ params }: Props) {
  const { slug } = await params;
  const { post, related } = await getPostAndRelatedBySlug(slug, { kind: "video", relatedLimit: 6 });
  if (!post) notFound();

  const allVideo = await getPostsByKind("video");
  const relatedVideos = allVideo.filter((p) => p.slug !== slug).slice(0, 6);
  const relatedAll = related;
  let youtubeMeta = null;
  if (post.youtubeId) {
    try {
      youtubeMeta = await getYoutubeVideoEnrichment(post.youtubeId);
    } catch {
      youtubeMeta = null;
    }
  }

  return (
    <VideoPublication
      key={slug}
      post={post}
      relatedVideos={relatedVideos}
      relatedAll={relatedAll}
      youtubeMeta={youtubeMeta}
    />
  );
}
