import Image from "next/image";
import Link from "next/link";
import { PostCard } from "@/components/cards/PostCard";
import { HeroGlassVideoLink } from "@/components/home/HeroGlassVideoLink";
import { HomeAsideStoriesGlow } from "@/components/home/HomeAsideStoriesGlow";
import { HomeHeroPixelCard } from "@/components/home/HomeHeroPixelCard";
import { HomeSectionBorderGlow } from "@/components/home/HomeSectionBorderGlow";
import { HeroGradualBlur } from "@/components/home/HeroGradualBlur";
import { HomeTrendingTicker } from "@/components/HomeTrendingTicker";
import { NewsletterBlock } from "@/components/NewsletterBlock";
import { SectionHeading } from "@/components/SectionHeading";
import { IconPlay } from "@/components/icons";
import { ArrowRight, Clock, ExternalLink, Music2 } from "lucide-react";
import { specialProjects } from "@/lib/content";
import { homeCopy, podcastHubCopy } from "@/lib/copy";
import { formatDateTime, formatTime } from "@/lib/format";
import {
  getAllPosts,
  pickFeaturedHero,
  pickEditorialPicks,
  pickHomeProjects,
  pickMainNowPosts,
  pickPopularPosts,
  pickSecondaryHero,
  pickUrgentFeed,
} from "@/lib/posts-service";
import type { Post } from "@/lib/types";
import { postHref } from "@/lib/routes";
import { podcastYandexMusicUrl } from "@/lib/site";
import { postCoverImageAlt } from "@/lib/seo/image-alt";
import { resolvePostImage } from "@/lib/youtube-thumbnail";
import { getAnalyticsSnapshot } from "@/lib/redis-analytics";
import { getRubrics } from "@/lib/remote-rubrics";
import { fetchPodcastFeedFromRss } from "@/lib/podcast-rss";

export const revalidate = 5;

function isExternalUrl(url: string): boolean {
  return /^https?:\/\//i.test(url);
}

type HomePodcastCard = {
  key: string;
  title: string;
  lead: string;
  durationLabel: string;
  dateLabel: string;
  imageUrl: string | null;
};

function buildHomePodcastPreview(
  feed: Awaited<ReturnType<typeof fetchPodcastFeedFromRss>>
): HomePodcastCard[] {
  if (feed?.episodes.length) {
    return feed.episodes.slice(0, 3).map((ep) => ({
      key: ep.key,
      title: ep.title,
      lead: ep.description.length > 168 ? `${ep.description.slice(0, 165)}…` : ep.description,
      durationLabel: ep.durationLabel,
      dateLabel: ep.dateLabel,
      imageUrl: ep.imageUrl,
    }));
  }
  return podcastHubCopy.episodes.slice(0, 3).map((ep) => ({
    key: ep.id,
    title: ep.title,
    lead: ep.description,
    durationLabel: ep.duration,
    dateLabel: ep.dateLabel,
    imageUrl: null,
  }));
}

export default async function HomePage() {
  const rubrics = await getRubrics();
  const allPosts = await getAllPosts();
  const hero = pickFeaturedHero(allPosts);
  const sec = pickSecondaryHero(allPosts, hero);
  const heroHref = hero ? postHref(hero) : "/novosti";
  const urgentList = pickUrgentFeed(allPosts);
  const fallbackPopular = pickPopularPosts(allPosts);
  const mainNowList = pickMainNowPosts(allPosts);
  const analyticsList: Post[] = [];
  const videos: Post[] = [];
  for (const p of allPosts) {
    if (p.kind === "analytics") analyticsList.push(p);
    else if (p.kind === "video") videos.push(p);
  }

  const analyticsHome = analyticsList.slice(0, 4);
  const analyticsFeatured = analyticsHome[0];
  const analyticsCompact = analyticsHome.slice(1);

  const editorialPicks = pickEditorialPicks(allPosts);
  const homeProjects = pickHomeProjects(allPosts);
  const analyticsSnapshot = await getAnalyticsSnapshot();
  const podcastFeed = await fetchPodcastFeedFromRss();
  const podcastPreview = buildHomePodcastPreview(podcastFeed);
  const viewsBySlug = new Map<string, number>(
    (analyticsSnapshot?.topPosts ?? []).map((it) => [it.slug, Math.max(0, Number(it.views) || 0)])
  );
  const popularByViews = [...allPosts]
    .filter((p) => (viewsBySlug.get(p.slug) ?? 0) > 0)
    .sort(
      (a, b) =>
        (viewsBySlug.get(b.slug) ?? 0) - (viewsBySlug.get(a.slug) ?? 0) ||
        +new Date(b.publishedAt) - +new Date(a.publishedAt)
    )
    .slice(0, 6);
  const popular = popularByViews.length ? popularByViews : fallbackPopular;
  const heroVideoHref = hero?.homeVideoUrl?.trim() ?? "";
  const heroVideoLabel = hero?.homeVideoLabel?.trim() || "Видео-дайджест";

  return (
    <div>
      <HomeTrendingTicker posts={urgentList} />
      <h1 className="sr-only">КриптоМарс Медиа — новости, аналитика и видео о криптоэкономике</h1>

      <section className="relative overflow-hidden mars-hero-mesh">
        <HeroGradualBlur />
        <div className="relative z-[2] mx-auto max-w-[1400px] px-3 py-5 sm:px-6 sm:py-9 lg:px-10 lg:py-12">
          {hero ? (
            <HomeHeroPixelCard>
            <article className="mars-hero-frame mars-reveal group relative h-full min-h-full w-full overflow-hidden rounded-[22px] border border-white/10 bg-[#070b16] shadow-[0_36px_80px_-40px_rgb(0_0_0/0.9)] transition-[border-color,box-shadow] duration-300 ease-out group-hover/card:border-white/18 group-hover/card:shadow-[0_36px_80px_-40px_rgb(0_0_0/0.9),0_0_0_1px_rgb(255_49_0/0.12),0_28px_64px_-32px_rgb(196_0_28/0.18)] lg:min-h-0 lg:rounded-[30px]">
              <Link href={heroHref} aria-label={`Открыть материал: ${hero.title}`} className="absolute inset-0 z-0">
                <Image
                  src={resolvePostImage(hero)}
                  alt={postCoverImageAlt(hero.title, hero.imageAlt)}
                  fill
                  priority
                  className="object-cover transition duration-700 group-hover:scale-[1.02]"
                  sizes="(max-width:1400px) 100vw, 1400px"
                />
              </Link>
              <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(7,11,22,0.22)_0%,rgba(7,11,22,0.5)_38%,rgba(7,11,22,0.88)_100%)]" />
              <div
                className="pointer-events-none absolute inset-0"
                style={{
                  background:
                    "linear-gradient(105deg, rgba(4,7,16,0.94) 0%, rgba(4,7,16,0.72) 22%, rgba(4,7,16,0.4) 40%, rgba(4,7,16,0.14) 56%, rgba(4,7,16,0) 68%)",
                }}
              />
              <div
                className="pointer-events-none absolute inset-0"
                style={{
                  background:
                    "radial-gradient(125% 95% at 18% 92%, rgba(0,0,0,0.78) 0%, rgba(0,0,0,0.42) 42%, rgba(0,0,0,0.12) 68%, rgba(0,0,0,0) 82%)",
                }}
              />
              <div
                className="pointer-events-none absolute inset-0 z-[1] [background-image:radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.72)_1px,transparent_0)] [background-size:15px_15px] opacity-[0.14] max-sm:opacity-[0.16] sm:max-lg:opacity-[0.1] sm:[background-size:22px_22px] lg:opacity-[0.14]"
                aria-hidden
              />
              <div className="pointer-events-none absolute inset-0 z-10 flex min-h-0 flex-col justify-end px-5 pb-6 pt-5 max-sm:pb-[min(5.25rem,14svh)] max-sm:pt-6 sm:px-5 sm:pb-5 sm:pt-10 sm:max-lg:pb-5 sm:max-lg:pt-9 md:pt-12 lg:pointer-events-auto lg:px-12 lg:pb-14 lg:pt-14 xl:pb-16">
                <div className="max-w-4xl min-h-0 pointer-events-auto max-sm:w-full max-sm:pl-0.5 lg:max-w-5xl">
                  <div className="flex flex-wrap items-center gap-1.5 text-[9px] font-bold uppercase tracking-widest text-white/80 max-sm:gap-2 max-sm:text-[10px] max-sm:tracking-[0.12em] sm:max-lg:gap-1.5 sm:max-lg:text-[10px] lg:gap-2.5 lg:text-[11px] lg:tracking-[0.18em]">
                    <span className="rounded-md bg-white/12 px-2 py-0.5 text-white ring-1 ring-white/20 backdrop-blur max-sm:ml-0 max-sm:px-2.5 max-sm:py-1 sm:max-lg:px-1.5 lg:rounded-md lg:px-2.5 lg:py-1">
                      {hero.homeBadge ?? "Материал дня"}
                    </span>
                    {hero.readMin ? (
                      <span className="hidden rounded-lg bg-[#FF3100] px-2 py-0.5 text-white shadow-lg shadow-orange-950/30 sm:inline-flex sm:rounded-xl sm:px-2.5 sm:py-1">
                        {hero.readMin} мин · без воды
                      </span>
                    ) : null}
                    <span className="text-white/60 max-sm:text-white/55">{formatTime(hero.publishedAt)}</span>
                  </div>
                  <Link href={heroHref} className="block min-w-0">
                    <h2 className="font-display mt-2 text-[0.95rem] font-bold leading-[1.2] tracking-tight text-white [text-shadow:0_1px_2px_rgba(0,0,0,0.75),0_10px_28px_rgba(0,0,0,0.55)] max-sm:mt-2.5 max-sm:max-w-none max-sm:line-clamp-3 max-sm:text-[0.98rem] max-sm:leading-[1.28] max-sm:tracking-[-0.01em] sm:max-lg:mt-2 sm:max-lg:line-clamp-4 sm:max-lg:max-w-[min(100%,32ch)] sm:max-lg:text-[1.0625rem] sm:max-lg:leading-[1.18] md:max-lg:text-[1.125rem] lg:mt-5 lg:line-clamp-none lg:max-w-[min(100%,40ch)] lg:text-[2.5rem] lg:leading-[1.11] xl:mt-6 xl:max-w-[min(100%,44ch)] xl:text-[2.85rem] xl:leading-[1.09]">
                      {hero.title}
                    </h2>
                  </Link>
                  <p className="mt-2 line-clamp-2 max-w-[min(100%,36ch)] text-[11px] leading-relaxed text-white/90 [text-shadow:0_1px_2px_rgba(0,0,0,0.65),0_10px_32px_rgba(0,0,0,0.45)] max-sm:mt-2 max-sm:max-w-none max-sm:line-clamp-2 max-sm:text-[13px] max-sm:leading-[1.45] max-sm:text-white/[0.82] max-lg:leading-snug sm:max-lg:mt-2 sm:max-lg:line-clamp-3 sm:max-lg:max-w-xl sm:max-lg:text-xs sm:max-lg:leading-relaxed lg:mt-5 lg:line-clamp-none lg:max-w-3xl lg:text-base lg:leading-[1.62] xl:mt-6 xl:text-lg xl:leading-[1.58]">
                    {hero.lead}
                  </p>
                  <div className="mt-3 flex flex-nowrap items-center gap-2 overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] max-sm:mt-4 max-lg:[&::-webkit-scrollbar]:hidden sm:max-lg:mt-3 sm:max-lg:gap-2 lg:mt-9 lg:gap-3 xl:mt-10 [&::-webkit-scrollbar]:hidden">
                    <Link
                      href={heroHref}
                      className="focus-ring inline-flex min-h-[40px] shrink-0 items-center justify-center gap-1 whitespace-nowrap rounded-md bg-gradient-to-r from-[#c4001c] via-[#ff3100] to-[#ff5c33] px-3 py-2 text-[11px] font-bold text-white shadow-[0_10px_28px_-10px_rgb(196_0_28/0.45)] transition hover:brightness-[1.06] sm:min-h-[44px] sm:gap-1.5 sm:rounded-lg sm:px-3.5 sm:py-2 sm:text-xs sm:shadow-[0_12px_36px_-10px_rgb(196_0_28/0.45)] sm:max-lg:px-4 lg:gap-2 lg:rounded-xl lg:px-6 lg:py-3 lg:text-sm lg:shadow-[0_16px_48px_-12px_rgb(196_0_28/0.5)]"
                    >
                      <span className="leading-none">{hero.homeCta ?? "Читать сейчас"}</span>
                      <ArrowRight className="size-[1em] shrink-0 opacity-95 sm:size-[1.1em]" strokeWidth={2.75} aria-hidden />
                    </Link>
                    {heroVideoHref ? (
                      <HeroGlassVideoLink
                        href={heroVideoHref}
                        className="min-h-[40px] gap-1 rounded-md px-3 py-2 text-[11px] sm:min-h-[44px] sm:gap-1.5 sm:rounded-lg sm:px-3 sm:py-2 sm:text-xs sm:max-lg:px-4 lg:rounded-xl lg:px-6 lg:py-3 lg:text-sm"
                        {...(isExternalUrl(heroVideoHref) ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                      >
                        <IconPlay className="h-3.5 w-3.5 shrink-0 opacity-90 lg:h-4 lg:w-4" aria-hidden />
                        {heroVideoLabel}
                      </HeroGlassVideoLink>
                    ) : null}
                  </div>
                </div>
              </div>
            </article>
            </HomeHeroPixelCard>
          ) : (
            <article className="mars-hero-frame mars-reveal flex min-w-0 flex-col justify-center overflow-hidden bg-slate-950 px-6 py-14 shadow-2xl sm:px-10 sm:py-16">
              <p className="font-eyebrow text-[11px] font-black uppercase tracking-[0.2em] text-white/50">Материалы</p>
              <h2 className="font-display mt-4 max-w-xl text-3xl font-bold leading-tight text-white sm:text-4xl">
                Пока нет опубликованных материалов в ленте
              </h2>
              <p className="mt-4 max-w-lg text-base leading-relaxed text-white/70">
                Если включён режим только облака (<code className="rounded bg-white/10 px-1.5 py-0.5 text-[13px]">POSTS_FEED_MODE=remote_only</code>
                ), добавьте материалы через админку или Make — тогда они появятся здесь.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href="/novosti"
                  className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#c4001c] via-[#ff3100] to-[#ff5c33] px-6 py-3 text-sm font-bold text-white shadow-[0_16px_48px_-12px_rgb(196_0_28/0.5)] transition hover:brightness-[1.06]"
                >
                  <span className="leading-none">Перейти к новостям</span>
                  <ArrowRight className="size-[1.1em] shrink-0 opacity-95" strokeWidth={2.75} aria-hidden />
                </Link>
                <Link
                  href="/admin/posts"
                  className="inline-flex min-h-[44px] items-center rounded-xl border border-white/20 bg-white/5 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
                >
                  Админка
                </Link>
              </div>
            </article>
          )}

          <div className="mt-6">
            <HomeAsideStoriesGlow>
              <div className="mb-3 flex items-end justify-between gap-3">
                <div>
                  <p className="font-eyebrow text-[11px] font-black uppercase tracking-[0.2em] text-mars-accent">
                    {homeCopy.heroAsideEyebrow}
                  </p>
                  <h2 className="font-display mt-1.5 text-2xl font-bold leading-tight text-slate-900 sm:text-[2rem]">
                    {homeCopy.heroAsideTitle}
                  </h2>
                </div>
              </div>
              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                {sec.map((p) => (
                  <Link
                    key={p.slug}
                    href={postHref(p)}
                    className="group overflow-hidden rounded-2xl border border-slate-200/85 bg-white shadow-sm transition hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-lg"
                  >
                    <div className="relative aspect-[16/9] overflow-hidden">
                      <Image
                        src={resolvePostImage(p)}
                        alt={postCoverImageAlt(p.title, p.imageAlt)}
                        fill
                        className="object-cover transition duration-500 group-hover:scale-[1.04]"
                        sizes="(max-width:1280px) 50vw, 25vw"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />
                      <span className="absolute left-2.5 top-2.5 rounded-md bg-black/60 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-white backdrop-blur">
                        {formatDateTime(p.publishedAt)}
                      </span>
                    </div>
                    <div className="p-3.5">
                      <h3 className="line-clamp-2 font-display text-base font-semibold leading-snug text-slate-900 group-hover:text-mars-accent">
                        {p.title}
                      </h3>
                      <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-slate-600">{p.lead}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </HomeAsideStoriesGlow>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-[1400px] px-4 py-12 sm:px-6 lg:px-10">
        <HomeSectionBorderGlow variant="warm" innerClassName="bg-gradient-to-b from-mars-accent-soft/35 via-white/95 to-mars-paper/25 p-5 sm:p-8">
          <SectionHeading
            className="mb-6"
            title={homeCopy.sections.urgent.title}
            subtitle={homeCopy.sections.urgent.subtitle}
            href="/novosti"
            actionLabel={homeCopy.sections.urgent.action}
          />
          <div className="grid gap-4 lg:grid-cols-2">
            {urgentList.slice(0, 4).map((p) => (
              <PostCard key={p.slug} post={p} variant="urgent" />
            ))}
          </div>
        </HomeSectionBorderGlow>
      </div>

      <div className="mx-auto max-w-[1400px] space-y-8 px-4 pb-12 pt-2 sm:space-y-10 sm:px-6 sm:pb-14 lg:px-10">
        <section aria-label="Главное сейчас">
          <HomeSectionBorderGlow className="ring-1 ring-slate-900/[0.03]" innerClassName="overflow-hidden rounded-2xl bg-gradient-to-b from-slate-50/90 via-white to-white p-0">
            <div className="relative">
              <div
                className="pointer-events-none absolute inset-x-0 top-0 z-[2] h-[3px] bg-gradient-to-r from-mars-accent via-[#ff5c33] to-orange-200/45"
                aria-hidden
              />
              <div className="p-5 pt-7 sm:p-8 sm:pt-9">
                <p className="font-eyebrow text-[10px] font-black uppercase tracking-[0.22em] text-slate-500">Лента дня</p>
                <SectionHeading
                  className="mb-6 sm:mb-8"
                  title={homeCopy.sections.now.title}
                  titlePrefix={<span className="mars-live-dot" />}
                />
                <div className="grid gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
                  {mainNowList.map((p) => (
                    <PostCard key={p.slug} post={p} />
                  ))}
                </div>
              </div>
            </div>
          </HomeSectionBorderGlow>
        </section>

        <section aria-label="Выбор редакции">
          <HomeSectionBorderGlow
            variant="blue"
            className="ring-1 ring-slate-900/[0.03]"
            innerClassName="overflow-hidden rounded-2xl bg-gradient-to-b from-mars-blue-soft/40 via-white to-white p-0"
          >
            <div className="relative">
              <div
                className="pointer-events-none absolute inset-x-0 top-0 z-[2] h-[3px] bg-gradient-to-r from-mars-blue via-sky-500/75 to-sky-200/35"
                aria-hidden
              />
              <div className="p-5 pt-7 sm:p-8 sm:pt-9">
                <p className="font-eyebrow text-[10px] font-black uppercase tracking-[0.22em] text-slate-500">Самое важное</p>
                <SectionHeading
                  className="mb-6 sm:mb-8"
                  title={homeCopy.sections.picks.title}
                  titlePrefix={<span className="mars-analytics-dot" />}
                  href="/stati"
                  actionLabel={homeCopy.sections.picks.action}
                />
                <div className="grid gap-5 sm:gap-6 lg:grid-cols-2">
                  {editorialPicks.length ? (
                    editorialPicks.map((p) => <PostCard key={p.slug} post={p} />)
                  ) : (
                    <p className="col-span-full text-sm font-medium text-slate-500">
                      Пока редакция не отметила материалы для этого блока.
                    </p>
                  )}
                </div>
              </div>
            </div>
          </HomeSectionBorderGlow>
        </section>
      </div>

      <section className="bg-white" aria-label={homeCopy.sections.analytics.title}>
        <div className="mx-auto max-w-[1400px] px-4 py-14 sm:px-6 sm:py-16 lg:px-10">
          <HomeSectionBorderGlow variant="blue" innerClassName="p-6 sm:p-8 lg:p-10">
            <p className="font-eyebrow text-[10px] font-black uppercase tracking-[0.22em] text-slate-500">
              Цифры и сценарии
            </p>
            <SectionHeading
              className="mb-8 sm:mb-10"
              title={homeCopy.sections.analytics.title}
              href="/analitika"
              actionLabel={homeCopy.sections.analytics.action}
            />

            {!analyticsFeatured ? (
              <p className="text-sm font-medium text-slate-500">Пока нет материалов в рубрике аналитики.</p>
            ) : (
              <>
              <article className="card-hover group relative overflow-hidden rounded-[1.75rem] border border-mars-blue/22 bg-white shadow-[0_28px_70px_-40px_rgb(43_62_247/0.35)] ring-1 ring-slate-900/[0.03] transition duration-300 hover:border-mars-blue/40">
                <Link
                  href={`/analitika/${analyticsFeatured.slug}`}
                  className="grid min-h-0 lg:min-h-[min(22rem,42vh)] lg:grid-cols-[1.08fr_1fr]"
                >
                  <div className="relative min-h-[14rem] overflow-hidden lg:min-h-full">
                    <Image
                      src={resolvePostImage(analyticsFeatured)}
                      alt={postCoverImageAlt(analyticsFeatured.title, analyticsFeatured.imageAlt)}
                      fill
                      className="object-cover transition duration-700 ease-out group-hover:scale-[1.045]"
                      sizes="(max-width:1024px) 100vw, 52vw"
                    />
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950/55 via-slate-950/5 to-transparent lg:bg-gradient-to-r lg:from-transparent lg:via-transparent lg:to-slate-900/20" />
                    <span className="absolute left-4 top-4 rounded-full border border-white/25 bg-white/92 px-3 py-1.5 text-[10px] font-black uppercase tracking-widest text-mars-blue shadow-sm backdrop-blur-sm">
                      Главный разбор
                    </span>
                  </div>
                  <div className="flex flex-col justify-center border-t border-slate-100/90 bg-gradient-to-br from-white to-mars-blue-soft/15 p-6 sm:p-8 lg:border-l lg:border-t-0 lg:p-10">
                    <p className="font-eyebrow text-[11px] font-black uppercase tracking-widest text-mars-blue">
                      Аналитика
                    </p>
                    <h3 className="font-display mt-3 text-2xl font-bold leading-[1.15] tracking-tight text-slate-900 sm:text-[1.7rem] lg:text-[1.85rem] group-hover:text-mars-blue">
                      {analyticsFeatured.title}
                    </h3>
                    <p className="mt-4 line-clamp-3 text-sm leading-relaxed text-slate-600 sm:text-base">
                      {analyticsFeatured.lead}
                    </p>
                    <span className="mt-7 inline-flex items-center gap-1 text-sm font-bold text-mars-blue">
                      {homeCopy.sections.analytics.cardCta}
                    </span>
                  </div>
                </Link>
              </article>

              {analyticsCompact.length ? (
                <div className="mt-7 grid gap-5 sm:grid-cols-2 lg:mt-8 lg:grid-cols-3">
                  {analyticsCompact.map((p) => (
                    <article
                      key={p.slug}
                      className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200/90 bg-white/95 shadow-[0_16px_44px_-32px_rgb(15_23_42/0.35)] ring-1 ring-slate-900/[0.02] transition duration-300 hover:-translate-y-0.5 hover:border-mars-blue/30 hover:shadow-[0_22px_50px_-28px_rgb(43_62_247/0.2)]"
                    >
                      <Link href={`/analitika/${p.slug}`} className="flex h-full flex-col">
                        <div className="relative aspect-[16/10] overflow-hidden">
                          <Image
                            src={resolvePostImage(p)}
                            alt={postCoverImageAlt(p.title, p.imageAlt)}
                            fill
                            className="object-cover transition duration-500 group-hover:scale-[1.05]"
                            sizes="(max-width:640px) 100vw, 400px"
                          />
                          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-900/45 via-transparent to-transparent opacity-90" />
                          <span className="absolute bottom-3 left-3 rounded-md bg-black/55 px-2 py-1 text-[9px] font-bold uppercase tracking-wider text-white backdrop-blur-sm">
                            Разбор
                          </span>
                        </div>
                        <div className="flex min-h-0 flex-1 flex-col p-5 sm:p-6">
                          <h3 className="font-display line-clamp-2 text-lg font-bold leading-snug text-slate-900 group-hover:text-mars-blue">
                            {p.title}
                          </h3>
                          <p className="mt-2 line-clamp-2 flex-1 text-sm leading-relaxed text-slate-600">
                            {p.lead}
                          </p>
                          <span className="mt-4 text-sm font-bold text-mars-blue">
                            {homeCopy.sections.analytics.cardCta}
                          </span>
                        </div>
                      </Link>
                    </article>
                  ))}
                </div>
              ) : null}
            </>
            )}
          </HomeSectionBorderGlow>
        </div>
      </section>

      <div className="relative overflow-hidden bg-[#050508] text-white">
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-[min(50vh,420px)] bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgb(196_0_28/0.35),transparent_55%),radial-gradient(ellipse_50%_40%_at_80%_20%,rgb(43_62_247/0.22),transparent)]"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.2]"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgb(255 255 255 / 0.24) 1px, transparent 0)`,
            backgroundSize: "22px 22px",
          }}
          aria-hidden
        />
        <div className="relative mx-auto max-w-[1400px] px-4 py-12 sm:px-6 lg:px-10">
          <HomeSectionBorderGlow variant="dark" innerClassName="p-4 sm:p-6 lg:p-8">
            <div className="flex w-full min-w-0 flex-col gap-5 max-sm:gap-4">
              <SectionHeading
                className="mb-0 sm:mb-8"
                title={homeCopy.sections.video.title}
                subtitle={homeCopy.sections.video.subtitle}
                href="/video"
                actionLabel={homeCopy.sections.video.action}
                variant="dark"
              />
              <div className="relative min-w-0 w-full max-sm:-mx-1">
                <div
                  className="flex min-w-0 gap-2 overflow-x-auto overscroll-x-contain pb-1.5 [-ms-overflow-style:none] [scrollbar-width:none] [touch-action:pan-x] snap-x snap-mandatory max-sm:px-1 sm:flex-wrap sm:overflow-visible sm:pb-0 sm:snap-none [&::-webkit-scrollbar]:hidden"
                  role="list"
                  aria-label="Рубрики видео"
                >
                  {["Криптовалюта", "Экономика", "Политика", "Подкасты", "Эфиры"].map((chip) => (
                    <span
                      key={chip}
                      role="listitem"
                      className="snap-start shrink-0 rounded-full border border-white/10 bg-white/[0.06] px-3 py-1.5 text-[11px] font-semibold leading-tight text-white/90 backdrop-blur-sm sm:px-4 sm:py-2.5 sm:text-xs"
                    >
                      {chip}
                    </span>
                  ))}
                </div>
                <div
                  className="pointer-events-none absolute inset-y-0 right-0 z-[1] w-8 bg-gradient-to-l from-[#111116] to-transparent sm:hidden"
                  aria-hidden
                />
              </div>
              <div className="grid w-full min-w-0 grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
                {videos.slice(0, 3).map((p) => (
                  <Link
                    key={p.slug}
                    href={`/video/${p.slug}`}
                    className="group w-full max-w-full overflow-hidden rounded-2xl bg-slate-900/80 ring-1 ring-white/[0.08] transition hover:ring-[#ff3100]/40"
                  >
                  <div className="relative aspect-video w-full overflow-hidden">
                    <Image
                      src={resolvePostImage(p)}
                      alt={postCoverImageAlt(p.title, p.imageAlt)}
                      fill
                      className="object-cover opacity-90 transition duration-500 group-hover:scale-[1.04] group-hover:opacity-100"
                      sizes="(max-width:640px) 100vw, 400px"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/15 to-transparent" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="flex h-14 w-14 items-center justify-center rounded-full bg-white text-slate-900 shadow-xl transition group-hover:scale-110">
                        <IconPlay className="ml-0.5 h-6 w-6" />
                      </span>
                    </div>
                    {p.durationLabel ? (
                      <span className="absolute bottom-3 right-3 rounded-md bg-black/75 px-2 py-1 text-xs font-bold text-white">
                        {p.durationLabel}
                      </span>
                    ) : null}
                  </div>
                  <div className="p-4 sm:p-5">
                    <h3 className="font-display text-base font-semibold leading-snug text-white group-hover:text-orange-200 sm:text-lg">
                      {p.title}
                    </h3>
                    <p className="mt-2 line-clamp-2 text-sm text-white/60">{p.lead}</p>
                    <time className="mt-3 block text-xs tabular-nums text-white/45" dateTime={p.publishedAt}>
                      {formatDateTime(p.publishedAt)}
                    </time>
                  </div>
                </Link>
              ))}
              </div>
            </div>
          </HomeSectionBorderGlow>
        </div>
      </div>

      <section className="relative overflow-hidden border-t border-slate-200/90 bg-gradient-to-b from-[#f8f7f5] via-white to-[#f5f6f8] text-mars-ink">
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_75%_50%_at_12%_-8%,rgb(196_0_28/0.08),transparent_55%),radial-gradient(ellipse_45%_42%_at_96%_102%,rgb(43_62_247/0.07),transparent)]"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.35]"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgb(15 23 42 / 0.06) 1px, transparent 0)`,
            backgroundSize: "24px 24px",
          }}
          aria-hidden
        />
        <div className="relative mx-auto max-w-[1400px] px-4 py-12 sm:px-6 lg:px-10 lg:py-16">
          <HomeSectionBorderGlow innerClassName="bg-white/80 p-6 shadow-sm backdrop-blur-sm sm:p-8 lg:p-10">
            <SectionHeading
              titlePrefix={
                <span
                  className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-mars-accent-soft text-mars-accent ring-1 ring-mars-accent/15 shadow-sm"
                  aria-hidden
                >
                  <Music2 className="h-[1.15rem] w-[1.15rem]" strokeWidth={2} />
                </span>
              }
              title={homeCopy.sections.podcast.title}
              subtitle={homeCopy.sections.podcast.subtitle}
              subtitleClassName="mt-2 text-base leading-relaxed text-slate-600 sm:max-w-4xl"
              href="/podkasty"
              actionLabel={homeCopy.sections.podcast.action}
            />
            <ul className="mt-10 grid list-none gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
              {podcastPreview.map((card, i) => (
              <li key={card.key}>
                <a
                  href={podcastYandexMusicUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex h-full flex-col overflow-hidden rounded-[1.25rem] border border-slate-200/90 bg-white/90 shadow-[0_4px_28px_-12px_rgb(15_23_42/0.12)] ring-1 ring-slate-100/80 backdrop-blur-[2px] transition duration-300 hover:-translate-y-1 hover:border-mars-accent/25 hover:shadow-[0_20px_44px_-24px_rgb(196_0_28/0.2)] hover:ring-mars-accent/10"
                >
                  <div className="relative aspect-square w-full overflow-hidden bg-slate-100">
                    {card.imageUrl ? (
                      <Image
                        src={card.imageUrl}
                        alt={`Обложка: ${card.title}`}
                        fill
                        className="object-cover transition duration-700 group-hover:scale-[1.05]"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                    ) : (
                      <div className="flex h-full w-full flex-col items-center justify-center bg-gradient-to-br from-mars-accent via-[#b80020] to-[#3d060d]">
                        <span className="font-display text-3xl font-bold tabular-nums text-white sm:text-4xl">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <span className="mt-1 text-[10px] font-bold uppercase tracking-[0.3em] text-white/75">эпизод</span>
                      </div>
                    )}
                    <div
                      className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-900/40 via-transparent to-transparent opacity-0 transition group-hover:opacity-100"
                      aria-hidden
                    />
                    <span className="absolute left-3 top-3 rounded-full bg-white/95 px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-mars-ink shadow-sm backdrop-blur-sm">
                      №{String(i + 1).padStart(2, "0")}
                    </span>
                  </div>
                  <div className="flex flex-1 flex-col border-l-4 border-transparent border-t border-slate-100/90 p-5 transition group-hover:border-l-mars-accent">
                    <span className="inline-flex w-max rounded-full bg-[#fc3f1e]/10 px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.16em] text-[#c41e0b]">
                      Яндекс Музыка
                    </span>
                    <h3 className="font-display mt-3 line-clamp-3 text-lg font-semibold leading-snug text-slate-900 transition group-hover:text-mars-accent">
                      {card.title}
                    </h3>
                    <p className="mt-2 line-clamp-3 flex-1 text-sm leading-relaxed text-slate-600">{card.lead}</p>
                    <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-slate-100 pt-4">
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold tabular-nums text-slate-700">
                        <Clock className="h-3.5 w-3.5 text-slate-500" aria-hidden />
                        {card.durationLabel}
                      </span>
                      <span className="text-xs font-medium text-slate-500">{card.dateLabel}</span>
                      <span className="ml-auto inline-flex items-center gap-1 text-xs font-bold text-mars-accent">
                        Слушать
                        <ExternalLink className="h-3.5 w-3.5 opacity-80" aria-hidden />
                      </span>
                    </div>
                  </div>
                </a>
              </li>
              ))}
            </ul>
          </HomeSectionBorderGlow>
        </div>
      </section>

      <div className="mx-auto max-w-[1400px] px-4 py-12 sm:px-6 lg:px-10">
        <HomeSectionBorderGlow innerClassName="p-5 sm:p-6 lg:p-8">
          <SectionHeading title={homeCopy.sections.popular.title} subtitle={homeCopy.sections.popular.subtitle} />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {popular.slice(0, 4).map((p) => (
              <PostCard key={`pop-${p.slug}`} post={p} />
            ))}
          </div>
        </HomeSectionBorderGlow>
      </div>

      <div className="bg-white">
        <div className="mx-auto max-w-[1400px] px-4 py-12 sm:px-6 lg:px-10">
          <HomeSectionBorderGlow innerClassName="p-5 sm:p-6 lg:p-8">
            <SectionHeading
              title={homeCopy.sections.topics.title}
              subtitle={homeCopy.sections.topics.subtitle}
              href="/rubriki"
              actionLabel={homeCopy.sections.topics.action}
            />
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {rubrics.map((r) => (
                <Link
                  key={r.slug}
                  href={`/rubriki/${r.slug}`}
                  className="group relative overflow-hidden rounded-2xl ring-1 ring-slate-200/80 shadow-sm transition hover:shadow-lg"
                >
                  <div className="relative aspect-[4/3]">
                    <Image
                      src={r.cover}
                      alt={`Иллюстрация рубрики: ${r.name}`}
                      fill
                      className="object-cover transition duration-500 group-hover:scale-[1.06]"
                      sizes="300px"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent" />
                    <span className="absolute bottom-4 left-4 font-display text-xl font-bold text-white">{r.name}</span>
                  </div>
                </Link>
              ))}
            </div>
          </HomeSectionBorderGlow>
        </div>
      </div>

      <div className="mx-auto max-w-[1400px] px-4 pb-16 sm:px-6 lg:px-10">
        <HomeSectionBorderGlow innerClassName="p-5 sm:p-6 lg:pb-10 lg:pt-6">
          <SectionHeading
            title={homeCopy.sections.projects.title}
            subtitle={homeCopy.sections.projects.subtitle}
            href="/specproekty"
            actionLabel={homeCopy.sections.projects.action}
          />
          <div className="grid gap-6 lg:grid-cols-2">
          {homeProjects.length
            ? homeProjects.map((p) => (
                <Link
                  key={p.slug}
                  href={postHref(p)}
                  className="card-hover overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-md"
                >
                  <div className="relative aspect-[21/9]">
                    <Image
                      src={resolvePostImage(p)}
                      alt={postCoverImageAlt(p.title, p.imageAlt)}
                      fill
                      className="object-cover"
                      sizes="(max-width:1024px) 100vw, 50vw"
                    />
                  </div>
                  <div className="p-8">
                    <p className="font-eyebrow text-[11px] font-black uppercase tracking-widest text-mars-accent">спецпроект</p>
                    <h3 className="font-display mt-2 text-2xl font-bold text-slate-900">{p.title}</h3>
                    <p className="mt-3 text-slate-600">{p.lead}</p>
                  </div>
                </Link>
              ))
            : specialProjects.map((s) => (
                <Link
                  key={s.slug}
                  href={`/specproekty/${s.slug}`}
                  className="card-hover overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-md"
                >
                  <div className="relative aspect-[21/9]">
                    <Image
                      src={s.cover}
                      alt={`Обложка спецпроекта: ${s.title}`}
                      fill
                      className="object-cover"
                      sizes="(max-width:1024px) 100vw, 50vw"
                    />
                  </div>
                  <div className="p-8">
                    <p className="font-eyebrow text-[11px] font-black uppercase tracking-widest text-mars-accent">{s.dek}</p>
                    <h3 className="font-display mt-2 text-2xl font-bold text-slate-900">{s.title}</h3>
                    <p className="mt-3 text-slate-600">{s.lead}</p>
                  </div>
                </Link>
              ))}
          </div>
        </HomeSectionBorderGlow>
      </div>

      <div className="mx-auto max-w-[1400px] px-4 pb-10 sm:px-6 lg:px-10">
        <HomeSectionBorderGlow innerClassName="bg-slate-50/90 p-6 sm:p-8">
          <h2 className="font-display text-2xl font-bold text-slate-900">Прозрачность редакции и документы</h2>
          <p className="mt-3 max-w-4xl text-sm leading-relaxed text-slate-600 sm:text-base">
            Сайт публикует редакционные материалы и не является витриной услуг. Правила публикаций, обработка данных,
            файлы cookie и пользовательские условия доступны в открытом доступе. Оплата и доставка для этого сайта не
            применяются. Регион работы редакции: Россия.
          </p>
          <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm text-slate-700">
            <li>Маркировка типов материалов</li>
            <li>Публичные исправления ошибок</li>
            <li>Открытые контакты редакции</li>
            <li>Редакционная политика</li>
          </ul>
          <div className="mt-5 flex flex-wrap gap-2.5 text-sm">
            <Link href="/pravovaya-informatsiya" className="rounded-lg bg-white px-3 py-2 font-semibold text-slate-800 ring-1 ring-slate-200 transition hover:bg-slate-100">
              Правовая информация
            </Link>
            <Link href="/politika-konfidencialnosti" className="rounded-lg bg-white px-3 py-2 font-semibold text-slate-800 ring-1 ring-slate-200 transition hover:bg-slate-100">
              Конфиденциальность
            </Link>
            <Link href="/politika-faylov-cookie" className="rounded-lg bg-white px-3 py-2 font-semibold text-slate-800 ring-1 ring-slate-200 transition hover:bg-slate-100">
              Файлы cookie
            </Link>
            <Link href="/polzovatelskoe-soglashenie" className="rounded-lg bg-white px-3 py-2 font-semibold text-slate-800 ring-1 ring-slate-200 transition hover:bg-slate-100">
              Пользовательское соглашение
            </Link>
            <Link href="/kontakty" className="rounded-lg bg-white px-3 py-2 font-semibold text-slate-800 ring-1 ring-slate-200 transition hover:bg-slate-100">
              Контакты и реквизиты
            </Link>
          </div>
        </HomeSectionBorderGlow>
      </div>

      <div className="bg-gradient-to-b from-white to-slate-100/90">
        <div className="mx-auto max-w-[1400px] px-4 py-14 sm:px-6 lg:px-10">
          <NewsletterBlock />
        </div>
      </div>
    </div>
  );
}

