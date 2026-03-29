"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AdminLogoutButton } from "@/components/admin/AdminLogoutButton";
import { adminEntryPathname } from "@/lib/admin-entry-path";

export function AdminShell({ children }: { children: React.ReactNode }) {
  const path = usePathname() ?? "";
  const isLogin =
    path === "/admin/login" ||
    path.startsWith("/admin/login/") ||
    path === adminEntryPathname ||
    path.startsWith(`${adminEntryPathname}/`);

  if (isLogin) {
    return <div className="min-h-screen">{children}</div>;
  }

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-white/10 bg-slate-900/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-3 sm:px-6">
          <div className="flex flex-wrap items-center gap-5">
            <Link href="/admin" className="font-display text-lg font-bold tracking-tight text-white">
              КриптоМарс Медиа
              <span className="ml-2 text-xs font-normal uppercase tracking-widest text-slate-500">админ</span>
            </Link>
            <nav className="flex gap-4 text-sm text-slate-400">
              <Link href="/admin" className="transition hover:text-white">
                Обзор
              </Link>
              <Link href="/admin/posts" className="transition hover:text-white">
                Материалы
              </Link>
            </nav>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/" className="text-sm text-slate-400 transition hover:text-white">
              На сайт
            </Link>
            <AdminLogoutButton />
          </div>
        </div>
      </header>
      <div id="main" className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        {children}
      </div>
    </>
  );
}
