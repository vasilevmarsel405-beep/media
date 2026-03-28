import Link from "next/link";
import { cn } from "@/lib/cn";

export type Crumb = { href: string; label: string };

export function Breadcrumbs({
  items,
  tone = "light",
}: {
  items: Crumb[];
  tone?: "light" | "dark";
}) {
  const muted = tone === "dark" ? "text-white/60" : "text-slate-500";
  const sep = tone === "dark" ? "text-white/30" : "text-slate-300";
  const current = tone === "dark" ? "text-white" : "text-slate-800";
  const link = tone === "dark" ? "text-white/75 hover:text-white" : "hover:text-slate-900";

  return (
    <nav aria-label="Хлебные крошки" className={cn("text-sm", muted)}>
      <ol className="flex flex-wrap items-center gap-2">
        {items.map((c, i) => (
          <li key={c.href} className="flex items-center gap-2">
            {i > 0 ? (
              <span aria-hidden className={sep}>
                /
              </span>
            ) : null}
            {i === items.length - 1 ? (
              <span className={cn("font-medium", current)}>{c.label}</span>
            ) : (
              <Link href={c.href} className={cn("focus-ring rounded", link)}>
                {c.label}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
