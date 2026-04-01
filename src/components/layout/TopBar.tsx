function formatToday() {
  return new Intl.DateTimeFormat("ru-RU", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date());
}

/**
 * Дата: кегль как у меню; ровные отступы сверху/снизу (pt = pb при отсутствии safe-area),
 * flex items-center — дата по центру по вертикали внутри полосы pt/pb.
 */
export function TopBar() {
  return (
    <div className="bg-transparent">
      <div className="mx-auto flex max-w-[1400px] items-center px-3 pb-1.5 pt-[max(0.375rem,env(safe-area-inset-top))] sm:px-5 sm:pb-2 sm:pt-[max(0.5rem,env(safe-area-inset-top))] lg:px-10">
        <time
          dateTime={new Date().toISOString()}
          className="text-[0.8125rem] font-medium capitalize leading-none tracking-normal text-mars-ink/88"
          suppressHydrationWarning
        >
          {formatToday()}
        </time>
      </div>
    </div>
  );
}
