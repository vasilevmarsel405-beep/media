import Link from "next/link";
import { postHref } from "@/lib/routes";
import type { Post } from "@/lib/types";

/**
 * Бегущая строка только по материалам с флагом «срочно»; каждый заголовок ведёт на материал.
 */
export function HomeTrendingTicker({ posts }: { posts: Post[] }) {
  if (posts.length === 0) return null;

  const loop = [...posts, ...posts];

  return (
    <div className="relative border-b border-slate-900/80 bg-slate-950 text-white">
      <div className="relative mx-auto flex max-w-[1400px] items-center gap-2 px-3 py-2 sm:gap-2.5 sm:px-5 sm:py-1.5 lg:px-10">
        <span className="shrink-0 rounded-md bg-[#c4001c] px-1.5 py-0.5 text-[10px] font-black uppercase tracking-[0.16em] text-white sm:rounded-lg sm:px-2 sm:py-1 sm:text-[11px]">
          Срочно
        </span>
        <div className="mars-ticker-viewport min-h-0 min-w-0 flex-1 overflow-hidden mask-linear-fade">
          <div className="mars-marquee inline-flex w-max max-w-none flex-nowrap items-center gap-8 pr-8 sm:gap-10 sm:pr-10">
            {loop.map((p, i) => (
              <span
                key={`${p.slug}-${i}`}
                className="inline-flex shrink-0 items-center gap-8 sm:gap-10"
              >
                <Link
                  href={postHref(p)}
                  className="whitespace-nowrap text-[11px] font-semibold tracking-[0.04em] text-white/88 underline-offset-4 transition hover:text-white hover:underline sm:text-[12px] sm:tracking-[0.05em]"
                >
                  {p.title}
                </Link>
                <span className="text-[#ff3100]" aria-hidden>
                  ·
                </span>
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
