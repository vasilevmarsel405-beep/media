import Image from "next/image";
import Link from "next/link";
import { authorById, authors, rubrics as allRubrics, tags as allTags } from "@/lib/content";
import { formatDateTime } from "@/lib/format";
import { postCoverImageAlt } from "@/lib/seo/image-alt";
import { postHref } from "@/lib/routes";
import type { Post } from "@/lib/types";
import { TagPill } from "@/components/TagPill";
import { IconPlay } from "@/components/icons";

export function PostCard({
  post,
  variant = "default",
}: {
  post: Post;
  variant?: "default" | "horizontal" | "compact" | "urgent" | "related";
}) {
  const href = postHref(post);
  const author = authorById(post.authorId) ?? authors[0];
  const primaryRubric = post.rubricSlugs[0]
    ? allRubrics.find((r) => r.slug === post.rubricSlugs[0])
    : undefined;
  const tagLabel = (slug: string) => allTags.find((t) => t.slug === slug)?.name ?? slug;

  if (variant === "horizontal") {
    return (
      <article className="card-hover group flex gap-4 rounded-2xl border border-slate-100 bg-white p-3 shadow-sm">
        <Link href={href} className="relative aspect-[4/3] w-36 shrink-0 overflow-hidden rounded-xl sm:w-44">
          <Image
            src={post.image}
            alt={postCoverImageAlt(post.title)}
            fill
            className="object-cover transition duration-300 group-hover:scale-[1.03]"
            sizes="200px"
          />
          {post.kind === "video" ? (
            <span className="absolute inset-0 flex items-center justify-center bg-black/20">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white/95 text-slate-900 shadow">
                <IconPlay className="ml-0.5 h-5 w-5" />
              </span>
            </span>
          ) : null}
        </Link>
        <div className="flex min-w-0 flex-1 flex-col">
          <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
            {post.urgent ? (
              <span className="rounded-md bg-[#ff3100] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
                Срочно
              </span>
            ) : null}
            {primaryRubric ? (
              <Link href={`/rubriki/${primaryRubric.slug}`} className="font-semibold text-mars-blue hover:underline">
                {primaryRubric.name}
              </Link>
            ) : null}
            <time dateTime={post.publishedAt}>{formatDateTime(post.publishedAt)}</time>
          </div>
          <Link href={href}>
            <h3 className="mt-2 font-display text-lg font-semibold leading-snug text-slate-900 group-hover:text-slate-700">
              {post.title}
            </h3>
          </Link>
          <p className="mt-1 line-clamp-2 text-sm text-slate-600">{post.lead}</p>
          {author ? (
            <p className="mt-2 text-xs text-slate-500">
              <span className="font-semibold text-slate-600">Автор:</span> {author.name}
            </p>
          ) : null}
          <div className="mt-auto flex flex-wrap gap-2 pt-3">
            {post.tagSlugs.slice(0, 2).map((t) => (
              <TagPill key={t} href={`/teg/${t}`}>
                {tagLabel(t)}
              </TagPill>
            ))}
          </div>
        </div>
      </article>
    );
  }

  if (variant === "compact") {
    return (
      <article className="border-b border-mars-line/60 py-4 last:border-0">
        <div className="flex items-start justify-between gap-3">
          <div>
            {post.urgent ? (
              <span className="text-xs font-bold uppercase text-[#ff3100]">Срочно · </span>
            ) : null}
            <Link href={href} className="font-display text-base font-semibold text-slate-900 hover:text-mars-accent">
              {post.title}
            </Link>
            <p className="mt-1 text-sm text-slate-600">{post.lead}</p>
          </div>
          <time className="shrink-0 text-xs text-mars-muted tabular-nums" dateTime={post.publishedAt}>
            {formatDateTime(post.publishedAt)}
          </time>
        </div>
      </article>
    );
  }

  if (variant === "urgent") {
    return (
      <article className="card-hover rounded-xl border border-mars-line/80 bg-white p-5 shadow-sm ring-1 ring-black/[0.02]">
        <div className="flex flex-col gap-3">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
            {post.urgent ? (
              <span className="rounded-md bg-[#ff3100] px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest text-white">
                Срочно
              </span>
            ) : null}
            <time
              className="text-xs font-medium text-mars-muted tabular-nums"
              dateTime={post.publishedAt}
            >
              {formatDateTime(post.publishedAt)}
            </time>
          </div>
          <Link href={href} className="group block">
            <h3 className="font-display text-base font-semibold leading-snug text-mars-ink group-hover:text-mars-accent">
              {post.title}
            </h3>
          </Link>
          <p className="text-sm leading-relaxed text-mars-muted">{post.lead}</p>
        </div>
      </article>
    );
  }

  if (variant === "related") {
    return (
      <article className="group card-hover flex flex-col overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
        <Link href={href} className="relative aspect-[3/2] w-full shrink-0 overflow-hidden">
          <Image
            src={post.image}
            alt={postCoverImageAlt(post.title)}
            fill
            className="object-cover transition duration-500 group-hover:scale-[1.02]"
            sizes="(max-width:768px) 100vw, 380px"
          />
          {post.kind === "video" ? (
            <span className="absolute bottom-2 left-2 flex items-center gap-1.5 rounded-full bg-black/70 px-2.5 py-1 text-[11px] font-semibold text-white backdrop-blur">
              <IconPlay className="h-3 w-3" />
              {post.durationLabel ?? "Видео"}
            </span>
          ) : null}
          {post.pinned ? (
            <span className="absolute left-2 top-2 rounded-full bg-white/95 px-2 py-0.5 text-[10px] font-bold text-slate-900 shadow">
              Главное
            </span>
          ) : null}
        </Link>
        <div className="flex flex-col p-4">
          <div className="flex flex-wrap items-center gap-1.5 text-[11px] text-slate-500">
            {post.urgent ? (
              <span className="rounded bg-[#ff3100] px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-white">
                Срочно
              </span>
            ) : null}
            {primaryRubric ? (
              <Link href={`/rubriki/${primaryRubric.slug}`} className="font-semibold text-mars-blue hover:underline">
                {primaryRubric.name}
              </Link>
            ) : null}
            {post.readMin ? <span className="text-slate-400">{post.readMin} мин</span> : null}
          </div>
          <Link href={href} className="mt-2">
            <h3 className="font-display text-base font-semibold leading-snug text-slate-900 group-hover:text-mars-accent sm:text-lg">
              {post.title}
            </h3>
          </Link>
          <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-slate-600">{post.lead}</p>
          {author ? (
            <p className="mt-2 text-[11px] text-slate-500">
              <span className="font-semibold text-slate-600">Автор:</span> {author.name}
            </p>
          ) : null}
          <time dateTime={post.publishedAt} className="mt-3 text-xs text-slate-500 tabular-nums">
            {formatDateTime(post.publishedAt)}
          </time>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {post.tagSlugs.slice(0, 2).map((t) => (
              <TagPill key={t} href={`/teg/${t}`}>
                {tagLabel(t)}
              </TagPill>
            ))}
          </div>
        </div>
      </article>
    );
  }

  return (
    <article className="group card-hover flex h-full flex-col overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
      <Link href={href} className="relative aspect-[16/10] w-full overflow-hidden">
        <Image
          src={post.image}
          alt={postCoverImageAlt(post.title)}
          fill
          className="object-cover transition duration-500 group-hover:scale-[1.02]"
          sizes="(max-width:768px) 100vw, 400px"
        />
        {post.kind === "video" ? (
          <span className="absolute bottom-3 left-3 flex items-center gap-2 rounded-full bg-black/70 px-3 py-1 text-xs font-semibold text-white backdrop-blur">
            <IconPlay className="h-3.5 w-3.5" />
            {post.durationLabel ?? "Видео"}
          </span>
        ) : null}
        {post.pinned ? (
          <span className="absolute left-3 top-3 rounded-full bg-white/95 px-3 py-1 text-xs font-bold text-slate-900 shadow">
            Главное
          </span>
        ) : null}
      </Link>
      <div className="flex flex-1 flex-col p-5">
        <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
          {post.urgent ? (
            <span className="rounded-md bg-[#ff3100] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
              Срочно
            </span>
          ) : null}
          {primaryRubric ? (
            <Link href={`/rubriki/${primaryRubric.slug}`} className="font-semibold text-mars-blue hover:underline">
              {primaryRubric.name}
            </Link>
          ) : null}
          {post.readMin ? <span>{post.readMin} мин чтения</span> : null}
        </div>
        <Link href={href} className="mt-2">
          <h3 className="font-display text-xl font-semibold leading-snug text-slate-900 group-hover:text-slate-700">
            {post.title}
          </h3>
        </Link>
        <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-slate-600">{post.lead}</p>
        <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-slate-500">
          <time dateTime={post.publishedAt}>{formatDateTime(post.publishedAt)}</time>
          {author ? (
            <span>
              · <span className="text-slate-600">Автор:</span> {author.name}
            </span>
          ) : null}
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          {post.tagSlugs.slice(0, 3).map((t) => (
            <TagPill key={t} href={`/teg/${t}`}>
              {tagLabel(t)}
            </TagPill>
          ))}
        </div>
      </div>
    </article>
  );
}
