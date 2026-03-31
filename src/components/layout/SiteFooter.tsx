import Link from "next/link";
import { NewsletterBlock } from "@/components/NewsletterBlock";
import { footerCopy, topBarCopy } from "@/lib/copy";
import { adminEntryPathname } from "@/lib/admin-entry-path";
import { siteName, socialTelegram, socialYoutube } from "@/lib/site";

const sections = [
  {
    title: "Материалы",
    links: [
      { href: "/novosti", label: "Новости" },
      { href: "/stati", label: "Статьи" },
      { href: "/analitika", label: "Аналитика" },
      { href: "/intervyu", label: "Интервью" },
      { href: "/video", label: "Видео" },
    ],
  },
  {
    title: "Навигация",
    links: [
      { href: "/rubriki", label: "Рубрики" },
      { href: "/specproekty", label: "Спецпроекты" },
      { href: "/podpiska", label: topBarCopy.subscription },
      { href: "/poisk", label: "Поиск" },
      { href: "/rss.xml", label: "RSS" },
      { href: "/o-proekte", label: "О проекте" },
      { href: "/kontakty", label: "Контакты" },
    ],
  },
  {
    title: "Документы",
    links: [
      { href: "/politika-konfidencialnosti", label: "Конфиденциальность" },
      { href: "/polzovatelskoe-soglashenie", label: "Соглашение" },
      { href: "/redaktsionnaya-politika", label: "Редакционная политика" },
      { href: "/pravovaya-informatsiya", label: "Правовая информация" },
      { href: "/politika-faylov-cookie", label: "Файлы cookie" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="mt-20 border-t border-slate-200 bg-slate-50">
      <div className="mx-auto max-w-[1400px] px-4 py-14 sm:px-6 lg:px-10">
        <div className="grid gap-12 lg:grid-cols-[1.2fr_2fr]">
          <div>
            <Link href="/" className="font-display text-2xl font-semibold text-slate-900">
              КриптоМарс <span className="text-mars-accent">Медиа</span>
            </Link>
            <p className="mt-4 max-w-md text-slate-600 leading-relaxed">{footerCopy.blurb}</p>
            <div className="mt-6 flex flex-wrap gap-3 text-sm font-medium">
              <Link href={socialTelegram} className="text-mars-blue hover:underline" target="_blank" rel="noreferrer">
                Telegram
              </Link>
              <Link href={socialYoutube} className="text-mars-blue hover:underline" target="_blank" rel="noreferrer">
                YouTube
              </Link>
            </div>
          </div>
          <div className="grid gap-10 sm:grid-cols-3">
            {sections.map((col) => (
              <div key={col.title}>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">{col.title}</p>
                <ul className="mt-4 space-y-2">
                  {col.links.map((l) => (
                    <li key={l.href}>
                      <Link
                        href={l.href}
                        className="focus-ring inline-flex min-h-10 items-center rounded-md py-1 text-slate-700 hover:text-slate-900"
                      >
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-14 border-t border-slate-200 pt-10">
          <NewsletterBlock compact />
        </div>

        <div className="relative mt-10 flex flex-col gap-4 border-t border-slate-200 pt-8 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {siteName}. Все права защищены{" "}
            {/* Скрытая точка входа: неочевидный URL; крошечная зона клика в конце строки */}
            <Link
              href={adminEntryPathname}
              className="-m-1 inline-block size-2 rounded-sm opacity-[0.07] hover:opacity-25"
              aria-label="Вход в админку"
              title="Вход в админку"
            >
              <span className="block size-full" aria-hidden />
              <span className="sr-only">Вход в админку</span>
            </Link>
          </p>
          <Link href="/kontakty" className="text-slate-600 hover:text-slate-900">
            {footerCopy.contactCta}
          </Link>
        </div>
      </div>
    </footer>
  );
}
