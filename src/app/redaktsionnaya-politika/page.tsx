import type { Metadata } from "next";
import Link from "next/link";
import { editorialEmail, siteName } from "@/lib/site";

export const metadata: Metadata = {
  title: "Редакционная политика",
  description: `Принципы и стандарты редакции ${siteName}.`,
};

export default function EditorialPage() {
  return (
    <div className="mx-auto max-w-[720px] px-4 py-14 sm:px-6 lg:px-10">
      <h1 className="font-display text-4xl font-semibold text-slate-900">Редакционная политика</h1>
      <p className="mt-3 text-sm text-slate-500">{siteName}</p>
      <div className="prose-mars mt-10 space-y-6 text-slate-700">
        <section className="space-y-3">
          <h2 className="font-display text-xl font-semibold text-slate-900">Миссия и аудитория</h2>
          <p>
            {siteName} публикует новости, аналитику и мультимедиа о рынках, технологиях и регулировании с акцентом на
            криптоэкономику и смежные темы. Мы ценим ясность: отделяем факты от мнений, поясняем контекст и избегаем
            необоснованного сенсационизма.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-display text-xl font-semibold text-slate-900">Разделение новостей, мнений и рекламы</h2>
          <p>
            Новости и репортажи строятся на проверяемых источниках. Колонки и аналитические тексты с явной позицией
            редакции или автора маркируются как мнения. Рекламные и спонсорские материалы всегда отделены от редакции и
            помечаются так, чтобы читатель мог однозначно их распознать.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-display text-xl font-semibold text-slate-900">Источники и конфликт интересов</h2>
          <p>
            Мы указываем источники, когда это не угрожает их безопасности. Анонимные источники используются только при
            внутренней проверке информации и веских причинах для неразглашения. Авторы и редакция раскрывают значимые
            финансовые интересы, если они могут повлиять на восприятие материала.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-display text-xl font-semibold text-slate-900">Исправления</h2>
          <p>
            Фактические ошибки исправляются оперативно; при существенных правках к материалу добавляется приписка
            редактора с датой. Если материал снимается с публикации, читателю сообщается причина в обобщённой форме, если
            это допустимо.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-display text-xl font-semibold text-slate-900">Независимость</h2>
          <p>
            Коммерческие партнёры не определяют редакционную позицию. Рекламные размещения не влияют на оценочные
            суждения в журналистских материалах.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-display text-xl font-semibold text-slate-900">Обратная связь</h2>
          <p>
            Замечания по фактам и этике:{" "}
            <a href={`mailto:${editorialEmail}`} className="font-medium text-mars-blue hover:underline">
              {editorialEmail}
            </a>
            . См. также{" "}
            <Link href="/polzovatelskoe-soglashenie" className="font-medium text-mars-blue hover:underline">
              Пользовательское соглашение
            </Link>
            .
          </p>
        </section>
      </div>
    </div>
  );
}
