import Link from "next/link";
import { PostCard } from "@/components/cards/PostCard";
import { poiskCopy } from "@/lib/copy";
import { authors, posts, rubrics, searchPosts, tags } from "@/lib/content";

export default async function PoiskPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const query = (q ?? "").trim();
  const results = searchPosts(query);
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

  return (
    <div className="mx-auto max-w-[1400px] px-4 py-12 sm:px-6 lg:px-10">
      <h1 className="font-display text-4xl font-semibold text-slate-900">{poiskCopy.title}</h1>
      <p className="mt-2 max-w-2xl text-slate-600">{poiskCopy.subtitle}</p>

      <form action="/poisk" method="get" className="mt-8 flex flex-col gap-3 sm:flex-row">
        <label htmlFor="q" className="sr-only">
          Запрос
        </label>
        <input
          id="q"
          name="q"
          defaultValue={query}
          placeholder={poiskCopy.placeholder}
          className="focus-ring min-h-12 flex-1 rounded-2xl border border-slate-200 px-4 text-slate-900 shadow-sm"
        />
        <button
          type="submit"
          className="focus-ring min-h-12 rounded-2xl bg-red-600 px-8 text-sm font-semibold text-white hover:bg-red-700"
        >
          {poiskCopy.submit}
        </button>
      </form>

      {!query ? (
        <div className="mt-12 rounded-2xl border border-dashed border-slate-200 bg-slate-50/80 p-8 text-slate-600">
          {poiskCopy.idleHint}
        </div>
      ) : null}

      {query && results.length === 0 && authorHits.length === 0 && rubricHits.length === 0 && tagHits.length === 0 ? (
        <div className="mt-12 space-y-8">
          <div>
            <h2 className="font-display text-xl font-semibold text-slate-900">{poiskCopy.emptyStateTitle}</h2>
            <p className="mt-2 text-lg text-slate-700">{poiskCopy.emptyResultsIntro(query)}</p>
          </div>
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500">{poiskCopy.recommendedTitle}</h2>
            <div className="mt-4 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {posts.slice(0, 3).map((p) => (
                <PostCard key={p.slug} post={p} />
              ))}
            </div>
          </div>
        </div>
      ) : null}

      {query && (authorHits.length > 0 || rubricHits.length > 0 || tagHits.length > 0) ? (
        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          {authorHits.length ? (
            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">Авторы</h2>
              <ul className="mt-3 space-y-2">
                {authorHits.map((a) => (
                  <li key={a.slug}>
                    <Link href={`/avtor/${a.slug}`} className="font-medium text-sky-700 hover:underline">
                      {a.name}
                    </Link>
                    <p className="text-xs text-slate-500">{a.role}</p>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}
          {rubricHits.length ? (
            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">Рубрики</h2>
              <ul className="mt-3 space-y-2">
                {rubricHits.map((r) => (
                  <li key={r.slug}>
                    <Link href={`/rubriki/${r.slug}`} className="font-medium text-sky-700 hover:underline">
                      {r.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}
          {tagHits.length ? (
            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">Теги</h2>
              <ul className="mt-3 space-y-2">
                {tagHits.map((t) => (
                  <li key={t.slug}>
                    <Link href={`/teg/${t.slug}`} className="font-medium text-sky-700 hover:underline">
                      {t.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}
        </div>
      ) : null}

      {query && results.length > 0 ? (
        <div className="mt-12 space-y-12">
          {byKind.news.length ? (
            <section>
              <h2 className="font-display text-xl font-semibold text-slate-900">Новости</h2>
              <div className="mt-4 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {byKind.news.map((p) => (
                  <PostCard key={p.slug} post={p} />
                ))}
              </div>
            </section>
          ) : null}
          {byKind.article.length ? (
            <section>
              <h2 className="font-display text-xl font-semibold text-slate-900">Статьи</h2>
              <div className="mt-4 grid gap-6 sm:grid-cols-2">
                {byKind.article.map((p) => (
                  <PostCard key={p.slug} post={p} />
                ))}
              </div>
            </section>
          ) : null}
          {byKind.analytics.length ? (
            <section>
              <h2 className="font-display text-xl font-semibold text-slate-900">Аналитика</h2>
              <div className="mt-4 grid gap-6 sm:grid-cols-2">
                {byKind.analytics.map((p) => (
                  <PostCard key={p.slug} post={p} />
                ))}
              </div>
            </section>
          ) : null}
          {byKind.interview.length ? (
            <section>
              <h2 className="font-display text-xl font-semibold text-slate-900">Интервью</h2>
              <div className="mt-4 grid gap-6 sm:grid-cols-2">
                {byKind.interview.map((p) => (
                  <PostCard key={p.slug} post={p} />
                ))}
              </div>
            </section>
          ) : null}
          {byKind.video.length ? (
            <section>
              <h2 className="font-display text-xl font-semibold text-slate-900">Видео</h2>
              <div className="mt-4 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {byKind.video.map((p) => (
                  <PostCard key={p.slug} post={p} />
                ))}
              </div>
            </section>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
