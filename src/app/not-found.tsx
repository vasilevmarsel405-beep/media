import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-lg flex-col items-center px-4 py-24 text-center">
      <p className="font-display text-6xl font-bold tabular-nums text-slate-200">404</p>
      <h1 className="font-display mt-4 text-2xl font-bold text-slate-900">Страница не найдена</h1>
      <p className="mt-3 text-slate-600 leading-relaxed">
        Ссылка устарела или адрес набран с опечаткой. Проверьте URL или воспользуйтесь поиском.
      </p>
      <div className="mt-10 flex flex-wrap justify-center gap-3">
        <Link
          href="/"
          className="focus-ring inline-flex min-h-11 items-center justify-center rounded-xl bg-mars-accent px-6 text-sm font-semibold text-white hover:bg-mars-accent-hover"
        >
          На главную
        </Link>
        <Link
          href="/poisk"
          className="focus-ring inline-flex min-h-11 items-center justify-center rounded-xl border border-slate-200 bg-white px-6 text-sm font-semibold text-slate-800 hover:bg-slate-50"
        >
          Поиск
        </Link>
      </div>
    </div>
  );
}
