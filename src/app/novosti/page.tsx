import Link from "next/link";
import { PostCard } from "@/components/cards/PostCard";
import { SectionHeading } from "@/components/SectionHeading";
import { novostiCopy } from "@/lib/copy";
import { posts, postsByKind, rubrics, tags } from "@/lib/content";
import { cn } from "@/lib/cn";

type Search = { rubric?: string; tag?: string };

export default async function NovostiPage({
  searchParams,
}: {
  searchParams: Promise<Search>;
}) {
  const sp = await searchParams;
  const pinned = postsByKind("news").filter((p) => p.pinned);
  let list = postsByKind("news").filter((p) => !p.pinned || sp.rubric || sp.tag);
  list = [...list].sort((a, b) => +new Date(b.publishedAt) - +new Date(a.publishedAt));
  if (sp.rubric) list = list.filter((p) => p.rubricSlugs.includes(sp.rubric!));
  if (sp.tag) list = list.filter((p) => p.tagSlugs.includes(sp.tag!));

  const chip = (active: boolean) =>
    cn(
      "rounded-full px-3 py-1.5 text-xs font-semibold ring-1 transition",
      active
        ? "bg-red-600 text-white ring-red-600"
        : "bg-white text-slate-700 ring-slate-200 hover:bg-slate-50"
    );

  return (
    <div className="mx-auto max-w-[1400px] px-4 py-10 sm:px-6 lg:px-10">
      <SectionHeading title="Новости" />
      <p className="-mt-4 mb-8 max-w-2xl text-slate-600">{novostiCopy.intro}</p>

      <div className="mb-10 flex flex-col gap-4 rounded-2xl border border-slate-200 bg-slate-50/80 p-4 sm:flex-row sm:flex-wrap sm:items-center">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Рубрика:</span>
        <div className="flex flex-wrap gap-2">
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
        <span className="hidden h-6 w-px bg-slate-200 sm:block" aria-hidden />
        <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Тег:</span>
        <div className="flex flex-wrap gap-2">
          {tags.slice(0, 8).map((t) => (
            <Link key={t.slug} href={`/novosti?tag=${t.slug}`} className={chip(sp.tag === t.slug)}>
              {t.name}
            </Link>
          ))}
        </div>
      </div>

      {pinned.length > 0 && !sp.rubric && !sp.tag ? (
        <section className="mb-12">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">{novostiCopy.pinnedLabel}</h2>
          <div className="mt-4 grid gap-6 lg:grid-cols-2">
            {pinned.map((p) => (
              <PostCard key={p.slug} post={p} />
            ))}
          </div>
        </section>
      ) : null}

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((p) => (
          <PostCard key={p.slug} post={p} />
        ))}
      </div>

      {list.length === 0 ? (
        <p className="mt-10 text-center text-slate-600">{novostiCopy.emptyFilter}</p>
      ) : null}
    </div>
  );
}
