import Image from "next/image";
import Link from "next/link";
import { rubrics } from "@/lib/content";
import { cn } from "@/lib/cn";

function rubricCellClass(i: number) {
  if (i === 0) {
    return "sm:col-span-2 lg:col-span-7 lg:row-span-2 lg:row-start-1 lg:col-start-1";
  }
  if (i === 1) {
    return "lg:col-span-5 lg:row-start-1 lg:col-start-8";
  }
  if (i === 2) {
    return "lg:col-span-5 lg:row-start-2 lg:col-start-8";
  }
  if (i >= 3 && i <= 5) {
    return "lg:col-span-4 lg:row-start-3";
  }
  return "lg:col-span-4 lg:row-start-4";
}

export default function RubrikiPage() {
  return (
    <div className="bg-[#fafafa]">
      <div className="mx-auto max-w-[1400px] px-4 py-12 sm:px-6 lg:px-10">
        <div className="max-w-2xl">
          <p className="text-[11px] font-black uppercase tracking-[0.26em] text-slate-400">Навигация</p>
          <h1 className="font-display mt-3 text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">Рубрики и темы</h1>
          <p className="mt-5 text-lg leading-relaxed text-slate-600">
            Навигация по интересам: политика, бизнес, технологии, культура и другие направления редакции.
          </p>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-12 lg:gap-5">
          {rubrics.map((r, i) => {
            const hero = i === 0;
            return (
              <Link
                key={r.slug}
                href={`/rubriki/${r.slug}`}
                className={cn(
                  "group relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg",
                  rubricCellClass(i)
                )}
              >
                <div
                  className={cn(
                    "relative w-full overflow-hidden",
                    hero ? "aspect-[16/11] min-h-[260px] lg:min-h-0 lg:h-full lg:min-h-[360px]" : "aspect-[16/10] min-h-[200px]"
                  )}
                >
                  <Image
                    src={r.cover}
                    alt=""
                    fill
                    className="object-cover transition duration-700 ease-out group-hover:scale-[1.05]"
                    sizes={hero ? "(max-width:1024px) 100vw, 58vw" : "(max-width:1024px) 100vw, 33vw"}
                  />
                  <div
                    className={cn(
                      "absolute inset-0 bg-gradient-to-t from-black/82 via-black/30 to-transparent",
                      hero && "via-black/40"
                    )}
                  />
                  <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6 lg:p-8">
                    <h2
                      className={cn(
                        "font-display font-bold text-white drop-shadow",
                        hero ? "text-3xl sm:text-4xl lg:text-[2.75rem] lg:leading-tight" : "text-xl sm:text-2xl"
                      )}
                    >
                      {r.name}
                    </h2>
                    <p
                      className={cn(
                        "mt-2 leading-relaxed text-white/88",
                        hero ? "mt-4 line-clamp-4 max-w-2xl text-base sm:text-lg" : "line-clamp-2 text-sm"
                      )}
                    >
                      {r.description}
                    </p>
                    <span className="mt-4 inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-white">
                      Открыть рубрику
                      <span aria-hidden className="transition group-hover:translate-x-1">
                        →
                      </span>
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
