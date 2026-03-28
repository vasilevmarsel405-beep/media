import Link from "next/link";
import { MobileNav } from "@/components/layout/MobileNav";
import { IconSearch } from "@/components/icons";
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
    <header className="sticky top-0 z-[100] border-b border-slate-200/80 bg-white/95 shadow-sm backdrop-blur-md">
      <div className="mx-auto flex max-w-[1400px] items-center gap-4 px-4 py-4 sm:px-6 lg:px-10">
        <Link
          href="/"
          className="font-display text-2xl font-semibold tracking-tight text-slate-900 focus-ring rounded-sm"
        >
          Марс<span className="text-red-600">Медиа</span>
        </Link>

        <nav
          className={cn(
            "ml-auto hidden items-center gap-1 lg:flex",
            "text-sm font-medium text-slate-700"
          )}
          aria-label="Основное меню"
        >
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-lg px-2.5 py-2 hover:bg-slate-50 hover:text-slate-900 focus-ring"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2 sm:gap-3 lg:ml-4">
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
            className="focus-ring hidden rounded-full bg-red-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-red-700 sm:inline-flex"
          >
            Подписаться
          </Link>
          <Link
            href="/kabinet"
            className="focus-ring hidden rounded-full border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-800 hover:bg-slate-50 lg:inline-flex"
          >
            Кабинет
          </Link>
          <MobileNav items={nav} />
        </div>
      </div>
    </header>
  );
}
