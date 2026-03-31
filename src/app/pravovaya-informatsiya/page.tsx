import type { Metadata } from "next";
import Link from "next/link";
import { editorialEmail, siteName } from "@/lib/site";

export const metadata: Metadata = {
  title: "Правовая информация",
  description:
    "Правовая и редакционная информация КриптоМарс Медиа: правила публикаций, прозрачность правок, политика данных и контакты редакции.",
};

export default function LegalInfoPage() {
  return (
    <div className="mx-auto max-w-[860px] px-4 py-14 sm:px-6 lg:px-10">
      <h1 className="font-display text-4xl font-semibold text-slate-900">Правовая информация</h1>
      <p className="mt-4 text-lg text-slate-600">
        Этот раздел фиксирует прозрачные правила работы {siteName}: как отделяются факты и мнения, как маркируются
        материалы, по какому порядку вносятся правки и через какие каналы принимается официальная обратная связь.
      </p>

      <div className="mt-10 space-y-8 rounded-3xl border border-slate-200 bg-slate-50/80 p-8">
        <section>
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500">Статус сайта</h2>
          <p className="mt-2 text-slate-700">
            Сайт не является витриной услуг и не принимает оплату за товары или доставку. Основная задача ресурса —
            публикация редакционных материалов с прозрачной политикой правок и ссылками на официальные документы.
          </p>
          <p className="mt-2 text-slate-700">
            Для посетителей доступны публичные правила: пользовательское соглашение, политика конфиденциальности,
            политика cookie и редакционная политика.
          </p>
        </section>

        <section>
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500">Прозрачность и доверие</h2>
          <p className="mt-2 text-slate-700">
            Ключевые правила работы редакции открыты: проверка фактов, отделение мнения от новости, обязательная
            маркировка материалов по типу и публичный порядок исправления ошибок.
          </p>
        </section>

        <section>
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500">Регион и контактный канал</h2>
          <p className="mt-2 text-slate-700">
            Регион работы редакции: Россия. Для официальных запросов, уточнений и сообщений об ошибках используется
            единый канал связи редакции.
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
        Связь с редакцией:{" "}
        <a href={`mailto:${editorialEmail}`} className="font-semibold text-mars-blue hover:underline">
          {editorialEmail}
        </a>
      </p>
    </div>
  );
}
