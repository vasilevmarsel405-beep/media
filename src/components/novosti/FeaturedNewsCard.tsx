import Image from "next/image";
import Link from "next/link";
import { authorById, authors, rubrics as allRubrics, tags as allTags } from "@/lib/content";
import { formatDateTime } from "@/lib/format";
import { postHref } from "@/lib/routes";
import { postCoverImageAlt } from "@/lib/seo/image-alt";
import type { Post } from "@/lib/types";
import { resolvePostImage, shouldBypassNextImageOptimization } from "@/lib/youtube-thumbnail";
import { TagPill } from "@/components/TagPill";

export function FeaturedNewsCard({ post }: { post: Post }) {
  const href = postHref(post);
  const cover = resolvePostImage(post);
  const author = authorById(post.authorId) ?? authors[0];
  const primaryRubric = post.rubricSlugs[0]
    ? allRubrics.find((r) => r.slug === post.rubricSlugs[0])
    : undefined;
  const tagLabel = (slug: string) => allTags.find((x) => x.slug === slug)?.name ?? slug;

  return (
    <article className="overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-[0_20px_50px_-28px_rgb(15_23_42/0.18)] ring-1 ring-black/[0.03]">
      <div className="grid lg:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)]">
        <Link href={href} aria-label={`Открыть материал: ${post.title}`} className="group relative block aspect-[16/10] min-h-[220px] lg:aspect-auto lg:min-h-[300px]">
          <span className="sr-only">Открыть материал: {post.title}</span>
          <Image
            src={cover}
            alt={postCoverImageAlt(post.title, post.imageAlt)}
            fill
            unoptimized={shouldBypassNextImageOptimization(cover)}
            className="object-cover transition duration-700 ease-out group-hover:scale-[1.02]"
            sizes="(max-width:1024px) 100vw, 55vw"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent lg:bg-gradient-to-r lg:from-transparent lg:via-black/10 lg:to-black/35" />
          <span className="absolute left-4 top-4 rounded-lg bg-mars-accent px-3 py-1.5 text-[11px] font-black uppercase tracking-widest text-white shadow-lg shadow-red-950/25">
            Главное
          </span>
        </Link>
        <div className="relative flex flex-col justify-center border-t border-slate-100 bg-white p-6 sm:p-8 lg:border-l-4 lg:border-t-0 lg:border-mars-accent lg:pl-10 lg:pr-8">
          <Link href={href} className="group/text block">
            <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
              {primaryRubric ? (
                <span className="font-bold text-mars-blue">{primaryRubric.name}</span>
              ) : null}
              {post.readMin ? <span className="text-slate-400">{post.readMin} мин чтения</span> : null}
              <time className="tabular-nums text-slate-400" dateTime={post.publishedAt}>
                {formatDateTime(post.publishedAt)}
              </time>
            </div>
            <h2 className="font-display mt-4 text-2xl font-bold leading-[1.15] tracking-tight text-slate-900 sm:text-3xl lg:text-[2rem] group-hover/text:text-mars-accent">
              {post.title}
            </h2>
            <p className="mt-4 text-base leading-relaxed text-slate-600 sm:text-lg">{post.lead}</p>
            <div className="mt-6 text-xs text-slate-500">
              {author ? (
                <p>
                  <span className="font-semibold uppercase tracking-wider text-slate-400">Автор</span>
                  <span className="mx-2 text-slate-300" aria-hidden>
                    ·
                  </span>
                  <span className="font-medium text-slate-700">{author.name}</span>
                  <span className="text-slate-400"> — {author.role}</span>
                </p>
              ) : null}
            </div>
            <span className="mt-8 inline-flex items-center gap-2 text-sm font-bold text-mars-accent">
              Читать материал
              <span aria-hidden className="transition group-hover/text:translate-x-1">
                →
              </span>
            </span>
          </Link>
          <div className="mt-5 flex flex-wrap gap-2">
            {post.tagSlugs.slice(0, 4).map((t) => (
              <TagPill key={t} href={`/teg/${t}`}>
                {tagLabel(t)}
              </TagPill>
            ))}
          </div>
        </div>
      </div>
    </article>
  );
}
