"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

export function LoginClient() {
  const router = useRouter();
  const sp = useSearchParams();
  const nocfg = sp.get("nocfg") === "1";
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  return (
    <div className="mx-auto max-w-md px-4 py-16">
      <h1 className="font-display text-2xl font-bold text-white">Вход в админ-панель</h1>
      <p className="mt-2 text-sm text-slate-400">
        Вход только по скрытой ссылке на сайте. Управление материалами в облаке и аналитика; статические материалы из
        кода здесь не редактируются.
      </p>

      {nocfg ? (
        <div className="mt-6 rounded-xl border border-amber-500/40 bg-amber-500/10 px-4 py-3 text-sm text-amber-100">
          В production задайте <code className="rounded bg-black/30 px-1">ADMIN_PASSWORD</code> и{" "}
          <code className="rounded bg-black/30 px-1">ADMIN_SESSION_SECRET</code> (не короче 16 символов). В{" "}
          <code className="rounded bg-black/30 px-1">npm run dev</code> без .env используются временные значения для
          локальной работы.
        </div>
      ) : null}

      <form
        className="mt-8 space-y-4"
        onSubmit={async (e) => {
          e.preventDefault();
          setError(null);
          setBusy(true);
          try {
            const res = await fetch("/api/admin/login", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ password }),
            });
            const data = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string };
            if (!res.ok) {
              setError(data.error ?? "Ошибка входа");
              setBusy(false);
              return;
            }
            router.push("/admin");
            router.refresh();
          } catch {
            setError("Сеть недоступна");
            setBusy(false);
          }
        }}
      >
        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500">Пароль</label>
        <input
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="focus-ring mt-1 w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-white placeholder:text-slate-600"
          placeholder="••••••••"
          required
        />
        {error ? <p className="text-sm text-red-400">{error}</p> : null}
        <button
          type="submit"
          disabled={busy}
          className="w-full rounded-xl bg-mars-accent py-3 text-sm font-bold text-white transition hover:bg-mars-accent-hover disabled:opacity-60"
        >
          {busy ? "Вход…" : "Войти"}
        </button>
      </form>

      <p className="mt-10 text-center text-sm text-slate-500">
        <Link href="/" className="text-slate-400 hover:text-white">
          ← На главную
        </Link>
      </p>
    </div>
  );
}
