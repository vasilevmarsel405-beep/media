function formatToday() {
  return new Intl.DateTimeFormat("ru-RU", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date());
}

/**
 * Дата: компактная полоса (минимальные pt/pb), на sm+ кегль как у меню.
 */
export function TopBar() {
  return (
    <div className="bg-transparent">
      <div className="mx-auto flex max-w-[1400px] items-center px-3 pb-0.5 pt-[max(0.25rem,env(safe-area-inset-top))] sm:px-5 sm:pb-1 sm:pt-[max(0.375rem,env(safe-area-inset-top))] lg:px-10">
        <time
          dateTime={new Date().toISOString()}
          className="text-[0.75rem] font-medium capitalize leading-none tracking-normal text-mars-ink/88 sm:text-[0.8125rem]"
          suppressHydrationWarning
        >
          {formatToday()}
        </time>
      </div>
    </div>
  );
}
