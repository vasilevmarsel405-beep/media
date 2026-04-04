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
      className="pixel-card--hero group/card relative w-full max-sm:aspect-[1.15/1] max-sm:min-h-[min(92vw,420px)] sm:max-lg:aspect-[1.88/1] lg:aspect-[2.15/1] lg:min-h-0"
    >
      {children}
    </PixelCard>
  );
}
