import type { Metadata } from "next";
import Link from "next/link";
import { PostCard } from "@/components/cards/PostCard";
import { TagPill } from "@/components/TagPill";
import { poiskCopy } from "@/lib/copy";
import { authors, rubrics, tags } from "@/lib/content";
import { getAllPosts, searchPosts } from "@/lib/posts-service";
import { cn } from "@/lib/cn";

type Props = { searchParams: Promise<{ q?: string }> };

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const { q } = await searchParams;
  const query = (q ?? "").trim();
  if (query) {
    const short = query.length > 48 ? `${query.slice(0, 45)}…` : query;
    return {
      title: `Поиск: ${short}`,
      description: `Результаты по запросу «${short}». ${poiskCopy.metaDescription}`,
      robots: { index: false, follow: true },
    };
  }
  return {
    title: "Поиск",
    description: poiskCopy.metaDescription,
    openGraph: { title: "Поиск по КриптоМарс Медиа", description: poiskCopy.metaDescription, locale: "ru_RU" },
  };
}

const kindLabel: Record<string, string> = {
  news: "Новости",
  article: "Статьи",
  analytics: "Аналитика",
  interview: "Интервью",
  video: "Видео",
};

function SectionHeader({ title, count }: { title: string; count: number }) {
  return (
    <div className="mb-5 flex flex-wrap items-end justify-between gap-2 border-b border-slate-200 pb-3">
      <h2 className="font-display text-xl font-semibold text-slate-900 sm:text-2xl">{title}</h2>
      <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold tabular-nums text-slate-600">
        {count}
      </span>
    </div>
  );
}

export default async function PoiskPage({ searchParams }: Props) {
  const { q } = await searchParams;
  const query = (q ?? "").trim();
  const results = await searchPosts(query);
  const allPosts = await getAllPosts();
  const byKind = {
    news: results.filter((p) => p.kind === "news"),
    article: results.filter((p) => p.kind === "article"),
    analytics: results.filter((p) => p.kind === "analytics"),
    interview: results.filter((p) => p.kind === "interview"),
    video: results.filter((p) => p.kind === "video"),
  };

  const authorHits = query
    ? authors.filter(
        (a) =>
          a.name.toLowerCase().includes(query.toLowerCase()) ||
          a.role.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  const rubricHits = query
    ? rubrics.filter(
        (r) =>
          r.name.toLowerCase().includes(query.toLowerCase()) ||
          r.description.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  const tagHits = query
    ? tags.filter((t) => t.name.toLowerCase().includes(query.toLowerCase()) || t.slug.includes(query.toLowerCase()))
    : [];

  const navHits = authorHits.length + rubricHits.length + tagHits.length;
  const materialCount = results.length;
  const hasAnything =
    query && (materialCount > 0 || authorHits.length > 0 || rubricHits.length > 0 || tagHits.length > 0);
  const emptyAll =
    query && materialCount === 0 && authorHits.length === 0 && rubricHits.length === 0 && tagHits.length === 0;

  const suggestedTags = tags.slice(0, 10);

  return (
    <div className="relative">
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-48 bg-[linear-gradient(180deg,rgb(196_0_28/0.05)_0%,transparent_100%)]"
        aria-hidden
      />

      <div className="relative mx-auto max-w-[1180px] px-4 py-10 sm:px-6 sm:py-14 lg:px-10">
        <section className="overflow-hidden rounded-3xl border border-slate-200/90 bg-gradient-to-br from-white via-white to-mars-accent-soft/20 px-6 py-10 shadow-[0_20px_50px_-28px_rgb(15_23_42/0.12)] sm:px-10 sm:py-12">
          <h1 className="font-display text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl lg:text-[2.35rem]">
            {poiskCopy.title}
          </h1>
          <p className="mt-3 max-w-2xl text-slate-600 leading-relaxed sm:text-lg">{poiskCopy.subtitle}</p>

          <form action="/poisk" method="get" className="mt-8 flex flex-col gap-3 sm:mt-10 sm:flex-row sm:items-center">
            <label htmlFor="q" className="sr-only">
              Запрос
            </label>
            <input
              id="q"
              name="q"
              defaultValue={query}
              placeholder={poiskCopy.placeholder}
              className="focus-ring min-h-14 flex-1 rounded-2xl border border-slate-200 bg-white px-5 text-base text-slate-900 shadow-inner shadow-slate-900/5 placeholder:text-slate-400"
            />
            <button
              type="submit"
              className="focus-ring min-h-14 shrink-0 rounded-2xl bg-mars-accent px-10 text-sm font-bold text-white shadow-[0_12px_32px_-10px_rgb(196_0_28/0.55)] transition hover:bg-mars-accent-hover"
            >
              {poiskCopy.submit}
            </button>
          </form>
        </section>

        {!query ? (
          <div className="mt-10 space-y-6">
            <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/90 px-6 py-8 text-slate-600 leading-relaxed">
              {poiskCopy.idleHint}
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-500">{poiskCopy.idleTopics}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {suggestedTags.map((t) => (
                  <TagPill key={t.slug} href={`/teg/${t.slug}`}>
                    {t.name}
                  </TagPill>
                ))}
              </div>
            </div>
          </div>
        ) : null}

        {query ? (
          <p
            className={cn(
              "mt-8 text-sm font-medium sm:text-base",
              materialCount > 0 ? "text-slate-700" : "text-slate-500"
            )}
          >
            {poiskCopy.resultsSummary(materialCount, query)}
            {navHits > 0 ? (
              <span className="text-slate-500"> · плюс совпадения в разделах и авторах</span>
            ) : null}
          </p>
        ) : null}

        {emptyAll ? (
          <div className="mt-10 space-y-10">
            <div>
              <h2 className="font-display text-xl font-semibold text-slate-900">{poiskCopy.emptyStateTitle}</h2>
              <p className="mt-2 max-w-2xl text-slate-600 leading-relaxed">{poiskCopy.emptyResultsIntro(query)}</p>
            </div>
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">{poiskCopy.recommendedTitle}</h2>
              <div className="mt-4 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {allPosts.slice(0, 3).map((p) => (
                  <PostCard key={p.slug} post={p} />
                ))}
              </div>
            </div>
          </div>
        ) : null}

        {hasAnything ? (
          <div className="mt-10 grid gap-12 lg:grid-cols-[minmax(0,1fr)_320px] lg:gap-14">
            <div className="min-w-0 space-y-14">
              <div>
                <SectionHeader title={poiskCopy.sectionMaterials} count={materialCount} />
                {materialCount === 0 ? (
                  <p className="text-slate-600">В текстах и заголовках материалов совпадений нет — смотрите блок справа.</p>
                ) : (
                  <div className="space-y-12">
                    {(
                      ["news", "article", "analytics", "interview", "video"] as const
                    ).map((kind) =>
                      byKind[kind].length ? (
                        <section key={kind}>
                          <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-slate-500">
                            {kindLabel[kind]}
                          </h3>
                          <div
                            className={cn(
                              "grid gap-6",
                              kind === "article" || kind === "analytics" || kind === "interview"
                                ? "sm:grid-cols-2"
                                : "sm:grid-cols-2 lg:grid-cols-3"
                            )}
                          >
                            {byKind[kind].map((p) => (
                              <PostCard key={p.slug} post={p} />
                            ))}
                          </div>
                        </section>
                      ) : null
                    )}
                  </div>
                )}
              </div>
            </div>

            {navHits > 0 ? (
              <aside className="space-y-6 lg:pt-2">
                <SectionHeader title={poiskCopy.sectionPeople} count={navHits} />
                <div className="space-y-4">
                  {authorHits.length ? (
                    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">Авторы</h3>
                      <ul className="mt-4 space-y-3">
                        {authorHits.map((a) => (
                          <li key={a.slug}>
                            <Link href={`/avtor/${a.slug}`} className="font-semibold text-slate-900 hover:text-mars-accent">
                              {a.name}
                            </Link>
                            <p className="text-xs text-slate-500">{a.role}</p>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : null}
                  {rubricHits.length ? (
                    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">Рубрики</h3>
                      <ul className="mt-4 space-y-2">
                        {rubricHits.map((r) => (
                          <li key={r.slug}>
                            <Link href={`/rubriki/${r.slug}`} className="text-sm font-medium text-mars-blue hover:underline">
                              {r.name}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : null}
                  {tagHits.length ? (
                    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">Теги</h3>
                      <ul className="mt-4 flex flex-wrap gap-2">
                        {tagHits.map((t) => (
                          <li key={t.slug}>
                            <TagPill href={`/teg/${t.slug}`}>{t.name}</TagPill>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : null}
                </div>
              </aside>
            ) : null}
          </div>
        ) : null}
      </div>
    </div>
  );
}
