import Image from "next/image";
import Link from "next/link";
import { PostCard } from "@/components/cards/PostCard";
import { Breadcrumbs, type Crumb } from "@/components/Breadcrumbs";
import { ShareRow } from "@/components/ShareRow";
import { TagPill } from "@/components/TagPill";
import { YouTubeEmbed } from "@/components/YouTubeEmbed";
import { authorById, rubrics as allRubrics, tags as allTags } from "@/lib/content";
import { publicationCopy } from "@/lib/copy";
import { formatDateTime } from "@/lib/format";
import type { Post } from "@/lib/types";
import { TocAside } from "@/components/TocAside";

export function PublicationView({
  post,
  breadcrumbs,
  related,
  tone = "default",
}: {
  post: Post;
  breadcrumbs: Crumb[];
  related: Post[];
  tone?: "default" | "analytics" | "interview";
}) {
  const author = authorById(post.authorId);
  const tagLabel = (slug: string) => allTags.find((t) => t.slug === slug)?.name ?? slug;

  const shell =
    tone === "analytics"
      ? "border-sky-100 bg-gradient-to-b from-sky-50/60 to-white"
      : tone === "interview"
        ? "border-violet-100 bg-gradient-to-b from-violet-50/50 to-white"
        : "";

  return (
    <article>
      <div className={`border-b ${shell}`}>
        <div className="mx-auto max-w-[1100px] px-4 py-8 sm:px-6 lg:px-10">
          <Breadcrumbs items={breadcrumbs} />
          <div className="mt-6 flex flex-wrap items-center gap-3 text-sm">
            {post.urgent ? (
              <span className="rounded bg-red-600 px-2 py-1 text-xs font-bold uppercase tracking-wide text-white">
                Срочно
              </span>
            ) : null}
            {post.rubricSlugs.map((slug) => {
              const r = allRubrics.find((x) => x.slug === slug);
              return r ? (
                <Link key={slug} href={`/rubriki/${slug}`} className="font-semibold text-sky-700 hover:underline">
                  {r.name}
                </Link>
              ) : null;
            })}
            <time dateTime={post.publishedAt} className="text-slate-500">
              {formatDateTime(post.publishedAt)}
            </time>
            {post.readMin ? <span className="text-slate-500">· {post.readMin} мин</span> : null}
          </div>
          <h1 className="font-display mt-4 max-w-4xl text-4xl font-semibold leading-[1.1] tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
            {post.title}
          </h1>
          {post.subtitle ? (
            <p className="mt-4 max-w-3xl text-xl text-slate-600 leading-relaxed">{post.subtitle}</p>
          ) : null}
          {post.guestName ? (
            <p className="mt-6 text-lg font-medium text-slate-800">
              Гость: {post.guestName}
              {post.guestBio ? <span className="mt-2 block text-base font-normal text-slate-600">{post.guestBio}</span> : null}
            </p>
          ) : null}
          {author ? (
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link href={`/avtor/${author.slug}`} className="flex items-center gap-3 focus-ring rounded-lg">
                <span className="relative h-12 w-12 overflow-hidden rounded-full ring-2 ring-white shadow">
                  <Image src={author.photo} alt="" fill className="object-cover" sizes="48px" />
                </span>
                <span>
                  <span className="block text-sm font-semibold text-slate-900">{author.name}</span>
                  <span className="block text-xs text-slate-500">{author.role}</span>
                </span>
              </Link>
            </div>
          ) : null}
          <p className="mt-8 max-w-3xl text-lg leading-relaxed text-slate-700">{post.lead}</p>
        </div>
      </div>

      <div className="mx-auto max-w-[1100px] px-4 py-10 sm:px-6 lg:px-10">
        <div className="relative aspect-[21/9] w-full overflow-hidden rounded-2xl bg-slate-100 shadow-inner ring-1 ring-slate-200">
          <Image src={post.image} alt="" fill priority className="object-cover" sizes="(max-width:1100px) 100vw, 1100px" />
        </div>

        {post.youtubeId && post.kind !== "video" ? (
          <div className="mt-10">
            <YouTubeEmbed id={post.youtubeId} title={post.title} />
          </div>
        ) : null}

        <div className="mt-10 flex flex-wrap gap-2">
          {post.tagSlugs.map((t) => (
            <TagPill key={t} href={`/teg/${t}`}>
              {tagLabel(t)}
            </TagPill>
          ))}
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-y border-slate-100 py-6">
          <ShareRow title={post.title} />
          {post.materialType ? (
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">{post.materialType}</span>
          ) : null}
        </div>

        {post.keyPoints?.length ? (
          <aside className="mt-10 rounded-2xl border border-slate-200 bg-slate-50 p-6 sm:p-8">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Ключевые тезисы</p>
            <ul className="mt-4 space-y-3 text-slate-800">
              {post.keyPoints.map((k) => (
                <li key={k} className="flex gap-3">
                  <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-red-600" aria-hidden />
                  <span className="leading-relaxed">{k}</span>
                </li>
              ))}
            </ul>
          </aside>
        ) : null}

        <div className="mt-12 lg:grid lg:grid-cols-[minmax(0,1fr)_16rem] lg:gap-12">
          <div className="min-w-0">
            {post.quotes?.map((q, qi) => (
              <blockquote
                key={`${qi}-${q.text.slice(0, 24)}`}
                className="my-10 border-l-4 border-red-600 bg-red-50/50 py-4 pl-6 pr-4 text-lg font-medium leading-relaxed text-slate-800"
              >
                <p>«{q.text}»</p>
                {q.attribution ? <footer className="mt-3 text-sm font-normal text-slate-600">— {q.attribution}</footer> : null}
              </blockquote>
            ))}

            <div className="prose-mars max-w-[42rem] text-slate-800">
              {post.toc ? (
                <>
                  {post.toc.map((t, i) => (
                    <section key={t.id} id={t.id} className="scroll-mt-28">
                      <h2 className="font-display mt-12 text-2xl font-semibold text-slate-900 first:mt-0">{t.label}</h2>
                      {post.paragraphs[i] ? (
                        <p className="mt-4 leading-relaxed">{post.paragraphs[i]}</p>
                      ) : null}
                    </section>
                  ))}
                  {post.paragraphs.slice(post.toc.length).map((text, i) => (
                    <p key={i} className="mt-6 leading-relaxed">
                      {text}
                    </p>
                  ))}
                </>
              ) : (
                post.paragraphs.map((text, i) => (
                  <p key={i} className="mt-6 leading-relaxed first:mt-0">
                    {text}
                  </p>
                ))
              )}
            </div>

            {tone === "analytics" ? (
              <div className="mt-12 overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
                <table className="w-full min-w-[32rem] text-left text-sm">
                  <caption className="border-b border-slate-100 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Индикаторы для мониторинга
                  </caption>
                  <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                    <tr>
                      <th className="px-4 py-3 font-semibold">Индикатор</th>
                      <th className="px-4 py-3 font-semibold">Статус</th>
                      <th className="px-4 py-3 font-semibold">Комментарий</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    <tr>
                      <td className="px-4 py-3 font-medium">Потребительский индекс</td>
                      <td className="px-4 py-3">
                        <span className="rounded-full bg-amber-50 px-2 py-0.5 text-xs font-semibold text-amber-800 ring-1 ring-amber-100">
                          Наблюдение
                        </span>
                      </td>
                      <td className="px-4 py-3">Сравнение с базой прошлого квартала</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 font-medium">Кредитный импульс МСП</td>
                      <td className="px-4 py-3">
                        <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-800 ring-1 ring-emerald-100">
                          Стабильно
                        </span>
                      </td>
                      <td className="px-4 py-3">Короткие ставки без резких скачков</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 font-medium">Импортные цепочки</td>
                      <td className="px-4 py-3">
                        <span className="rounded-full bg-red-50 px-2 py-0.5 text-xs font-semibold text-red-800 ring-1 ring-red-100">
                          Риск
                        </span>
                      </td>
                      <td className="px-4 py-3">Точечные задержки в отдельных категориях</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            ) : null}
          </div>

          {post.toc?.length ? (
            <aside className="mt-10 lg:mt-0">
              <TocAside items={post.toc} />
            </aside>
          ) : null}
        </div>

        <section className="mt-16 border-t border-slate-200 pt-12">
          <h2 className="font-display text-2xl font-semibold text-slate-900">{publicationCopy.relatedTitle}</h2>
          <p className="mt-2 max-w-2xl text-sm text-slate-600">{publicationCopy.relatedSub}</p>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {related.map((r) => (
              <PostCard key={r.slug} post={r} />
            ))}
          </div>
        </section>

        {author ? (
          <section className="mt-14 rounded-2xl border border-slate-200 bg-slate-50 p-6 sm:p-8">
            <h2 className="font-display text-xl font-semibold text-slate-900">{publicationCopy.authorBlockTitle}</h2>
            <p className="mt-2 text-slate-600">
              <Link href={`/avtor/${author.slug}`} className="font-semibold text-sky-700 hover:underline">
                {publicationCopy.authorProfileCta(author.name)}
              </Link>
            </p>
          </section>
        ) : null}

        <section className="mt-14 rounded-2xl border border-dashed border-slate-200 bg-white p-6">
          <h2 className="font-display text-lg font-semibold text-slate-900">{publicationCopy.feedbackTitle}</h2>
          <p className="mt-2 text-sm text-slate-600">
            {publicationCopy.feedbackBody}{" "}
            <a href="mailto:red@marsmedia.example.com" className="font-semibold text-sky-700 hover:underline">
              red@marsmedia.example.com
            </a>
            .
          </p>
        </section>
      </div>
    </article>
  );
}
