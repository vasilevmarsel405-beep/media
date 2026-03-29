import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { VideoPublication } from "@/components/VideoPublication";
import { buildPostMetadata } from "@/lib/seo/post-metadata";
import { getPostBySlug, getPostsByKind, getRelatedPosts } from "@/lib/posts-service";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const list = await getPostsByKind("video");
  return list.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post || post.kind !== "video") return {};
  return buildPostMetadata(post, `/video/${slug}`);
}

export default async function VideoPage({ params }: Props) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post || post.kind !== "video") notFound();

  const allVideo = await getPostsByKind("video");
  const relatedVideos = allVideo.filter((p) => p.slug !== slug).slice(0, 6);
  const relatedAll = await getRelatedPosts(post, 6);

  return <VideoPublication post={post} relatedVideos={relatedVideos} relatedAll={relatedAll} />;
}
