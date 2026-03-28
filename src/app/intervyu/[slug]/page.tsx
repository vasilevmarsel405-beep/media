import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PublicationView } from "@/components/PublicationView";
import { postBySlug, postsByKind, relatedPosts } from "@/lib/content";
import { siteUrl } from "@/lib/site";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return postsByKind("interview").map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = postBySlug(slug);
  if (!post || post.kind !== "interview") return {};
  return {
    title: post.title,
    description: post.lead,
    openGraph: { title: post.title, description: post.lead, images: [{ url: post.image }], type: "article" },
    alternates: { canonical: `${siteUrl}/intervyu/${slug}` },
  };
}

export default async function InterviewPage({ params }: Props) {
  const { slug } = await params;
  const post = postBySlug(slug);
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
      related={relatedPosts(post)}
    />
  );
}
