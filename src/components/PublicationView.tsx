import Image from "next/image";
import Link from "next/link";
import { PostCard } from "@/components/cards/PostCard";
import { Breadcrumbs, type Crumb } from "@/components/Breadcrumbs";
import { ShareRow } from "@/components/ShareRow";
import { TagPill } from "@/components/TagPill";
import { YouTubeEmbed } from "@/components/YouTubeEmbed";
import { authorById, authors, rubrics as allRubrics, tags as allTags } from "@/lib/content";
import { publicationCopy } from "@/lib/copy";
import { formatDateTime } from "@/lib/format";
import type { Post } from "@/lib/types";
import { ArticleJsonLd } from "@/components/seo/ArticleJsonLd";
import { postCoverImageAlt } from "@/lib/seo/image-alt";
import { BreadcrumbJsonLd } from "@/components/seo/BreadcrumbJsonLd";
import { TocAside } from "@/components/TocAside";
import { cn } from "@/lib/cn";
import { resolvePostImage } from "@/lib/youtube-thumbnail";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

function MarkdownParagraph({ text, className }: { text: string; className?: string }) {
  return (
    <div className={className}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        // По умолчанию HTML из markdown не рендерится (без rehypeRaw),
        // поэтому форматирование безопасно: поддерживаем markdown-синтаксис.
        components={{
          p: ({ children }) => <>{children}</>,
          a: ({ href, children }) => (
            <a
              href={href}
              className="font-semibold text-mars-blue underline decoration-mars-blue/35 underline-offset-2 hover:decoration-mars-blue"
              target="_blank"
              rel="noopener noreferrer"
            >
              {children}
            </a>
          ),
          ul: ({ children }) => <ul className="my-3 list-disc space-y-1 pl-6">{children}</ul>,
          ol: ({ children }) => <ol className="my-3 list-decimal space-y-1 pl-6">{children}</ol>,
          li: ({ children }) => <li className="leading-relaxed">{children}</li>,
          strong: ({ children }) => <strong className="font-bold text-slate-900">{children}</strong>,
          em: ({ children }) => <em className="italic">{children}</em>,
          code: ({ children }) => (
            <code className="rounded bg-slate-100 px-1.5 py-0.5 text-[0.92em] text-slate-800">{children}</code>
          ),
        }}
      >
        {text}
      </ReactMarkdown>
    </div>
  );
}

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
  const author = authorById(post.authorId) ?? authors[0];
  const tagLabel = (slug: string) => allTags.find((t) => t.slug === slug)?.name ?? slug;

  const headerGradient =
    tone === "analytics"
      ? "from-mars-blue-soft/55 via-white to-white"
      : tone === "interview"
        ? "from-violet-50/70 via-white to-white"
        : "from-slate-50/95 via-white to-white";

  const accentBar =
    tone === "analytics"
      ? "from-mars-blue to-mars-blue/70"
      : tone === "interview"
        ? "from-violet-500 to-violet-400"
        : "from-mars-accent to-[#ff5c33]";

  return (
    <>
      <BreadcrumbJsonLd items={breadcrumbs} />
      <ArticleJsonLd post={post} />
      <article className="bg-white">
      <header
        className={cn(
          "border-b border-slate-200/70 bg-gradient-to-b pb-6 pt-5 sm:pb-8 sm:pt-7",
          headerGradient
        )}
      >
        <div className="mx-auto max-w-[1180px] px-4 sm:px-6 lg:px-12">
          <Breadcrumbs items={breadcrumbs} />

          <div className="mt-4 flex flex-wrap items-center gap-2 sm:mt-5 sm:gap-2.5">
            {post.urgent ? (
              <span className="rounded-md bg-mars-accent px-2 py-1 text-[10px] font-black uppercase tracking-widest text-white shadow-sm">
                Срочно
              </span>
            ) : null}
            {post.rubricSlugs.map((slug) => {
              const r = allRubrics.find((x) => x.slug === slug);
              return r ? (
                <Link
                  key={slug}
                  href={`/rubriki/${slug}`}
                  className="rounded-lg bg-white/90 px-2.5 py-1 text-xs font-bold text-mars-blue shadow-sm ring-1 ring-mars-blue/15 transition hover:bg-mars-blue-soft hover:ring-mars-blue/25"
                >
                  {r.name}
                </Link>
              ) : null;
            })}
            <span className="hidden h-3.5 w-px bg-slate-200 sm:block" aria-hidden />
            <time
              dateTime={post.publishedAt}
              className="text-xs font-medium tabular-nums text-slate-500 sm:text-[13px]"
            >
              {formatDateTime(post.publishedAt)}
            </time>
            {post.readMin ? (
              <>
                <span className="text-slate-300 sm:px-0.5" aria-hidden>
                  ·
                </span>
                <span className="text-xs font-medium text-slate-500 sm:text-[13px]">{post.readMin} мин чтения</span>
              </>
            ) : null}
            {author ? (
              <>
                <span className="hidden h-3.5 w-px bg-slate-200 sm:block" aria-hidden />
                <span className="text-xs font-medium text-slate-600 sm:text-[13px]">
                  <span className="text-slate-400">Автор</span> · {author.name}
                </span>
              </>
            ) : null}
          </div>

          <div
            className={cn("mt-3.5 h-0.5 w-14 rounded-full bg-gradient-to-r shadow-sm sm:mt-4 sm:h-1 sm:w-16", accentBar)}
            aria-hidden
          />

          <h1 className="font-display mt-4 max-w-[52rem] text-[1.75rem] font-bold leading-[1.1] tracking-tight text-slate-900 sm:mt-5 sm:text-[2.05rem] sm:leading-[1.08] lg:text-[2.35rem]">
            {post.title}
          </h1>

          {post.subtitle ? (
            <p className="mt-3 max-w-[42rem] text-base font-medium leading-snug text-slate-700 sm:mt-4 sm:text-lg">
              {post.subtitle}
            </p>
          ) : null}

          {post.guestName ? (
            <p className="mt-4 text-lg font-medium text-slate-800 sm:mt-5">
              Гость: {post.guestName}
              {post.guestBio ? (
                <span className="mt-2 block text-base font-normal text-slate-600">{post.guestBio}</span>
              ) : null}
            </p>
          ) : null}

          {author ? (
            <div className="mt-5 sm:mt-6">
              <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-500">Автор</p>
              <Link
                href={`/avtor/${author.slug}`}
                className="focus-ring mt-2 inline-flex max-w-full items-center gap-3 rounded-xl border border-slate-200/90 bg-white/90 py-2 pl-2 pr-5 shadow-[0_4px_20px_-12px_rgb(15_23_42/0.1)] backdrop-blur-sm transition hover:border-slate-300 hover:shadow-[0_6px_28px_-12px_rgb(15_23_42/0.14)]"
              >
                <span className="relative h-11 w-11 shrink-0 overflow-hidden rounded-full ring-2 ring-white shadow-md sm:h-12 sm:w-12">
                  <Image src={author.photo} alt={author.name} fill className="object-cover" sizes="48px" />
                </span>
                <span className="min-w-0 text-left">
                  <span className="block text-sm font-bold text-slate-900">{author.name}</span>
                  <span className="mt-0.5 block text-xs leading-snug text-slate-500">{author.role}</span>
                </span>
              </Link>
            </div>
          ) : null}

          <p className="mt-5 max-w-[40.5rem] text-base leading-relaxed text-slate-600 sm:mt-6 sm:text-[1.0625rem] sm:leading-[1.65]">
            {post.lead}
          </p>
        </div>
      </header>

      <div className="mx-auto max-w-[1180px] px-4 pb-16 pt-6 sm:px-6 sm:pt-8 lg:px-12">
        <div className="relative sm:-mt-1">
          <div className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl bg-slate-100 shadow-[0_28px_80px_-32px_rgb(15_23_42/0.45)] ring-1 ring-slate-900/[0.07] sm:aspect-[2.05/1] sm:rounded-3xl lg:aspect-[21/9]">
            <Image
              src={resolvePostImage(post)}
              alt={postCoverImageAlt(post.title)}
              fill
              priority
              className="object-cover"
              sizes="(max-width:1180px) 100vw, 1180px"
            />
          </div>
        </div>

        {post.youtubeId && post.kind !== "video" ? (
          <div className="mt-10 sm:mt-12">
            <YouTubeEmbed id={post.youtubeId} title={post.title} />
          </div>
        ) : null}

        {post.tagSlugs.length > 0 ? (
          <div className="mt-8 flex flex-wrap gap-2 sm:mt-10">
            {post.tagSlugs.map((t) => (
              <TagPill key={t} href={`/teg/${t}`}>
                {tagLabel(t)}
              </TagPill>
            ))}
          </div>
        ) : null}

        <div className="mt-8 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-slate-100 bg-slate-50/80 px-4 py-4 sm:px-6 sm:py-5">
          <ShareRow title={post.title} />
          {post.materialType ? (
            <span className="rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-sm ring-1 ring-slate-200/80">
              {post.materialType}
            </span>
          ) : null}
        </div>

        {post.keyPoints?.length ? (
          <aside className="mt-10 rounded-2xl border border-slate-200/90 bg-gradient-to-br from-white to-slate-50/90 p-6 shadow-sm sm:mt-12 sm:p-8">
            <p className="text-[11px] font-black uppercase tracking-[0.18em] text-slate-500">Ключевые тезисы</p>
            <ul className="mt-5 space-y-3.5 text-slate-800">
              {post.keyPoints.map((k) => (
                <li key={k} className="flex gap-3.5">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-gradient-to-br from-mars-accent to-[#ff3100]" aria-hidden />
                  <span className="leading-relaxed">{k}</span>
                </li>
              ))}
            </ul>
          </aside>
        ) : null}

        <div
          className={cn(
            "mt-12",
            post.toc?.length ? "lg:grid lg:grid-cols-[minmax(0,1fr)_15.5rem] lg:gap-14 lg:gap-x-16" : ""
          )}
        >
          <div className="min-w-0">
            {post.quotes?.map((q, qi) => (
              <blockquote
                key={`${qi}-${q.text.slice(0, 24)}`}
                className="my-10 rounded-r-xl border-l-[3px] border-mars-accent bg-gradient-to-r from-mars-accent-soft/70 to-mars-accent-soft/20 py-5 pl-6 pr-5 text-[1.0625rem] font-medium leading-relaxed text-slate-800 sm:my-12 sm:pl-8 sm:text-lg"
              >
                <p>«{q.text}»</p>
                {q.attribution ? (
                  <footer className="mt-3 text-sm font-normal text-slate-600">— {q.attribution}</footer>
                ) : null}
              </blockquote>
            ))}

            <div className="prose-mars prose-mars--article text-slate-800">
              {post.toc ? (
                <>
                  {post.toc.map((t, i) => (
                    <section key={t.id} id={t.id} className="scroll-mt-32">
                      <h2 className="font-display mt-12 border-l-[3px] border-mars-accent pl-4 text-xl font-bold leading-snug text-slate-900 first:mt-0 sm:mt-14 sm:pl-5 sm:text-2xl">
                        {t.label}
                      </h2>
                      {post.paragraphs[i] ? (
                        <MarkdownParagraph text={post.paragraphs[i]} className="mt-5 leading-relaxed" />
                      ) : null}
                    </section>
                  ))}
                  {post.paragraphs.slice(post.toc.length).map((text, i) => (
                    <MarkdownParagraph key={i} text={text} className="mt-6 leading-relaxed" />
                  ))}
                </>
              ) : (
                post.paragraphs.map((text, i) => (
                  <MarkdownParagraph key={i} text={text} className="mt-6 leading-relaxed first:mt-0" />
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
                        <span className="rounded-full bg-mars-accent-soft px-2 py-0.5 text-xs font-semibold text-mars-accent ring-1 ring-mars-accent/15">
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
            <aside className="mt-10 lg:mt-2">
              <TocAside items={post.toc} tone={tone} />
            </aside>
          ) : null}
        </div>

        <section className="mt-16 border-t border-slate-200/90 pt-12 sm:mt-20 sm:pt-14">
          <h2 className="font-display text-2xl font-bold text-slate-900">{publicationCopy.relatedTitle}</h2>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-600">{publicationCopy.relatedSub}</p>
          <div className="mt-8 grid grid-cols-1 items-start gap-5 sm:grid-cols-2 lg:grid-cols-2 lg:gap-6 xl:grid-cols-3">
            {related.map((r) => (
              <PostCard key={r.slug} post={r} variant="related" />
            ))}
          </div>
        </section>

        <section className="mt-12 rounded-2xl border border-slate-200/80 bg-slate-50/50 p-6 sm:p-7">
          <h2 className="font-display text-lg font-bold text-slate-900">{publicationCopy.feedbackTitle}</h2>
          <p className="mt-2 text-sm leading-relaxed text-slate-600">
            {publicationCopy.feedbackBody}{" "}
            <a href="mailto:red@cryptomarsmedia.ru" className="font-semibold text-mars-blue hover:underline">
              red@cryptomarsmedia.ru
            </a>
            .
          </p>
        </section>
      </div>
    </article>
    </>
  );
}
