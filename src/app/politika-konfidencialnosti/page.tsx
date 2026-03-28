import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Политика конфиденциальности",
};

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-[720px] px-4 py-14 sm:px-6 lg:px-10">
      <h1 className="font-display text-4xl font-semibold text-slate-900">Политика конфиденциальности</h1>
      <div className="prose-mars mt-8 space-y-4 text-slate-700">
        <p>
          Этот текст — заготовка для юридического согласования. Опишите цели обработки данных, сроки хранения, права
          пользователей и контакты ответственного лица.
        </p>
        <p>
          Для продакшена подключите актуальную политику с учётом применимого законодательства и используемых сервисов
          аналитики.
        </p>
      </div>
    </div>
  );
}
