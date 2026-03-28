"use client";

import { useState } from "react";
import { newsletterCopy } from "@/lib/copy";

export function NewsletterBlock({ compact }: { compact?: boolean }) {
  const [sent, setSent] = useState(false);

  return (
    <div
      className={
        compact
          ? "rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
          : "rounded-2xl border border-slate-200 bg-gradient-to-br from-white to-slate-50 p-8 shadow-sm"
      }
    >
      <p className="text-xs font-bold uppercase tracking-widest text-red-600">{newsletterCopy.eyebrow}</p>
      <h2 className="font-display mt-2 text-xl font-semibold text-slate-900 sm:text-2xl">{newsletterCopy.title}</h2>
      <p className="mt-2 max-w-xl text-slate-600">{newsletterCopy.body}</p>
      <form
        className="mt-6 flex flex-col gap-3 sm:flex-row"
        onSubmit={(e) => {
          e.preventDefault();
          setSent(true);
        }}
      >
        <label htmlFor="newsletter-email" className="sr-only">
          Email
        </label>
        <input
          id="newsletter-email"
          name="email"
          type="email"
          required
          placeholder={newsletterCopy.placeholder}
          className="focus-ring min-h-12 flex-1 rounded-xl border border-slate-200 bg-white px-4 text-slate-900 placeholder:text-slate-400"
        />
        <button
          type="submit"
          className="focus-ring min-h-12 rounded-xl bg-red-600 px-6 text-sm font-semibold text-white hover:bg-red-700"
        >
          {sent ? newsletterCopy.submitted : newsletterCopy.submit}
        </button>
      </form>
      <p className="mt-3 text-xs text-slate-500">
        {newsletterCopy.privacyLead}{" "}
        <a href="/politika-konfidencialnosti" className="underline hover:text-slate-800">
          {newsletterCopy.privacyLink}
        </a>
        .
      </p>
    </div>
  );
}
