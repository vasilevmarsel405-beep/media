import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { PostCard } from "@/components/cards/PostCard";
import { authorBySlug, authors } from "@/lib/content";
import { getPostsByAuthor } from "@/lib/posts-service";
import { siteUrl } from "@/lib/site";

type Props = { params: Promise<{ slug: string }> };

export const revalidate = 30;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const a = authorBySlug(slug);
  if (!a) return {};
  return {
    title: a.name,
    description: a.bio,
    openGraph: { title: a.name, description: a.bio, images: [{ url: a.photo }] },
    alternates: { canonical: `${siteUrl}/avtor/${slug}` },
  };
}

export default async function AuthorPage({ params }: Props) {
  const { slug } = await params;
  const author = authorBySlug(slug);
  if (!author) notFound();

  const materials = await getPostsByAuthor(slug);

  return (
    <div className="mx-auto max-w-[1100px] px-4 py-12 sm:px-6 lg:px-10">
      <div className="flex flex-col gap-8 border-b border-slate-200 pb-10 sm:flex-row sm:items-start">
        <div className="relative h-32 w-32 shrink-0 overflow-hidden rounded-3xl bg-slate-100 shadow-lg ring-4 ring-white">
          <Image src={author.photo} alt="" fill className="object-cover" sizes="128px" />
        </div>
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Автор</p>
          <h1 className="font-display mt-2 text-4xl font-semibold text-slate-900">{author.name}</h1>
          <p className="mt-2 text-lg font-medium text-mars-blue">{author.role}</p>
          <p className="mt-4 max-w-2xl text-slate-600 leading-relaxed">{author.bio}</p>
          {author.social?.length ? (
            <div className="mt-4 flex flex-wrap gap-3">
              {author.social.map((s) => (
                <a key={s.href} href={s.href} className="text-sm font-semibold text-mars-blue hover:underline">
                  {s.label}
                </a>
              ))}
            </div>
          ) : null}
        </div>
      </div>

      <div className="mt-10">
        <h2 className="font-display text-2xl font-semibold text-slate-900">Материалы</h2>
        <p className="mt-2 text-sm text-slate-500">Фильтр по типу можно добавить на уровне CMS.</p>
        <div className="mt-8 grid gap-6 sm:grid-cols-2">
          {materials.map((p) => (
            <PostCard key={p.slug} post={p} />
          ))}
        </div>
        {materials.length === 0 ? <p className="mt-6 text-slate-600">Публикации скоро появятся.</p> : null}
      </div>
    </div>
  );
}
