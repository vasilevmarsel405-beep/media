import Link from "next/link";

export const dynamic = "force-dynamic";
import { AdminPostsTable } from "@/components/admin/AdminPostsTable";
import { getAdminPostsList } from "@/lib/admin-posts-list";
import { getPostsStorageMode, isRemotePostsConfigured } from "@/lib/redis-posts";

export default async function AdminPostsPage() {
  const rows = await getAdminPostsList();
  const store = getPostsStorageMode();
  const canMutate = isRemotePostsConfigured();

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold text-white">Материалы</h1>
          <p className="mt-2 text-sm text-slate-400">
            Здесь показаны все материалы сайта. Удаление и редактирование доступны только для «Облако», «Код» — только через git.
          </p>
        </div>
        {canMutate ? (
          <Link
            href="/admin/posts/new"
            className="rounded-xl bg-mars-accent px-5 py-2.5 text-sm font-bold text-white hover:bg-mars-accent-hover"
          >
            Новый материал
          </Link>
        ) : null}
      </div>

      {store === "local" ? (
        <div className="rounded-xl border border-sky-500/35 bg-sky-500/10 px-4 py-3 text-sm text-sky-100">
          <strong className="font-semibold text-white">Режим разработки:</strong> материалы в облаке пишутся в файл{" "}
          <code className="rounded bg-black/30 px-1">.local/remote-posts.json</code> (не в git). Для счётчиков и продакшена
          подключите Upstash — см. <code className="rounded bg-black/30 px-1">.env.example</code>.
        </div>
      ) : null}

      {store === "off" ? (
        <div className="rounded-xl border border-amber-500/35 bg-amber-500/10 px-4 py-3 text-sm text-amber-100">
          Нет хранилища для правок (нужен Upstash Redis — см. <code className="rounded bg-black/30 px-1">.env.example</code>
          ). Ниже — все материалы, которые отдаёт сайт из <strong className="text-white">кода</strong>; создать или
          сохранить облачную копию без Redis нельзя.
        </div>
      ) : null}

      {canMutate ? (
        <AdminPostsTable rows={rows} />
      ) : (
        <div className="rounded-xl border border-white/10 bg-slate-900/40 px-4 py-6 text-sm text-slate-400">
          Редактирование отключено: нет удалённого хранилища. Для массового удаления подключите Upstash Redis.
        </div>
      )}
    </div>
  );
}
