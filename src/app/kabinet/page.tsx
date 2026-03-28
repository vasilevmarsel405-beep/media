"use client";

import { useState } from "react";
import Link from "next/link";
import { kabinetCopy } from "@/lib/copy";

const tabs = [
  { id: "profile" as const, label: kabinetCopy.tabs.profile },
  { id: "saved" as const, label: kabinetCopy.tabs.saved },
  { id: "history" as const, label: kabinetCopy.tabs.history },
  { id: "prefs" as const, label: kabinetCopy.tabs.prefs },
];

export default function KabinetPage() {
  const [tab, setTab] = useState<(typeof tabs)[number]["id"]>("profile");

  return (
    <div className="mx-auto max-w-[900px] px-4 py-14 sm:px-6 lg:px-10">
      <h1 className="font-display text-4xl font-semibold text-slate-900">{kabinetCopy.title}</h1>
      <p className="mt-2 text-slate-600">{kabinetCopy.lead}</p>

      <div className="mt-8 flex flex-wrap gap-2 border-b border-slate-200 pb-4">
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={`focus-ring rounded-full px-4 py-2 text-sm font-semibold ${
              tab === t.id ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        {tab === "profile" ? (
          <div className="space-y-4">
            <p className="text-slate-700">{kabinetCopy.profileBody}</p>
            <button type="button" className="rounded-full bg-red-600 px-5 py-2.5 text-sm font-semibold text-white">
              {kabinetCopy.saveDemo}
            </button>
          </div>
        ) : null}
        {tab === "saved" ? <p className="text-slate-600">{kabinetCopy.savedBody}</p> : null}
        {tab === "history" ? <p className="text-slate-600">{kabinetCopy.historyBody}</p> : null}
        {tab === "prefs" ? <p className="text-slate-600">{kabinetCopy.prefsBody}</p> : null}
      </div>

      <p className="mt-8 text-sm text-slate-500">
        {kabinetCopy.noAccount}{" "}
        <Link href="/podpiska" className="font-semibold text-sky-700 hover:underline">
          {kabinetCopy.toSubscribe}
        </Link>
      </p>
    </div>
  );
}
