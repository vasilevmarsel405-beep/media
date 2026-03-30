import Image from "next/image";
import Link from "next/link";
import { PostCard } from "@/components/cards/PostCard";
import { HeroGlassVideoLink } from "@/components/home/HeroGlassVideoLink";
import { HeroGradualBlur } from "@/components/home/HeroGradualBlur";
import { HomeEditorialStats } from "@/components/home/HomeEditorialStats";
import { HomeTrendingTicker } from "@/components/HomeTrendingTicker";
import { NewsletterBlock } from "@/components/NewsletterBlock";
import { SectionHeading } from "@/components/SectionHeading";
import { IconPlay } from "@/components/icons";
import { rubrics, specialProjects } from "@/lib/content";
import { homeCopy } from "@/lib/copy";
import { formatDateTime, formatTime } from "@/lib/format";
import {
  getAllPosts,
  pickFeaturedHero,
  pickPopularPosts,
  pickSecondaryHero,
  pickUrgentFeed,
} from "@/lib/posts-service";
import type { Post } from "@/lib/types";
import { postHref } from "@/lib/routes";
import { resolvePostImage } from "@/lib/youtube-thumbnail";

export const revalidate = 30;

function isExternalUrl(url: string): boolean {
  return /^https?:\/\//i.test(url);
}

export default async function HomePage() {
  const allPosts = await getAllPosts();
  const hero = pickFeaturedHero(allPosts);
  const sec = pickSecondaryHero(allPosts, hero);
  const heroHref = hero ? postHref(hero) : "/novosti";
  const urgentList = pickUrgentFeed(allPosts);
  const popular = pickPopularPosts(allPosts);
  const byKind = (k: Post["kind"]) => allPosts.filter((p) => p.kind === k);
  const articles = byKind("article");
  const analyticsList = byKind("analytics");
  const interviews = byKind("interview");
  const videos = byKind("video");
  const heroVideoHref = hero?.homeVideoUrl?.trim() ?? "";
  const heroVideoLabel = hero?.homeVideoLabel?.trim() || "Р’РёРґРµРѕ-РґР°Р№РґР¶РµСЃС‚";

  return (
    <div>
      <HomeTrendingTicker />
      <HomeEditorialStats materials={allPosts.length} rubrics={rubrics.length} />

      <section className="relative overflow-hidden mars-hero-mesh">
        <HeroGradualBlur />
        <div className="relative z-[2] mx-auto max-w-[1400px] px-4 py-8 sm:px-6 lg:px-10 lg:py-12">
          <div className="grid min-w-0 gap-10 lg:grid-cols-[1.2fr_1fr] lg:items-stretch">
            {hero ? (
              <article className="mars-hero-frame mars-reveal flex min-w-0 flex-col overflow-hidden bg-slate-950 shadow-2xl">
                <Link
                  href={heroHref}
                  className="group relative block aspect-[16/10] w-full shrink-0 sm:aspect-[2.05/1] mars-clip-hero-media"
                >
                  <Image
                    src={resolvePostImage(hero)}
                    alt=""
                    fill
                    priority
                    className="object-cover transition duration-700 ease-out group-hover:scale-[1.03]"
                    sizes="(max-width:1024px) 100vw, 68vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/55 to-black/10" />
                </Link>
                <div className="relative flex flex-1 flex-col justify-end bg-gradient-to-b from-slate-950 via-slate-950 to-black px-6 pb-9 pt-8 sm:px-10 sm:pb-11 sm:pt-10">
                  <div className="flex flex-wrap items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-white/70">
                    <span className="rounded-md bg-white/10 px-2.5 py-1 text-white ring-1 ring-white/15 backdrop-blur">
                      {hero.homeBadge ?? "РњР°С‚РµСЂРёР°Р» РґРЅСЏ"}
                    </span>
                    {hero.readMin ? (
                      <span className="rounded-xl bg-[#FF3100] px-2.5 py-1 text-white shadow-lg shadow-orange-950/30">
                        {hero.readMin} РјРёРЅ В· Р±РµР· РІРѕРґС‹
                      </span>
                    ) : null}
                    <span className="text-white/50">{formatTime(hero.publishedAt)}</span>
                  </div>
                  <Link href={heroHref}>
                    <h1 className="font-display mt-5 max-w-[22ch] text-3xl font-bold leading-[1.08] tracking-tight text-white drop-shadow-[0_4px_28px_rgba(0,0,0,0.55)] sm:text-4xl lg:text-5xl xl:text-[3.25rem]">
                      {hero.title}
                    </h1>
                  </Link>
                  <p className="mt-4 max-w-2xl text-base leading-relaxed text-white/88 sm:text-lg">{hero.lead}</p>
                  <div className="mt-8 flex flex-wrap items-center gap-3">
                    <Link
                      href={heroHref}
                      className="focus-ring inline-flex min-h-[44px] items-center gap-2 rounded-xl bg-gradient-to-r from-[#c4001c] via-[#ff3100] to-[#ff5c33] px-6 py-3 text-sm font-bold text-white shadow-[0_16px_48px_-12px_rgb(196_0_28/0.5)] transition hover:brightness-[1.06]"
                    >
                      {hero.homeCta ?? "Р§РёС‚Р°С‚СЊ СЃРµР№С‡Р°СЃ"}
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
              </article>
            ) : (
              <article className="mars-hero-frame mars-reveal flex min-w-0 flex-col justify-center overflow-hidden bg-slate-950 px-6 py-14 shadow-2xl sm:px-10 sm:py-16">
                <p className="font-eyebrow text-[11px] font-black uppercase tracking-[0.2em] text-white/50">РњР°С‚РµСЂРёР°Р»С‹</p>
                <h1 className="font-display mt-4 max-w-xl text-3xl font-bold leading-tight text-white sm:text-4xl">
                  РџРѕРєР° РЅРµС‚ РѕРїСѓР±Р»РёРєРѕРІР°РЅРЅС‹С… РјР°С‚РµСЂРёР°Р»РѕРІ РІ Р»РµРЅС‚Рµ
                </h1>
                <p className="mt-4 max-w-lg text-base leading-relaxed text-white/70">
                  Р•СЃР»Рё РІРєР»СЋС‡С‘РЅ СЂРµР¶РёРј С‚РѕР»СЊРєРѕ РѕР±Р»Р°РєР° (<code className="rounded bg-white/10 px-1.5 py-0.5 text-[13px]">POSTS_FEED_MODE=remote_only</code>
                  ), РґРѕР±Р°РІСЊС‚Рµ РјР°С‚РµСЂРёР°Р»С‹ С‡РµСЂРµР· Р°РґРјРёРЅРєСѓ РёР»Рё Make вЂ” С‚РѕРіРґР° РѕРЅРё РїРѕСЏРІСЏС‚СЃСЏ Р·РґРµСЃСЊ.
                </p>
                <div className="mt-8 flex flex-wrap gap-3">
                  <Link
                    href="/novosti"
                    className="inline-flex min-h-[44px] items-center gap-2 rounded-xl bg-gradient-to-r from-[#c4001c] via-[#ff3100] to-[#ff5c33] px-6 py-3 text-sm font-bold text-white shadow-[0_16px_48px_-12px_rgb(196_0_28/0.5)] transition hover:brightness-[1.06]"
                  >
                    РџРµСЂРµР№С‚Рё Рє РЅРѕРІРѕСЃС‚СЏРј
                    <span aria-hidden>→</span>
                  </Link>
                  <Link
                    href="/admin/posts"
                    className="inline-flex min-h-[44px] items-center rounded-xl border border-white/20 bg-white/5 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
                  >
                    РђРґРјРёРЅРєР°
                  </Link>
                </div>
              </article>
            )}

            <div className="flex min-w-0 flex-col gap-5 lg:justify-center">
              <div>
                <p className="font-eyebrow text-[11px] font-black uppercase tracking-[0.2em] text-mars-accent">
                  {homeCopy.heroAsideEyebrow}
                </p>
                <h2 className="font-display mt-2 text-2xl font-bold text-slate-900 sm:text-3xl">
                  {homeCopy.heroAsideTitle}
                </h2>
                <p className="mt-2 text-sm text-slate-600">{homeCopy.heroAsideSub}</p>
              </div>
              <div className="flex flex-col gap-4">
                {sec.map((p) => (
                  <PostCard key={p.slug} post={p} variant="horizontal" />
                ))}
              </div>
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
            {urgentList.map((p) => (
              <PostCard key={p.slug} post={p} variant="urgent" />
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white">
        <div className="mx-auto max-w-[1400px] px-4 py-12 sm:px-6 lg:px-10">
          <SectionHeading title={homeCopy.sections.now.title} subtitle={homeCopy.sections.now.subtitle} />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {allPosts.slice(0, 6).map((p) => (
              <PostCard key={p.slug} post={p} />
            ))}
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-[1400px] px-4 py-12 sm:px-6 lg:px-10">
        <SectionHeading
          title={homeCopy.sections.picks.title}
          subtitle={homeCopy.sections.picks.subtitle}
          href="/stati"
          actionLabel={homeCopy.sections.picks.action}
        />
        <div className="grid gap-6 lg:grid-cols-2">
          {articles.map((p) => (
            <PostCard key={p.slug} post={p} />
          ))}
        </div>
      </div>

      <div className="bg-white">
        <div className="mx-auto max-w-[1400px] px-4 py-12 sm:px-6 lg:px-10">
          <SectionHeading
            title={homeCopy.sections.analytics.title}
            subtitle={homeCopy.sections.analytics.subtitle}
            href="/analitika"
            actionLabel={homeCopy.sections.analytics.action}
          />
          <div className="grid gap-6 md:grid-cols-2">
            {analyticsList.map((p) => (
              <article
                key={p.slug}
                className="card-hover group rounded-3xl border border-mars-blue/15 bg-gradient-to-br from-mars-blue-soft/50 via-white to-white p-8 shadow-[0_20px_50px_-28px_rgb(43_62_247/0.12)]"
              >
                <Link href={`/analitika/${p.slug}`} className="block">
                  <p className="font-eyebrow text-[11px] font-black uppercase tracking-widest text-mars-blue">
                    Р“Р»СѓР±РѕРєРёР№ СЂР°Р·Р±РѕСЂ
                  </p>
                  <h3 className="font-display mt-3 text-2xl font-bold text-slate-900 group-hover:text-mars-blue">
                    {p.title}
                  </h3>
                  <p className="mt-3 text-slate-600 leading-relaxed">{p.lead}</p>
                  <span className="mt-6 inline-flex items-center gap-1 text-sm font-bold text-mars-blue">
                    {homeCopy.sections.analytics.cardCta}
                  </span>
                </Link>
              </article>
            ))}
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-[1400px] px-4 py-12 sm:px-6 lg:px-10">
        <SectionHeading
          title={homeCopy.sections.interviews.title}
          subtitle={homeCopy.sections.interviews.subtitle}
          href="/intervyu"
          actionLabel={homeCopy.sections.interviews.action}
        />
        <div className="grid gap-6 lg:grid-cols-2">
          {interviews.map((p) => (
            <PostCard key={p.slug} post={p} />
          ))}
        </div>
      </div>

      <div className="bg-slate-950 text-white">
        <div className="mx-auto max-w-[1400px] px-4 py-12 sm:px-6 lg:px-10">
          <SectionHeading
            title={homeCopy.sections.video.title}
            subtitle={homeCopy.sections.video.subtitle}
            href="/video"
            actionLabel={homeCopy.sections.video.action}
            variant="dark"
          />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {videos.map((p) => (
              <Link
                key={p.slug}
                href={`/video/${p.slug}`}
                className="group relative overflow-hidden rounded-2xl bg-slate-900 shadow-[0_24px_60px_-20px_rgb(0_0_0/0.65)] ring-1 ring-white/10 transition hover:ring-[#ff3100]/45"
              >
                <div className="relative aspect-video">
                  <Image
                    src={resolvePostImage(p)}
                    alt=""
                    fill
                    className="object-cover opacity-90 transition duration-500 group-hover:scale-[1.04] group-hover:opacity-100"
                    sizes="400px"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="flex h-16 w-16 items-center justify-center rounded-full bg-white text-slate-900 shadow-2xl transition group-hover:scale-110">
                      <IconPlay className="ml-1 h-7 w-7" />
                    </span>
                  </div>
                  {p.durationLabel ? (
                    <span className="absolute bottom-3 right-3 rounded-md bg-black/75 px-2 py-1 text-xs font-bold text-white">
                      {p.durationLabel}
                    </span>
                  ) : null}
                </div>
                <div className="p-5">
                  <h3 className="font-display text-lg font-bold leading-snug text-white">{p.title}</h3>
                  <p className="mt-2 line-clamp-2 text-sm text-white/75">{p.lead}</p>
                  <time className="mt-3 block text-xs text-white/50" dateTime={p.publishedAt}>
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
          {popular.map((p) => (
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
                    alt=""
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
          {specialProjects.map((s) => (
            <Link
              key={s.slug}
              href={`/specproekty/${s.slug}`}
              className="card-hover overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-md"
            >
              <div className="relative aspect-[21/9]">
                <Image src={s.cover} alt="" fill className="object-cover" sizes="(max-width:1024px) 100vw, 50vw" />
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

      <div className="bg-gradient-to-b from-white to-slate-100/90">
        <div className="mx-auto max-w-[1400px] px-4 py-14 sm:px-6 lg:px-10">
          <NewsletterBlock />
        </div>
      </div>
    </div>
  );
}

