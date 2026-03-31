"use client";

import { useState } from "react";
import type { Rubric } from "@/lib/types";

const inCls =
  "w-full rounded-xl border border-white/10 bg-slate-900/60 px-4 py-2.5 text-sm text-white placeholder:text-slate-600 disabled:opacity-55 focus:outline-none focus:ring-2 focus:ring-mars-accent/45";

export function AdminRubricsEditor({ initialItems }: { initialItems: Rubric[] }) {
  const [items, setItems] = useState<Rubric[]>(initialItems);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [ok, setOk] = useState<string | null>(null);

  const uploadFor = async (slug: string, file: File) => {
    const fd = new FormData();
    fd.append("file", file);
    const res = await fetch("/api/admin/upload-cover", { method: "POST", body: fd });
    const data = (await res.json().catch(() => ({}))) as { error?: string; url?: string };
    if (!res.ok || !data.url) throw new Error(data.error ?? "Ошибка загрузки");
    setItems((prev) => prev.map((r) => (r.slug === slug ? { ...r, cover: data.url! } : r)));
  };

  return (
    <div className="space-y-5">
      {error ? <p className="text-sm text-red-400">{error}</p> : null}
      {ok ? <p className="text-sm text-emerald-400">{ok}</p> : null}
      <div className="grid gap-5 md:grid-cols-2">
        {items.map((r) => (
          <article key={r.slug} className="rounded-2xl border border-white/10 bg-slate-900/40 p-4">
            <p className="mb-2 text-xs uppercase tracking-wider text-slate-500">{r.slug}</p>
            <div className="relative mb-3 aspect-[16/9] overflow-hidden rounded-xl border border-white/10 bg-slate-900">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={r.cover} alt={r.name} className="h-full w-full object-cover" />
            </div>
            <div className="space-y-3">
              <input
                className={inCls}
                value={r.name}
                onChange={(e) =>
                  setItems((prev) => prev.map((x) => (x.slug === r.slug ? { ...x, name: e.target.value } : x)))
                }
                placeholder="Название"
              />
              <textarea
                className={inCls}
                rows={3}
                value={r.description}
                onChange={(e) =>
                  setItems((prev) => prev.map((x) => (x.slug === r.slug ? { ...x, description: e.target.value } : x)))
                }
                placeholder="Описание"
              />
              <input
                className={inCls}
                value={r.cover}
                onChange={(e) =>
                  setItems((prev) => prev.map((x) => (x.slug === r.slug ? { ...x, cover: e.target.value } : x)))
                }
                placeholder="URL фото"
              />
              <label className="inline-flex cursor-pointer items-center rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-xs font-semibold text-slate-200 hover:bg-white/10">
                Загрузить фото
                <input
                  type="file"
                  className="hidden"
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  onChange={async (e) => {
                    const f = e.target.files?.[0];
                    e.target.value = "";
                    if (!f) return;
                    setError(null);
                    try {
                      await uploadFor(r.slug, f);
                    } catch (err) {
                      setError(err instanceof Error ? err.message : "Ошибка загрузки");
                    }
                  }}
                />
              </label>
            </div>
          </article>
        ))}
      </div>
      <button
        type="button"
        disabled={busy}
        onClick={async () => {
          setBusy(true);
          setError(null);
          setOk(null);
          try {
            const res = await fetch("/api/admin/rubrics", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ items }),
            });
            const data = (await res.json().catch(() => ({}))) as { error?: string; items?: Rubric[] };
            if (!res.ok || !data.items) {
              setError(data.error ?? "Ошибка сохранения");
              setBusy(false);
              return;
            }
            setItems(data.items);
            setOk("Рубрики сохранены");
          } catch {
            setError("Ошибка сети");
          }
          setBusy(false);
        }}
        className="rounded-xl bg-mars-accent px-5 py-2.5 text-sm font-bold text-white hover:bg-mars-accent-hover disabled:opacity-60"
      >
        {busy ? "Сохранение…" : "Сохранить рубрики"}
      </button>
    </div>
  );
}

