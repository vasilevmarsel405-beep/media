"use client";

import CounterBase from "@/components/Counter";
import { homeStatsCopy } from "@/lib/copy";
import { useReducedMotion } from "motion/react";
import type { ComponentProps } from "react";

const Counter = CounterBase as React.ComponentType<Partial<ComponentProps<typeof CounterBase>> & { value: number }>;

type Props = {
  materials: number;
  rubrics: number;
};

function StatFigure({ value, reduceMotion }: { value: number; reduceMotion: boolean | null }) {
  if (reduceMotion) {
    return <span className="font-display text-[1.75rem] font-bold leading-none tabular-nums text-slate-900">{value}</span>;
  }
  return (
    <Counter
      value={value}
      fontSize={28}
      padding={4}
      gap={3}
      borderRadius={6}
      horizontalPadding={4}
      fontWeight="700"
      textColor="rgb(15 23 42)"
      gradientHeight={8}
      gradientFrom="rgb(250 250 250)"
      gradientTo="transparent"
      containerStyle={{ display: "inline-flex", verticalAlign: "middle" }}
    />
  );
}

/** Один ряд: живые цифры из контента, без выдуманной статистики. */
export function HomeEditorialStats({ materials, rubrics }: Props) {
  const reduceMotion = useReducedMotion();

  return (
    <div className="bg-white">
      <div className="mx-auto flex max-w-[1400px] flex-wrap items-center justify-center gap-x-10 gap-y-2 px-4 py-2.5 sm:justify-end sm:px-6 lg:px-10">
        <div className="flex items-center gap-2.5">
          <StatFigure value={materials} reduceMotion={reduceMotion} />
          <span className="text-sm text-slate-600">{homeStatsCopy.materialsHint}</span>
        </div>
        <div className="hidden h-4 w-px bg-slate-200 sm:block" aria-hidden />
        <div className="flex items-center gap-2.5">
          <StatFigure value={rubrics} reduceMotion={reduceMotion} />
          <span className="text-sm text-slate-600">{homeStatsCopy.rubricsHint}</span>
        </div>
      </div>
    </div>
  );
}
