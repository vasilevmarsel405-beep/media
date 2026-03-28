import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Пользовательское соглашение",
};

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-[720px] px-4 py-14 sm:px-6 lg:px-10">
      <h1 className="font-display text-4xl font-semibold text-slate-900">Пользовательское соглашение</h1>
      <div className="prose-mars mt-8 space-y-4 text-slate-700">
        <p>Заготовка документа: правила использования сайта, ограничение ответственности, интеллектуальная собственность.</p>
        <p>Замените этот блок текстом, утверждённым юристами, перед запуском.</p>
      </div>
    </div>
  );
}
