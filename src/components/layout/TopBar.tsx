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
    <div className="border-b border-mars-line/80 bg-mars-surface/95 text-[11px] text-mars-muted backdrop-blur-md sm:text-xs">
      <div className="mx-auto flex max-w-[1400px] flex-col items-center gap-1 px-4 py-2 sm:flex-row sm:items-center sm:justify-between sm:gap-x-4 sm:px-6 sm:py-1.5 lg:px-10">
        <time
          dateTime={new Date().toISOString()}
          className="shrink-0 capitalize text-mars-ink/90"
          suppressHydrationWarning
        >
          {formatToday()}
        </time>
        <p className="max-w-[min(100%,42rem)] text-center font-medium leading-snug text-mars-muted sm:max-w-none sm:flex-1 sm:text-right lg:text-center">
          {topBarCopy.tagline}
        </p>
      </div>
    </div>
  );
}
