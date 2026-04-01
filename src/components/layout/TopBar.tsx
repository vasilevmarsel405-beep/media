import { topBarCopy } from "@/lib/copy";

function formatToday() {
  return new Intl.DateTimeFormat("ru-RU", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date());
}

export function TopBar() {
  return (
    <div className="relative overflow-hidden border-b border-mars-line/70 bg-gradient-to-b from-slate-50/95 via-white to-white">
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-mars-accent/0 via-mars-accent/55 to-mars-blue/0 opacity-90"
        aria-hidden
      />
      <div className="relative mx-auto max-w-[1400px] px-4 py-3 sm:px-6 lg:px-10">
        <div className="flex flex-col items-center gap-2.5 md:flex-row md:items-center md:gap-5 md:py-0.5">
          <div className="hidden min-w-0 flex-1 md:block" aria-hidden />
          <time
            dateTime={new Date().toISOString()}
            className="flex w-fit max-w-full shrink-0 items-center gap-2 rounded-full border border-slate-200/95 bg-white/95 px-3.5 py-1.5 text-[11px] font-semibold capitalize leading-snug tracking-wide text-mars-ink shadow-[0_1px_2px_rgba(15,23,42,0.05)] backdrop-blur-sm sm:text-xs"
            suppressHydrationWarning
          >
            <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-mars-accent shadow-[0_0_0_3px_rgba(196,0,40,0.12)]" />
            {formatToday()}
          </time>
          <div className="flex min-w-0 flex-1 justify-center md:justify-end">
            <p className="max-w-xl text-center text-[11px] font-medium leading-relaxed text-mars-muted sm:text-xs md:max-w-[min(100%,26rem)] md:text-right md:leading-snug">
              <span className="font-display text-[1.02em] italic text-mars-ink/88">{topBarCopy.tagline}</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
