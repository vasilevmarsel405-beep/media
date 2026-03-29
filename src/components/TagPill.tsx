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
        "inline-flex items-center rounded-xl bg-mars-blue-soft px-3 py-1 text-xs font-semibold text-mars-blue ring-1 ring-mars-blue/15 hover:bg-[#e0e5ff] focus-ring",
        className
      )}
    >
      {children}
    </Link>
  );
}
