import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Рекламодателям и партнёрам",
  description: "Форматы сотрудничества с МарсМедиа.",
};

export default function AdsPage() {
  return (
    <div className="mx-auto max-w-[760px] px-4 py-14 sm:px-6 lg:px-10">
      <h1 className="font-display text-4xl font-semibold text-slate-900">Рекламодателям и партнёрам</h1>
      <p className="mt-4 text-lg text-slate-600">
        Нативные форматы, спецпроекты, видео и ивенты — с прозрачной маркировкой и отдельным учётом редакционного
        контента.
      </p>
      <ul className="mt-8 space-y-3 text-slate-700">
        <li>— Медиакит и презентация (PDF) — добавьте ссылки на реальные файлы.</li>
        <li>— Брендированные спецпроекты с мультимедиа.</li>
        <li>— Видеоинтеграции в плеере и на главной.</li>
      </ul>
      <p className="mt-8">
        <a href="mailto:ads@marsmedia.example.com" className="font-semibold text-sky-700 hover:underline">
          ads@marsmedia.example.com
        </a>
      </p>
      <p className="mt-6">
        <Link href="/kontakty" className="text-sm font-semibold text-slate-600 hover:text-slate-900">
          Форма обратной связи →
        </Link>
      </p>
    </div>
  );
}
