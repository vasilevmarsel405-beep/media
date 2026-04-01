import { homeStatsCopy, topBarCopy, topBarStatsCopy } from "@/lib/copy";

function formatToday() {
  return new Intl.DateTimeFormat("ru-RU", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date());
}

function TopBarStats({ materials, rubrics }: { materials: number; rubrics: number }) {
  return (
    <div
      className="flex shrink-0 items-center gap-1.5 text-[10px] leading-none text-mars-muted sm:gap-2 sm:text-[11px]"
      aria-label={`${materials} ${homeStatsCopy.materialsHint}, ${rubrics} ${homeStatsCopy.rubricsHint}`}
    >
      <span className="tabular-nums" title={homeStatsCopy.materialsHint}>
        <span className="font-semibold text-mars-ink">{materials}</span>
        <span className="ml-0.5 font-normal">{topBarStatsCopy.materialsLabel}</span>
      </span>
      <span className="h-2.5 w-px shrink-0 bg-slate-200/90" aria-hidden />
      <span className="tabular-nums" title={homeStatsCopy.rubricsHint}>
        <span className="font-semibold text-mars-ink">{rubrics}</span>
        <span className="ml-0.5 font-normal">{topBarStatsCopy.rubricsLabel}</span>
      </span>
    </div>
  );
}

type Props = {
  materials: number;
  rubrics: number;
};

export function TopBar({ materials, rubrics }: Props) {
  return (
    <div className="relative overflow-hidden border-b border-mars-line/70 bg-gradient-to-b from-slate-50/95 via-white to-white">
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-mars-accent/0 via-mars-accent/55 to-mars-blue/0 opacity-90"
        aria-hidden
      />
      <div className="relative mx-auto max-w-[1400px] px-4 py-2 sm:px-6 sm:py-2.5 lg:px-10">
        <div className="grid grid-cols-[1fr_auto] gap-x-3 gap-y-2 md:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)_minmax(0,1fr)] md:items-center md:gap-x-4 lg:gap-x-6">
          <time
            dateTime={new Date().toISOString()}
            className="col-start-1 row-start-1 flex w-fit min-w-0 max-w-full justify-self-start items-center gap-2 rounded-full border border-slate-200/95 bg-white/95 px-3 py-1.5 text-[10px] font-semibold capitalize leading-snug tracking-wide text-mars-ink shadow-[0_1px_2px_rgba(15,23,42,0.05)] backdrop-blur-sm sm:text-[11px]"
            suppressHydrationWarning
          >
            <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-mars-accent shadow-[0_0_0_3px_rgba(196,0,40,0.12)]" />
            {formatToday()}
          </time>
          <div className="col-start-2 row-start-1 justify-self-end md:col-start-3 md:row-start-1 md:justify-self-end">
            <TopBarStats materials={materials} rubrics={rubrics} />
          </div>
          <p className="col-span-2 row-start-2 max-w-[min(100%,40rem)] justify-self-center self-center text-center text-[10px] font-medium leading-relaxed text-mars-muted sm:text-[11px] md:col-span-1 md:col-start-2 md:row-start-1 md:px-3 md:leading-snug lg:px-6">
            <span className="font-display text-[1.02em] italic text-mars-ink/88">{topBarCopy.tagline}</span>
          </p>
        </div>
      </div>
    </div>
  );
}
