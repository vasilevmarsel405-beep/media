import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/cn";
import { getPostsByKind } from "@/lib/posts-service";
import { resolvePostImage } from "@/lib/youtube-thumbnail";

/** РќРµ Р±Р»РѕРєРёСЂСѓРµРј build СЃРµС‚РµРІС‹РјРё Р·Р°РїСЂРѕСЃР°РјРё Рє Redis/РІРЅРµС€РЅРёРј API. */
export const revalidate = 30;

export default async function AnalitikaPage() {
  const list = (await getPostsByKind("analytics")).sort(
    (a, b) => +new Date(b.publishedAt) - +new Date(a.publishedAt)
  );

  return (
    <div className="relative overflow-hidden bg-[#f8f9ff]">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.45]"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgb(43 62 247 / 0.14) 1px, transparent 0)`,
          backgroundSize: "28px 28px",
        }}
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -right-24 top-0 h-[420px] w-[420px] rounded-full bg-mars-blue/15 blur-3xl"
        aria-hidden
      />
      <div className="relative mx-auto max-w-[1400px] px-4 pb-16 pt-12 sm:px-6 lg:px-10">
        <div className="max-w-3xl">
          <p className="text-[11px] font-black uppercase tracking-[0.28em] text-mars-blue">РСЃСЃР»РµРґРѕРІР°РЅРёРµ Рё Р°СЂРіСѓРјРµРЅС‚</p>
          <h1 className="font-display mt-3 text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">РђРЅР°Р»РёС‚РёРєР°</h1>
          <p className="mt-5 text-lg leading-relaxed text-slate-700 sm:text-xl">
            Р Р°Р·Р±РѕСЂС‹, СЃСЂР°РІРЅРµРЅРёСЏ, РїСЂРѕРіРЅРѕР·С‹ Рё РёСЃСЃР»РµРґРѕРІР°С‚РµР»СЊСЃРєРёРµ РјР°С‚РµСЂРёР°Р»С‹. Р—РґРµСЃСЊ РїСЂРёРѕСЂРёС‚РµС‚ вЂ” СЃС‚СЂСѓРєС‚СѓСЂР° Р°СЂРіСѓРјРµРЅС‚Р° Рё РїСЂРѕРІРµСЂСЏРµРјС‹Рµ
            РѕРїРѕСЂРЅС‹Рµ С‚РѕС‡РєРё.
          </p>
        </div>

        <div className="mt-14 grid gap-10 lg:gap-12">
          {list.map((p, i) => (
            <Link
              key={p.slug}
              href={`/analitika/${p.slug}`}
              className={cn(
                "group grid overflow-hidden rounded-2xl border border-mars-blue/15 bg-white shadow-[0_24px_60px_-34px_rgb(43_62_247/0.35)] transition hover:border-mars-blue/25 hover:shadow-[0_28px_70px_-32px_rgb(43_62_247/0.4)] md:grid-cols-[1.05fr_1fr]",
                i % 2 === 1 && "md:[direction:rtl] md:[&>*]:[direction:ltr]"
              )}
            >
              <div className="relative min-h-[220px] md:min-h-[260px]">
                <Image
                  src={resolvePostImage(p)}
                  alt=""
                  fill
                  className="object-cover transition duration-700 group-hover:scale-[1.03]"
                  sizes="(max-width:768px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-mars-blue/30 via-transparent to-transparent md:bg-gradient-to-r" />
              </div>
              <div className="relative flex flex-col justify-center border-t border-mars-blue/10 p-7 sm:p-9 md:border-l md:border-t-0 md:border-mars-blue/15 md:pl-10">
                <span className="inline-flex w-fit rounded-md bg-mars-blue-soft px-2.5 py-1 text-[10px] font-black uppercase tracking-widest text-mars-blue">
                  РђРЅР°Р»РёС‚РёС‡РµСЃРєРёР№ РјР°С‚РµСЂРёР°Р»
                </span>
                <h2 className="font-display mt-4 text-2xl font-bold leading-snug text-slate-900 sm:text-3xl group-hover:text-mars-blue">
                  {p.title}
                </h2>
                <p className="mt-4 flex-1 text-slate-600 leading-relaxed">{p.lead}</p>
                <div className="mt-6 flex flex-wrap items-center gap-4 border-t border-slate-100 pt-5">
                  {p.readMin ? (
                    <span className="font-mono text-xs font-semibold uppercase tracking-wider text-slate-500">
                      {p.readMin} РјРёРЅ В· С‡С‚РµРЅРёРµ
                    </span>
                  ) : null}
                  <span className="text-sm font-bold text-mars-blue">
                    РћС‚РєСЂС‹С‚СЊ СЂР°Р·Р±РѕСЂ <span aria-hidden>→</span>
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

