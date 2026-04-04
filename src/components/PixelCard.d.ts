import type { FC, HTMLAttributes, ReactNode } from "react";

export type PixelCardProps = Omit<HTMLAttributes<HTMLDivElement>, "children" | "className"> & {
  variant?: "default" | "blue" | "yellow" | "pink";
  gap?: number;
  speed?: number;
  colors?: string;
  noFocus?: boolean;
  className?: string;
  children?: ReactNode;
  /** Canvas above content; use translucent `colors` so text stays readable */
  canvasOnTop?: boolean;
};

declare const PixelCard: FC<PixelCardProps>;
export default PixelCard;
