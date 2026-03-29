"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { postHref } from "@/lib/routes";
import type { AdminPostRow } from "@/lib/admin-posts-list";

const kindRu: Record<string, string> = {
  news: "Новость",
  article: "Статья",
  analytics: "Аналитика",
  interview: "Интервью",
  video: "Видео",
};

export function AdminPostsTable({ rows }: { rows: AdminPostRow[] }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [selected, setSelected] = useState<Record<string, boolean>>({});

  const selectedSlugs = useMemo(
    () => rows.map((r) => r.post.slug).filter((slug) => Boolean(selected[slug])),
    [rows, selected]
  );
  const allChecked = rows.length > 0 && selectedSlugs.length === rows.length;

  const toggleAll = (checked: boolean) => {
    if (!checked) {
      setSelected({});
      return;
    }
    const next: Record<string, boolean> = {};
    for (const r of rows) next[r.post.slug] = true;
    setSelected(next);
  };

  const deleteSlugs = async (slugs: string[]) => {
    if (!slugs.length) return;
    setBusy(true);
    const results = await Promise.all(
      slugs.map(async (slug) => {
        const res = await fetch(`/api/admin/posts?slug=${encodeURIComponent(slug)}`, { method: "DELETE" });
        return { slug, ok: res.ok };
      })
    );
    const failed = results.filter((r) => !r.ok);
    if (failed.length) {
      alert(`Не удалось удалить: ${failed.map((f) => f.slug).join(", ")}`);
      setBusy(false);
      return;
    }
    setSelected({});
    router.refresh();
  };

  return (
    <div className="overflow-x-auto rounded-2xl border border-white/10 bg-slate-900/40">
      <div className="flex items-center justify-between gap-3 border-b border-white/10 px-4 py-3">
        <label className="flex items-center gap-2 text-sm text-slate-300">
          <input
            type="checkbox"
            checked={allChecked}
            onChange={(e) => toggleAll(e.target.checked)}
            disabled={busy || rows.length === 0}
          />
          Выбрать все
        </label>
        <button
          type="button"
          disabled={busy || selectedSlugs.length === 0}
          onClick={async () => {
            if (
              !confirm(
                `Удалить ${selectedSlugs.length} материалов из облака? Данные из кода репозитория не затрагиваются.`
              )
            ) {
              return;
            }
            await deleteSlugs(selectedSlugs);
          }}
          className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-1.5 text-xs font-semibold text-red-300 hover:bg-red-500/15 disabled:opacity-50"
        >
          {busy ? "Удаление..." : `Удалить выбранные (${selectedSlugs.length})`}
        </button>
      </div>
      <table className="w-full min-w-[760px] text-left text-sm">
        <thead className="border-b border-white/10 text-xs uppercase tracking-wider text-slate-500">
          <tr>
            <th className="px-4 py-3 w-10" />
            <th className="px-4 py-3">Заголовок</th>
            <th className="px-4 py-3">Тип</th>
            <th className="px-4 py-3">Slug</th>
            <th className="px-4 py-3" />
          </tr>
        </thead>
        <tbody>
          {rows.map(({ post }) => (
            <tr key={post.slug} className="border-b border-white/5 last:border-0">
              <td className="px-4 py-3">
                <input
                  type="checkbox"
                  checked={Boolean(selected[post.slug])}
                  onChange={(e) => setSelected((s) => ({ ...s, [post.slug]: e.target.checked }))}
                  disabled={busy}
                />
              </td>
              <td className="px-4 py-3">
                <Link href={postHref(post)} className="font-medium text-slate-200 hover:text-white">
                  {post.title}
                </Link>
              </td>
              <td className="px-4 py-3 text-slate-400">{kindRu[post.kind] ?? post.kind}</td>
              <td className="px-4 py-3 font-mono text-xs text-slate-500">{post.slug}</td>
              <td className="px-4 py-3 text-right">
                <div className="flex justify-end gap-3">
                  <Link
                    href={`/admin/posts/${encodeURIComponent(post.slug)}/edit`}
                    className="text-xs font-semibold text-mars-accent hover:underline"
                  >
                    Изменить
                  </Link>
                  <button
                    type="button"
                    disabled={busy}
                    onClick={async () => {
                      if (
                        !confirm(
                          `Удалить материал «${post.slug}» из облака? Данные из кода репозитория не затрагиваются.`
                        )
                      ) {
                        return;
                      }
                      await deleteSlugs([post.slug]);
                    }}
                    className="text-xs font-semibold text-red-400 hover:text-red-300 disabled:opacity-50"
                  >
                    Удалить
                  </button>
                </div>
              </td>
            </tr>
          ))}
          {rows.length === 0 ? (
            <tr>
              <td className="px-4 py-6 text-sm text-slate-400" colSpan={5}>
                Нет облачных материалов для редактирования.
              </td>
            </tr>
          ) : null}
        </tbody>
      </table>
    </div>
  );
}
