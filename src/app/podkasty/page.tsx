import type { Metadata } from "next";
import Link from "next/link";
import { ExternalLink, Headphones, Mic2, Radio } from "lucide-react";
import { hubPageMeta, podcastHubCopy } from "@/lib/copy";
import { cn } from "@/lib/cn";
import type { PodcastEpisodeDisplay } from "@/lib/podcast-rss";
import { fetchPodcastEpisodesFromRss } from "@/lib/podcast-rss";
import { socialTelegram, socialYoutube } from "@/lib/site";

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
  return podcastHubCopy.episodes.map((ep) => ({
    key: ep.id,
    episodeLabel: ep.episode,
    title: ep.title,
    description: ep.description,
    durationLabel: ep.duration,
    dateLabel: ep.dateLabel,
    listenUrl: socialTelegram,
  }));
}

export default async function PodcastHubPage() {
  const c = podcastHubCopy;
  const fromRss = await fetchPodcastEpisodesFromRss();
  const episodes = fromRss?.length ? fromRss : staticEpisodesForHub();
  const newest = fromRss?.length ? fromRss[0]! : null;

  const featuredTitle = newest?.title ?? c.featuredTitle;
  const featuredLead =
    newest?.description.slice(0, 280) ?? c.featuredLead;
  const featuredDuration = newest?.durationLabel ?? c.featuredDuration;
  const featuredListenUrl = newest?.listenUrl ?? socialTelegram;
  const featuredBadge = newest ? "Свежий выпуск" : c.featuredBadge;
  const featuredCardLine = newest ? "Открыть страницу выпуска" : "Перейти к эфиру";

  return (
    <main className="relative min-h-screen overflow-x-clip bg-gradient-to-b from-[#f7f6f4] via-white to-[#f4f5f7] text-mars-ink">
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-[min(70vh,640px)] bg-[radial-gradient(ellipse_90%_50%_at_50%_-8%,rgb(196_0_28/0.09),transparent_58%),radial-gradient(ellipse_45%_35%_at_92%_12%,rgb(43_62_247/0.06),transparent)]"
        aria-hidden
      />

      <section className="relative border-b border-slate-200/70">
        <div className="mx-auto max-w-[1400px] px-4 pb-14 pt-12 sm:px-6 sm:pb-16 sm:pt-14 lg:px-10 lg:pb-20 lg:pt-16">
          <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,400px)] lg:gap-16">
            <div>
              <p className="font-eyebrow text-[11px] font-black uppercase tracking-[0.28em] text-mars-accent">
                {c.eyebrow}
              </p>
              <h1 className="font-display mt-4 text-[2.125rem] font-bold leading-[1.08] tracking-tight sm:text-5xl lg:text-[3.25rem]">
                {c.title}
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-relaxed text-mars-muted sm:text-lg">{c.subtitle}</p>

              <div className="mt-8">
                <p className="text-[10px] font-black uppercase tracking-[0.22em] text-slate-500">{c.platformsEyebrow}</p>
                <p className="mt-2 max-w-xl text-sm leading-relaxed text-slate-600">{c.platformsNote}</p>
                <div className="mt-5 flex flex-wrap gap-3">
                  <a
                    href={socialTelegram}
                    target="_blank"
                    rel="noreferrer"
                    className="focus-ring inline-flex items-center gap-2 rounded-full bg-mars-accent px-5 py-2.5 text-sm font-bold text-white shadow-[0_12px_32px_-12px_rgb(196_0_28/0.55)] transition hover:bg-mars-accent-hover"
                  >
                    <Radio className="h-4 w-4 opacity-95" aria-hidden />
                    Telegram
                    <ExternalLink className="h-3.5 w-3.5 opacity-80" aria-hidden />
                  </a>
                  <a
                    href={socialYoutube}
                    target="_blank"
                    rel="noreferrer"
                    className="focus-ring inline-flex items-center gap-2 rounded-full border border-slate-200/90 bg-white px-5 py-2.5 text-sm font-semibold text-slate-800 shadow-sm transition hover:border-slate-300 hover:bg-slate-50"
                  >
                    YouTube
                    <ExternalLink className="h-3.5 w-3.5 text-slate-500" aria-hidden />
                  </a>
                  <Link
                    href="/podpiska"
                    className="focus-ring inline-flex items-center gap-2 rounded-full border border-transparent px-2 py-2.5 text-sm font-semibold text-mars-accent underline-offset-4 hover:underline"
                  >
                    Дайджест на почту
                  </Link>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="absolute -inset-4 rounded-[2rem] bg-gradient-to-br from-mars-accent/15 via-white to-mars-blue-soft/40 blur-2xl" aria-hidden />
              <div className="relative overflow-hidden rounded-[1.75rem] border border-slate-200/90 bg-white/90 p-8 shadow-[var(--shadow-soft)] backdrop-blur-sm sm:p-10">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-mars-accent-soft text-mars-accent">
                    <Mic2 className="h-7 w-7" strokeWidth={1.75} aria-hidden />
                  </div>
                  <Headphones className="h-9 w-9 text-slate-300" strokeWidth={1.25} aria-hidden />
                </div>
                <HeroEqualizer className="mt-10" />
                <p className="mt-6 text-center text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                  Редакционный звук · стерео
                </p>
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
          <div className="grid gap-10 lg:grid-cols-[1.15fr_minmax(0,1fr)] lg:items-center lg:gap-14">
            <div>
              <span className="inline-flex rounded-full border border-white/15 bg-white/[0.07] px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-white/80">
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
                  {newest ? "Слушать выпуск" : "Открыть в Telegram"}
                  <ExternalLink className="h-4 w-4" aria-hidden />
                </a>
              </div>
            </div>
            <a
              href={featuredListenUrl}
              target="_blank"
              rel="noreferrer"
              className="focus-ring group relative flex min-h-[200px] flex-col justify-end overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-white/[0.09] to-white/[0.02] p-6 transition hover:border-mars-accent/40 hover:shadow-[0_0_0_1px_rgb(196_0_28/0.35)] sm:min-h-[240px] sm:p-8"
            >
              <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-[0.12] transition group-hover:opacity-[0.18]">
                <HeroEqualizer tone="ghost" className="h-32 w-full max-w-xs opacity-90" />
              </div>
              <div className="relative flex items-center gap-4">
                <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-mars-accent text-white shadow-[0_0_0_6px_rgb(255_255_255/0.08)] transition group-hover:scale-105">
                  <Radio className="h-7 w-7" aria-hidden />
                </span>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-white/50">Слушать выпуск</p>
                  <p className="font-display mt-1 text-lg font-semibold text-white">{featuredCardLine}</p>
                </div>
              </div>
            </a>
          </div>
        </div>
      </section>

      <section className="relative mx-auto max-w-[1400px] px-4 py-14 sm:px-6 sm:py-16 lg:px-10 lg:py-20" aria-labelledby="episodes-heading">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="font-eyebrow text-[11px] font-black uppercase tracking-[0.24em] text-mars-accent">{c.episodesEyebrow}</p>
            <h2 id="episodes-heading" className="font-display mt-2 text-2xl font-bold tracking-tight text-mars-ink sm:text-3xl">
              Архив сезона
            </h2>
          </div>
          <p className="max-w-md text-sm text-mars-muted">
            {fromRss?.length
              ? "Список подтягивается из RSS вашего хостинга (например Mave); кеш обновляется автоматически."
              : "Карточки обновляются по мере выхода новых записей. Задайте PODCAST_RSS_URL — подтянем выпуски из RSS."}
          </p>
        </div>

        <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:gap-6 xl:grid-cols-2">
          {episodes.map((ep, index) => (
            <li key={ep.key} id={`podcast-ep-${index}`}>
              <article className="group flex h-full flex-col rounded-2xl border border-slate-200/90 bg-white/80 p-5 shadow-[0_2px_24px_-12px_rgb(15_23_42/0.08)] backdrop-blur-[2px] transition hover:-translate-y-0.5 hover:border-mars-accent/25 hover:shadow-[0_16px_40px_-20px_rgb(196_0_28/0.2)] sm:p-6">
                <div className="flex items-start gap-4">
                  <span
                    className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-mars-accent to-[#9e0016] font-display text-sm font-bold tabular-nums text-white shadow-md shadow-red-950/20"
                    aria-hidden
                  >
                    {ep.episodeLabel}
                  </span>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-display text-lg font-semibold leading-snug text-mars-ink transition group-hover:text-mars-accent sm:text-xl">
                      {ep.title}
                    </h3>
                    <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-mars-muted">{ep.description}</p>
                  </div>
                </div>
                <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-slate-100 pt-5 text-xs font-semibold text-slate-500">
                  <span className="tabular-nums">{ep.durationLabel}</span>
                  <span className="text-slate-300" aria-hidden>
                    ·
                  </span>
                  <span>{ep.dateLabel || "—"}</span>
                  <a
                    href={ep.listenUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="focus-ring ml-auto inline-flex items-center gap-1.5 rounded-lg px-2 py-1 text-mars-accent hover:bg-mars-accent-soft/60"
                  >
                    Слушать
                    <ExternalLink className="h-3.5 w-3.5" aria-hidden />
                  </a>
                </div>
              </article>
            </li>
          ))}
        </ul>
      </section>

      <section className="border-t border-slate-200/80 bg-gradient-to-r from-mars-accent-soft/50 via-white to-mars-blue-soft/30">
        <div className="mx-auto max-w-[1400px] px-4 py-12 sm:px-6 lg:px-10 lg:py-14">
          <div className="flex flex-col items-start justify-between gap-6 rounded-2xl border border-slate-200/60 bg-white/90 px-6 py-8 shadow-sm sm:flex-row sm:items-center sm:px-10 sm:py-10">
            <div>
              <p className="font-eyebrow text-[11px] font-black uppercase tracking-[0.22em] text-mars-accent">Не пропустить</p>
              <p className="font-display mt-2 text-xl font-bold text-mars-ink sm:text-2xl">Подпишитесь на дайджест редакции</p>
              <p className="mt-2 max-w-lg text-sm text-mars-muted">Короткая выжимка главного — раз в неделю, без спама.</p>
            </div>
            <Link
              href="/podpiska"
              className="focus-ring shrink-0 rounded-full bg-mars-accent px-8 py-3.5 text-sm font-bold text-white shadow-[0_12px_28px_-10px_rgb(196_0_28/0.5)] transition hover:bg-mars-accent-hover"
            >
              Получить бесплатно
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
