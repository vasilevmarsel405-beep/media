import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PublicationView } from "@/components/PublicationView";
import { buildPostMetadata } from "@/lib/seo/post-metadata";
import { getPostBySlug, getRelatedPosts } from "@/lib/posts-service";

type Props = { params: Promise<{ slug: string }> };

/** Не предрендерим при сборке: чтение Redis/Upstash с VPS часто даёт ETIMEDOUT при десятках страниц подряд. */
export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post || post.kind !== "analytics") return {};
  return buildPostMetadata(post, `/analitika/${slug}`);
}

export default async function AnalyticsArticlePage({ params }: Props) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post || post.kind !== "analytics") notFound();

  return (
    <PublicationView
      post={post}
      tone="analytics"
      breadcrumbs={[
        { href: "/", label: "Главная" },
        { href: "/analitika", label: "Аналитика" },
        { href: `/analitika/${slug}`, label: post.title },
      ]}
      related={await getRelatedPosts(post)}
    />
  );
}
