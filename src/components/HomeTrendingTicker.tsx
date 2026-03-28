import Link from "next/link";
import { homeCopy } from "@/lib/copy";
import { homeTrendingTopics } from "@/lib/content";

export function HomeTrendingTicker() {
  const loop = [...homeTrendingTopics, ...homeTrendingTopics];

  return (
    <div className="relative border-y border-slate-900/10 bg-slate-950 text-white">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-red-600/25 via-transparent to-sky-600/20" />
      <div className="relative mx-auto flex max-w-[1400px] items-center gap-3 px-4 py-2 sm:px-6 lg:px-10">
        <span className="hidden shrink-0 rounded-md bg-red-600 px-2 py-1 text-[10px] font-black uppercase tracking-widest text-white sm:inline">
          Сейчас
        </span>
        <div className="min-w-0 flex-1 overflow-hidden mask-linear-fade">
          <div className="mars-marquee flex w-max gap-10 pr-10">
            {loop.map((label, i) => (
              <span
                key={`${label}-${i}`}
                className="flex items-center gap-10 text-[11px] font-bold uppercase tracking-[0.2em] text-white/75"
              >
                <span className="whitespace-nowrap">{label}</span>
                <span className="text-red-500" aria-hidden>
                  ·
                </span>
              </span>
            ))}
          </div>
        </div>
        <Link
          href="/poisk"
          className="focus-ring hidden shrink-0 rounded-full bg-white/10 px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-white ring-1 ring-white/15 hover:bg-white/15 sm:inline"
        >
          {homeCopy.tickerSearch}
        </Link>
      </div>
    </div>
  );
}
