"use client";

import { authors, rubrics, tags } from "@/lib/content";
import type { Post, PostKind } from "@/lib/types";
import { useRouter } from "next/navigation";
import { useMemo, useRef, useState, type ReactNode } from "react";

const inCls =
  "w-full rounded-xl border border-white/10 bg-slate-900/60 px-4 py-2.5 text-sm text-white placeholder:text-slate-600 disabled:opacity-55 focus:outline-none focus:ring-2 focus:ring-mars-accent/45";

const kinds: { value: PostKind; label: string }[] = [
  { value: "news", label: "Новость" },
  { value: "article", label: "Статья" },
  { value: "analytics", label: "Аналитика" },
  { value: "interview", label: "Интервью" },
  { value: "video", label: "Видео" },
];

function toDatetimeLocal(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return new Date().toISOString().slice(0, 16);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function fromDatetimeLocal(s: string): string {
  const d = new Date(s);
  return Number.isNaN(d.getTime()) ? new Date().toISOString() : d.toISOString();
}

export function AdminPostForm({
  mode,
  initial,
  canSave = true,
}: {
  mode: "create" | "edit";
  initial?: Post | null;
  canSave?: boolean;
}) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const defaults = useMemo(
    () => ({
      slug: initial?.slug ?? "",
      kind: (initial?.kind ?? "news") as PostKind,
      title: initial?.title ?? "",
      subtitle: initial?.subtitle ?? "",
      lead: initial?.lead ?? "",
      image: initial?.image ?? "",
      authorId: initial?.authorId ?? authors[0]?.id ?? "",
      rubricSlugs: initial?.rubricSlugs ?? [],
      tagSlugs: initial?.tagSlugs ?? [],
      publishedAt: initial?.publishedAt ? toDatetimeLocal(initial.publishedAt) : toDatetimeLocal(new Date().toISOString()),
      readMin: initial?.readMin != null ? String(initial.readMin) : "",
      youtubeId: initial?.youtubeId ?? "",
      durationLabel: initial?.durationLabel ?? "",
      urgent: initial?.urgent ?? false,
      pinned: initial?.pinned ?? false,
      seoTitle: initial?.seoTitle ?? "",
      seoDescription: initial?.seoDescription ?? "",
      canonicalUrl: initial?.canonicalUrl ?? "",
      seoKeywords: initial?.seoKeywords ?? "",
      seoNoindex: initial?.seoNoindex ?? false,
      paragraphsText: initial?.paragraphs?.length ? initial.paragraphs.join("\n\n") : "",
      guestName: initial?.guestName ?? "",
      guestBio: initial?.guestBio ?? "",
      materialType: initial?.materialType ?? "",
      homeBadge: initial?.homeBadge ?? "",
      homeCta: initial?.homeCta ?? "",
      homeHero: initial?.homeHero ?? false,
      homePick: initial?.homePick ?? false,
      homeMain: initial?.homeMain ?? false,
      homeProject: initial?.homeProject ?? false,
      homeVideoUrl: initial?.homeVideoUrl ?? "",
      homeVideoLabel: initial?.homeVideoLabel ?? "",
    }),
    [initial]
  );

  const [form, setForm] = useState(defaults);
  const [enrichBusy, setEnrichBusy] = useState(false);
  const [enrichError, setEnrichError] = useState<string | null>(null);
  const [coverUploadBusy, setCoverUploadBusy] = useState(false);
  const [coverUploadError, setCoverUploadError] = useState<string | null>(null);
  const coverFileRef = useRef<HTMLInputElement>(null);

  const toggleSlug = (field: "rubricSlugs" | "tagSlugs", slug: string) => {
    setForm((f) => {
      const arr = f[field];
      const has = arr.includes(slug);
      return {
        ...f,
        [field]: has ? arr.filter((x) => x !== slug) : [...arr, slug],
      };
    });
  };

  return (
    <form
      className="space-y-8"
      onSubmit={async (e) => {
        e.preventDefault();
        if (!canSave) return;
        setError(null);
        setBusy(true);
        const paragraphs = form.paragraphsText
          .split(/\n\s*\n/)
          .map((p) => p.trim())
          .filter(Boolean);
        const body: Record<string, unknown> = {
          slug: form.slug.trim(),
          kind: form.kind,
          title: form.title.trim(),
          lead: form.lead.trim(),
          image: form.image.trim(),
          authorId: form.authorId,
          rubricSlugs: form.rubricSlugs,
          tagSlugs: form.tagSlugs,
          publishedAt: fromDatetimeLocal(form.publishedAt),
        };
        if (paragraphs.length) body.paragraphs = paragraphs;
        if (form.subtitle.trim()) body.subtitle = form.subtitle.trim();
        if (form.readMin.trim()) {
          const n = parseInt(form.readMin, 10);
          if (!Number.isNaN(n)) body.readMin = n;
        }
        if (form.youtubeId.trim()) body.youtubeId = form.youtubeId.trim();
        if (form.durationLabel.trim()) body.durationLabel = form.durationLabel.trim();
        if (form.guestName.trim()) body.guestName = form.guestName.trim();
        if (form.guestBio.trim()) body.guestBio = form.guestBio.trim();
        if (form.materialType.trim()) body.materialType = form.materialType.trim();
        if (form.seoTitle.trim()) body.seoTitle = form.seoTitle.trim();
        if (form.seoDescription.trim()) body.seoDescription = form.seoDescription.trim();
        if (form.canonicalUrl.trim()) body.canonicalUrl = form.canonicalUrl.trim();
        if (form.seoKeywords.trim()) body.seoKeywords = form.seoKeywords.trim();
        body.seoNoindex = form.seoNoindex;
        if (form.homeBadge.trim()) body.homeBadge = form.homeBadge.trim();
        if (form.homeCta.trim()) body.homeCta = form.homeCta.trim();
        if (form.homeVideoUrl.trim()) body.homeVideoUrl = form.homeVideoUrl.trim();
        if (form.homeVideoLabel.trim()) body.homeVideoLabel = form.homeVideoLabel.trim();
        body.homeHero = form.homeHero;
        body.homePick = form.homePick;
        body.homeMain = form.homeMain;
        body.homeProject = form.homeProject;
        body.urgent = form.urgent;
        body.pinned = form.pinned;

        try {
          const res = await fetch("/api/admin/posts", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
          });
          const data = (await res.json().catch(() => ({}))) as { error?: string; slug?: string };
          if (!res.ok) {
            setError(data.error ?? "Ошибка сохранения");
            setBusy(false);
            return;
          }
          router.push("/admin/posts");
          router.refresh();
        } catch {
          setError("Сеть");
          setBusy(false);
        }
      }}
    >
      {!canSave ? (
        <div className="rounded-xl border border-amber-500/40 bg-amber-500/10 px-4 py-3 text-sm text-amber-100">
          Этот материал задан только в коде репозитория. Создайте копию с новым slug в облаке или правьте файл{" "}
          <code className="rounded bg-black/30 px-1">content.ts</code>.
        </div>
      ) : null}

      {error ? <p className="text-sm text-red-400">{error}</p> : null}

      <section className="grid gap-4 sm:grid-cols-2">
        <Field label="Slug (латиница, дефисы)">
          <input
            required
            disabled={mode === "edit" || !canSave}
            value={form.slug}
            onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
            className={inCls}
            pattern="[a-z0-9]+(-[a-z0-9]+)*"
          />
        </Field>
        <Field label="Тип">
          <select
            value={form.kind}
            disabled={!canSave}
            onChange={(e) => setForm((f) => ({ ...f, kind: e.target.value as PostKind }))}
            className={inCls}
          >
            {kinds.map((k) => (
              <option key={k.value} value={k.value}>
                {k.label}
              </option>
            ))}
          </select>
        </Field>
      </section>

      <Field label="Заголовок">
        <input
          required
          disabled={!canSave}
          value={form.title}
          onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
          className={inCls}
        />
      </Field>

      <Field label="Подзаголовок (необязательно)">
        <input
          disabled={!canSave}
          value={form.subtitle}
          onChange={(e) => setForm((f) => ({ ...f, subtitle: e.target.value }))}
          className={inCls}
        />
      </Field>

      <Field label="Лид">
        <textarea
          required
          disabled={!canSave}
          value={form.lead}
          onChange={(e) => setForm((f) => ({ ...f, lead: e.target.value }))}
          rows={3}
          className={inCls}
        />
      </Field>

      <Field label="URL обложки (картинка)">
        <input
          required
          disabled={!canSave}
          value={form.image}
          onChange={(e) => setForm((f) => ({ ...f, image: e.target.value }))}
          className={inCls}
        />
      </Field>

      <section className="grid gap-4 sm:grid-cols-2">
        <Field label="Автор">
          <select
            value={form.authorId}
            disabled={!canSave}
            onChange={(e) => setForm((f) => ({ ...f, authorId: e.target.value }))}
            className={inCls}
          >
            {authors.map((a) => (
              <option key={a.id} value={a.id}>
                {a.name}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Дата публикации">
          <input
            type="datetime-local"
            required
            disabled={!canSave}
            value={form.publishedAt}
            onChange={(e) => setForm((f) => ({ ...f, publishedAt: e.target.value }))}
            className={inCls}
          />
        </Field>
      </section>

      <section className="grid gap-4 sm:grid-cols-3">
        <Field label="Минут чтения">
          <input
            disabled={!canSave}
            value={form.readMin}
            onChange={(e) => setForm((f) => ({ ...f, readMin: e.target.value }))}
            className={inCls}
            inputMode="numeric"
          />
        </Field>
        <label className="flex items-center gap-2 pt-6 text-sm text-slate-300">
          <input
            type="checkbox"
            disabled={!canSave}
            checked={form.urgent}
            onChange={(e) => setForm((f) => ({ ...f, urgent: e.target.checked }))}
          />
          Срочно
        </label>
        <label className="flex items-center gap-2 pt-6 text-sm text-slate-300">
          <input
            type="checkbox"
            disabled={!canSave}
            checked={form.pinned}
            onChange={(e) => setForm((f) => ({ ...f, pinned: e.target.checked }))}
          />
          Закреп
        </label>
      </section>

      {form.kind === "video" ? (
        <section className="space-y-3">
          <div className="rounded-xl border border-white/10 bg-slate-900/40 px-4 py-4 sm:px-5">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Обложка — файл на сервере</p>
            <p className="mt-1 text-sm text-slate-400">
              Файл сохраняется на VPS в <code className="rounded bg-black/40 px-1 text-[11px]">.local/uploads/covers/</code> и
              подставляется в поле «URL обложки» как путь вида <code className="rounded bg-black/40 px-1 text-[11px]">/api/media/covers/…</code>.
            </p>
            <input
              ref={coverFileRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              className="hidden"
              disabled={!canSave || coverUploadBusy}
              onChange={async (e) => {
                const file = e.target.files?.[0];
                e.target.value = "";
                if (!file || !canSave) return;
                setCoverUploadError(null);
                const maxBytes = 6 * 1024 * 1024;
                if (file.size > maxBytes) {
                  setCoverUploadError("Файл больше 6 МБ — сожмите картинку или уменьшите разрешение.");
                  return;
                }
                setCoverUploadBusy(true);
                try {
                  const fd = new FormData();
                  fd.append("file", file);
                  const res = await fetch("/api/admin/upload-cover", { method: "POST", body: fd });
                  const data = (await res.json().catch(() => ({}))) as { error?: string; url?: string };
                  if (!res.ok) {
                    if (res.status === 413) {
                      setCoverUploadError(
                        "Сервер (Nginx) отклонил файл: слишком большой запрос. На VPS добавьте в конфиг Nginx client_max_body_size 20M; и перезагрузите Nginx."
                      );
                      setCoverUploadBusy(false);
                      return;
                    }
                    setCoverUploadError(data.error ?? `Не удалось загрузить файл (HTTP ${res.status})`);
                    setCoverUploadBusy(false);
                    return;
                  }
                  if (data.url) {
                    setForm((f) => ({ ...f, image: data.url! }));
                  }
                } catch {
                  setCoverUploadError("Ошибка сети");
                }
                setCoverUploadBusy(false);
              }}
            />
            <div className="mt-3 flex flex-wrap items-center gap-3">
              <button
                type="button"
                disabled={!canSave || coverUploadBusy}
                onClick={() => coverFileRef.current?.click()}
                className="rounded-xl border border-white/15 bg-slate-800/80 px-4 py-2.5 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-50"
              >
                {coverUploadBusy ? "Загрузка…" : "Загрузить обложку с компьютера"}
              </button>
              {coverUploadError ? <span className="text-sm text-red-400">{coverUploadError}</span> : null}
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="YouTube — ссылка или ID ролика">
              <input
                disabled={!canSave}
                value={form.youtubeId}
                onChange={(e) => setForm((f) => ({ ...f, youtubeId: e.target.value }))}
                className={inCls}
                placeholder="https://www.youtube.com/watch?v=… или dQw4w9WgXcQ"
              />
            </Field>
            <Field label="Длительность (подпись)">
              <input
                disabled={!canSave}
                value={form.durationLabel}
                onChange={(e) => setForm((f) => ({ ...f, durationLabel: e.target.value }))}
                className={inCls}
                placeholder="12:04"
              />
            </Field>
          </div>
          {canSave ? (
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
              <button
                type="button"
                disabled={enrichBusy}
                onClick={async () => {
                  setEnrichError(null);
                  const url = form.youtubeId.trim();
                  if (!url) {
                    setEnrichError("Сначала вставьте ссылку или ID ролика");
                    return;
                  }
                  setEnrichBusy(true);
                  try {
                    const res = await fetch("/api/admin/youtube-enrich", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ url }),
                    });
                    const data = (await res.json().catch(() => ({}))) as {
                      error?: string;
                      youtubeId?: string;
                      title?: string;
                      description?: string;
                      thumbnailUrl?: string | null;
                      durationLabel?: string | null;
                    };
                    if (!res.ok) {
                      setEnrichError(data.error ?? "Не удалось получить данные с YouTube");
                      setEnrichBusy(false);
                      return;
                    }
                    const desc = (data.description ?? "").trim();
                    const firstBlock = desc.split(/\n\s*\n/)[0]?.trim() ?? "";
                    const leadFromYt = (firstBlock || desc.slice(0, 500) || data.title || "").slice(0, 4000);
                    const seoDesc = (desc.slice(0, 320) || leadFromYt.slice(0, 320)).trim();
                    const fallbackThumb =
                      data.youtubeId && data.youtubeId.trim()
                        ? `https://i.ytimg.com/vi/${data.youtubeId.trim()}/hqdefault.jpg`
                        : "";
                    setForm((f) => ({
                      ...f,
                      youtubeId: (data.youtubeId ?? "").trim(),
                      title: (data.title ?? "").trim(),
                      lead: leadFromYt,
                      image:
                        typeof data.thumbnailUrl === "string" && data.thumbnailUrl.trim()
                          ? data.thumbnailUrl.trim()
                          : fallbackThumb || f.image,
                      durationLabel:
                        typeof data.durationLabel === "string" && data.durationLabel.trim()
                          ? data.durationLabel.trim()
                          : f.durationLabel,
                      seoTitle: (data.title ?? "").slice(0, 70),
                      seoDescription: seoDesc,
                      paragraphsText: desc,
                    }));
                  } catch {
                    setEnrichError("Ошибка сети");
                  }
                  setEnrichBusy(false);
                }}
                className="rounded-xl border border-white/15 bg-slate-800/80 px-4 py-2.5 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-50"
              >
                {enrichBusy ? "Загрузка…" : "Заполнить заголовок, лид, SEO и текст из YouTube"}
              </button>
              {enrichError ? <p className="text-sm text-red-400">{enrichError}</p> : null}
            </div>
          ) : null}
        </section>
      ) : null}

      <Field label="Текст (абзацы через пустую строку)">
        <textarea
          disabled={!canSave}
          value={form.paragraphsText}
          onChange={(e) => setForm((f) => ({ ...f, paragraphsText: e.target.value }))}
          rows={12}
          className={`${inCls} font-mono`}
        />
      </Field>

      <div className="grid gap-6 lg:grid-cols-2">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Рубрики</p>
          <div className="mt-2 flex max-h-48 flex-col gap-2 overflow-y-auto rounded-xl border border-white/10 bg-slate-900/50 p-3">
            {rubrics.map((r) => (
              <label key={r.slug} className="flex cursor-pointer items-center gap-2 text-sm text-slate-300">
                <input
                  type="checkbox"
                  disabled={!canSave}
                  checked={form.rubricSlugs.includes(r.slug)}
                  onChange={() => toggleSlug("rubricSlugs", r.slug)}
                />
                {r.name}
              </label>
            ))}
          </div>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Теги</p>
          <div className="mt-2 flex max-h-48 flex-col gap-2 overflow-y-auto rounded-xl border border-white/10 bg-slate-900/50 p-3">
            {tags.map((t) => (
              <label key={t.slug} className="flex cursor-pointer items-center gap-2 text-sm text-slate-300">
                <input
                  type="checkbox"
                  disabled={!canSave}
                  checked={form.tagSlugs.includes(t.slug)}
                  onChange={() => toggleSlug("tagSlugs", t.slug)}
                />
                {t.name}
              </label>
            ))}
          </div>
        </div>
      </div>

      <section className="grid gap-4 sm:grid-cols-2">
        <Field label="SEO title">
          <input
            disabled={!canSave}
            value={form.seoTitle}
            onChange={(e) => setForm((f) => ({ ...f, seoTitle: e.target.value }))}
            className={inCls}
          />
        </Field>
        <Field label="SEO description">
          <textarea
            disabled={!canSave}
            value={form.seoDescription}
            onChange={(e) => setForm((f) => ({ ...f, seoDescription: e.target.value }))}
            rows={2}
            className={inCls}
          />
        </Field>
      </section>

      {form.kind === "video" ? (
        <section className="grid gap-4 sm:grid-cols-2">
          <Field label="Canonical URL (опционально)">
            <input
              disabled={!canSave}
              value={form.canonicalUrl}
              onChange={(e) => setForm((f) => ({ ...f, canonicalUrl: e.target.value }))}
              className={inCls}
              placeholder="https://site.com/video/slug"
            />
          </Field>
          <Field label="SEO keywords (через запятую)">
            <input
              disabled={!canSave}
              value={form.seoKeywords}
              onChange={(e) => setForm((f) => ({ ...f, seoKeywords: e.target.value }))}
              className={inCls}
              placeholder="crypto, bitcoin, market"
            />
          </Field>
          <label className="flex items-center gap-2 text-sm text-slate-300 sm:col-span-2">
            <input
              type="checkbox"
              disabled={!canSave}
              checked={form.seoNoindex}
              onChange={(e) => setForm((f) => ({ ...f, seoNoindex: e.target.checked }))}
            />
            Не индексировать это видео (noindex)
          </label>
        </section>
      ) : null}

      <section className="grid gap-4 sm:grid-cols-2">
        <Field label="Главная: бейдж">
          <input
            disabled={!canSave}
            value={form.homeBadge}
            onChange={(e) => setForm((f) => ({ ...f, homeBadge: e.target.value }))}
            className={inCls}
          />
        </Field>
        <Field label="Главная: CTA">
          <input
            disabled={!canSave}
            value={form.homeCta}
            onChange={(e) => setForm((f) => ({ ...f, homeCta: e.target.value }))}
            className={inCls}
          />
        </Field>
        <Field label="Главная: ссылка видео-кнопки (опционально)">
          <input
            disabled={!canSave}
            value={form.homeVideoUrl}
            onChange={(e) => setForm((f) => ({ ...f, homeVideoUrl: e.target.value }))}
            className={inCls}
            placeholder="/video/slug или https://youtube.com/..."
          />
        </Field>
        <Field label="Главная: текст видео-кнопки">
          <input
            disabled={!canSave}
            value={form.homeVideoLabel}
            onChange={(e) => setForm((f) => ({ ...f, homeVideoLabel: e.target.value }))}
            className={inCls}
            placeholder="Видео-дайджест"
          />
        </Field>
        <label className="flex items-center gap-2 text-sm text-slate-300 sm:col-span-2">
          <input
            type="checkbox"
            disabled={!canSave}
            checked={form.homeHero}
            onChange={(e) => setForm((f) => ({ ...f, homeHero: e.target.checked }))}
          />
          Поставить в главный слот слева на главной
        </label>
        <label className="flex items-center gap-2 text-sm text-slate-300 sm:col-span-2">
          <input
            type="checkbox"
            disabled={!canSave}
            checked={form.homePick}
            onChange={(e) => setForm((f) => ({ ...f, homePick: e.target.checked }))}
          />
          Показывать в блоке «Выбор редакции» на главной
        </label>
        <label className="flex items-center gap-2 text-sm text-slate-300 sm:col-span-2">
          <input
            type="checkbox"
            disabled={!canSave}
            checked={form.homeMain}
            onChange={(e) => setForm((f) => ({ ...f, homeMain: e.target.checked }))}
          />
          Показывать в блоке «Главное сейчас» на главной
        </label>
        <label className="flex items-center gap-2 text-sm text-slate-300 sm:col-span-2">
          <input
            type="checkbox"
            disabled={!canSave}
            checked={form.homeProject}
            onChange={(e) => setForm((f) => ({ ...f, homeProject: e.target.checked }))}
          />
          Показывать в блоке «Спецпроекты» на главной
        </label>
      </section>

      {canSave ? (
        <div className="flex flex-wrap gap-3">
          <button
            type="submit"
            disabled={busy}
            className="rounded-xl bg-mars-accent px-6 py-3 text-sm font-bold text-white hover:bg-mars-accent-hover disabled:opacity-50"
          >
            {busy ? "Сохранение…" : mode === "create" ? "Создать" : "Сохранить"}
          </button>
        </div>
      ) : null}
    </form>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">{label}</label>
      <div className="mt-1">{children}</div>
    </div>
  );
}
