function parseBoundedInt(raw: string | undefined, fallback: number, min: number, max: number): number {
  if (raw == null || raw.trim() === "") return fallback;
  const n = Number.parseInt(raw, 10);
  if (!Number.isFinite(n)) return fallback;
  return Math.min(max, Math.max(min, n));
}

/**
 * ISR с лентой: в каждом `page.tsx` задано `export const revalidate = 120` (литерал — требование Next.js 16 для статического анализа).
 * При смене интервала — find/replace по проекту или поменяйте только нужные страницы.
 */

/** Кеш массива постов в памяти одного процесса Node (между HTTP-запросами). Меньше походов в Upstash. */
export function postsMemoryCacheTtlMs(): number {
  const def = process.env.NODE_ENV === "production" ? 60_000 : 30_000;
  return parseBoundedInt(process.env.POSTS_MEMORY_CACHE_MS, def, 5000, 600_000);
}
