import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { VideoPublication } from "@/components/VideoPublication";
import { postBySlug, postsByKind, relatedPosts } from "@/lib/content";
import { siteUrl } from "@/lib/site";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return postsByKind("video").map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = postBySlug(slug);
  if (!post || post.kind !== "video") return {};
  return {
    title: post.title,
    description: post.lead,
    openGraph: {
      title: post.title,
      description: post.lead,
      images: [{ url: post.image }],
      type: "website",
    },
    alternates: { canonical: `${siteUrl}/video/${slug}` },
  };
}

export default async function VideoPage({ params }: Props) {
  const { slug } = await params;
  const post = postBySlug(slug);
  if (!post || post.kind !== "video") notFound();

  const relatedVideos = postsByKind("video").filter((p) => p.slug !== slug).slice(0, 6);
  const relatedAll = relatedPosts(post, 6);

  return <VideoPublication post={post} relatedVideos={relatedVideos} relatedAll={relatedAll} />;
}
