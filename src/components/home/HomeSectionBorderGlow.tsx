"use client";

import BorderGlow from "@/components/BorderGlow";
import { cn } from "@/lib/cn";

const VARIANT = {
  default: {
    bg: "#ffffff",
    colors: ["#ff3100b3", "#c4001c99", "#4f6bed99"],
    glowColor: "18 95 58",
    glowClass: "border-glow-mars-aside",
  },
  warm: {
    bg: "#fffbf9",
    colors: ["#ff3100c4", "#e11d4899", "#fb923c88"],
    glowColor: "16 92 58",
    glowClass: "border-glow-mars-aside border-glow-mars-warm",
  },
  blue: {
    bg: "#f8fbff",
    colors: ["#3b7cffaa", "#38bdf999", "#ff310055"],
    glowColor: "224 78 58",
    glowClass: "border-glow-mars-aside border-glow-mars-blue",
  },
  dark: {
    bg: "#111116",
    colors: ["#ff4d2ebb", "#ff310099", "#8b9bff88"],
    glowColor: "12 88 52",
    glowClass: "border-glow-mars-dark",
  },
} as const;

export type HomeSectionGlowVariant = keyof typeof VARIANT;

type Props = {
  children: React.ReactNode;
  variant?: HomeSectionGlowVariant;
  className?: string;
  innerClassName?: string;
};

export function HomeSectionBorderGlow({
  children,
  variant = "default",
  className,
  innerClassName,
}: Props) {
  const v = VARIANT[variant];
  return (
    <BorderGlow
      className={cn("w-full max-w-full", v.glowClass, className)}
      backgroundColor={v.bg}
      borderRadius={16}
      glowRadius={32}
      glowIntensity={0.9}
      edgeSensitivity={26}
      coneSpread={24}
      fillOpacity={variant === "dark" ? 0.22 : 0.28}
      glowColor={v.glowColor}
      colors={[...v.colors]}
    >
      <div className={cn("min-w-0", innerClassName ?? "p-4 sm:p-5 lg:p-6")}>{children}</div>
    </BorderGlow>
  );
}
