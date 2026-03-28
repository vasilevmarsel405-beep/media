import Image from "next/image";
import Link from "next/link";
import { PostCard } from "@/components/cards/PostCard";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { ShareRow } from "@/components/ShareRow";
import { TagPill } from "@/components/TagPill";
import { YouTubeEmbed } from "@/components/YouTubeEmbed";
import { authorById, rubrics as allRubrics, tags as allTags } from "@/lib/content";
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
  const author = authorById(post.authorId);
  const tagLabel = (slug: string) => allTags.find((t) => t.slug === slug)?.name ?? slug;

  return (
    <article>
      <div className="border-b border-slate-200 bg-black">
        <div className="mx-auto max-w-[1200px] px-4 py-8 sm:px-6 lg:px-10">
          <Breadcrumbs
            tone="dark"
            items={[
              { href: "/", label: "Главная" },
              { href: "/video", label: "Видео" },
              { href: `/video/${post.slug}`, label: post.title },
            ]}
          />
          <h1 className="font-display mt-6 max-w-4xl text-3xl font-semibold leading-tight text-white sm:text-4xl lg:text-5xl">
            {post.title}
          </h1>
          <p className="mt-4 max-w-3xl text-lg text-white/80">{post.lead}</p>
          <div className="mt-6 flex flex-wrap items-center gap-3 text-sm text-white/70">
            <time dateTime={post.publishedAt}>{formatDateTime(post.publishedAt)}</time>
            {post.durationLabel ? <span>· {post.durationLabel}</span> : null}
            {author ? <span>· {author.name}</span> : null}
          </div>
        </div>
      </div>

      <div className="bg-black pb-6">
        <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-10">
          {post.youtubeId ? (
            <YouTubeEmbed id={post.youtubeId} title={post.title} />
          ) : (
            <div className="relative aspect-video overflow-hidden rounded-2xl bg-slate-900">
              <Image src={post.image} alt="" fill className="object-cover opacity-60" sizes="1200px" />
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
                className="rounded-full bg-sky-50 px-3 py-1 text-xs font-semibold text-sky-800 ring-1 ring-sky-100"
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
                  <span className="font-mono text-xs font-bold text-red-600">{tc.t}</span>
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
