import Link from "next/link";

function formatToday() {
  return new Intl.DateTimeFormat("ru-RU", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date());
}

export function TopBar() {
  return (
    <div className="border-b border-slate-200 bg-white text-sm text-slate-600">
      <div className="mx-auto flex max-w-[1400px] flex-wrap items-center justify-between gap-2 px-4 py-2 sm:px-6 lg:px-10">
        <time dateTime={new Date().toISOString()} className="capitalize">
          {formatToday()}
        </time>
        <div className="flex items-center gap-4">
          <span className="hidden text-slate-400 sm:inline">Русский</span>
          <Link href="/podpiska" className="font-medium text-sky-700 hover:text-sky-900 focus-ring rounded">
            Подписка
          </Link>
          <Link href="/kabinet" className="font-medium text-slate-700 hover:text-slate-900 focus-ring rounded">
            Вход
          </Link>
        </div>
      </div>
    </div>
  );
}
