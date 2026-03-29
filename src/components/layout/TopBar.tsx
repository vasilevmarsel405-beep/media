import { topBarCopy } from "@/lib/copy";
import { TopBarOnlineCount } from "@/components/layout/TopBarOnlineCount";

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
      <div className="mx-auto flex max-w-[1400px] flex-wrap items-center justify-between gap-x-3 gap-y-1 px-4 py-1.5 sm:px-6 lg:px-10">
        <div className="flex min-w-0 flex-wrap items-center gap-2 sm:gap-3">
          <time
            dateTime={new Date().toISOString()}
            className="capitalize text-mars-ink/90"
            suppressHydrationWarning
          >
            {formatToday()}
          </time>
          <span className="hidden h-3 w-px shrink-0 bg-mars-line sm:block" aria-hidden />
          <span className="font-eyebrow flex min-w-0 flex-wrap items-center gap-1.5 font-bold tracking-widest text-mars-muted sm:gap-2">
            <span className="mars-pulse-dot" aria-hidden />
            <span className="shrink-0 uppercase font-semibold text-[#ff3100]">{topBarCopy.live}</span>
            <TopBarOnlineCount />
          </span>
        </div>
        <p className="order-last w-full text-center font-medium text-mars-muted lg:order-none lg:flex lg:w-auto lg:flex-1 lg:justify-center">
          {topBarCopy.tagline}
        </p>
      </div>
    </div>
  );
}
