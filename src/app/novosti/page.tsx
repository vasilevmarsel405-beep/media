import type { Metadata } from "next";
import Link from "next/link";
import { PostCard } from "@/components/cards/PostCard";
import { FeaturedNewsCard } from "@/components/novosti/FeaturedNewsCard";
import { ItemListJsonLd } from "@/components/seo/ItemListJsonLd";
import { hubPageMeta, novostiCopy } from "@/lib/copy";
import { rubrics, tags } from "@/lib/content";
import { cn } from "@/lib/cn";
import { postHref } from "@/lib/routes";
import { getPostsByKind } from "@/lib/posts-service";
import { siteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: hubPageMeta.novosti.title,
  description: hubPageMeta.novosti.description,
};

export const revalidate = 30;

type Search = { rubric?: string; tag?: string };

export default async function NovostiPage({
  searchParams,
}: {
  searchParams: Promise<Search>;
}) {
  const sp = await searchParams;
  const news = await getPostsByKind("news");
  const pinned = news.filter((p) => p.pinned);
  let list = news.filter((p) => !p.pinned || sp.rubric || sp.tag);
  list = [...list].sort((a, b) => +new Date(b.publishedAt) - +new Date(a.publishedAt));
  if (sp.rubric) list = list.filter((p) => p.rubricSlugs.includes(sp.rubric!));
  if (sp.tag) list = list.filter((p) => p.tagSlugs.includes(sp.tag!));

  const chip = (active: boolean) =>
    cn(
      "rounded-lg px-3 py-2 text-xs font-semibold transition",
      active
        ? "bg-mars-accent text-white shadow-[0_0_0_1px_rgb(196_0_28),0_4px_14px_-4px_rgb(196_0_28/0.55)]"
        : "bg-white text-slate-700 shadow-[inset_0_0_0_1px_rgb(226_232_240)] hover:border-slate-300 hover:bg-slate-50"
    );

  const listQs = new URLSearchParams();
  if (sp.rubric) listQs.set("rubric", sp.rubric);
  if (sp.tag) listQs.set("tag", sp.tag);
  const listPath = `/novosti${listQs.size ? `?${listQs}` : ""}`;
  const itemListLd = list.slice(0, 40).map((p) => ({
    url: `${siteUrl}${postHref(p)}`,
    name: p.title,
  }));

  return (
    <>
      <ItemListJsonLd
        name="Новости"
        description={novostiCopy.intro}
        path={listPath}
        items={itemListLd}
      />
    <div className="relative">
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-48 bg-[linear-gradient(180deg,rgb(196_0_28/0.07)_0%,transparent_100%)]"
        aria-hidden
      />
      <div className="relative mx-auto max-w-[1400px] px-4 pb-14 pt-10 sm:px-6 lg:px-10">
        <div className="mb-2 inline-flex items-center gap-2 rounded-md bg-mars-accent/10 px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-mars-accent">
          Лента
        </div>
        <h1 className="font-display text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">Новости</h1>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-slate-600 sm:text-lg">{novostiCopy.intro}</p>

        <div className="mt-10 space-y-5 rounded-xl border border-slate-200/90 bg-white/90 p-4 shadow-sm backdrop-blur-sm sm:p-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
            <span className="w-20 shrink-0 text-[10px] font-black uppercase tracking-widest text-slate-400">Рубрика</span>
            <div className="flex min-w-0 flex-1 flex-wrap gap-2">
              <Link href="/novosti" className={chip(!sp.rubric && !sp.tag)}>
                Все
              </Link>
              {rubrics.map((r) => (
                <Link
                  key={r.slug}
                  href={`/novosti?rubric=${r.slug}`}
                  className={chip(sp.rubric === r.slug)}
                >
                  {r.name}
                </Link>
              ))}
            </div>
          </div>
          <div className="h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" aria-hidden />
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:gap-4">
            <span className="w-20 shrink-0 text-[10px] font-black uppercase tracking-widest text-slate-400">Теги</span>
            <div className="flex min-w-0 flex-1 flex-wrap gap-2">
              {tags.slice(0, 8).map((t) => (
                <Link key={t.slug} href={`/novosti?tag=${t.slug}`} className={chip(sp.tag === t.slug)}>
                  {t.name}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {pinned.length > 0 && !sp.rubric && !sp.tag ? (
          <section className="mt-14" aria-labelledby="novosti-pinned-heading">
            <h2 id="novosti-pinned-heading" className="text-[11px] font-black uppercase tracking-[0.22em] text-slate-500">
              {novostiCopy.pinnedLabel}
            </h2>
            <div className="mt-6 space-y-6">
              <FeaturedNewsCard post={pinned[0]} />
              {pinned.length > 1 ? (
                <div className="grid gap-4 lg:grid-cols-2">
                  {pinned.slice(1).map((p) => (
                    <PostCard key={p.slug} post={p} variant="horizontal" />
                  ))}
                </div>
              ) : null}
            </div>
          </section>
        ) : null}

        <div
          className={cn(
            "mt-14 border-l-2 border-mars-accent/25 pl-5 sm:pl-6",
            pinned.length > 0 && !sp.rubric && !sp.tag ? "" : "mt-10 border-transparent pl-0 sm:pl-0"
          )}
        >
          <h2 className="mb-6 text-[11px] font-black uppercase tracking-[0.22em] text-slate-500">Все материалы</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {list.map((p) => (
              <PostCard key={p.slug} post={p} />
            ))}
          </div>
        </div>

        {list.length === 0 ? (
          <p className="mt-14 text-center text-slate-600">{novostiCopy.emptyFilter}</p>
        ) : null}
      </div>
    </div>
    </>
  );
}

