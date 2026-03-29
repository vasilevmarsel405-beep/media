import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PublicationView } from "@/components/PublicationView";
import { buildPostMetadata } from "@/lib/seo/post-metadata";
import { getPostBySlug, getPostsByKind, getRelatedPosts } from "@/lib/posts-service";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const list = await getPostsByKind("article");
  return list.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post || post.kind !== "article") return {};
  return buildPostMetadata(post, `/stati/${slug}`);
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post || post.kind !== "article") notFound();

  return (
    <PublicationView
      post={post}
      breadcrumbs={[
        { href: "/", label: "Главная" },
        { href: "/stati", label: "Статьи" },
        { href: `/stati/${slug}`, label: post.title },
      ]}
      related={await getRelatedPosts(post)}
    />
  );
}
