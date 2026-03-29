import type { Metadata } from "next";
import Link from "next/link";
import { editorialEmail, siteName, siteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "Политика использования файлов cookie",
  description: `Как ${siteName} использует cookie и аналогичные технологии на ${siteUrl}.`,
};

export default function CookiePolicyPage() {
  return (
    <div className="mx-auto max-w-[720px] px-4 py-14 sm:px-6 lg:px-10">
      <h1 className="font-display text-4xl font-semibold text-slate-900">Политика файлов cookie</h1>
      <p className="mt-3 text-sm text-slate-500">
        {siteName} · {siteUrl}
      </p>
      <div className="prose-mars mt-10 space-y-6 text-slate-700">
        <section className="space-y-3">
          <h2 className="font-display text-xl font-semibold text-slate-900">Что такое cookie</h2>
          <p>
            Cookie — небольшие фрагменты данных, которые сайт сохраняет в вашем браузере. Они помогают распознавать
            повторные визиты, сохранять настройки и собирать обезличенную статистику.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-display text-xl font-semibold text-slate-900">Какие cookie мы используем</h2>
          <ul className="list-disc space-y-2 pl-5">
            <li>
              <strong>Необходимые / функциональные:</strong> обеспечивают работу Сайта (например, сессии в закрытых
              разделах для администраторов).
            </li>
            <li>
              <strong>Аналитические (first-party):</strong> обезличенные идентификаторы посетителя и сессии для подсчёта
              просмотров страниц, приблизительного «онлайна» и популярных материалов. Данные обрабатываются в
              инфраструктуре, указанной в{" "}
              <Link href="/politika-konfidencialnosti" className="font-medium text-mars-blue hover:underline">
                Политике конфиденциальности
              </Link>
              .
            </li>
            <li>
              <strong>Яндекс.Метрика (если подключена):</strong> на сайт может подгружаться счётчик Яндекса; обработка
              данных посетителей в этом случае также регулируется документами сервиса{" "}
              <a
                href="https://yandex.ru/legal/confidential/"
                className="font-medium text-mars-blue hover:underline"
                target="_blank"
                rel="noreferrer"
              >
                Яндекса
              </a>
              . Вы можете ограничить cookie в браузере или использовать блокировщики по своему усмотрению.
            </li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="font-display text-xl font-semibold text-slate-900">Срок хранения</h2>
          <p>
            Сроки жизни cookie зависят от их назначения: сессионные удаляются при закрытии браузера, аналитические могут
            сохраняться дольше (до нескольких сотен дней), если вы не очистите их вручную.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-display text-xl font-semibold text-slate-900">Как отключить</h2>
          <p>
            В настройках браузера вы можете удалить или заблокировать cookie. Это может ограничить функции Сайта
            (например, корректный подсчёт уникальных посетителей для нас не критичен для вашего чтения, но влияет на
            статистику).
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-display text-xl font-semibold text-slate-900">Обновления</h2>
          <p>
            Политика может обновляться. Дата последнего обновления отображается логически «как при публикации» — следите
            за изменениями на этой странице.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-display text-xl font-semibold text-slate-900">Контакты</h2>
          <p>
            Вопросы:{" "}
            <a href={`mailto:${editorialEmail}`} className="font-medium text-mars-blue hover:underline">
              {editorialEmail}
            </a>
            .
          </p>
        </section>
      </div>
    </div>
  );
}
