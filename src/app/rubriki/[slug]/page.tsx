import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PostCard } from "@/components/cards/PostCard";
import { TagPill } from "@/components/TagPill";
import { rubricBySlug, rubrics, tags } from "@/lib/content";
import { getPostsByKind, getPostsForRubric } from "@/lib/posts-service";
import { postHref } from "@/lib/routes";
import { postCoverImageAlt } from "@/lib/seo/image-alt";
import { siteUrl } from "@/lib/site";
import { resolvePostImage } from "@/lib/youtube-thumbnail";

type Props = { params: Promise<{ slug: string }> };

/** Лента рубрики читает посты из Redis — не дёргать хранилище N раз на этапе `next build`. */
export const revalidate = 30;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const r = rubricBySlug(slug);
  if (!r) return {};
  return {
    title: r.name,
    description: r.description,
    openGraph: { title: r.name, description: r.description, images: [{ url: r.cover }] },
    alternates: { canonical: `${siteUrl}/rubriki/${slug}` },
  };
}

export default async function RubricPage({ params }: Props) {
  const { slug } = await params;
  const rubric = rubricBySlug(slug);
  if (!rubric) notFound();

  const inRubric = (await getPostsForRubric(slug)).sort(
    (a, b) => +new Date(b.publishedAt) - +new Date(a.publishedAt)
  );
  const top = inRubric[0];
  const rest = inRubric.slice(1);
  const popular = [...inRubric]
    .sort((a, b) => (b.readMin ?? 0) - (a.readMin ?? 0))
    .slice(0, 4);

  const relatedTags = tags.slice(0, 10);
  const videosInRubric = (await getPostsByKind("video")).filter((p) => p.rubricSlugs.includes(slug));

  return (
    <div>
      <div className="relative border-b border-slate-200">
        <div className="relative h-[min(52vh,520px)] w-full">
          <Image src={rubric.cover} alt={`Иллюстрация рубрики: ${rubric.name}`} fill priority className="object-cover" sizes="100vw" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 mx-auto max-w-[1100px] px-4 pb-12 pt-24 text-white sm:px-6 lg:px-10">
            <p className="text-xs font-bold uppercase tracking-wider text-white/70">Рубрика</p>
            <h1 className="font-display mt-3 text-4xl font-semibold sm:text-5xl">{rubric.name}</h1>
            <p className="mt-4 max-w-2xl text-lg text-white/85">{rubric.description}</p>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-[1400px] px-4 py-12 sm:px-6 lg:px-10">
        {top ? (
          <section className="mb-14">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">Топ материал</h2>
            <Link
              href={postHref(top)}
              className="mt-4 grid gap-8 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm lg:grid-cols-2"
            >
              <div className="relative min-h-[240px]">
                <Image src={resolvePostImage(top)} alt={postCoverImageAlt(top.title, top.imageAlt)} fill className="object-cover" sizes="600px" />
              </div>
              <div className="flex flex-col justify-center p-8 lg:p-10">
                <h3 className="font-display text-3xl font-semibold text-slate-900">{top.title}</h3>
                <p className="mt-4 text-slate-600 leading-relaxed">{top.lead}</p>
                <span className="mt-6 text-sm font-semibold text-mars-blue">Открыть материал →</span>
              </div>
            </Link>
          </section>
        ) : null}

        <div className="grid gap-12 lg:grid-cols-[1fr_18rem]">
          <div>
            <h2 className="font-display text-2xl font-semibold text-slate-900">Лента по теме</h2>
            <div className="mt-6 grid gap-6 sm:grid-cols-2">
              {rest.map((p) => (
                <PostCard key={p.slug} post={p} />
              ))}
            </div>
            {rest.length === 0 && !top ? (
              <p className="text-slate-600">В этой рубрике скоро появятся материалы.</p>
            ) : null}
          </div>
          <aside className="space-y-8">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">Популярное в рубрике</h3>
              <ul className="mt-4 space-y-4">
                {popular.map((p) => (
                  <li key={p.slug}>
                    <Link href={postHref(p)} className="font-medium text-slate-900 hover:text-mars-accent">
                      {p.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">Смежные теги</h3>
              <div className="mt-4 flex flex-wrap gap-2">
                {relatedTags.map((t) => (
                  <TagPill key={t.slug} href={`/teg/${t.slug}`}>
                    {t.name}
                  </TagPill>
                ))}
              </div>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">Другие рубрики</h3>
              <ul className="mt-4 space-y-2 text-sm">
                {rubrics
                  .filter((x) => x.slug !== slug)
                  .map((x) => (
                    <li key={x.slug}>
                      <Link href={`/rubriki/${x.slug}`} className="text-mars-blue hover:underline">
                        {x.name}
                      </Link>
                    </li>
                  ))}
              </ul>
            </div>
          </aside>
        </div>

        <section className="mt-16 border-t border-slate-200 pt-10">
          <h2 className="font-display text-xl font-semibold text-slate-900">Видео по теме</h2>
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {videosInRubric.map((p) => (
                <PostCard key={p.slug} post={p} />
              ))}
          </div>
        </section>
      </div>
    </div>
  );
}
