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
      ? "font-display text-2xl font-semibold tracking-tight text-white break-words sm:text-3xl"
      : "font-display text-2xl font-semibold tracking-tight text-slate-900 break-words sm:text-3xl";
  const sub =
    variant === "dark" ? "mt-1 max-w-2xl text-sm text-white/65" : "mt-1 max-w-2xl text-sm text-slate-600";
  const link =
    variant === "dark"
      ? "inline-flex min-h-10 shrink-0 items-center text-sm font-semibold text-blue-200 hover:text-white focus-ring rounded-md"
      : "inline-flex min-h-10 shrink-0 items-center text-sm font-semibold text-mars-blue hover:text-mars-accent focus-ring rounded-md";

  return (
    <div
      className={cn(
        "mb-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-end sm:justify-between sm:gap-x-6 sm:gap-y-2",
        className
      )}
    >
      <div className="min-w-0 w-full sm:flex-1">
        <h2 className={h2}>{title}</h2>
        {subtitle ? (
          <p className={cn(sub, "mt-1 w-full max-w-none text-pretty sm:max-w-2xl")}>{subtitle}</p>
        ) : null}
      </div>
      {href ? (
        <Link href={href} className={cn(link, "w-full shrink-0 sm:w-auto sm:self-end")}>
          {actionLabel} →
        </Link>
      ) : null}
    </div>
  );
}
