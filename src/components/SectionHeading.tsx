import Link from "next/link";
import { cn } from "@/lib/utils";

export function SectionHeading({
  title,
  subtitle,
  href,
  actionLabel = "Все материалы",
  className,
  variant = "light",
}: {
  title: string;
  subtitle?: string;
  href?: string;
  actionLabel?: string;
  className?: string;
  variant?: "light" | "dark";
}) {
  const h2 =
    variant === "dark"
      ? "font-display text-2xl font-semibold tracking-tight text-white sm:text-3xl"
      : "font-display text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl";
  const sub =
    variant === "dark" ? "mt-1 max-w-2xl text-sm text-white/65" : "mt-1 max-w-2xl text-sm text-slate-600";
  const link =
    variant === "dark"
      ? "inline-flex min-h-10 shrink-0 items-center text-sm font-semibold text-blue-200 hover:text-white focus-ring rounded-md"
      : "inline-flex min-h-10 shrink-0 items-center text-sm font-semibold text-mars-blue hover:text-mars-accent focus-ring rounded-md";

  return (
    <div className={cn("mb-8 flex flex-wrap items-end justify-between gap-4", className)}>
      <div className="min-w-0 flex-1">
        <h2 className={h2}>{title}</h2>
        {subtitle ? <p className={sub}>{subtitle}</p> : null}
      </div>
      {href ? (
        <Link href={href} className={link}>
          {actionLabel} →
        </Link>
      ) : null}
    </div>
  );
}
