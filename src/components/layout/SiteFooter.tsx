import Link from "next/link";
import { NewsletterBlock } from "@/components/NewsletterBlock";
import { footerCopy } from "@/lib/copy";

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
      { href: "/poisk", label: "Поиск" },
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
      { href: "/reklamodatelyam", label: "Рекламодателям" },
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
              Марс<span className="text-red-600">Медиа</span>
            </Link>
            <p className="mt-4 max-w-md text-slate-600 leading-relaxed">{footerCopy.blurb}</p>
            <div className="mt-6 flex flex-wrap gap-3 text-sm font-medium">
              <Link href="https://t.me" className="text-sky-700 hover:underline" target="_blank" rel="noreferrer">
                Telegram
              </Link>
              <Link
                href="https://youtube.com"
                className="text-sky-700 hover:underline"
                target="_blank"
                rel="noreferrer"
              >
                YouTube
              </Link>
              <Link href="https://vk.com" className="text-sky-700 hover:underline" target="_blank" rel="noreferrer">
                VK
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
                      <Link href={l.href} className="text-slate-700 hover:text-slate-900 focus-ring rounded">
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
          <NewsletterBlock />
        </div>

        <div className="mt-10 flex flex-col gap-4 border-t border-slate-200 pt-8 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} МарсМедиа. Все права защищены.</p>
          <Link href="/kontakty" className="text-slate-600 hover:text-slate-900">
            {footerCopy.contactCta}
          </Link>
        </div>
      </div>
    </footer>
  );
}
