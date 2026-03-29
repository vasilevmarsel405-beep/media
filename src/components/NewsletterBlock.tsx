"use client";

import BorderGlow from "@/components/BorderGlow";
import { newsletterCopy } from "@/lib/copy";
import { cn } from "@/lib/cn";
import { CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { useId, useState } from "react";

function NewsletterInner({
  sent,
  wasDuplicate,
  setSent,
  emailId,
}: {
  sent: boolean;
  wasDuplicate: boolean;
  setSent: (v: boolean, dup?: boolean) => void;
  emailId: string;
}) {
  if (sent) {
    return (
      <div className="text-center sm:text-left">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500/15 text-emerald-600 ring-1 ring-emerald-500/25 sm:mx-0">
          <CheckCircle2 className="h-8 w-8" strokeWidth={2} aria-hidden />
        </div>
        <h2 className="font-display mt-5 text-2xl font-semibold tracking-tight text-slate-900">
          {newsletterCopy.successTitle}
        </h2>
        <p className="mx-auto mt-3 max-w-lg text-slate-600 leading-relaxed sm:mx-0">
          {wasDuplicate ? newsletterCopy.successBodyDuplicate : newsletterCopy.successBody}
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:justify-start">
          <Link
            href="/"
            className="focus-ring inline-flex min-h-11 items-center justify-center rounded-xl bg-mars-accent px-6 text-sm font-semibold text-white shadow-[0_8px_24px_-8px_rgb(196_0_28/0.55)] transition hover:bg-mars-accent-hover"
          >
            {newsletterCopy.successCtaHome}
          </Link>
          <Link
            href="/novosti"
            className="focus-ring inline-flex min-h-11 items-center justify-center rounded-xl border border-slate-200 bg-white px-6 text-sm font-semibold text-slate-800 shadow-sm transition hover:border-slate-300 hover:bg-slate-50"
          >
            {newsletterCopy.successCtaNovosti}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <p className="text-xs font-bold uppercase tracking-widest text-mars-accent">{newsletterCopy.eyebrow}</p>
      <h2 className="font-display mt-2 text-xl font-semibold text-slate-900 sm:text-2xl">{newsletterCopy.title}</h2>
      <p className="mt-2 max-w-xl text-slate-600 leading-relaxed">{newsletterCopy.body}</p>
      <div aria-live="polite" className="sr-only" />
      <NewsletterForm emailId={emailId} setSent={setSent} />
      <p className="mt-3 text-xs text-slate-500 leading-relaxed">
        {newsletterCopy.privacyLead}{" "}
        <Link
          href="/politika-konfidencialnosti"
          className="font-medium text-slate-700 underline underline-offset-2 hover:text-slate-900"
        >
          {newsletterCopy.privacyLink}
        </Link>
        {" · "}
        <Link href="/politika-faylov-cookie" className="font-medium text-slate-700 underline underline-offset-2 hover:text-slate-900">
          файлы cookie
        </Link>
        .
      </p>
    </>
  );
}

function NewsletterForm({
  emailId,
  setSent,
}: {
  emailId: string;
  setSent: (v: boolean, dup?: boolean) => void;
}) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  return (
    <form
      className="mt-6 flex flex-col gap-3"
      onSubmit={async (e) => {
        e.preventDefault();
        setError(null);
        const form = e.currentTarget;
        const email = (new FormData(form).get("email") as string)?.trim();
        if (!email) return;
        setBusy(true);
        try {
          const res = await fetch("/api/newsletter", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email }),
          });
          const data = (await res.json().catch(() => ({}))) as { ok?: boolean; duplicate?: boolean; error?: string };
          if (!res.ok || !data.ok) {
            setError(data.error ?? "Не удалось отправить. Попробуйте позже.");
            setBusy(false);
            return;
          }
          setSent(true, Boolean(data.duplicate));
          form.reset();
        } catch {
          setError("Сеть недоступна. Попробуйте позже.");
        } finally {
          setBusy(false);
        }
      }}
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-stretch">
        <label htmlFor={emailId} className="sr-only">
          Email
        </label>
        <input
          id={emailId}
          name="email"
          type="email"
          required
          autoComplete="email"
          inputMode="email"
          disabled={busy}
          placeholder={newsletterCopy.placeholder}
          className="focus-ring min-h-12 flex-1 rounded-xl border border-slate-200 bg-white px-4 text-slate-900 shadow-sm placeholder:text-slate-400 disabled:opacity-60"
        />
        <button
          type="submit"
          disabled={busy}
          className="focus-ring min-h-12 rounded-xl bg-mars-accent px-6 text-sm font-semibold text-white shadow-[0_8px_24px_-8px_rgb(196_0_28/0.45)] transition hover:bg-mars-accent-hover disabled:opacity-60"
        >
          {busy ? "Отправка…" : newsletterCopy.submit}
        </button>
      </div>
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
    </form>
  );
}

export function NewsletterBlock({ compact }: { compact?: boolean }) {
  const [sent, setSentState] = useState(false);
  const [wasDuplicate, setWasDuplicate] = useState(false);
  const uid = useId();
  const emailId = compact ? `newsletter-email-compact-${uid}` : `newsletter-email-${uid}`;

  const setSent = (v: boolean, dup?: boolean) => {
    setSentState(v);
    if (dup !== undefined) setWasDuplicate(dup);
  };

  if (compact) {
    return (
      <div
        className={cn(
          "rounded-2xl border p-6 shadow-sm transition-colors",
          sent ? "border-emerald-200/90 bg-gradient-to-br from-emerald-50/80 to-white" : "border-slate-200 bg-white"
        )}
      >
        <NewsletterInner sent={sent} wasDuplicate={wasDuplicate} setSent={setSent} emailId={emailId} />
      </div>
    );
  }

  return (
    <BorderGlow
      className={cn("rounded-2xl shadow-[0_24px_56px_-28px_rgb(15_23_42/0.22)]", sent && "opacity-[0.98]")}
      backgroundColor="#fafafa"
      borderRadius={16}
      glowRadius={36}
      edgeSensitivity={26}
      fillOpacity={sent ? 0.1 : 0.18}
      glowIntensity={sent ? 0.55 : 0.85}
      colors={["#ff6b6b", "#ff3100", "#5c6fff"]}
      glowColor="355 90 48"
    >
      <div
        className={cn(
          "rounded-2xl border p-8 shadow-sm sm:p-10",
          sent
            ? "border-emerald-200/70 bg-gradient-to-br from-emerald-50/50 via-white to-slate-50/80"
            : "border-slate-200/90 bg-gradient-to-br from-white to-slate-50/90"
        )}
      >
        <NewsletterInner sent={sent} wasDuplicate={wasDuplicate} setSent={setSent} emailId={emailId} />
      </div>
    </BorderGlow>
  );
}
