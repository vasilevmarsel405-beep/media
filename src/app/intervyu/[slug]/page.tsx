import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PublicationView } from "@/components/PublicationView";
import { buildPostMetadata } from "@/lib/seo/post-metadata";
import { getPostBySlug, getRelatedPosts } from "@/lib/posts-service";

type Props = { params: Promise<{ slug: string }> };

export const revalidate = 120;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post || post.kind !== "interview") return {};
  return buildPostMetadata(post, `/intervyu/${slug}`);
}

export default async function InterviewPage({ params }: Props) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post || post.kind !== "interview") notFound();

  return (
    <PublicationView
      post={post}
      tone="interview"
      breadcrumbs={[
        { href: "/", label: "Главная" },
        { href: "/intervyu", label: "Интервью" },
        { href: `/intervyu/${slug}`, label: post.title },
      ]}
      related={await getRelatedPosts(post)}
    />
  );
}
