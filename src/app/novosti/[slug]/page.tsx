import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PublicationView } from "@/components/PublicationView";
import { buildPostMetadata } from "@/lib/seo/post-metadata";
import { getPostBySlug, getRelatedPosts } from "@/lib/posts-service";

type Props = { params: Promise<{ slug: string }> };

/** См. analitika/[slug]: без предрендера при build — меньше таймаутов к Upstash. */
export const revalidate = 30;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post || post.kind !== "news") return {};
  return buildPostMetadata(post, `/novosti/${slug}`);
}

export default async function NewsArticlePage({ params }: Props) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post || post.kind !== "news") notFound();

  const related = await getRelatedPosts(post);

  return (
    <PublicationView
      post={post}
      breadcrumbs={[
        { href: "/", label: "Главная" },
        { href: "/novosti", label: "Новости" },
        { href: `/novosti/${slug}`, label: post.title },
      ]}
      related={related}
    />
  );
}
