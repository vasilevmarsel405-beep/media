import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { IconPlay } from "@/components/icons";
import { hubPageMeta, videoHubCopy } from "@/lib/copy";
import { getPostsByKind } from "@/lib/posts-service";
import { postCoverImageAlt } from "@/lib/seo/image-alt";
import { formatDateTime, formatTime } from "@/lib/format";
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
  const featuredHref = featured ? `/video/${featured.slug}` : "";

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#050508] text-white">
      {/* Атмосфера: блики + точечная сетка как в hero на главной */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-[min(60vh,560px)] bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgb(196_0_28/0.38),transparent_55%),radial-gradient(ellipse_50%_42%_at_92%_18%,rgb(43_62_247/0.22),transparent)]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.11] sm:opacity-[0.14]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.65) 1px, transparent 0)",
          backgroundSize: "26px 26px",
        }}
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(255,255,255,0.06) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255,255,255,0.06) 1px, transparent 1px)
          `,
          backgroundSize: "20px 20px",
        }}
        aria-hidden
      />

      <div className="relative z-[1] mx-auto max-w-[1400px] px-3 py-8 sm:px-6 sm:py-10 lg:px-10 lg:py-12">
        {/* Вводная полоса: темы не сжимаются (без обрезки); на xl — перенос строки при нехватке места */}
        <header className="mb-8 lg:mb-10 xl:flex xl:items-start xl:justify-between xl:gap-8 xl:overflow-visible">
          <div className="min-w-0 max-w-3xl max-sm:max-w-none xl:max-w-[min(100%,46rem)] xl:shrink">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/50 sm:text-[11px] sm:tracking-[0.24em]">
              {videoHubCopy.eyebrow}
            </p>
            <h1 className="font-display mt-2 text-[1.55rem] font-bold leading-[1.18] tracking-tight text-white [text-shadow:0_1px_24px_rgba(0,0,0,0.45)] sm:text-[1.85rem] md:text-4xl lg:text-[2.25rem] xl:text-[2.5rem]">
              {videoHubCopy.title}
            </h1>
            <p className="mt-2.5 max-w-2xl text-[13px] leading-snug text-white/70 sm:text-sm lg:text-[0.9375rem] lg:leading-relaxed">
              <span className="block">{videoHubCopy.subtitleLine1}</span>
              <span className="mt-1 block">{videoHubCopy.subtitleLine2}</span>
            </p>
          </div>
          <nav
            className="mt-5 flex max-w-full flex-wrap items-center gap-2 sm:gap-2.5 xl:mt-1 xl:max-w-[min(100%,36rem)] xl:justify-end 2xl:max-w-none 2xl:flex-nowrap"
            aria-label="Темы видео"
          >
            {categories.map((c) => (
              <span
                key={c.slug}
                className="inline-flex shrink-0 whitespace-nowrap rounded-full border border-white/[0.14] bg-[#0a0a0f]/85 px-3 py-2 text-[11px] font-semibold text-white/[0.92] shadow-[inset_0_1px_0_rgb(255_255_255/0.06)] backdrop-blur-md transition hover:border-white/25 hover:bg-[#12121a]/95 hover:text-white sm:px-3.5 sm:py-2 sm:text-xs"
              >
                {c.label}
              </span>
            ))}
          </nav>
        </header>

        {featured ? (
          <article className="mars-hero-frame mars-reveal isolate group relative z-0 w-full overflow-hidden rounded-[22px] border border-white/10 bg-[#070b16] shadow-[0_36px_80px_-40px_rgb(0_0_0/0.9)] max-sm:aspect-[1.18/1] sm:max-lg:aspect-[1.85/1] lg:aspect-auto lg:min-h-[min(72vh,620px)] lg:rounded-[30px]">
            <Link href={featuredHref} aria-label={`Смотреть: ${featured.title}`} className="absolute inset-0 z-0">
              <Image
                src={resolvePostImage(featured)}
                alt={postCoverImageAlt(featured.title, featured.imageAlt)}
                fill
                priority
                className="object-cover transition duration-700 group-hover:scale-[1.02]"
                sizes="(max-width:1400px) 100vw, 1400px"
              />
            </Link>
            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(7,11,22,0.25)_0%,rgba(7,11,22,0.52)_38%,rgba(7,11,22,0.9)_100%)]" />
            <div
              className="pointer-events-none absolute inset-0"
              style={{
                background:
                  "linear-gradient(105deg, rgba(4,7,16,0.94) 0%, rgba(4,7,16,0.72) 22%, rgba(4,7,16,0.38) 40%, rgba(4,7,16,0.12) 56%, rgba(4,7,16,0) 70%)",
              }}
            />
            <div
              className="pointer-events-none absolute inset-0"
              style={{
                background:
                  "radial-gradient(120% 80% at 12% 88%, rgba(0,0,0,0.68) 0%, rgba(0,0,0,0.3) 38%, rgba(0,0,0,0) 62%)",
              }}
            />
            {/* Точечная сетка только на фоне страницы — на обложке только градиенты */}
            <div className="pointer-events-none absolute inset-0 z-10 flex flex-col justify-center px-5 py-8 sm:justify-end sm:px-5 sm:pb-5 sm:pt-10 md:pt-12 lg:pointer-events-auto lg:relative lg:min-h-[min(72vh,620px)] lg:justify-end lg:px-12 lg:pb-12 lg:pt-12">
              <div className="max-w-4xl pointer-events-auto max-sm:w-full max-sm:pl-0.5">
                <div className="flex flex-wrap items-center gap-2 text-[9px] font-bold uppercase tracking-widest text-white/85 max-sm:text-[10px] sm:max-lg:text-[10px] lg:text-[11px]">
                  <span className="rounded-md bg-[#FF3100] px-2.5 py-1 text-white shadow-lg shadow-orange-950/35 ring-1 ring-white/15 max-sm:ml-0">
                    Свежий выпуск
                  </span>
                  {featured.durationLabel ? (
                    <span className="rounded-md bg-white/12 px-2 py-0.5 text-white ring-1 ring-white/20 backdrop-blur">
                      {featured.durationLabel}
                    </span>
                  ) : null}
                  <span className="text-white/55">{formatTime(featured.publishedAt)}</span>
                </div>
                <Link href={featuredHref} className="mt-2 block min-w-0 max-sm:mt-1.5 sm:mt-3 lg:mt-4">
                  <h2 className="font-display text-[1.05rem] font-bold leading-[1.15] tracking-tight text-white [text-shadow:0_1px_2px_rgba(0,0,0,0.75),0_12px_32px_rgba(0,0,0,0.55)] max-sm:max-w-none max-sm:line-clamp-3 max-sm:text-[0.98rem] max-sm:leading-[1.22] sm:max-lg:line-clamp-4 sm:max-lg:text-[1.2rem] sm:max-lg:leading-tight md:max-lg:text-2xl lg:line-clamp-none lg:max-w-[22ch] lg:text-[2.5rem] lg:leading-[1.06] xl:text-[2.85rem]">
                    {featured.title}
                  </h2>
                </Link>
                <p className="mt-2 max-w-3xl text-[12px] leading-relaxed text-white/[0.9] [text-shadow:0_1px_2px_rgba(0,0,0,0.65),0_10px_28px_rgba(0,0,0,0.4)] max-sm:mt-1.5 max-sm:line-clamp-2 max-sm:text-[13px] max-sm:leading-snug sm:max-lg:line-clamp-3 sm:max-lg:text-xs lg:mt-4 lg:line-clamp-none lg:text-base lg:leading-relaxed xl:text-lg">
                  {featured.lead}
                </p>
                <div className="mt-3 max-sm:mt-3.5 sm:mt-5 lg:mt-8">
                  <Link
                    href={featuredHref}
                    className="focus-ring inline-flex min-h-[40px] shrink-0 items-center justify-center gap-1 whitespace-nowrap rounded-md bg-gradient-to-r from-[#c4001c] via-[#ff3100] to-[#ff5c33] px-3 py-2 text-[11px] font-bold text-white shadow-[0_10px_28px_-10px_rgb(196_0_28/0.45)] transition hover:brightness-[1.07] sm:min-h-[44px] sm:gap-1.5 sm:rounded-lg sm:px-4 sm:py-2.5 sm:text-xs sm:shadow-[0_12px_36px_-10px_rgb(196_0_28/0.5)] lg:rounded-xl lg:px-6 lg:py-3 lg:text-sm"
                  >
                    <span className="leading-none">Смотреть выпуск</span>
                    <ArrowRight className="size-[1em] shrink-0 opacity-95 sm:size-[1.1em]" strokeWidth={2.75} aria-hidden />
                  </Link>
                </div>
              </div>
            </div>
          </article>
        ) : (
          <div className="mars-hero-frame relative overflow-hidden rounded-[22px] border border-white/10 bg-[#070b16]/90 px-6 py-16 text-center lg:rounded-[30px] lg:py-20">
            <p className="font-eyebrow text-[11px] font-black uppercase tracking-[0.22em] text-white/45">Видео</p>
            <p className="font-display mx-auto mt-4 max-w-lg text-xl font-bold text-white sm:text-2xl">
              Пока нет опубликованных видео в ленте
            </p>
            <p className="mx-auto mt-3 max-w-md text-sm text-white/60">
              Добавьте материалы с типом «видео» — они появятся здесь с обложкой и плеером.
            </p>
          </div>
        )}

        {rest.length > 0 ? (
          <section className="mt-14 lg:mt-20" aria-labelledby="video-more-heading">
            <div className="mb-8 flex flex-wrap items-end justify-between gap-4 lg:mb-10">
              <div>
                <p className="font-eyebrow text-[10px] font-black uppercase tracking-[0.22em] text-[#ff6b6b]">Каталог</p>
                <div className="mt-2 flex items-center gap-4">
                  <h2 id="video-more-heading" className="font-display text-2xl font-bold tracking-tight sm:text-3xl">
                    Ещё выпуски
                  </h2>
                  <span
                    className="hidden h-px min-w-[4rem] flex-1 bg-gradient-to-r from-[#ff3100]/60 to-transparent sm:block sm:min-w-[6rem]"
                    aria-hidden
                  />
                </div>
              </div>
            </div>

            <ul className="grid list-none gap-6 sm:grid-cols-2 sm:gap-7 lg:grid-cols-3 lg:gap-8">
              {rest.map((v) => (
                <li key={v.slug}>
                  <Link
                    href={`/video/${v.slug}`}
                    className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-white/[0.1] bg-[#12131a] shadow-[0_8px_32px_-16px_rgb(0_0_0/0.75),inset_0_1px_0_rgb(255_255_255/0.04)] ring-1 ring-black/50 transition duration-300 hover:-translate-y-1 hover:border-[#ff3100]/40 hover:shadow-[0_20px_48px_-28px_rgb(196_0_28/0.22)]"
                  >
                    <div className="relative aspect-video w-full overflow-hidden">
                      <Image
                        src={resolvePostImage(v)}
                        alt={postCoverImageAlt(v.title, v.imageAlt)}
                        fill
                        className="object-cover opacity-92 transition duration-500 group-hover:scale-[1.05] group-hover:opacity-100"
                        sizes="(max-width:640px) 100vw, (max-width:1024px) 50vw, 33vw"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#050508]/90 via-[#050508]/25 to-transparent" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-white text-slate-900 shadow-[0_0_0_6px_rgb(255_255_255/0.12)] transition group-hover:scale-110 group-hover:shadow-[0_0_0_10px_rgb(255_255_255/0.08)]">
                          <IconPlay className="ml-0.5 h-6 w-6" aria-hidden />
                        </span>
                      </div>
                      {v.durationLabel ? (
                        <span className="absolute bottom-3 right-3 rounded-md bg-black/75 px-2 py-1 text-xs font-bold tabular-nums text-white backdrop-blur-sm">
                          {v.durationLabel}
                        </span>
                      ) : null}
                    </div>
                    <div className="flex flex-1 flex-col bg-[#0e0f15]/95 p-5">
                      <h3 className="font-display text-lg font-semibold leading-snug text-white transition group-hover:text-orange-200">
                        {v.title}
                      </h3>
                      <p className="mt-2 line-clamp-2 flex-1 text-sm leading-relaxed text-white/60">{v.lead}</p>
                      <time
                        className="mt-4 border-t border-white/[0.1] pt-3 text-xs font-medium tabular-nums text-white/45"
                        dateTime={v.publishedAt}
                      >
                        {formatDateTime(v.publishedAt)}
                      </time>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ) : null}
      </div>
    </main>
  );
}
