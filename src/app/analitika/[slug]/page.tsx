import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PublicationView } from "@/components/PublicationView";
import { postBySlug, postsByKind, relatedPosts } from "@/lib/content";
import { siteUrl } from "@/lib/site";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return postsByKind("analytics").map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = postBySlug(slug);
  if (!post || post.kind !== "analytics") return {};
  return {
    title: post.title,
    description: post.lead,
    openGraph: { title: post.title, description: post.lead, images: [{ url: post.image }], type: "article" },
    alternates: { canonical: `${siteUrl}/analitika/${slug}` },
  };
}

export default async function AnalyticsArticlePage({ params }: Props) {
  const { slug } = await params;
  const post = postBySlug(slug);
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
      related={relatedPosts(post)}
    />
  );
}
