import Link from "next/link";

export const dynamic = "force-dynamic";
import { AdminDeletePostButton } from "@/components/admin/AdminDeletePostButton";
import { postHref } from "@/lib/routes";
import { getAdminPostsList } from "@/lib/admin-posts-list";
import { getPostsStorageMode, isRemotePostsConfigured } from "@/lib/redis-posts";

const kindRu: Record<string, string> = {
  news: "Новость",
  article: "Статья",
  analytics: "Аналитика",
  interview: "Интервью",
  video: "Видео",
};

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
            «Облако» — редактирование и удаление. «Код» — демо из репозитория, меняется только через git.
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

      <div className="overflow-x-auto rounded-2xl border border-white/10 bg-slate-900/40">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="border-b border-white/10 text-xs uppercase tracking-wider text-slate-500">
            <tr>
              <th className="px-4 py-3">Заголовок</th>
              <th className="px-4 py-3">Тип</th>
              <th className="px-4 py-3">Источник</th>
              <th className="px-4 py-3">Slug</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {rows.map(({ post, source }) => (
              <tr key={post.slug} className="border-b border-white/5 last:border-0">
                <td className="px-4 py-3">
                  <Link href={postHref(post)} className="font-medium text-slate-200 hover:text-white">
                    {post.title}
                  </Link>
                </td>
                <td className="px-4 py-3 text-slate-400">{kindRu[post.kind] ?? post.kind}</td>
                <td className="px-4 py-3">
                  <span
                    className={
                      source === "remote"
                        ? "rounded-md bg-emerald-500/15 px-2 py-0.5 text-xs font-semibold text-emerald-300"
                        : "rounded-md bg-slate-600/40 px-2 py-0.5 text-xs font-semibold text-slate-400"
                    }
                  >
                    {source === "remote" ? "Облако" : "Код"}
                  </span>
                </td>
                <td className="px-4 py-3 font-mono text-xs text-slate-500">{post.slug}</td>
                <td className="px-4 py-3 text-right">
                  <div className="flex justify-end gap-3">
                    <Link
                      href={`/admin/posts/${encodeURIComponent(post.slug)}/edit`}
                      className="text-xs font-semibold text-mars-accent hover:underline"
                    >
                      {canMutate ? "Изменить" : "Просмотр"}
                    </Link>
                    {canMutate && source === "remote" ? <AdminDeletePostButton slug={post.slug} /> : null}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
