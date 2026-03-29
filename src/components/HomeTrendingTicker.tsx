import Link from "next/link";
import { homeCopy } from "@/lib/copy";
import { homeTrendingTopics } from "@/lib/content";

export function HomeTrendingTicker() {
  const loop = [...homeTrendingTopics, ...homeTrendingTopics];

  return (
    <div className="relative bg-slate-950 text-white">
      <div className="relative mx-auto flex max-w-[1400px] items-center gap-3 px-4 py-2 sm:px-6 lg:px-10">
        <span className="hidden shrink-0 rounded-xl bg-[#c4001c] px-2 py-1 text-[10px] font-black uppercase tracking-widest text-white sm:inline">
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
                <span className="text-[#ff3100]" aria-hidden>
                  ·
                </span>
              </span>
            ))}
          </div>
        </div>
        <Link
          href="/poisk"
          className="focus-ring hidden shrink-0 rounded-xl bg-white/10 px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-white ring-1 ring-white/15 hover:bg-white/15 sm:inline"
        >
          {homeCopy.tickerSearch}
        </Link>
      </div>
    </div>
  );
}
