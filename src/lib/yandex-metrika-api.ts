/**
 * Reporting API Метрики (сервер только). Токен — YANDEX_METRIKA_OAUTH_TOKEN, не NEXT_PUBLIC.
 * @see https://yandex.ru/dev/metrika/doc/api2/api_v1/intro.html
 */

function counterIdFromEnv(): string | null {
  const explicit = process.env.YANDEX_METRIKA_COUNTER_ID?.trim().replace(/\D/g, "");
  if (explicit && explicit.length >= 5) return explicit;
  const pub = process.env.NEXT_PUBLIC_YANDEX_METRIKA_ID?.trim().replace(/\D/g, "");
  return pub && pub.length >= 5 ? pub : null;
}

export type MetrikaTrafficSummary = {
  visits: number;
  pageviews: number;
  periodLabel: string;
};

/** Визиты и просмотры за последние 7 дней (сегодня включительно). */
export async function fetchMetrikaTraffic7d(): Promise<MetrikaTrafficSummary | null> {
  const token = process.env.YANDEX_METRIKA_OAUTH_TOKEN?.trim();
  const counterId = counterIdFromEnv();
  if (!token || !counterId) return null;

  const url = new URL("https://api-metrika.yandex.net/stat/v1/data");
  url.searchParams.set("ids", counterId);
  url.searchParams.set("metrics", "ym:s:visits,ym:s:pageviews");
  url.searchParams.set("date1", "7daysAgo");
  url.searchParams.set("date2", "today");

  try {
    const res = await fetch(url.toString(), {
      headers: { Authorization: `OAuth ${token}` },
      next: { revalidate: 300 },
    });
    if (!res.ok) return null;
    const body = (await res.json()) as {
      data?: { metrics?: number[] }[];
    };
    const row = body.data?.[0]?.metrics;
    if (!row || row.length < 2) return null;
    return {
      visits: Math.round(row[0] ?? 0),
      pageviews: Math.round(row[1] ?? 0),
      periodLabel: "последние 7 дней",
    };
  } catch {
    return null;
  }
}
