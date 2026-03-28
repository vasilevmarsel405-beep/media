import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PublicationView } from "@/components/PublicationView";
import { postBySlug, postsByKind, relatedPosts } from "@/lib/content";
import { siteUrl } from "@/lib/site";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return postsByKind("news").map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = postBySlug(slug);
  if (!post || post.kind !== "news") return {};
  return {
    title: post.title,
    description: post.lead,
    openGraph: {
      title: post.title,
      description: post.lead,
      images: [{ url: post.image }],
      type: "article",
      publishedTime: post.publishedAt,
    },
    alternates: { canonical: `${siteUrl}/novosti/${slug}` },
  };
}

export default async function NewsArticlePage({ params }: Props) {
  const { slug } = await params;
  const post = postBySlug(slug);
  if (!post || post.kind !== "news") notFound();

  const related = relatedPosts(post);

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
