import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type Props = {
  href: string;
  target?: "_blank" | "_self";
  rel?: string;
  children: ReactNode;
  className?: string;
};

/**
 * Вторичная CTA в тёмном hero: тот же ритм, что у красно-оранжевой кнопки,
 * но без сплошного градиента — лёгкая тёплая заливка и тонкая рамка в тон палитре.
 */
export function HeroGlassVideoLink({ href, target, rel, children, className }: Props) {
  return (
    <Link
      href={href}
      target={target}
      rel={rel}
      className={cn(
        "focus-ring inline-flex min-h-[44px] max-w-full shrink-0 items-center gap-2 whitespace-nowrap rounded-xl border border-[#ff5c33]/35 bg-gradient-to-r from-white/[0.07] via-[#ff3100]/[0.12] to-[#c4001c]/[0.14] px-6 py-3 text-sm font-bold text-white shadow-[0_10px_32px_-12px_rgb(196_0_28/0.35)] backdrop-blur-[2px] transition hover:border-[#ff704d]/50 hover:from-white/[0.1] hover:via-[#ff3100]/[0.16] hover:to-[#c4001c]/[0.2] hover:shadow-[0_12px_36px_-10px_rgb(196_0_28/0.42)] active:brightness-[0.97]",
        className
      )}
    >
      {children}
    </Link>
  );
}
