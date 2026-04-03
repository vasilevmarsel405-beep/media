import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Calendar, Clock, ExternalLink, MessageCircle, Mic2, Music2, Radio } from "lucide-react";
import { hubPageMeta, podcastHubCopy } from "@/lib/copy";
import { cn } from "@/lib/cn";
import type { PodcastEpisodeDisplay } from "@/lib/podcast-rss";
import { fetchPodcastFeedFromRss } from "@/lib/podcast-rss";
import { podcastYandexMusicUrl, socialTelegram } from "@/lib/site";

export const metadata: Metadata = {
  title: hubPageMeta.podkasty.title,
  description: hubPageMeta.podkasty.description,
};

export const revalidate = 300;

const barHeights = [28, 52, 36, 64, 42, 72, 38, 58, 44, 68, 32, 76, 48, 62, 40, 70, 34, 56, 50, 66] as const;

function HeroEqualizer({
  className,
  tone = "brand",
}: {
  className?: string;
  tone?: "brand" | "ghost";
}) {
  return (
    <div className={cn("flex h-44 items-end justify-center gap-[3px] sm:h-52 sm:gap-1", className)} aria-hidden>
      {barHeights.map((h, i) => (
        <span
          key={i}
          className={cn(
            "w-1 rounded-full sm:w-1.5",
            tone === "ghost"
              ? i % 4 === 0
                ? "bg-white"
                : "bg-white/45"
              : i % 3 === 0
                ? "bg-mars-accent"
                : i % 3 === 1
                  ? "bg-mars-accent/55"
                  : "bg-slate-300/90"
          )}
          style={{ height: `${h}%` }}
        />
      ))}
    </div>
  );
}

function staticEpisodesForHub(): PodcastEpisodeDisplay[] {
  return podcastHubCopy.episodes.map((ep, i) => ({
    key: ep.id,
    episodeLabel: ep.episode,
    title: ep.title,
    description: ep.description,
    durationLabel: ep.duration,
    dateLabel: ep.dateLabel,
    listenUrl: socialTelegram,
    imageUrl: null,
    publishedAtMs: 2_000_000_000_000 - i * 86_400_000,
  }));
}

export default async function PodcastHubPage() {
  const c = podcastHubCopy;
  const feed = await fetchPodcastFeedFromRss();
  const staticSorted = staticEpisodesForHub().sort((a, b) => b.publishedAtMs - a.publishedAtMs);
  const episodes = feed?.episodes.length ? feed.episodes : staticSorted;
  const hasRss = Boolean(feed?.episodes.length);
  const newest = hasRss ? feed!.episodes[0]! : null;
  const channelCover = feed?.channelImageUrl ?? null;

  const featuredTitle = newest?.title ?? c.featuredTitle;
  const featuredLead = newest?.description.slice(0, 280) ?? c.featuredLead;
  const featuredDuration = newest?.durationLabel ?? c.featuredDuration;
  const featuredListenUrl = hasRss ? podcastYandexMusicUrl : socialTelegram;
  const featuredBadge = newest ? c.featuredBadgeFresh : c.featuredBadge;
  const featuredCardLine = newest ? c.featuredCardLineFresh : c.featuredCardLineStatic;
  const featuredCoverUrl = newest?.imageUrl ?? null;

  return (
    <main className="relative min-h-screen overflow-x-clip bg-gradient-to-b from-[#f7f6f4] via-white to-[#f4f5f7] text-mars-ink">
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-[min(70vh,640px)] bg-[radial-gradient(ellipse_90%_50%_at_50%_-8%,rgb(196_0_28/0.09),transparent_58%),radial-gradient(ellipse_45%_35%_at_92%_12%,rgb(43_62_247/0.06),transparent)]"
        aria-hidden
      />

      <section className="relative border-b border-slate-200/70">
        <div className="mx-auto max-w-[1400px] px-4 pb-14 pt-12 sm:px-6 sm:pb-16 sm:pt-14 lg:px-10 lg:pb-20 lg:pt-16">
          <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,380px)] lg:gap-14">
            <div>
              <p className="font-eyebrow text-[11px] font-black uppercase tracking-[0.28em] text-mars-accent">
                {c.eyebrow}
              </p>
              <h1 className="font-display mt-4 text-[2.125rem] font-bold leading-[1.08] tracking-tight sm:text-5xl lg:text-[3.25rem]">
                {c.title}
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-relaxed text-mars-muted sm:text-lg">{c.subtitle}</p>

              <div className="mt-8">
                <p className="text-xs font-bold tracking-wide text-slate-600">{c.platformsEyebrow}</p>
                <p className="mt-2 max-w-xl text-sm leading-relaxed text-slate-600">{c.platformsNote}</p>
                <div className="mt-5 flex flex-wrap gap-3">
                  <a
                    href={podcastYandexMusicUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="focus-ring inline-flex items-center gap-2 rounded-full bg-mars-accent px-5 py-2.5 text-sm font-bold text-white shadow-[0_12px_32px_-12px_rgb(196_0_28/0.55)] transition hover:bg-mars-accent-hover"
                  >
                    <Music2 className="h-4 w-4 opacity-95" aria-hidden />
                    {c.listenYandexLabel}
                    <ExternalLink className="h-3.5 w-3.5 opacity-80" aria-hidden />
                  </a>
                  <a
                    href={socialTelegram}
                    target="_blank"
                    rel="noreferrer"
                    className="focus-ring inline-flex items-center gap-2 rounded-full border border-slate-200/90 bg-white px-5 py-2.5 text-sm font-semibold text-slate-800 shadow-sm transition hover:border-slate-300 hover:bg-slate-50"
                  >
                    <MessageCircle className="h-4 w-4 text-slate-600" aria-hidden />
                    {c.listenTelegramLabel}
                    <ExternalLink className="h-3.5 w-3.5 text-slate-500" aria-hidden />
                  </a>
                </div>
              </div>
            </div>

            <div className="relative mx-auto w-full max-w-[360px] lg:mx-0 lg:ml-auto lg:max-w-none">
              <div className="absolute -inset-3 rounded-[1.75rem] bg-gradient-to-br from-mars-accent/12 via-white to-mars-blue-soft/35 blur-2xl" aria-hidden />
              <div className="relative overflow-hidden rounded-[1.75rem] border border-slate-200/90 bg-white shadow-[var(--shadow-soft)]">
                <div className="relative aspect-square w-full">
                  {channelCover ? (
                    <Image
                      src={channelCover}
                      alt={`${c.title} — обложка подкаста`}
                      fill
                      className="object-cover"
                      sizes="(max-width: 1024px) 90vw, 380px"
                      priority
                    />
                  ) : (
                    <div className="flex h-full min-h-0 flex-col items-center justify-center bg-gradient-to-br from-mars-accent-soft via-white to-slate-50 p-10">
                      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-mars-accent-soft text-mars-accent">
                        <Mic2 className="h-8 w-8" strokeWidth={1.75} aria-hidden />
                      </div>
                      <HeroEqualizer className="mt-8 max-w-[200px]" />
                    </div>
                  )}
                  <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#1a1020]/88 via-[#1a1020]/45 to-transparent px-4 pb-4 pt-12">
                    <p className="text-center text-[10px] font-semibold uppercase tracking-[0.22em] text-white/95 drop-shadow-sm">
                      {c.visualCardTagline}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="relative border-b border-white/10 bg-[#0b0c10] text-white">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.45] bg-[radial-gradient(ellipse_70%_45%_at_20%_0%,rgb(196_0_28/0.35),transparent),radial-gradient(ellipse_50%_40%_at_100%_100%,rgb(43_62_247/0.2),transparent)]"
          aria-hidden
        />
        <div className="relative mx-auto max-w-[1400px] px-4 py-12 sm:px-6 lg:px-10 lg:py-16">
          <div className="grid gap-10 lg:grid-cols-[1fr_minmax(280px,400px)] lg:items-center lg:gap-12">
            <div className="flex flex-col justify-center">
              <span className="inline-flex w-max rounded-full border border-white/15 bg-white/[0.07] px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-white/80">
                {featuredBadge}
              </span>
              <h2 className="font-display mt-5 text-2xl font-bold leading-snug tracking-tight sm:text-3xl lg:text-[2.125rem]">
                {featuredTitle}
              </h2>
              <p className="mt-4 max-w-xl text-base leading-relaxed text-white/65">{featuredLead}</p>
              <div className="mt-6 flex flex-wrap items-center gap-4">
                <span className="inline-flex items-center gap-2 rounded-lg bg-white/10 px-3 py-1.5 text-xs font-bold tabular-nums text-white/90">
                  {featuredDuration}
                </span>
                <a
                  href={featuredListenUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="focus-ring inline-flex items-center gap-2 text-sm font-bold text-white underline-offset-4 hover:text-mars-accent-soft hover:underline"
                >
                  {newest ? c.featuredLinkListenFresh : c.featuredLinkTelegram}
                  <ExternalLink className="h-4 w-4" aria-hidden />
                </a>
              </div>
            </div>
            <a
              href={featuredListenUrl}
              target="_blank"
              rel="noreferrer"
              className="focus-ring group relative mx-auto aspect-square w-full max-w-[min(100%,400px)] overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] shadow-[0_24px_60px_-20px_rgb(0_0_0/0.5)] transition hover:border-mars-accent/45 hover:shadow-[0_0_0_1px_rgb(196_0_28/0.35)] lg:mx-0 lg:ml-auto"
            >
              {featuredCoverUrl ? (
                <>
                  <Image
                    src={featuredCoverUrl}
                    alt={`Обложка: ${featuredTitle}`}
                    fill
                    className="object-cover transition duration-700 group-hover:scale-[1.04]"
                    sizes="(max-width: 1024px) 100vw, 400px"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0b0c10] via-[#0b0c10]/35 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 flex items-end gap-4 p-6 sm:p-8">
                    <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-mars-accent text-white shadow-[0_0_0_6px_rgb(255_255_255/0.1)] transition group-hover:scale-105">
                      <Radio className="h-6 w-6" aria-hidden />
                    </span>
                    <div className="min-w-0 pb-0.5">
                      <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/55">{c.featuredCardSubline}</p>
                      <p className="font-display mt-1 text-lg font-semibold leading-tight text-white sm:text-xl">{featuredCardLine}</p>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-[0.14] transition group-hover:opacity-[0.22]">
                    <HeroEqualizer tone="ghost" className="h-36 w-full max-w-xs" />
                  </div>
                  <div className="absolute inset-x-0 bottom-0 flex items-end gap-4 bg-gradient-to-t from-[#0b0c10] via-[#0b0c10]/85 to-transparent p-6 sm:p-8">
                    <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-mars-accent text-white shadow-[0_0_0_6px_rgb(255_255_255/0.08)] transition group-hover:scale-105">
                      <Radio className="h-6 w-6" aria-hidden />
                    </span>
                    <div className="min-w-0 pb-0.5">
                      <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/50">{c.featuredCardSubline}</p>
                      <p className="font-display mt-1 text-lg font-semibold text-white">{featuredCardLine}</p>
                    </div>
                  </div>
                </>
              )}
            </a>
          </div>
        </div>
      </section>

      <section className="relative mx-auto max-w-[1400px] px-4 py-14 sm:px-6 sm:py-16 lg:px-10 lg:py-20" aria-labelledby="episodes-heading">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            <p className="font-eyebrow text-[11px] font-black uppercase tracking-[0.24em] text-mars-accent">{c.episodesEyebrow}</p>
            <h2 id="episodes-heading" className="font-display mt-2 text-2xl font-bold tracking-tight text-mars-ink sm:text-3xl">
              {c.episodesSectionTitle}
            </h2>
            {!hasRss ? <p className="mt-3 text-sm leading-relaxed text-mars-muted">{c.listNoteStatic}</p> : null}
          </div>
        </div>

        <ul className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-5 md:gap-6 lg:grid-cols-3 lg:gap-6">
          {episodes.map((ep, index) => {
            const listenHref = hasRss ? podcastYandexMusicUrl : ep.listenUrl;
            return (
              <li key={ep.key} id={`podcast-ep-${index}`}>
                <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-[0_2px_20px_-8px_rgb(15_23_42/0.1)] transition duration-300 hover:-translate-y-0.5 hover:border-mars-accent/28 hover:shadow-[0_12px_36px_-18px_rgb(196_0_28/0.18)]">
                  <div className="relative aspect-square w-full overflow-hidden bg-slate-100">
                    {ep.imageUrl ? (
                      <Image
                        src={ep.imageUrl}
                        alt={`Обложка: ${ep.title}`}
                        fill
                        className="object-cover transition duration-500 group-hover:scale-[1.04]"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                    ) : (
                      <div className="flex h-full w-full flex-col items-center justify-center bg-gradient-to-br from-mars-accent via-[#b80020] to-[#5c0010] p-5 text-center">
                        <span className="font-display text-3xl font-bold tabular-nums text-white sm:text-4xl">{ep.episodeLabel}</span>
                        <span className="mt-1.5 text-[9px] font-bold uppercase tracking-[0.3em] text-white/75">выпуск</span>
                      </div>
                    )}
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#0f172a]/45 via-transparent to-transparent opacity-70 transition group-hover:opacity-100" aria-hidden />
                    <span className="absolute left-2.5 top-2.5 inline-flex items-center rounded-full bg-white/90 px-2 py-0.5 text-[10px] font-black tabular-nums uppercase tracking-wider text-mars-ink shadow-sm backdrop-blur-sm">
                      №{ep.episodeLabel}
                    </span>
                  </div>
                  <div className="flex flex-1 flex-col border-l-[3px] border-transparent p-4 transition group-hover:border-l-mars-accent sm:p-4">
                    <h3 className="font-display text-[0.9375rem] font-semibold leading-snug text-mars-ink transition group-hover:text-mars-accent sm:text-base">
                      {ep.title}
                    </h3>
                    <p className="mt-2 line-clamp-2 text-[13px] leading-relaxed text-mars-muted">{ep.description}</p>
                    <div className="mt-3 flex flex-wrap items-center gap-1.5 border-t border-slate-100 pt-3 text-[11px] text-slate-600">
                      <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-0.5 font-semibold tabular-nums text-slate-700">
                        <Clock className="h-3 w-3 text-slate-500" aria-hidden />
                        {ep.durationLabel}
                      </span>
                      {ep.dateLabel ? (
                        <span className="inline-flex min-w-0 max-w-[min(100%,11rem)] items-center gap-1 rounded-full bg-slate-50 px-2 py-0.5 font-medium text-slate-600">
                          <Calendar className="h-3 w-3 shrink-0 text-slate-400" aria-hidden />
                          <span className="truncate">{ep.dateLabel}</span>
                        </span>
                      ) : null}
                      <a
                        href={listenHref}
                        target="_blank"
                        rel="noreferrer"
                        className="focus-ring ml-auto inline-flex max-w-full items-center gap-1.5 rounded-full bg-mars-accent px-2.5 py-1.5 text-[11px] font-bold text-white shadow-[0_6px_16px_-6px_rgb(196_0_28/0.5)] transition hover:bg-mars-accent-hover"
                      >
                        <span className="truncate">{hasRss ? c.listenYandexLabel : "Слушать"}</span>
                        <ExternalLink className="h-3 w-3 shrink-0 opacity-90" aria-hidden />
                      </a>
                    </div>
                  </div>
                </article>
              </li>
            );
          })}
        </ul>
      </section>

      <section className="border-t border-slate-200/80 bg-gradient-to-r from-mars-accent-soft/50 via-white to-mars-blue-soft/30">
        <div className="mx-auto max-w-[1400px] px-4 py-12 sm:px-6 lg:px-10 lg:py-14">
          <div className="flex flex-col items-start justify-between gap-6 rounded-2xl border border-slate-200/60 bg-white/90 px-6 py-8 shadow-sm sm:flex-row sm:items-center sm:px-10 sm:py-10">
            <div>
              <p className="font-eyebrow text-[11px] font-black uppercase tracking-[0.22em] text-mars-accent">{c.digestEyebrow}</p>
              <p className="font-display mt-2 text-xl font-bold text-mars-ink sm:text-2xl">{c.digestTitle}</p>
              <p className="mt-2 max-w-lg text-sm text-mars-muted">{c.digestLead}</p>
            </div>
            <Link
              href="/podpiska"
              className="focus-ring shrink-0 rounded-full bg-mars-accent px-8 py-3.5 text-sm font-bold text-white shadow-[0_12px_28px_-10px_rgb(196_0_28/0.5)] transition hover:bg-mars-accent-hover"
            >
              {c.digestCta}
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
