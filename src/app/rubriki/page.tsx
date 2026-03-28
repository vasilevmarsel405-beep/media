import Image from "next/image";
import Link from "next/link";
import { SectionHeading } from "@/components/SectionHeading";
import { rubrics } from "@/lib/content";

export default function RubrikiPage() {
  return (
    <div className="mx-auto max-w-[1400px] px-4 py-12 sm:px-6 lg:px-10">
      <SectionHeading title="Рубрики и темы" />
      <p className="-mt-4 mb-10 max-w-2xl text-slate-600">
        Навигация по интересам: политика, бизнес, технологии, культура и другие направления редакции.
      </p>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {rubrics.map((r) => (
          <Link
            key={r.slug}
            href={`/rubriki/${r.slug}`}
            className="group overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition hover:shadow-md"
          >
            <div className="relative aspect-[16/9]">
              <Image
                src={r.cover}
                alt=""
                fill
                className="object-cover transition duration-500 group-hover:scale-[1.03]"
                sizes="400px"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
              <h2 className="absolute bottom-5 left-5 font-display text-2xl font-semibold text-white">{r.name}</h2>
            </div>
            <p className="p-6 text-slate-600 leading-relaxed">{r.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
