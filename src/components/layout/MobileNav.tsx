"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { IconClose, IconMenu } from "@/components/icons";
import { mobileNavCopy } from "@/lib/copy";
import { cn } from "@/lib/cn";

type Item = { href: string; label: string };

export function MobileNav({ items }: { items: Item[] }) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

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

  const drawer =
    mounted &&
    createPortal(
      <>
        <div
          id="mobile-drawer-backdrop"
          className={cn(
            "fixed inset-0 bg-black/50 transition-opacity lg:hidden",
            open ? "z-[500] opacity-100" : "pointer-events-none z-[500] opacity-0"
          )}
          aria-hidden={!open}
          onClick={() => setOpen(false)}
        />
        <div
          className={cn(
            "fixed inset-y-0 right-0 flex w-[min(100%,20rem)] max-w-[100vw] flex-col bg-white shadow-2xl ring-1 ring-black/10 transition-transform duration-200 ease-out lg:hidden",
            open ? "z-[510] translate-x-0" : "pointer-events-none z-[510] translate-x-full"
          )}
          role="dialog"
          aria-modal="true"
          aria-label="Мобильное меню"
          aria-hidden={!open}
        >
          <div className="flex shrink-0 items-center justify-between border-b border-mars-line bg-white px-4 py-4">
            <span className="font-display text-lg font-semibold text-mars-ink">Меню</span>
            <button
              type="button"
              className="focus-ring flex h-11 w-11 items-center justify-center rounded-xl hover:bg-slate-100"
              onClick={() => setOpen(false)}
              aria-label="Закрыть меню"
            >
              <IconClose className="h-5 w-5" />
            </button>
          </div>
          <nav
            className="flex flex-1 flex-col gap-1 overflow-y-auto bg-white p-3"
            aria-label="Мобильная навигация"
          >
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
              href="/podpiska"
              onClick={() => setOpen(false)}
              className="focus-ring mars-cta-block mt-2 block"
            >
              {mobileNavCopy.subscribe}
            </Link>
          </nav>
        </div>
      </>,
      document.body
    );

  return (
    <div className="lg:hidden">
      <button
        type="button"
        className="focus-ring flex h-11 w-11 items-center justify-center rounded-xl border border-mars-line bg-white text-mars-ink hover:bg-stone-50"
        aria-expanded={open}
        aria-controls="mobile-drawer-backdrop"
        onClick={() => setOpen((o) => !o)}
      >
        {open ? <IconClose className="h-5 w-5" /> : <IconMenu className="h-5 w-5" />}
        <span className="sr-only">Меню</span>
      </button>
      {drawer}
    </div>
  );
}
