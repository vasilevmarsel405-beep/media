import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { IconPlay } from "@/components/icons";
import { hubPageMeta, videoHubCopy } from "@/lib/copy";
import { getPostsByKind } from "@/lib/posts-service";
import { postCoverImageAlt } from "@/lib/seo/image-alt";
import { formatDateTime } from "@/lib/format";
import { resolvePostImage } from "@/lib/youtube-thumbnail";

export const metadata: Metadata = {
  title: hubPageMeta.video.title,
  description: hubPageMeta.video.description,
};

export const revalidate = 30;

const categories = [
  { slug: "crypto", label: "Криптовалюта" },
  { slug: "economy", label: "Экономика" },
  { slug: "politics", label: "Политика" },
  { slug: "podcasts", label: "Подкасты" },
  { slug: "live", label: "Эфиры" },
];

export default async function VideoHubPage() {
  const videos = (await getPostsByKind("video")).sort(
    (a, b) => +new Date(b.publishedAt) - +new Date(a.publishedAt)
  );
  const [featured, ...rest] = videos;

  return (
    <div className="relative bg-[#050508] text-white">
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-[min(55vh,520px)] bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgb(196_0_28/0.35),transparent_55%),radial-gradient(ellipse_50%_40%_at_80%_20%,rgb(43_62_247/0.2),transparent)]"
        aria-hidden
      />
      <div className="relative mx-auto max-w-[1400px] px-4 pb-16 pt-14 sm:px-6 sm:pt-16 lg:px-10">
        <div className="max-w-3xl max-sm:max-w-none">
          <p className="text-[11px] font-black uppercase tracking-[0.22em] text-white/50 sm:tracking-[0.28em]">
            {videoHubCopy.eyebrow}
          </p>
          <h1 className="font-display mt-3 text-[1.65rem] font-bold leading-snug tracking-tight text-pretty sm:text-5xl sm:leading-tight lg:text-[3.25rem]">
            {videoHubCopy.title}
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-white/70 text-pretty sm:mt-5 sm:text-base sm:text-lg sm:leading-relaxed">
            {videoHubCopy.subtitle}
          </p>
        </div>

        <div className="mt-8 flex gap-2 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] sm:mt-10 [&::-webkit-scrollbar]:hidden">
          {categories.map((c) => (
            <span
              key={c.slug}
              className="shrink-0 rounded-full border border-white/10 bg-white/[0.06] px-4 py-2.5 text-xs font-semibold text-white/85 backdrop-blur-sm"
            >
              {c.label}
            </span>
          ))}
        </div>

        {featured ? (
          <Link
            href={`/video/${featured.slug}`}
            className="group relative mt-12 block overflow-hidden rounded-2xl ring-1 ring-white/10"
          >
            <div className="relative aspect-[21/9] min-h-[220px]">
              <Image
                src={resolvePostImage(featured)}
                alt={postCoverImageAlt(featured.title, featured.imageAlt)}
                fill
                className="object-cover opacity-95 transition duration-700 group-hover:scale-[1.03] group-hover:opacity-100"
                sizes="(max-width:1400px) 100vw, 1400px"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#050508] via-[#050508]/55 to-transparent" />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="flex h-20 w-20 items-center justify-center rounded-full bg-white text-slate-900 shadow-[0_0_0_8px_rgb(255_255_255/0.12),0_24px_48px_rgb(0_0_0/0.5)] transition group-hover:scale-110">
                  <IconPlay className="ml-1 h-9 w-9" />
                </span>
              </div>
              {featured.durationLabel ? (
                <span className="absolute bottom-4 right-4 rounded-lg bg-black/70 px-2.5 py-1 text-xs font-bold tabular-nums text-white backdrop-blur">
                  {featured.durationLabel}
                </span>
              ) : null}
              <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-10">
                <span className="text-[10px] font-black uppercase tracking-[0.25em] text-[#ff6b6b]">Смотреть сейчас</span>
                <h2 className="font-display mt-2 max-w-3xl text-2xl font-bold leading-tight sm:text-3xl lg:text-4xl">
                  {featured.title}
                </h2>
                <p className="mt-3 max-w-2xl line-clamp-2 text-sm text-white/75 sm:text-base">{featured.lead}</p>
              </div>
            </div>
          </Link>
        ) : null}

        <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {rest.map((v) => (
            <Link
              key={v.slug}
              href={`/video/${v.slug}`}
              className="group overflow-hidden rounded-2xl bg-slate-900/80 ring-1 ring-white/[0.08] transition hover:ring-[#ff3100]/40"
            >
              <div className="relative aspect-video">
                <Image
                  src={resolvePostImage(v)}
                  alt={postCoverImageAlt(v.title, v.imageAlt)}
                  fill
                  className="object-cover opacity-90 transition duration-500 group-hover:scale-[1.04] group-hover:opacity-100"
                  sizes="400px"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/15 to-transparent" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="flex h-14 w-14 items-center justify-center rounded-full bg-white text-slate-900 shadow-xl transition group-hover:scale-110">
                    <IconPlay className="ml-0.5 h-6 w-6" />
                  </span>
                </div>
                {v.durationLabel ? (
                  <span className="absolute bottom-3 right-3 rounded-md bg-black/75 px-2 py-1 text-xs font-bold text-white">
                    {v.durationLabel}
                  </span>
                ) : null}
              </div>
              <div className="p-5">
                <h3 className="font-display text-lg font-semibold leading-snug text-white group-hover:text-orange-200">
                  {v.title}
                </h3>
                <p className="mt-2 line-clamp-2 text-sm text-white/60">{v.lead}</p>
                <time className="mt-3 block text-xs text-white/45 tabular-nums" dateTime={v.publishedAt}>
                  {formatDateTime(v.publishedAt)}
                </time>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

