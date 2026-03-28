import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Редакционная политика",
};

export default function EditorialPage() {
  return (
    <div className="mx-auto max-w-[720px] px-4 py-14 sm:px-6 lg:px-10">
      <h1 className="font-display text-4xl font-semibold text-slate-900">Редакционная политика</h1>
      <div className="prose-mars mt-8 space-y-4 text-slate-700">
        <p>
          МарсМедиа разделяет новости, мнения и рекламные материалы. Рекламный контент всегда маркируется; редакция
          сохраняет финальный контроль над журналистскими текстами.
        </p>
        <p>
          Ошибки исправляются публично; при серьёзных поправках добавляется приписка редактора с датой. Источники
          проверяются; анонимные указания используются только при веских причинах и внутренней верификации.
        </p>
        <p>Замените и дополните этот раздел внутренним регламентом редакции.</p>
      </div>
    </div>
  );
}
