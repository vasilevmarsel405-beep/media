import Image from "next/image";
import Link from "next/link";
import { SectionHeading } from "@/components/SectionHeading";
import { specialProjects } from "@/lib/content";

export default function SpecproektyPage() {
  return (
    <div className="mx-auto max-w-[1400px] px-4 py-12 sm:px-6 lg:px-10">
      <SectionHeading title="Спецпроекты" />
      <p className="-mt-4 mb-10 max-w-2xl text-slate-600">
        Большие темы, сезонные серии и мультимедийные истории с собственной визуальной логикой.
      </p>
      <div className="flex flex-col gap-16">
        {specialProjects.map((s) => (
          <Link
            key={s.slug}
            href={`/specproekty/${s.slug}`}
            className="group grid overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm transition hover:shadow-lg lg:grid-cols-[1.2fr_1fr]"
          >
            <div className="relative min-h-[280px]">
              <Image src={s.cover} alt="" fill className="object-cover transition duration-700 group-hover:scale-[1.02]" sizes="700px" />
            </div>
            <div className="flex flex-col justify-center p-10 lg:p-14">
              <p className="text-xs font-bold uppercase tracking-wider text-red-600">{s.dek}</p>
              <h2 className="font-display mt-3 text-3xl font-semibold text-slate-900 sm:text-4xl">{s.title}</h2>
              <p className="mt-4 text-lg text-slate-600 leading-relaxed">{s.lead}</p>
              <span className="mt-8 inline-flex text-sm font-semibold text-sky-700">Перейти к проекту →</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
