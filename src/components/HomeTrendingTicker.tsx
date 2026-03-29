import { homeTrendingTopics } from "@/lib/content";

/**
 * Одна строка: бейдж + бегущая строка. Поиск — только иконка в шапке (/poisk), без дубля здесь.
 */
export function HomeTrendingTicker() {
  const loop = [...homeTrendingTopics, ...homeTrendingTopics];

  return (
    <div className="relative bg-slate-950 text-white">
      <div className="relative mx-auto flex max-w-[1400px] items-center gap-2 px-4 py-2.5 sm:gap-3 sm:px-6 sm:py-2 lg:px-10">
        <span className="shrink-0 rounded-lg bg-[#c4001c] px-2 py-1 text-[10px] font-black uppercase tracking-widest text-white sm:rounded-xl">
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
    </div>
  );
}
