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
      className="flex shrink-0 items-center gap-1.5 text-[9px] leading-none text-slate-500 sm:gap-2 sm:text-[10px]"
      aria-label={`${materials} ${homeStatsCopy.materialsHint}, ${rubrics} ${homeStatsCopy.rubricsHint}`}
    >
      <span className="tabular-nums" title={homeStatsCopy.materialsHint}>
        <span className="font-medium text-slate-700">{materials}</span>
        <span className="ml-0.5 font-normal">{topBarStatsCopy.materialsLabel}</span>
      </span>
      <span className="h-2 w-px shrink-0 bg-slate-200/80" aria-hidden />
      <span className="tabular-nums" title={homeStatsCopy.rubricsHint}>
        <span className="font-medium text-slate-700">{rubrics}</span>
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
    <div className="border-b border-slate-200/80 bg-white/90 text-slate-600">
      <div className="mx-auto max-w-[1400px] px-3 py-1 sm:px-5 sm:py-1.5 lg:px-10">
        <div className="grid grid-cols-[1fr_auto] gap-x-2.5 gap-y-1 md:grid-cols-[minmax(0,1fr)_minmax(0,1.35fr)_minmax(0,1fr)] md:items-center md:gap-x-3 lg:gap-x-5">
          <time
            dateTime={new Date().toISOString()}
            className="col-start-1 row-start-1 flex w-fit min-w-0 max-w-full justify-self-start items-center gap-1.5 rounded-md border border-slate-200/70 bg-slate-50/80 px-2 py-0.5 text-[9px] font-medium capitalize leading-none tracking-wide text-slate-600 sm:gap-2 sm:px-2.5 sm:py-1 sm:text-[10px]"
            suppressHydrationWarning
          >
            <span className="h-1 w-1 shrink-0 rounded-full bg-mars-accent/90" aria-hidden />
            {formatToday()}
          </time>
          <div className="col-start-2 row-start-1 justify-self-end md:col-start-3 md:row-start-1 md:justify-self-end">
            <TopBarStats materials={materials} rubrics={rubrics} />
          </div>
          <p className="col-span-2 row-start-2 max-w-[min(100%,38rem)] justify-self-center self-center text-center text-[9px] font-normal leading-snug text-slate-500 sm:text-[10px] md:col-span-1 md:col-start-2 md:row-start-1 md:px-2 md:leading-tight lg:px-4">
            <span className="italic text-slate-600">{topBarCopy.tagline}</span>
          </p>
        </div>
      </div>
    </div>
  );
}
