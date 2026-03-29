"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { IconClose, IconMenu } from "@/components/icons";
import { mobileNavCopy } from "@/lib/copy";
import { cn } from "@/lib/cn";

type Item = { href: string; label: string };

export function MobileNav({ items }: { items: Item[] }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <div className="lg:hidden">
      <button
        type="button"
        className="focus-ring flex h-11 w-11 items-center justify-center rounded-xl border border-mars-line bg-white text-mars-ink hover:bg-stone-50"
        aria-expanded={open}
        aria-controls="mobile-drawer"
        onClick={() => setOpen((o) => !o)}
      >
        {open ? <IconClose className="h-5 w-5" /> : <IconMenu className="h-5 w-5" />}
        <span className="sr-only">Меню</span>
      </button>

      <div
        id="mobile-drawer"
        className={cn(
          "fixed inset-0 z-[160] bg-black/40 transition-opacity",
          open ? "opacity-100" : "pointer-events-none opacity-0"
        )}
        aria-hidden={!open}
        onClick={() => setOpen(false)}
      />
      <div
        className={cn(
          "fixed inset-y-0 right-0 z-[170] w-[min(100%,20rem)] bg-mars-surface shadow-2xl transition-transform duration-200 ease-out",
          open ? "translate-x-0" : "translate-x-full"
        )}
        role="dialog"
        aria-modal="true"
        aria-label="Мобильное меню"
      >
        <div className="flex items-center justify-between border-b border-mars-line px-4 py-4">
          <span className="font-display text-lg font-semibold text-mars-ink">Меню</span>
          <button
            type="button"
            className="focus-ring flex h-11 w-11 items-center justify-center rounded-xl hover:bg-slate-50"
            onClick={() => setOpen(false)}
            aria-label="Закрыть меню"
          >
            <IconClose className="h-5 w-5" />
          </button>
        </div>
        <nav className="flex flex-col gap-1 p-3" aria-label="Мобильная навигация">
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className="rounded-lg px-3 py-3 text-base font-medium text-mars-ink hover:bg-mars-accent-soft/50 focus-ring"
            >
              {item.label}
            </Link>
          ))}
          <Link
            href="/poisk"
            onClick={() => setOpen(false)}
            className="rounded-lg px-3 py-3 text-base font-medium text-mars-blue hover:bg-mars-blue-soft focus-ring"
          >
            Поиск
          </Link>
          <Link
            href="/podpiska"
            onClick={() => setOpen(false)}
            className="focus-ring mars-cta-block mt-2 block"
          >
            {mobileNavCopy.subscribe}
          </Link>
        </nav>
      </div>
    </div>
  );
}
