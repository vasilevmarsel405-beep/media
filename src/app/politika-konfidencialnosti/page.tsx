import type { Metadata } from "next";
import Link from "next/link";
import { commercialEmail, editorialEmail, siteName, siteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "Политика конфиденциальности",
  description: `Как ${siteName} обрабатывает персональные данные посетителей сайта ${siteUrl}.`,
};

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-[720px] px-4 py-14 sm:px-6 lg:px-10">
      <h1 className="font-display text-4xl font-semibold text-slate-900">Политика конфиденциальности</h1>
      <p className="mt-3 text-sm text-slate-500">
        Редакция: {siteName} · Сайт: {siteUrl}
      </p>
      <div className="prose-mars mt-10 space-y-6 text-slate-700">
        <section className="space-y-3">
          <h2 className="font-display text-xl font-semibold text-slate-900">1. Общие положения</h2>
          <p>
            Настоящая Политика описывает, какие данные мы можем получать при использовании сайта {siteName} (далее —
            «Сайт»), в каких целях и на каких основаниях. Мы стремимся собирать минимум информации, необходимый для
            работы Сайта, рассылки (по вашему согласию) и аналитики посещаемости.
          </p>
          <p>
            Используя Сайт, вы подтверждаете, что ознакомились с этой Политикой. Если вы не согласны с её условиями,
            пожалуйста, воздержитесь от отправки форм и отключите файлы cookie в браузере (см.{" "}
            <Link href="/politika-faylov-cookie" className="font-medium text-mars-blue hover:underline">
              Политику cookie
            </Link>
            ).
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-display text-xl font-semibold text-slate-900">2. Какие данные мы обрабатываем</h2>
          <ul className="list-disc space-y-2 pl-5">
            <li>
              <strong>Технические данные:</strong> IP-адрес, тип браузера, язык, время запроса — для защиты от
              злоупотреблений, ограничения частоты запросов и обезличенной аналитики.
            </li>
            <li>
              <strong>Идентификаторы аналитики:</strong> обезличенные cookie для подсчёта уникальных посетителей и
              популярных страниц, если вы не отключили cookie.
            </li>
            <li>
              <strong>Адрес электронной почты</strong> — только если вы указали его в форме подписки на рассылку.
            </li>
            <li>
              <strong>Данные в письмах редакции</strong> — в объёме, который вы сами указали в сообщении.
            </li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="font-display text-xl font-semibold text-slate-900">3. Цели обработки</h2>
          <ul className="list-disc space-y-2 pl-5">
            <li>предоставление доступа к материалам Сайта;</li>
            <li>улучшение структуры и контента на основе обезличенной статистики;</li>
            <li>отправка email-рассылки — только при вашем запросе (подписка);</li>
            <li>ответы на обращения в редакцию и коммерческую службу;</li>
            <li>обеспечение безопасности и работоспособности Сайта.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="font-display text-xl font-semibold text-slate-900">4. Правовые основания и третьи лица</h2>
          <p>
            Обработка может опираться на согласие, исполнение соглашения с пользователем и законные интересы оператора
            (безопасность, аналитика) — с учётом применимого законодательства. Могут использоваться облачные сервисы
            (хостинг, базы данных); с подрядчиками заключаются соглашения о конфиденциальности.
          </p>
          <p className="text-sm text-slate-600">
            Уточните формулировки с юристом под вашу юрисдикцию и фактическую схему обработки (в т.ч. трансграничная
            передача).
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-display text-xl font-semibold text-slate-900">5. Сроки и права субъекта данных</h2>
          <p>
            Логи и аналитика хранятся в разумные сроки. Адреса рассылки — до отписки или закрытия проекта. Вы можете
            запрашивать доступ, исправление, удаление и иные права, предусмотренные применимым правом.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-display text-xl font-semibold text-slate-900">6. Контакты</h2>
          <p>
            Персональные данные:{" "}
            <a href={`mailto:${editorialEmail}`} className="font-medium text-mars-blue hover:underline">
              {editorialEmail}
            </a>
            . Коммерция:{" "}
            <a href={`mailto:${commercialEmail}`} className="font-medium text-mars-blue hover:underline">
              {commercialEmail}
            </a>
            .
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-display text-xl font-semibold text-slate-900">7. Изменения</h2>
          <p>Актуальная версия Политики всегда на этой странице. Существенные изменения целесообразно анонсировать.</p>
        </section>
      </div>
    </div>
  );
}
