"use client";

import PixelCard from "@/components/PixelCard";

type Props = { children: React.ReactNode };

/** Обёртка главного hero: PixelCard (React Bits) с лаконичным брендовым шиммером по наведению */
export function HomeHeroPixelCard({ children }: Props) {
  return (
    <PixelCard
      canvasOnTop
      gap={12}
      speed={34}
      colors="#ff310088,#c4001c72,#ffffff5c"
      noFocus
      className="pixel-card--hero group/card relative w-full max-sm:aspect-[1.2/1] sm:max-lg:aspect-[1.88/1] lg:aspect-auto lg:min-h-[540px]"
    >
      {children}
    </PixelCard>
  );
}
