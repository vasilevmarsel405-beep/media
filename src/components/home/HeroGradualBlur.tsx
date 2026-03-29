"use client";

import GradualBlur from "@/components/GradualBlur";
import { useReducedMotion } from "motion/react";

export function HeroGradualBlur() {
  const reduceMotion = useReducedMotion();
  if (reduceMotion) return null;

  return (
    <div
      className="pointer-events-none absolute inset-x-0 bottom-0 z-[1] h-24 overflow-hidden max-lg:h-20"
      aria-hidden
    >
      <GradualBlur
        preset="subtle"
        position="bottom"
        height="100%"
        strength={1}
        opacity={0.38}
        divCount={4}
        curve="ease-out"
      />
    </div>
  );
}
