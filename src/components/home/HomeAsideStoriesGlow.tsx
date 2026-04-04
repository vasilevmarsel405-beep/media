"use client";

import { HomeSectionBorderGlow } from "./HomeSectionBorderGlow";

type Props = { children: React.ReactNode };

/** Блок «Другие сюжеты» — тот же BorderGlow, что и у крупных секций главной */
export function HomeAsideStoriesGlow({ children }: Props) {
  return <HomeSectionBorderGlow>{children}</HomeSectionBorderGlow>;
}
