import Link from "next/link";
import { cn } from "@/lib/cn";

export function TagPill({
  href,
  children,
  className,
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "inline-flex items-center rounded-full bg-red-50 px-3 py-1 text-xs font-semibold text-red-700 ring-1 ring-red-100 hover:bg-red-100 focus-ring",
        className
      )}
    >
      {children}
    </Link>
  );
}
