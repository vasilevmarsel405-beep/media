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

  return (
    <div className="lg:hidden">
      <button
        type="button"
        className="focus-ring flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 text-slate-800 hover:bg-slate-50"
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
          "fixed inset-y-0 right-0 z-[170] w-[min(100%,20rem)] bg-white shadow-2xl transition-transform duration-200 ease-out",
          open ? "translate-x-0" : "translate-x-full"
        )}
        role="dialog"
        aria-modal="true"
        aria-label="Мобильное меню"
      >
        <div className="flex items-center justify-between border-b border-slate-100 px-4 py-4">
          <span className="font-display text-lg font-semibold">Меню</span>
          <button
            type="button"
            className="focus-ring flex h-10 w-10 items-center justify-center rounded-full hover:bg-slate-50"
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
              className="rounded-xl px-3 py-3 text-base font-medium text-slate-800 hover:bg-slate-50 focus-ring"
            >
              {item.label}
            </Link>
          ))}
          <Link
            href="/poisk"
            onClick={() => setOpen(false)}
            className="rounded-xl px-3 py-3 text-base font-medium text-sky-800 hover:bg-sky-50 focus-ring"
          >
            Поиск
          </Link>
          <Link
            href="/podpiska"
            onClick={() => setOpen(false)}
            className="mt-2 rounded-xl bg-red-600 px-3 py-3 text-center text-base font-semibold text-white hover:bg-red-700 focus-ring"
          >
            {mobileNavCopy.subscribe}
          </Link>
        </nav>
      </div>
    </div>
  );
}
