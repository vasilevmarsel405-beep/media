"use client";

import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="mx-auto flex max-w-lg flex-col items-center px-4 py-24 text-center">
      <p className="text-xs font-semibold uppercase tracking-wider text-mars-accent">Ошибка</p>
      <h1 className="font-display mt-3 text-3xl font-bold text-slate-900">Не удалось загрузить страницу</h1>
      <p className="mt-4 text-slate-600 leading-relaxed">
        Попробуйте снова. Если повторяется — зайдите с главной или напишите на{" "}
        <a href="mailto:red@cryptomarsmedia.ru" className="font-medium text-mars-blue underline underline-offset-2">
          red@cryptomarsmedia.ru
        </a>
        .
      </p>
      {process.env.NODE_ENV === "development" ? (
        <pre className="mt-6 max-h-40 w-full overflow-auto rounded-xl bg-slate-100 p-4 text-left text-xs text-slate-700">
          {error.message}
        </pre>
      ) : null}
      <div className="mt-10 flex flex-wrap justify-center gap-3">
        <button
          type="button"
          onClick={() => reset()}
          className="focus-ring inline-flex min-h-11 items-center justify-center rounded-xl bg-mars-accent px-6 text-sm font-semibold text-white hover:bg-mars-accent-hover"
        >
          Повторить
        </button>
        <Link
          href="/"
          className="focus-ring inline-flex min-h-11 items-center justify-center rounded-xl border border-slate-200 bg-white px-6 text-sm font-semibold text-slate-800 hover:bg-slate-50"
        >
          На главную
        </Link>
      </div>
    </div>
  );
}
