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
    <div className="relative bg-slate-950 text-white">
      <div className="relative mx-auto flex max-w-[1400px] items-center gap-2 px-4 py-2.5 sm:gap-3 sm:px-6 sm:py-2 lg:px-10">
        <span className="shrink-0 rounded-lg bg-[#c4001c] px-2 py-1 text-[10px] font-black uppercase tracking-widest text-white sm:rounded-xl">
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
                  className="whitespace-nowrap text-[11px] font-bold tracking-wide text-white/80 underline-offset-4 transition hover:text-white hover:underline sm:tracking-[0.06em]"
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
