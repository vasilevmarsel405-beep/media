"use client";

import { kontaktyCopy } from "@/lib/copy";
import { useState } from "react";

export function ContactForm() {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  if (done) {
    return (
      <p className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900">
        Сообщение отправлено. Мы ответим на указанный email, если нужен ответ.
      </p>
    );
  }

  return (
    <form
      className="space-y-4"
      onSubmit={async (e) => {
        e.preventDefault();
        setError(null);
        const fd = new FormData(e.currentTarget);
        const email = String(fd.get("email") ?? "").trim();
        const name = String(fd.get("name") ?? "").trim();
        const message = String(fd.get("message") ?? "").trim();
        setBusy(true);
        try {
          const res = await fetch("/api/contact", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, name: name || undefined, message }),
          });
          const data = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string };
          if (!res.ok || !data.ok) {
            setError(data.error ?? "Не удалось отправить.");
            setBusy(false);
            return;
          }
          setDone(true);
          e.currentTarget.reset();
        } catch {
          setError("Сеть недоступна.");
        } finally {
          setBusy(false);
        }
      }}
    >
      <div>
        <label htmlFor="contact-name" className="text-xs font-semibold uppercase tracking-wider text-slate-500">
          Имя (необязательно)
        </label>
        <input
          id="contact-name"
          name="name"
          type="text"
          maxLength={200}
          disabled={busy}
          className="focus-ring mt-1 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 disabled:opacity-60"
        />
      </div>
      <div>
        <label htmlFor="contact-email" className="text-xs font-semibold uppercase tracking-wider text-slate-500">
          Email
        </label>
        <input
          id="contact-email"
          name="email"
          type="email"
          required
          autoComplete="email"
          disabled={busy}
          className="focus-ring mt-1 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 disabled:opacity-60"
        />
      </div>
      <div>
        <label htmlFor="contact-message" className="text-xs font-semibold uppercase tracking-wider text-slate-500">
          Сообщение
        </label>
        <textarea
          id="contact-message"
          name="message"
          required
          minLength={10}
          rows={5}
          disabled={busy}
          className="focus-ring mt-1 w-full resize-y rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 disabled:opacity-60"
        />
      </div>
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      <button
        type="submit"
        disabled={busy}
        className="focus-ring inline-flex min-h-11 items-center justify-center rounded-xl bg-mars-accent px-6 text-sm font-semibold text-white hover:bg-mars-accent-hover disabled:opacity-60"
      >
        {busy ? "Отправка…" : kontaktyCopy.submit}
      </button>
    </form>
  );
}
