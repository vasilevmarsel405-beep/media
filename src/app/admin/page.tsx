import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Админ-панель (заготовка)",
  robots: { index: false, follow: false },
};

export default function AdminPage() {
  return (
    <div className="mx-auto max-w-[900px] px-4 py-14 sm:px-6 lg:px-10">
      <h1 className="font-display text-3xl font-semibold text-slate-900">CMS / Админ-панель</h1>
      <p className="mt-4 text-slate-600 leading-relaxed">
        Сейчас контент лежит в коде как демо-данные. Для продакшена подключите headless CMS (Sanity, Strapi, Directus,
        Payload) или собственную админку с ролями, расписанием публикаций, SEO-полями и загрузкой медиа.
      </p>
      <div className="mt-8 rounded-2xl border border-amber-200 bg-amber-50 p-6 text-amber-950">
        <p className="font-semibold">Минимальный функционал CMS по вашему ТЗ:</p>
        <ul className="mt-3 list-inside list-disc space-y-1 text-sm">
          <li>Создание и редактирование материалов всех типов</li>
          <li>Авторы, рубрики, теги, обложки, видео</li>
          <li>Публикация сразу / по расписанию, закрепление на главной</li>
          <li>Сборка главной и спецпроектов</li>
          <li>SEO: title, description, OG, ЧПУ</li>
        </ul>
      </div>
      <p className="mt-8 text-sm text-slate-500">
        <Link href="/" className="font-semibold text-sky-700 hover:underline">
          ← На главную
        </Link>
      </p>
    </div>
  );
}
