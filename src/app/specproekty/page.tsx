import Image from "next/image";
import Link from "next/link";
import { specialProjects } from "@/lib/content";
import { cn } from "@/lib/cn";

export const revalidate = 60;

export default function SpecproektyPage() {
  return (
    <div className="bg-[#f7f6f4]">
      <div className="mx-auto max-w-[1200px] px-4 py-14 sm:px-6 lg:px-8">
        <div className="border-l-4 border-mars-accent pl-6 sm:pl-8">
          <p className="text-[11px] font-black uppercase tracking-[0.28em] text-mars-accent/90">Серии и расследования</p>
          <h1 className="font-display mt-3 text-4xl font-bold tracking-tight text-slate-900 sm:text-[2.75rem]">Спецпроекты</h1>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-slate-600">
            Большие темы, сезонные серии и мультимедийные истории с собственной визуальной логикой.
          </p>
        </div>

        <ol className="mt-16 list-none space-y-16">
          {specialProjects.map((s, i) => (
            <li key={s.slug}>
              <Link
                href={`/specproekty/${s.slug}`}
                className={cn(
                  "group grid gap-0 overflow-hidden rounded-2xl bg-white shadow-[0_2px_24px_-12px_rgb(15_23_42/0.12)] ring-1 ring-slate-200/80 transition hover:shadow-[0_20px_50px_-24px_rgb(15_23_42/0.2)] lg:grid-cols-2",
                  i % 2 === 1 && "lg:[direction:rtl] lg:[&>*]:[direction:ltr]"
                )}
              >
                <div className="relative aspect-[16/10] min-h-[240px] lg:aspect-auto lg:min-h-[320px]">
                  <Image
                    src={s.cover}
                    alt=""
                    fill
                    className="object-cover transition duration-700 group-hover:scale-[1.02]"
                    sizes="(max-width:1024px) 100vw, 50vw"
                  />
                  <div className="absolute left-4 top-4 flex h-12 w-12 items-center justify-center rounded-full bg-white/95 font-mono text-sm font-bold text-slate-900 shadow-md tabular-nums ring-1 ring-black/5">
                    {String(i + 1).padStart(2, "0")}
                  </div>
                </div>
                <div className="flex flex-col justify-center p-8 sm:p-10 lg:p-12">
                  <p className="text-xs font-black uppercase tracking-[0.2em] text-mars-accent">{s.dek}</p>
                  <h2 className="font-display mt-4 text-3xl font-bold leading-tight text-slate-900 sm:text-4xl">{s.title}</h2>
                  <p className="mt-5 text-lg leading-relaxed text-slate-600">{s.lead}</p>
                  <span className="mt-10 inline-flex items-center gap-2 text-sm font-bold text-mars-blue">
                    Перейти к проекту
                    <span aria-hidden className="transition group-hover:translate-x-1.5">
                      →
                    </span>
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
