import type { Metadata } from "next";
import Link from "next/link";
import { commercialEmail, siteName } from "@/lib/site";

export const metadata: Metadata = {
  title: "Правовая информация",
  description:
    "Юридическая и коммерческая информация КриптоМарс Медиа: правила размещения, маркировка, оплата, гарантии и контакты.",
};

export default function LegalInfoPage() {
  return (
    <div className="mx-auto max-w-[860px] px-4 py-14 sm:px-6 lg:px-10">
      <h1 className="font-display text-4xl font-semibold text-slate-900">Правовая информация</h1>
      <p className="mt-4 text-lg text-slate-600">
        Этот раздел фиксирует прозрачные правила сотрудничества с {siteName}: как согласуются условия, как маркируются
        коммерческие материалы и через какие каналы запрашиваются документы.
      </p>

      <div className="mt-10 space-y-8 rounded-3xl border border-slate-200 bg-slate-50/80 p-8">
        <section>
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500">Условия размещения</h2>
          <p className="mt-2 text-slate-700">
            Все коммерческие публикации и интеграции выходят с явной маркировкой. Формат, объём, сроки и KPI
            фиксируются в переписке и в договорных документах до старта размещения.
          </p>
        </section>

        <section>
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500">Оплата и документы</h2>
          <p className="mt-2 text-slate-700">
            Условия оплаты, закрывающие документы и реквизиты предоставляются по официальному запросу на коммерческую
            почту после согласования формата сотрудничества.
          </p>
        </section>

        <section>
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500">Гарантии и корректировки</h2>
          <p className="mt-2 text-slate-700">
            При выявлении фактической ошибки редакция публикует правку и обновляет материал открыто. По коммерческим
            размещениям порядок исправлений и дедлайны согласуются заранее в рабочем плане.
          </p>
        </section>

        <section>
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500">Связанные документы</h2>
          <ul className="mt-2 space-y-2 text-slate-700">
            <li>
              <Link href="/politika-konfidencialnosti" className="font-medium text-mars-blue hover:underline">
                Политика конфиденциальности
              </Link>
            </li>
            <li>
              <Link href="/politika-faylov-cookie" className="font-medium text-mars-blue hover:underline">
                Политика файлов cookie
              </Link>
            </li>
            <li>
              <Link href="/polzovatelskoe-soglashenie" className="font-medium text-mars-blue hover:underline">
                Пользовательское соглашение
              </Link>
            </li>
            <li>
              <Link href="/redaktsionnaya-politika" className="font-medium text-mars-blue hover:underline">
                Редакционная политика
              </Link>
            </li>
          </ul>
        </section>
      </div>

      <p className="mt-8 text-slate-700">
        Коммерческие запросы:{" "}
        <a href={`mailto:${commercialEmail}`} className="font-semibold text-mars-blue hover:underline">
          {commercialEmail}
        </a>
      </p>
    </div>
  );
}
