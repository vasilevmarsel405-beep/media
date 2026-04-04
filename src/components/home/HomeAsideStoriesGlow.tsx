"use client";

import BorderGlow from "@/components/BorderGlow";

type Props = { children: React.ReactNode };

/** BorderGlow (React Bits) для блока «Другие сюжеты» — лёгкая подсветка по краю от курсора */
export function HomeAsideStoriesGlow({ children }: Props) {
  return (
    <BorderGlow
      className="border-glow-mars-aside w-full max-w-full"
      backgroundColor="#ffffff"
      borderRadius={20}
      glowRadius={32}
      glowIntensity={0.9}
      edgeSensitivity={26}
      coneSpread={24}
      fillOpacity={0.28}
      glowColor="18 95 58"
      colors={["#ff3100b3", "#c4001c99", "#4f6bed99"]}
    >
      <div className="min-w-0 p-4 sm:p-5 lg:p-6">{children}</div>
    </BorderGlow>
  );
}
