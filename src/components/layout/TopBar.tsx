function formatToday() {
  return new Intl.DateTimeFormat("ru-RU", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date());
}

/**
 * Дата: кегль и цвет как у пунктов меню в шапке (0.8125rem, mars-ink/88),
 * отступ сверху с safe-area, выравнивание по центру полосы.
 */
export function TopBar() {
  return (
    <div className="bg-transparent">
      <div className="mx-auto flex max-w-[1400px] items-center px-3 pb-2 pt-[max(0.625rem,env(safe-area-inset-top))] sm:px-5 sm:pb-2.5 sm:pt-[max(0.75rem,env(safe-area-inset-top))] lg:px-10">
        <time
          dateTime={new Date().toISOString()}
          className="text-[0.8125rem] font-medium capitalize leading-normal tracking-normal text-mars-ink/88"
          suppressHydrationWarning
        >
          {formatToday()}
        </time>
      </div>
    </div>
  );
}
