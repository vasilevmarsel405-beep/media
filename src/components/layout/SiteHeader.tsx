import Link from "next/link";
import { MobileNav } from "@/components/layout/MobileNav";
import { IconSearch } from "@/components/icons";
import { headerCopy } from "@/lib/copy";
import { cn } from "@/lib/cn";

const nav = [
  { href: "/novosti", label: "Новости" },
  { href: "/stati", label: "Статьи" },
  { href: "/analitika", label: "Аналитика" },
  { href: "/intervyu", label: "Интервью" },
  { href: "/video", label: "Видео" },
  { href: "/rubriki", label: "Рубрики" },
  { href: "/specproekty", label: "Спецпроекты" },
  { href: "/o-proekte", label: "О проекте" },
  { href: "/kontakty", label: "Контакты" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-[100] border-b border-slate-200/80 bg-white/95 shadow-[0_8px_30px_-12px_rgb(15_23_42/0.12)] backdrop-blur-md">
      <div className="mx-auto flex max-w-[1400px] flex-nowrap items-center gap-3 overflow-x-auto px-4 py-4 sm:gap-4 sm:px-6 lg:px-10 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <Link
          href="/"
          className="shrink-0 font-display text-2xl font-semibold tracking-tight text-slate-900 focus-ring rounded-sm"
        >
          Марс<span className="text-red-600">Медиа</span>
        </Link>

        <nav
          className={cn(
            "ml-auto hidden shrink-0 flex-nowrap items-center gap-0.5 lg:flex lg:gap-1",
            "text-sm font-medium text-slate-700"
          )}
          aria-label="Основное меню"
        >
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="whitespace-nowrap rounded-lg px-2 py-2 hover:bg-slate-50 hover:text-slate-900 focus-ring lg:px-2.5"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex shrink-0 flex-nowrap items-center gap-2 sm:gap-3 lg:ml-4">
          <Link
            href="/poisk"
            className="focus-ring flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50"
            aria-label="Поиск"
          >
            <IconSearch className="h-5 w-5" />
          </Link>
          <div className="hidden items-center gap-2 sm:flex">
            <Link
              href="https://t.me"
              className="text-xs font-medium text-slate-500 hover:text-sky-700 focus-ring rounded px-2"
              target="_blank"
              rel="noreferrer"
            >
              TG
            </Link>
            <Link
              href="https://youtube.com"
              className="text-xs font-medium text-slate-500 hover:text-sky-700 focus-ring rounded px-2"
              target="_blank"
              rel="noreferrer"
            >
              YouTube
            </Link>
          </div>
          <Link
            href="/podpiska"
            className="focus-ring hidden whitespace-nowrap rounded-full bg-red-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-red-700 sm:inline-flex sm:items-center sm:justify-center"
          >
            {headerCopy.subscribe}
          </Link>
          <Link
            href="/kabinet"
            className="focus-ring hidden whitespace-nowrap rounded-full border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-800 hover:bg-slate-50 lg:inline-flex lg:items-center lg:justify-center"
          >
            {headerCopy.cabinet}
          </Link>
          <MobileNav items={nav} />
        </div>
      </div>
    </header>
  );
}
