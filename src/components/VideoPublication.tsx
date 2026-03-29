import Image from "next/image";
import Link from "next/link";
import { PostCard } from "@/components/cards/PostCard";
import { Breadcrumbs, type Crumb } from "@/components/Breadcrumbs";
import { ShareRow } from "@/components/ShareRow";
import { TagPill } from "@/components/TagPill";
import { BreadcrumbJsonLd } from "@/components/seo/BreadcrumbJsonLd";
import { VideoJsonLd } from "@/components/seo/VideoJsonLd";
import { YouTubeEmbed } from "@/components/YouTubeEmbed";
import { authorById, authors, rubrics as allRubrics, tags as allTags } from "@/lib/content";
import { postCoverImageAlt } from "@/lib/seo/image-alt";
import { videoPublicationCopy } from "@/lib/copy";
import { formatDateTime } from "@/lib/format";
import type { Post } from "@/lib/types";

export function VideoPublication({
  post,
  relatedVideos,
  relatedAll,
}: {
  post: Post;
  relatedVideos: Post[];
  relatedAll: Post[];
}) {
  const author = authorById(post.authorId) ?? authors[0];
  const tagLabel = (slug: string) => allTags.find((t) => t.slug === slug)?.name ?? slug;
  const videoBreadcrumbs: Crumb[] = [
    { href: "/", label: "Главная" },
    { href: "/video", label: "Видео" },
    { href: `/video/${post.slug}`, label: post.title },
  ];

  return (
    <article>
      <BreadcrumbJsonLd items={videoBreadcrumbs} />
      <VideoJsonLd post={post} />
      <div className="border-b border-slate-200 bg-black">
        <div className="mx-auto max-w-[1200px] px-4 py-8 sm:px-6 lg:px-10">
          <Breadcrumbs tone="dark" items={videoBreadcrumbs} />
          <h1 className="font-display mt-6 max-w-4xl text-3xl font-semibold leading-tight text-white sm:text-4xl lg:text-5xl">
            {post.title}
          </h1>
          <p className="mt-4 max-w-3xl text-lg text-white/80">{post.lead}</p>
          <div className="mt-6 space-y-4 text-sm">
            <div className="flex flex-wrap items-center gap-3 text-white/70">
              <time dateTime={post.publishedAt}>{formatDateTime(post.publishedAt)}</time>
              {post.durationLabel ? <span>· {post.durationLabel}</span> : null}
            </div>
            {author ? (
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-white/45">Автор</p>
                <Link
                  href={`/avtor/${author.slug}`}
                  className="mt-2 inline-flex max-w-full items-center gap-3 rounded-xl border border-white/15 bg-white/5 py-2 pl-2 pr-4 transition hover:border-white/25 hover:bg-white/10"
                >
                  <span className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full ring-2 ring-white/20">
                    <Image src={author.photo} alt={author.name} fill className="object-cover" sizes="40px" />
                  </span>
                  <span className="min-w-0 text-left">
                    <span className="block font-semibold text-white">{author.name}</span>
                    <span className="mt-0.5 block text-xs text-white/65">{author.role}</span>
                  </span>
                </Link>
              </div>
            ) : null}
          </div>
        </div>
      </div>

      <div className="bg-black pb-6">
        <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-10">
          {post.youtubeId ? (
            <YouTubeEmbed id={post.youtubeId} title={post.title} />
          ) : (
            <div className="relative aspect-video overflow-hidden rounded-2xl bg-slate-900">
              <Image src={post.image} alt={postCoverImageAlt(post.title)} fill className="object-cover opacity-60" sizes="1200px" />
              <p className="absolute inset-0 flex items-center justify-center text-white">Видео будет здесь</p>
            </div>
          )}
        </div>
      </div>

      <div className="mx-auto max-w-[1100px] px-4 py-10 sm:px-6 lg:px-10">
        <div className="flex flex-wrap gap-2">
          {post.rubricSlugs.map((slug) => {
            const r = allRubrics.find((x) => x.slug === slug);
            return r ? (
              <Link
                key={slug}
                href={`/rubriki/${slug}`}
                className="rounded-xl bg-mars-blue-soft px-3 py-1 text-xs font-semibold text-mars-blue ring-1 ring-mars-blue/20"
              >
                {r.name}
              </Link>
            ) : null;
          })}
          {post.tagSlugs.map((t) => (
            <TagPill key={t} href={`/teg/${t}`}>
              {tagLabel(t)}
            </TagPill>
          ))}
        </div>

        <div className="mt-8 border-y border-slate-100 py-6">
          <ShareRow title={post.title} />
        </div>

        {post.timecodes?.length ? (
          <section className="mt-8 rounded-2xl border border-slate-200 bg-slate-50 p-6">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">Таймкоды</h2>
            <ul className="mt-4 grid gap-2 sm:grid-cols-2">
              {post.timecodes.map((tc) => (
                <li key={tc.t} className="flex gap-3 text-sm text-slate-800">
                  <span className="font-mono text-xs font-bold text-mars-accent">{tc.t}</span>
                  <span>{tc.label}</span>
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        <div className="prose-mars mt-10 max-w-[42rem] text-slate-700">
          {post.paragraphs.map((text, i) => (
            <p key={i} className="mt-6 leading-relaxed first:mt-0">
              {text}
            </p>
          ))}
        </div>

        {author ? (
          <footer className="mt-10 max-w-[42rem] border-t border-slate-200 pt-8">
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-500">Автор</p>
            <p className="mt-2 text-base text-slate-800">
              <Link
                href={`/avtor/${author.slug}`}
                className="font-semibold text-slate-900 underline decoration-slate-300 decoration-1 underline-offset-4 transition hover:text-mars-blue hover:decoration-mars-blue/40"
              >
                {author.name}
              </Link>
              <span className="text-slate-500"> — {author.role}</span>
            </p>
          </footer>
        ) : null}

        <section className="mt-14 border-t border-slate-200 pt-10">
          <h2 className="font-display text-2xl font-semibold text-slate-900">{videoPublicationCopy.relatedMixedTitle}</h2>
          <p className="mt-2 max-w-2xl text-sm text-slate-600">{videoPublicationCopy.relatedMixedSub}</p>
          <div className="mt-6 grid gap-6 sm:grid-cols-2">
            {relatedAll.slice(0, 4).map((p) => (
              <PostCard key={p.slug} post={p} variant="horizontal" />
            ))}
          </div>
        </section>

        <section className="mt-14">
          <h2 className="font-display text-2xl font-semibold text-slate-900">{videoPublicationCopy.watchNextTitle}</h2>
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {relatedVideos.map((p) => (
              <PostCard key={p.slug} post={p} />
            ))}
          </div>
        </section>
      </div>
    </article>
  );
}
