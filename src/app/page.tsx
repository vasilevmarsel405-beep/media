import Image from "next/image";
import Link from "next/link";
import { PostCard } from "@/components/cards/PostCard";
import { HeroGlassVideoLink } from "@/components/home/HeroGlassVideoLink";
import { HeroGradualBlur } from "@/components/home/HeroGradualBlur";
import { HomeTrendingTicker } from "@/components/HomeTrendingTicker";
import { NewsletterBlock } from "@/components/NewsletterBlock";
import { SectionHeading } from "@/components/SectionHeading";
import { IconPlay } from "@/components/icons";
import { specialProjects } from "@/lib/content";
import { homeCopy } from "@/lib/copy";
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
import { postCoverImageAlt } from "@/lib/seo/image-alt";
import { resolvePostImage } from "@/lib/youtube-thumbnail";
import { getAnalyticsSnapshot } from "@/lib/redis-analytics";
import { getRubrics } from "@/lib/remote-rubrics";

export const revalidate = 5;

function isExternalUrl(url: string): boolean {
  return /^https?:\/\//i.test(url);
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
        <div className="relative z-[2] mx-auto max-w-[1400px] px-4 py-8 sm:px-6 lg:px-10 lg:py-12">
          {hero ? (
            <article className="mars-hero-frame mars-reveal group relative overflow-hidden rounded-[30px] border border-white/10 bg-[#070b16] shadow-[0_36px_80px_-40px_rgb(0_0_0/0.9)]">
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
                    "radial-gradient(120% 80% at 12% 88%, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0.28) 38%, rgba(0,0,0,0) 62%)",
                }}
              />
              <div className="pointer-events-none absolute inset-0 opacity-[0.14]" style={{ backgroundImage: "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.7) 1px, transparent 0)", backgroundSize: "26px 26px" }} />
              <div className="relative z-10 flex min-h-[420px] flex-col justify-end px-6 pb-8 pt-12 sm:min-h-[480px] sm:px-10 sm:pb-10 lg:min-h-[540px] lg:px-12">
                <div className="max-w-4xl">
                  <div className="flex flex-wrap items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-white/80">
                    <span className="rounded-md bg-white/12 px-2.5 py-1 text-white ring-1 ring-white/20 backdrop-blur">
                      {hero.homeBadge ?? "Материал дня"}
                    </span>
                    {hero.readMin ? (
                      <span className="rounded-xl bg-[#FF3100] px-2.5 py-1 text-white shadow-lg shadow-orange-950/30">
                        {hero.readMin} мин · без воды
                      </span>
                    ) : null}
                    <span className="text-white/65">{formatTime(hero.publishedAt)}</span>
                  </div>
                  <Link href={heroHref}>
                    <h2 className="font-display mt-4 max-w-[22ch] text-[2.2rem] font-bold leading-[1.04] tracking-tight text-white [text-shadow:0_1px_2px_rgba(0,0,0,0.75),0_14px_42px_rgba(0,0,0,0.6)] sm:text-[2.75rem] lg:text-[3.15rem]">
                      {hero.title}
                    </h2>
                  </Link>
                  <p className="mt-4 max-w-3xl text-sm leading-relaxed text-white/93 sm:text-base lg:text-lg [text-shadow:0_1px_2px_rgba(0,0,0,0.65),0_10px_32px_rgba(0,0,0,0.45)]">
                    {hero.lead}
                  </p>
                  <div className="mt-7 flex flex-wrap items-center gap-3">
                    <Link
                      href={heroHref}
                      className="focus-ring inline-flex min-h-[44px] items-center gap-2 rounded-xl bg-gradient-to-r from-[#c4001c] via-[#ff3100] to-[#ff5c33] px-6 py-3 text-sm font-bold text-white shadow-[0_16px_48px_-12px_rgb(196_0_28/0.5)] transition hover:brightness-[1.06]"
                    >
                      {hero.homeCta ?? "Читать сейчас"}
                      <span aria-hidden>→</span>
                    </Link>
                    {heroVideoHref ? (
                      <div className="min-w-0 max-w-full shrink-0">
                        <HeroGlassVideoLink
                          href={heroVideoHref}
                          {...(isExternalUrl(heroVideoHref) ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                        >
                          <IconPlay className="h-4 w-4 shrink-0 opacity-90" aria-hidden />
                          {heroVideoLabel}
                        </HeroGlassVideoLink>
                      </div>
                    ) : null}
                  </div>
                </div>
              </div>
            </article>
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
                  className="inline-flex min-h-[44px] items-center gap-2 rounded-xl bg-gradient-to-r from-[#c4001c] via-[#ff3100] to-[#ff5c33] px-6 py-3 text-sm font-bold text-white shadow-[0_16px_48px_-12px_rgb(196_0_28/0.5)] transition hover:brightness-[1.06]"
                >
                  Перейти к новостям
                  <span aria-hidden>→</span>
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
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-[1400px] px-4 py-12 sm:px-6 lg:px-10">
        <div className="rounded-2xl border border-mars-line/70 bg-gradient-to-b from-mars-accent-soft/40 via-white/90 to-mars-paper/30 p-5 shadow-sm sm:p-8">
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
        </div>
      </div>

      <div className="mx-auto max-w-[1400px] space-y-8 px-4 pb-12 pt-2 sm:space-y-10 sm:px-6 sm:pb-14 lg:px-10">
        <section
          className="relative overflow-hidden rounded-2xl border border-mars-line/70 bg-gradient-to-b from-slate-50/90 via-white to-white shadow-sm ring-1 ring-slate-900/[0.03]"
          aria-label="Главное сейчас"
        >
          <div
            className="pointer-events-none absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-mars-accent via-[#ff5c33] to-orange-200/45"
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
        </section>

        <section
          className="relative overflow-hidden rounded-2xl border border-mars-line/70 bg-gradient-to-b from-mars-blue-soft/40 via-white to-white shadow-sm ring-1 ring-slate-900/[0.03]"
          aria-label="Выбор редакции"
        >
          <div
            className="pointer-events-none absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-mars-blue via-sky-500/75 to-sky-200/35"
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
        </section>
      </div>

      <section className="bg-white" aria-label={homeCopy.sections.analytics.title}>
        <div className="mx-auto max-w-[1400px] px-4 py-14 sm:px-6 sm:py-16 lg:px-10">
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
          <SectionHeading
            title={homeCopy.sections.video.title}
            subtitle={homeCopy.sections.video.subtitle}
            href="/video"
            actionLabel={homeCopy.sections.video.action}
            variant="dark"
          />
          <div className="mb-6 mt-2 flex gap-2 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {["Сводки дня", "Разборы на доске", "Позиция", "Спецэфиры"].map((chip) => (
              <span
                key={chip}
                className="shrink-0 rounded-full border border-white/10 bg-white/[0.06] px-4 py-2.5 text-xs font-semibold text-white/85 backdrop-blur-sm"
              >
                {chip}
              </span>
            ))}
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {videos.slice(0, 3).map((p) => (
              <Link
                key={p.slug}
                href={`/video/${p.slug}`}
                className="group overflow-hidden rounded-2xl bg-slate-900/80 ring-1 ring-white/[0.08] transition hover:ring-[#ff3100]/40"
              >
                <div className="relative aspect-video">
                  <Image
                    src={resolvePostImage(p)}
                    alt={postCoverImageAlt(p.title, p.imageAlt)}
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
                  {p.durationLabel ? (
                    <span className="absolute bottom-3 right-3 rounded-md bg-black/75 px-2 py-1 text-xs font-bold text-white">
                      {p.durationLabel}
                    </span>
                  ) : null}
                </div>
                <div className="p-5">
                  <h3 className="font-display text-lg font-semibold leading-snug text-white group-hover:text-orange-200">{p.title}</h3>
                  <p className="mt-2 line-clamp-2 text-sm text-white/60">{p.lead}</p>
                  <time className="mt-3 block text-xs tabular-nums text-white/45" dateTime={p.publishedAt}>
                    {formatDateTime(p.publishedAt)}
                  </time>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-[1400px] px-4 py-12 sm:px-6 lg:px-10">
        <SectionHeading title={homeCopy.sections.popular.title} subtitle={homeCopy.sections.popular.subtitle} />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {popular.slice(0, 4).map((p) => (
            <PostCard key={`pop-${p.slug}`} post={p} />
          ))}
        </div>
      </div>

      <div className="bg-white">
        <div className="mx-auto max-w-[1400px] px-4 py-12 sm:px-6 lg:px-10">
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
        </div>
      </div>

      <div className="mx-auto max-w-[1400px] px-4 pb-16 sm:px-6 lg:px-10">
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
      </div>

      <div className="mx-auto max-w-[1400px] px-4 pb-10 sm:px-6 lg:px-10">
        <section className="rounded-2xl border border-slate-200/80 bg-slate-50/80 p-6 shadow-sm sm:p-8">
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
        </section>
      </div>

      <div className="bg-gradient-to-b from-white to-slate-100/90">
        <div className="mx-auto max-w-[1400px] px-4 py-14 sm:px-6 lg:px-10">
          <NewsletterBlock />
        </div>
      </div>
    </div>
  );
}

