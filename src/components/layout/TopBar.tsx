function formatToday() {
  return new Intl.DateTimeFormat("ru-RU", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date());
}

/** Одна строка: дата выпуска, визуально как вторичный текст шапки (без отдельной «плашки» и линий). */
export function TopBar() {
  return (
    <div className="bg-transparent">
      <div className="mx-auto max-w-[1400px] px-3 py-1.5 sm:px-5 sm:py-2 lg:px-10">
        <time
          dateTime={new Date().toISOString()}
          className="block text-[0.8125rem] font-medium capitalize leading-snug tracking-normal text-mars-muted"
          suppressHydrationWarning
        >
          {formatToday()}
        </time>
      </div>
    </div>
  );
}
