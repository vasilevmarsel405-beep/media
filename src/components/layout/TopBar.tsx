import Link from "next/link";
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
    <div className="border-b border-slate-200/80 bg-white/90 text-sm text-slate-600 backdrop-blur-md">
      <div className="mx-auto flex max-w-[1400px] flex-wrap items-center justify-between gap-3 px-4 py-2.5 sm:px-6 lg:px-10">
        <div className="flex min-w-0 flex-wrap items-center gap-3 sm:gap-4">
          <time dateTime={new Date().toISOString()} className="capitalize text-slate-700">
            {formatToday()}
          </time>
          <span className="hidden h-4 w-px bg-slate-200 sm:block" aria-hidden />
          <span className="font-eyebrow hidden items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-slate-500 sm:flex">
            <span className="mars-pulse-dot" aria-hidden />
            <span className="text-emerald-700">{topBarCopy.live}</span>
            <span className="font-normal normal-case tracking-normal text-slate-400">{topBarCopy.online}</span>
          </span>
        </div>
        <p className="order-last hidden w-full text-center text-xs font-medium text-slate-500 lg:order-none lg:flex lg:w-auto lg:flex-1 lg:justify-center">
          {topBarCopy.tagline}
        </p>
        <div className="flex items-center gap-4">
          <span className="hidden text-slate-400 sm:inline">{topBarCopy.lang}</span>
          <Link
            href="/podpiska"
            className="font-semibold text-red-600 hover:text-red-700 focus-ring rounded"
          >
            {topBarCopy.subscription}
          </Link>
          <Link href="/kabinet" className="font-medium text-slate-700 hover:text-slate-900 focus-ring rounded">
            {topBarCopy.login}
          </Link>
        </div>
      </div>
    </div>
  );
}
