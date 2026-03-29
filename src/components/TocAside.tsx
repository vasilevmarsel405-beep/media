"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { TocItem } from "@/lib/types";
import { publicationCopy } from "@/lib/copy";
import { cn } from "@/lib/cn";

export function TocAside({
  items,
  tone = "default",
}: {
  items: TocItem[];
  tone?: "default" | "analytics" | "interview";
}) {
  const [active, setActive] = useState<string | null>(items[0]?.id ?? null);

  useEffect(() => {
    const els = items.map((i) => document.getElementById(i.id)).filter(Boolean) as HTMLElement[];
    if (!els.length) return;

    const obs = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]?.target?.id) setActive(visible[0].target.id);
      },
      { rootMargin: "-40% 0px -45% 0px", threshold: [0, 0.25, 0.5, 1] }
    );

    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, [items]);

  const activeBg =
    tone === "analytics"
      ? "bg-mars-blue-soft text-mars-ink"
      : tone === "interview"
        ? "bg-violet-100 text-slate-900"
        : "bg-mars-blue-soft text-mars-ink";

  return (
    <nav
      aria-label={publicationCopy.tocLabel}
      className="lg:sticky lg:top-28 rounded-2xl border border-slate-200/90 bg-gradient-to-b from-white to-slate-50/60 p-5 shadow-[0_8px_30px_-18px_rgb(15_23_42/0.12)]"
    >
      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">{publicationCopy.tocLabel}</p>
      <ul className="mt-4 space-y-1 text-sm">
        {items.map((item) => (
          <li key={item.id}>
            <Link
              href={`#${item.id}`}
              className={cn(
                "block rounded-xl px-3 py-2.5 font-medium leading-snug transition focus-ring",
                active === item.id ? activeBg : "text-slate-600 hover:bg-white hover:text-slate-900"
              )}
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
