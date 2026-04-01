import Link from "next/link";
import { MobileNav } from "@/components/layout/MobileNav";
import { IconSearch } from "@/components/icons";
import { headerCopy } from "@/lib/copy";
import { socialTelegram, socialYoutube } from "@/lib/site";
import { cn } from "@/lib/cn";

const nav = [
  { href: "/novosti", label: "Новости" },
  { href: "/analitika", label: "Аналитика" },
  { href: "/video", label: "Видео" },
  { href: "/rubriki", label: "Рубрики" },
  { href: "/specproekty", label: "Спецпроекты" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-[100] border-b border-slate-200/85 bg-mars-surface/94 shadow-[0_6px_24px_-12px_rgb(19_21_26/0.08)] backdrop-blur-md backdrop-saturate-150">
      <div className="mx-auto flex min-w-0 max-w-[1400px] items-center gap-3 px-3 py-2 sm:px-5 sm:py-2.5 lg:gap-5 lg:px-10">
        <Link
          href="/"
          className="shrink-0 font-display text-[1.35rem] font-semibold tracking-tight text-mars-ink focus-ring rounded-sm sm:text-2xl"
        >
          КриптоМарс <span className="text-mars-accent">Медиа</span>
        </Link>

        {/* Центр полосы между логотипом и разделителем у блока действий */}
        <div
          className={cn(
            "flex min-w-0 flex-1 items-center justify-center overflow-x-auto overflow-y-visible py-1",
            "[scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
            "scroll-pl-2 scroll-pr-2"
          )}
        >
          <nav
            className={cn(
              "hidden w-max shrink-0 items-center gap-1 lg:flex",
              "text-[0.8125rem] font-medium text-mars-muted"
            )}
            aria-label="Основное меню"
          >
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="shrink-0 whitespace-nowrap rounded-xl px-2.5 py-2 text-mars-ink/88 transition-colors hover:bg-mars-accent-soft/80 hover:text-mars-ink focus-ring lg:px-3"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex shrink-0 items-center gap-2 sm:gap-2.5 lg:gap-3 lg:border-l lg:border-mars-line/70 lg:pl-5">
          <Link
            href="/poisk"
            className="focus-ring flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-mars-line bg-white/80 text-mars-muted transition-colors hover:border-stone-300 hover:bg-white hover:text-mars-ink"
            aria-label="Поиск"
          >
            <IconSearch className="h-[1.125rem] w-[1.125rem]" />
          </Link>
          <div className="hidden items-center gap-1 sm:flex">
            <Link
              href={socialTelegram}
              className="inline-flex min-h-10 min-w-10 items-center justify-center rounded-xl px-2 text-[0.6875rem] font-semibold uppercase tracking-wider text-mars-muted transition-colors hover:bg-stone-100 hover:text-[#229ED9] focus-ring"
              target="_blank"
              rel="noreferrer"
            >
              TG
            </Link>
            <Link
              href={socialYoutube}
              className="inline-flex min-h-10 min-w-10 items-center justify-center rounded-xl px-2 text-[0.6875rem] font-semibold uppercase tracking-wider text-mars-muted transition-colors hover:bg-stone-100 hover:text-[#c00] focus-ring"
              target="_blank"
              rel="noreferrer"
            >
              YouTube
            </Link>
          </div>
          <Link
            href="/podpiska"
            className="focus-ring mars-cta-header hidden shrink-0 whitespace-nowrap sm:inline-flex sm:items-center sm:justify-center"
          >
            {headerCopy.subscribe}
          </Link>
          <MobileNav items={nav} />
        </div>
      </div>
    </header>
  );
}
