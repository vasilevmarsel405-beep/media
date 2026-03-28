import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PostCard } from "@/components/cards/PostCard";
import { postsForTag, tagBySlug, tags } from "@/lib/content";
import { siteUrl } from "@/lib/site";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return tags.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const t = tagBySlug(slug);
  if (!t) return {};
  return {
    title: `Тег: ${t.name}`,
    description: `Все материалы по тегу «${t.name}» на МарсМедиа.`,
    alternates: { canonical: `${siteUrl}/teg/${slug}` },
  };
}

export default async function TagPage({ params }: Props) {
  const { slug } = await params;
  const tag = tagBySlug(slug);
  if (!tag) notFound();

  const list = postsForTag(slug).sort(
    (a, b) => +new Date(b.publishedAt) - +new Date(a.publishedAt)
  );

  return (
    <div className="mx-auto max-w-[1400px] px-4 py-12 sm:px-6 lg:px-10">
      <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Тег</p>
      <h1 className="font-display mt-2 text-4xl font-semibold text-slate-900">{tag.name}</h1>
      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((p) => (
          <PostCard key={p.slug} post={p} />
        ))}
      </div>
      {list.length === 0 ? <p className="mt-8 text-slate-600">По этому тегу пока нет материалов.</p> : null}
    </div>
  );
}
