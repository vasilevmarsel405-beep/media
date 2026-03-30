import Link from "next/link";
import { makeIngestReference } from "@/lib/make-ingest-reference";
import { postHref } from "@/lib/routes";

export const dynamic = "force-dynamic";
import { getAllPosts } from "@/lib/posts-service";
import { getAnalyticsSnapshot, isAnalyticsConfigured } from "@/lib/redis-analytics";
import { getPostsStorageMode, hasUpstashRedis } from "@/lib/redis-posts";
import { fetchMetrikaTraffic7d } from "@/lib/yandex-metrika-api";

function fmt(n: number) {
  return n.toLocaleString("ru-RU");
}

export default async function AdminHomePage() {
  const [snap, metrika, posts] = await Promise.all([
    getAnalyticsSnapshot(),
    fetchMetrikaTraffic7d(),
    getAllPosts(),
  ]);
  const titleBySlug = new Map(posts.map((p) => [p.slug, p.title]));
  const store = getPostsStorageMode();
  const analyticsOn = isAnalyticsConfigured();

  return (
    <div className="space-y-10">
      <div>
        <h1 className="font-display text-3xl font-bold text-white">Обзор</h1>
        <p className="mt-2 text-slate-400">
          Аналитика собирается при посещениях страниц (кроме админки). Онлайн — активность за последние ~5 минут.
        </p>
      </div>

      {store === "local" ? (
        <div className="rounded-xl border border-sky-500/35 bg-sky-500/10 px-4 py-3 text-sm text-sky-100">
          <strong className="font-semibold text-white">Локальная разработка:</strong> правки материалов пишутся в{" "}
          <code className="rounded bg-black/30 px-1">.local/remote-posts.json</code>.
          {!analyticsOn ? (
            <>
              {" "}
              Аналитика и сценарии Make — после настройки Upstash (переменные ниже в{" "}
              <code className="rounded bg-black/30 px-1">.env.example</code>).
            </>
          ) : null}
        </div>
      ) : null}

      {store === "off" ? (
        <div className="rounded-xl border border-amber-500/35 bg-amber-500/10 px-4 py-3 text-sm text-amber-100">
          <strong className="font-semibold text-white">Хранилище материалов отключено:</strong> на сайте видны только
          материалы из кода; сохранять правки из админки нельзя. Включите{" "}
          <code className="rounded bg-black/30 px-1">POSTS_STORAGE_MODE=local</code> (VPS) или настройте{" "}
          <code className="rounded bg-black/30 px-1">UPSTASH_REDIS_REST_URL</code>/<code className="rounded bg-black/30 px-1">UPSTASH_REDIS_REST_TOKEN</code>.
        </div>
      ) : null}

      {hasUpstashRedis() && !analyticsOn ? (
        <div className="rounded-xl border border-amber-500/35 bg-amber-500/10 px-4 py-3 text-sm text-amber-100">
          Redis подключён, но снимок аналитики недоступен — проверьте переменные и доступ к базе.
        </div>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Сейчас на сайте"
          value={snap ? fmt(snap.onlineNow) : "—"}
          hint={analyticsOn ? "по heartbeat ~5 мин" : "нужен Upstash Redis"}
        />
        <StatCard
          label="Уникальных всего"
          value={snap ? fmt(snap.visitorsLifetime) : "—"}
          hint={analyticsOn ? "по cookie" : "нужен Upstash Redis"}
        />
        <StatCard
          label="За 7 дней"
          value={snap ? fmt(snap.visitorsWeek) : "—"}
          hint={analyticsOn ? "объединение дней" : "нужен Upstash Redis"}
        />
        <StatCard
          label="В этом месяце"
          value={snap ? fmt(snap.visitorsMonth) : "—"}
          hint={analyticsOn ? "календарный месяц" : "нужен Upstash Redis"}
        />
      </div>

      {metrika ? (
        <section className="rounded-2xl border border-violet-500/30 bg-violet-950/25 px-5 py-4">
          <h2 className="font-display text-sm font-semibold text-violet-100">Яндекс.Метрика (API)</h2>
          <p className="mt-0.5 text-xs text-violet-200/70">Сводка за {metrika.periodLabel} (счётчик из env).</p>
          <div className="mt-3 flex flex-wrap gap-8">
            <div>
              <span className="text-2xl font-bold tabular-nums text-white">{fmt(metrika.visits)}</span>
              <span className="ml-2 text-sm text-slate-400">визитов</span>
            </div>
            <div>
              <span className="text-2xl font-bold tabular-nums text-white">{fmt(metrika.pageviews)}</span>
              <span className="ml-2 text-sm text-slate-400">просмотров</span>
            </div>
          </div>
        </section>
      ) : (
        <div className="rounded-xl border border-white/10 bg-slate-900/30 px-4 py-3 text-xs leading-relaxed text-slate-500">
          <strong className="text-slate-400">Метрика через API:</strong> добавьте OAuth-токен с доступом к счётчику —{" "}
          <code className="rounded bg-black/40 px-1">YANDEX_METRIKA_OAUTH_TOKEN</code> в{" "}
          <code className="rounded bg-black/40 px-1">.env.local</code> / Vercel. Номер счётчика —{" "}
          <code className="rounded bg-black/40 px-1">NEXT_PUBLIC_YANDEX_METRIKA_ID</code> или{" "}
          <code className="rounded bg-black/40 px-1">YANDEX_METRIKA_COUNTER_ID</code>. Токен не должен попадать в Git.
        </div>
      )}

      <div className="grid gap-8 lg:grid-cols-2">
        <section className="rounded-2xl border border-white/10 bg-slate-900/40 p-6">
          <h2 className="font-display text-lg font-semibold text-white">Популярные материалы</h2>
          <p className="mt-1 text-xs text-slate-500">Просмотры страниц публикаций (по slug).</p>
          <ul className="mt-4 space-y-3">
            {(snap?.topPosts ?? []).length === 0 ? (
              <li className="text-sm text-slate-500">Пока нет данных.</li>
            ) : (
              (snap?.topPosts ?? []).map((row) => {
                const title = titleBySlug.get(row.slug) ?? row.slug;
                const post = posts.find((p) => p.slug === row.slug);
                const href = post ? postHref(post) : "#";
                return (
                  <li key={row.slug} className="flex items-start justify-between gap-3 border-b border-white/5 pb-3 text-sm last:border-0">
                    <div className="min-w-0">
                      <Link href={href} className="font-medium text-slate-200 hover:text-white">
                        {title}
                      </Link>
                      <p className="truncate text-xs text-slate-500">{row.slug}</p>
                    </div>
                    <span className="shrink-0 tabular-nums text-slate-400">{fmt(row.views)}</span>
                  </li>
                );
              })
            )}
          </ul>
        </section>

        <section className="rounded-2xl border border-white/10 bg-slate-900/40 p-6">
          <h2 className="font-display text-lg font-semibold text-white">Популярные пути</h2>
          <p className="mt-1 text-xs text-slate-500">Все запросы страниц (включая списки).</p>
          <ul className="mt-4 space-y-2">
            {(snap?.topPaths ?? []).length === 0 ? (
              <li className="text-sm text-slate-500">Пока нет данных.</li>
            ) : (
              (snap?.topPaths ?? []).map((row) => (
                <li key={row.path} className="flex justify-between gap-2 text-sm">
                  <span className="truncate font-mono text-xs text-slate-400">{row.path}</span>
                  <span className="shrink-0 tabular-nums text-slate-500">{fmt(row.views)}</span>
                </li>
              ))
            )}
          </ul>
        </section>
      </div>

      <div className="flex flex-wrap gap-3">
        <Link
          href="/admin/posts"
          className="inline-flex rounded-xl bg-mars-accent px-5 py-2.5 text-sm font-bold text-white hover:bg-mars-accent-hover"
        >
          Все материалы
        </Link>
        <Link
          href="/admin/posts/new"
          className="inline-flex rounded-xl border border-white/15 bg-white/5 px-5 py-2.5 text-sm font-semibold text-white hover:bg-white/10"
        >
          Новый материал
        </Link>
      </div>

      <section className="rounded-2xl border border-white/10 bg-slate-900/40 p-6">
        <h2 className="font-display text-lg font-semibold text-white">Справочник для Make (webhook)</h2>
        <p className="mt-1 text-sm text-slate-400">
          Те же значения проверяет <code className="rounded bg-black/30 px-1">POST /api/webhooks/make</code>. Подробности и
          примеры JSON — в <code className="rounded bg-black/30 px-1">README.md</code>.
        </p>
        <div className="mt-4 grid gap-4 text-sm text-slate-300 sm:grid-cols-2">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">authorId</p>
            <ul className="mt-2 space-y-1 font-mono text-xs text-slate-400">
              {makeIngestReference.authors.map((a) => (
                <li key={a.id}>
                  {a.id} — {a.name}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">kind</p>
            <p className="mt-2 font-mono text-xs text-slate-400">{makeIngestReference.kinds.join(", ")}</p>
            <p className="mt-4 text-xs font-semibold uppercase tracking-wider text-slate-500">rubricSlugs</p>
            <p className="mt-2 font-mono text-xs leading-relaxed text-slate-400">
              {makeIngestReference.rubricSlugs.join(", ")}
            </p>
            <p className="mt-4 text-xs font-semibold uppercase tracking-wider text-slate-500">tagSlugs</p>
            <p className="mt-2 font-mono text-xs leading-relaxed text-slate-400">
              {makeIngestReference.tagSlugs.join(", ")}
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

function StatCard({ label, value, hint }: { label: string; value: string; hint: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-slate-900/50 p-5">
      <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">{label}</p>
      <p className="font-display mt-2 text-3xl font-bold tabular-nums text-white">{value}</p>
      <p className="mt-1 text-[11px] text-slate-600">{hint}</p>
    </div>
  );
}
