import Image from "next/image";
import Link from "next/link";
import { PostCard } from "@/components/cards/PostCard";
import { Breadcrumbs, type Crumb } from "@/components/Breadcrumbs";
import { ShareRow } from "@/components/ShareRow";
import { TagPill } from "@/components/TagPill";
import { YoutubeDescription } from "@/components/video/YoutubeDescription";
import { BreadcrumbJsonLd } from "@/components/seo/BreadcrumbJsonLd";
import { VideoJsonLd } from "@/components/seo/VideoJsonLd";
import { YouTubeEmbed } from "@/components/YouTubeEmbed";
import { IconPlay } from "@/components/icons";
import { authorById, authors, rubrics as allRubrics, tags as allTags } from "@/lib/content";
import { videoPublicationCopy } from "@/lib/copy";
import { formatDateTime } from "@/lib/format";
import { postCoverImageAlt } from "@/lib/seo/image-alt";
import { resolvePostImage } from "@/lib/youtube-thumbnail";
import type { YoutubeVideoEnrichment } from "@/lib/youtube-enrichment";
import type { Post } from "@/lib/types";

const WATCH_URL = (id: string) => `https://www.youtube.com/watch?v=${id}`;

export function VideoPublication({
  post,
  relatedVideos,
  relatedAll,
  youtubeMeta,
}: {
  post: Post;
  relatedVideos: Post[];
  relatedAll: Post[];
  youtubeMeta: YoutubeVideoEnrichment | null;
}) {
  const author = authorById(post.authorId) ?? authors[0];
  const tagLabel = (slug: string) => allTags.find((t) => t.slug === slug)?.name ?? slug;
  const videoBreadcrumbs: Crumb[] = [
    { href: "/", label: "Главная" },
    { href: "/video", label: "Видео" },
    { href: `/video/${post.slug}`, label: post.title },
  ];

  const ytDescription = youtubeMeta?.description?.trim() ?? "";
  const showYoutubeDescription = ytDescription.length > 0;
  const channelLine = youtubeMeta?.channelTitle;

  return (
    <article className="relative overflow-hidden bg-black text-white">
      <div
        className="pointer-events-none absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20xmlns=%22http://www.w3.org/2000/svg%22%20viewBox=%220%200%2032%2032%22%20width=%2232%22%20height=%2232%22%20fill=%22none%22%20stroke=%22rgb(255%20255%20255%20/%200.04)%22%3E%3Cpath%20d=%22M0%20.5H32M0%208.5H32M0%2016.5H32M0%2024.5H32M.5%200V32M8.5%200V32M16.5%200V32M24.5%200V32%22/%3E%3C/svg%3E')] opacity-[0.45]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-[46rem] bg-[radial-gradient(ellipse_75%_55%_at_18%_8%,rgb(255_49_0_/_0.17),transparent_62%),radial-gradient(ellipse_58%_45%_at_85%_4%,rgb(43_62_247_/_0.14),transparent_60%)]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute bottom-0 left-0 right-0 h-[30rem] bg-[radial-gradient(ellipse_64%_52%_at_50%_100%,rgb(43_62_247_/_0.10),transparent_72%)]"
        aria-hidden
      />
      <BreadcrumbJsonLd items={videoBreadcrumbs} />
      <VideoJsonLd
        post={post}
        youtubeDescription={youtubeMeta?.description}
        youtubeThumbnailUrl={youtubeMeta?.thumbnailUrl}
      />

      <header className="relative overflow-hidden border-b border-white/10 bg-black text-white">
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_120%_70%_at_50%_-30%,rgb(255_49_0_/_0.22),transparent_55%),radial-gradient(ellipse_70%_60%_at_105%_40%,rgb(43_62_247_/_0.12),transparent_50%)]"
          aria-hidden
        />
        <div className="pointer-events-none absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20xmlns=%22http://www.w3.org/2000/svg%22%20viewBox=%220%200%2032%2032%22%20width=%2232%22%20height=%2232%22%20fill=%22none%22%20stroke=%22rgb(255%20255%20255%20/%200.04)%22%3E%3Cpath%20d=%22M0%20.5H32M0%208.5H32M0%2016.5H32M0%2024.5H32M.5%200V32M8.5%200V32M16.5%200V32M24.5%200V32%22/%3E%3C/svg%3E')] opacity-[0.65]" />

        <div className="relative z-[1] mx-auto max-w-[1200px] px-4 pb-10 pt-8 sm:px-6 sm:pb-12 sm:pt-10 lg:px-10">
          <Breadcrumbs tone="dark" items={videoBreadcrumbs} />

          <div className="mt-2 h-1 w-16 rounded-full bg-gradient-to-r from-[#ff3100] to-[#ff7a45] shadow-[0_0_24px_rgb(255_49_0_/_0.45)]" />

          <h1 className="font-display mt-6 max-w-[52rem] text-[1.65rem] font-bold leading-[1.08] tracking-tight text-white sm:text-4xl lg:text-[2.75rem]">
            {post.title}
          </h1>
          {post.subtitle ? (
            <p className="mt-4 max-w-3xl text-lg font-medium leading-snug text-white/85">{post.subtitle}</p>
          ) : null}
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-white/72 sm:text-[1.05rem] sm:leading-relaxed">
            {post.lead}
          </p>

          <div className="mt-7 flex flex-wrap items-center gap-x-4 gap-y-3 text-sm text-white/60">
            <time dateTime={post.publishedAt} className="tabular-nums">
              {formatDateTime(post.publishedAt)}
            </time>
            {post.durationLabel ? (
              <span className="inline-flex items-center gap-1.5 rounded-lg bg-white/10 px-2.5 py-1 text-xs font-bold uppercase tracking-wider text-white/90 ring-1 ring-white/15">
                <IconPlay className="h-3.5 w-3.5" aria-hidden />
                {post.durationLabel}
              </span>
            ) : null}
            {post.youtubeId ? (
              <Link
                href={WATCH_URL(post.youtubeId)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-lg border border-white/20 bg-white/5 px-3 py-1.5 text-xs font-semibold text-white transition hover:border-[#ff3100]/50 hover:bg-[#ff3100]/15 hover:text-white"
              >
                {videoPublicationCopy.youtubeOpenButton}
                <span aria-hidden className="text-white/50">
                  ↗
                </span>
              </Link>
            ) : null}
          </div>

          {author ? (
            <div className="mt-8">
              <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-white/40">Автор</p>
              <Link
                href={`/avtor/${author.slug}`}
                className="mt-2 inline-flex max-w-full items-center gap-3 rounded-2xl border border-white/15 bg-white/[0.07] py-2.5 pl-2.5 pr-5 shadow-[0_12px_40px_-20px_rgb(0_0_0_/_0.8)] backdrop-blur-sm transition hover:border-white/25 hover:bg-white/10"
              >
                <span className="relative h-11 w-11 shrink-0 overflow-hidden rounded-full ring-2 ring-[#ff3100]/35">
                  <Image src={author.photo} alt={author.name} fill className="object-cover" sizes="44px" />
                </span>
                <span className="min-w-0 text-left">
                  <span className="block text-sm font-bold text-white">{author.name}</span>
                  <span className="mt-0.5 block text-xs leading-snug text-white/55">{author.role}</span>
                </span>
              </Link>
            </div>
          ) : null}
        </div>
      </header>

      {/* Один контейнер под плеер и всё ниже — одна ширина с header (1200px), без «ступеньки» */}
      <div className="relative z-[1] mx-auto max-w-[1200px] px-4 pb-16 pt-2 sm:px-6 sm:pb-20 sm:pt-4 lg:px-10">
        <div className="grid gap-8 lg:grid-cols-12 lg:gap-10 lg:items-start">
          <div className="lg:col-span-8">
            {post.youtubeId ? (
              <YouTubeEmbed id={post.youtubeId} title={post.title} />
            ) : (
              <div className="relative aspect-video overflow-hidden rounded-2xl bg-slate-900 shadow-2xl ring-1 ring-white/10 sm:rounded-3xl">
                <Image
                  src={resolvePostImage(post)}
                  alt={postCoverImageAlt(post.title)}
                  fill
                  className="object-cover opacity-55"
                  sizes="(max-width:1024px) 100vw, 800px"
                  priority
                />
                <p className="absolute inset-0 flex items-center justify-center px-6 text-center text-sm font-medium text-white/80">
                  Укажите ссылку или ID ролика YouTube — плеер появится здесь
                </p>
              </div>
            )}
          </div>

          <aside className="lg:col-span-4 lg:sticky lg:top-24">
            <div className="rounded-2xl border border-white/12 bg-white/[0.06] p-5 shadow-[0_20px_50px_-28px_rgb(0_0_0_/_0.9)] backdrop-blur-md sm:p-6">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#ff3100]/90">
                {videoPublicationCopy.youtubeMetaEyebrow}
              </p>
              {channelLine ? (
                <p className="mt-3 text-sm text-white/80">
                  <span className="text-white/45">{videoPublicationCopy.youtubeChannel} · </span>
                  <span className="font-medium text-white">{channelLine}</span>
                </p>
              ) : null}
              {youtubeMeta?.title && youtubeMeta.title !== post.title ? (
                <p className="mt-3 text-sm leading-snug text-white/70">&ldquo;{youtubeMeta.title}&rdquo;</p>
              ) : null}

              {post.youtubeId ? (
                <Link
                  href={WATCH_URL(post.youtubeId)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#c4001c] via-[#ff3100] to-[#ff5c33] px-4 py-3 text-sm font-bold text-white shadow-[0_12px_36px_-8px_rgb(255_49_0_/_0.55)] transition hover:brightness-110"
                >
                  <IconPlay className="h-4 w-4" aria-hidden />
                  {videoPublicationCopy.youtubeOpenButton}
                </Link>
              ) : null}
            </div>
          </aside>
        </div>

        <div className="mt-10 flex flex-wrap gap-2 sm:mt-12">
          {post.rubricSlugs.map((slug) => {
            const r = allRubrics.find((x) => x.slug === slug);
            return r ? (
              <Link
                key={slug}
                href={`/rubriki/${slug}`}
                className="rounded-xl border border-white/14 bg-white/[0.07] px-3 py-1 text-xs font-semibold text-white/90 ring-1 ring-white/10 transition hover:bg-white/10"
              >
                {r.name}
              </Link>
            ) : null;
          })}
          {post.tagSlugs.map((t) => (
            <TagPill
              key={t}
              href={`/teg/${t}`}
              className="border border-white/12 bg-white/[0.07] text-white/90 ring-white/12 hover:bg-white/11"
            >
              {tagLabel(t)}
            </TagPill>
          ))}
        </div>

        <div className="mt-8 rounded-2xl border border-white/12 bg-white/[0.05] px-4 py-5 shadow-[0_12px_36px_-24px_rgb(0_0_0_/_0.9)] backdrop-blur-sm sm:px-6">
          <ShareRow title={post.title} tone="dark" />
        </div>

        {post.timecodes?.length ? (
          <section className="mt-10 rounded-2xl border border-white/12 bg-white/[0.06] p-6 shadow-[0_20px_50px_-34px_rgb(0_0_0_/_0.85)] backdrop-blur-sm sm:p-8">
            <h2 className="text-[11px] font-black uppercase tracking-[0.18em] text-white/55">Таймкоды</h2>
            <ul className="mt-5 grid gap-3 sm:grid-cols-2">
              {post.timecodes.map((tc) => (
                <li
                  key={`${tc.t}-${tc.label}`}
                  className="flex gap-3 rounded-xl border border-white/10 bg-black/25 px-3 py-2.5 text-sm text-white/85 shadow-sm"
                >
                  <span className="font-mono text-xs font-bold tabular-nums text-mars-accent">{tc.t}</span>
                  <span className="leading-snug">{tc.label}</span>
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        {post.paragraphs.some((p) => p.trim()) ? (
          <section className="mt-12 rounded-2xl border border-white/12 bg-white/[0.05] px-5 py-6 shadow-[0_20px_50px_-36px_rgb(0_0_0_/_0.88)] backdrop-blur-sm sm:px-7 sm:py-8">
            <h2 className="font-display text-xl font-bold text-white sm:text-2xl">
              {videoPublicationCopy.editorialTitle}
            </h2>
            <div className="mt-5 min-w-0">
              <YoutubeDescription
                text={post.paragraphs.filter((p) => p.trim()).join("\n\n")}
                tone="dark"
                className="space-y-4"
              />
            </div>
            {showYoutubeDescription ? (
              <p className="mt-5 text-xs text-white/45">
                Источник текста: описание ролика YouTube.
              </p>
            ) : null}
          </section>
        ) : null}

        <section className="mt-16 border-t border-white/15 pt-12">
          <h2 className="font-display text-2xl font-bold text-white">{videoPublicationCopy.relatedMixedTitle}</h2>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-white/65">{videoPublicationCopy.relatedMixedSub}</p>
          <div className="mt-8 grid gap-6 sm:grid-cols-2">
            {relatedAll.slice(0, 4).map((p) => (
              <PostCard key={p.slug} post={p} variant="horizontal-dark" />
            ))}
          </div>
        </section>

        <section className="mt-16">
          <h2 className="font-display text-2xl font-bold text-white">{videoPublicationCopy.watchNextTitle}</h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {relatedVideos.map((p) => (
              <PostCard key={p.slug} post={p} variant="dark" />
            ))}
          </div>
        </section>
      </div>
    </article>
  );
}
