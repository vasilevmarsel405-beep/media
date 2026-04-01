"use client";

import CounterBase from "@/components/Counter";
import { IconLibrary, IconRubrics } from "@/components/icons";
import { homeStatsCopy } from "@/lib/copy";
import { useReducedMotion } from "motion/react";
import type { ComponentProps, ReactNode } from "react";

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
      gradientFrom="rgb(248 250 252)"
      gradientTo="transparent"
      containerStyle={{ display: "inline-flex", verticalAlign: "middle" }}
    />
  );
}

function StatCard({
  value,
  hint,
  icon,
  reduceMotion,
}: {
  value: number;
  hint: string;
  icon: ReactNode;
  reduceMotion: boolean | null;
}) {
  return (
    <div className="group flex min-w-[min(100%,17rem)] max-w-md flex-1 items-center gap-3.5 rounded-2xl border border-slate-200/90 bg-gradient-to-b from-white to-slate-50/40 px-4 py-3.5 shadow-[0_2px_12px_-4px_rgba(15,23,42,0.07)] ring-1 ring-black/[0.03] transition-[border-color,box-shadow] duration-200 ease-out hover:border-mars-accent/35 hover:shadow-[0_8px_24px_-8px_rgba(196,0,40,0.14)] sm:min-w-0 sm:flex-none sm:max-w-none">
      <div
        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-mars-blue-soft text-mars-blue transition-transform duration-200 ease-out group-hover:scale-[1.03] group-hover:bg-mars-accent-soft group-hover:text-mars-accent"
        aria-hidden
      >
        <div className="[&_svg]:h-[1.35rem] [&_svg]:w-[1.35rem]">{icon}</div>
      </div>
      <div className="flex min-w-0 flex-col gap-0.5">
        <StatFigure value={value} reduceMotion={reduceMotion} />
        <span className="text-xs font-medium leading-snug text-slate-600">{hint}</span>
      </div>
    </div>
  );
}

/** Один ряд: живые цифры из контента, без выдуманной статистики. */
export function HomeEditorialStats({ materials, rubrics }: Props) {
  const reduceMotion = useReducedMotion();

  return (
    <div className="relative border-b border-slate-200/80 bg-gradient-to-b from-slate-50/60 via-white to-white">
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-slate-300/60 to-transparent"
        aria-hidden
      />
      <div className="mx-auto flex max-w-[1400px] flex-wrap items-stretch justify-center gap-3 px-4 py-4 sm:justify-end sm:gap-4 sm:px-6 sm:py-4 lg:px-10">
        <StatCard value={materials} hint={homeStatsCopy.materialsHint} reduceMotion={reduceMotion} icon={<IconLibrary />} />
        <StatCard value={rubrics} hint={homeStatsCopy.rubricsHint} reduceMotion={reduceMotion} icon={<IconRubrics />} />
      </div>
    </div>
  );
}
