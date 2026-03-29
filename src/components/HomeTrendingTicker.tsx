import Link from "next/link";
import { homeCopy } from "@/lib/copy";
import { homeTrendingTopics } from "@/lib/content";

export function HomeTrendingTicker() {
  const loop = [...homeTrendingTopics, ...homeTrendingTopics];

  return (
    <div className="relative bg-slate-950 text-white">
      <div className="relative mx-auto flex max-w-[1400px] flex-col gap-2 px-4 py-2.5 sm:flex-row sm:items-center sm:gap-3 sm:px-6 sm:py-2 lg:px-10">
        <div className="flex min-h-[2.75rem] w-full min-w-0 items-center gap-2 sm:min-h-0 sm:gap-3">
          <span className="shrink-0 self-center rounded-lg bg-[#c4001c] px-2 py-1 text-[10px] font-black uppercase tracking-widest text-white sm:rounded-xl">
            Сейчас
          </span>
          <div className="mars-ticker-viewport min-h-0 min-w-0 flex-1 overflow-hidden mask-linear-fade">
            <div className="mars-marquee inline-flex w-max max-w-none flex-nowrap items-center gap-8 pr-8 sm:gap-10 sm:pr-10">
              {loop.map((label, i) => (
                <span
                  key={`${label}-${i}`}
                  className="inline-flex shrink-0 items-center gap-8 text-[11px] font-bold uppercase tracking-[0.18em] text-white/75 sm:gap-10 sm:tracking-[0.2em]"
                >
                  <span className="whitespace-nowrap">{label}</span>
                  <span className="text-[#ff3100]" aria-hidden>
                    ·
                  </span>
                </span>
              ))}
            </div>
          </div>
        </div>
        <Link
          href="/poisk"
          className="focus-ring inline-flex min-h-10 shrink-0 items-center justify-center self-stretch rounded-xl bg-white/10 px-3 py-2 text-center text-[11px] font-bold uppercase tracking-wider text-white ring-1 ring-white/15 hover:bg-white/15 sm:min-h-0 sm:self-center sm:py-1.5"
        >
          {homeCopy.tickerSearch}
        </Link>
      </div>
    </div>
  );
}
