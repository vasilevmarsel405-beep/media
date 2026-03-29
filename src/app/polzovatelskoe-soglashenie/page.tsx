import type { Metadata } from "next";
import Link from "next/link";
import { editorialEmail, siteName, siteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "Пользовательское соглашение",
  description: `Правила использования сайта ${siteName}.`,
};

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-[720px] px-4 py-14 sm:px-6 lg:px-10">
      <h1 className="font-display text-4xl font-semibold text-slate-900">Пользовательское соглашение</h1>
      <p className="mt-3 text-sm text-slate-500">
        {siteName} · {siteUrl}
      </p>
      <div className="prose-mars mt-10 space-y-6 text-slate-700">
        <section className="space-y-3">
          <h2 className="font-display text-xl font-semibold text-slate-900">1. Стороны и предмет</h2>
          <p>
            Настоящее Соглашение регулирует отношения между вами и {siteName} при использовании сайта по адресу{" "}
            {siteUrl} (далее — «Сайт»). Материалы Сайта предназначены для личного некоммерческого ознакомления, если
            иное прямо не разрешено редакцией.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-display text-xl font-semibold text-slate-900">2. Интеллектуальная собственность</h2>
          <p>
            Тексты, визуальные материалы, подборы, дизайн и программный код Сайта охраняются законодательством об
            интеллектуальной собственности. Копирование, распространение, публичный показ или иное использование без
            письменного разрешения правообладателя запрещены, за исключением случаев, прямо предусмотренных законом
            (краткие цитаты с указанием источника и ссылки на Сайт).
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-display text-xl font-semibold text-slate-900">3. Информация и риски</h2>
          <p>
            Материалы о финансовых инструментах, криптоактивах и регулировании носят информационный характер и{" "}
            <strong>не являются индивидуальной инвестиционной, юридической или налоговой рекомендацией</strong>.
            Решения вы принимаете самостоятельно. Прошлые результаты не гарантируют будущую доходность.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-display text-xl font-semibold text-slate-900">4. Поведение пользователей</h2>
          <p>Запрещается использовать Сайт для:</p>
          <ul className="list-disc space-y-2 pl-5">
            <li>нарушения законодательства и прав третьих лиц;</li>
            <li>распространения вредоносного кода, спама, оскорблений;</li>
            <li>попыток несанкционированного доступа к системам и данным.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="font-display text-xl font-semibold text-slate-900">5. Ссылки и сервисы третьих лиц</h2>
          <p>
            Сайт может содержать ссылки на внешние ресурсы (соцсети, видеохостинги). Мы не контролируем их контент и
            политику конфиденциальности; ответственность за переход лежит на пользователе.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-display text-xl font-semibold text-slate-900">6. Ограничение ответственности</h2>
          <p>
            Сайт предоставляется по принципу «как есть». Мы прилагаем разумные усилия для актуальности материалов, но
            не гарантируем отсутствие ошибок или бесперебойную работу. В максимальной степени, допустимой законом,
            ответственность ограничивается целью использования Сайта как информационного ресурса.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-display text-xl font-semibold text-slate-900">7. Изменения и прекращение</h2>
          <p>
            Мы можем изменять функциональность Сайта и текст Соглашения. Продолжение использования после публикации
            изменений означает согласие с обновлённой версией, если иное не указано отдельно.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-display text-xl font-semibold text-slate-900">8. Контакты</h2>
          <p>
            По вопросам Соглашения:{" "}
            <a href={`mailto:${editorialEmail}`} className="font-medium text-mars-blue hover:underline">
              {editorialEmail}
            </a>
            . Также см.{" "}
            <Link href="/politika-konfidencialnosti" className="font-medium text-mars-blue hover:underline">
              Политику конфиденциальности
            </Link>
            .
          </p>
        </section>
      </div>
    </div>
  );
}
