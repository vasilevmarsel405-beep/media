import Link from "next/link";
import Image from "next/image";
import { SectionHeading } from "@/components/SectionHeading";
import { postsByKind } from "@/lib/content";

export default function AnalitikaPage() {
  const list = postsByKind("analytics").sort(
    (a, b) => +new Date(b.publishedAt) - +new Date(a.publishedAt)
  );

  return (
    <div className="border-b border-sky-100 bg-gradient-to-b from-sky-50/50 to-white">
      <div className="mx-auto max-w-[1400px] px-4 py-12 sm:px-6 lg:px-10">
        <SectionHeading title="Аналитика" />
        <p className="-mt-4 mb-10 max-w-3xl text-lg text-slate-700 leading-relaxed">
          Разборы, сравнения, прогнозы и исследовательские материалы. Здесь приоритет — структура аргумента и проверяемые
          опорные точки.
        </p>
        <div className="grid gap-8 lg:grid-cols-2">
          {list.map((p) => (
            <Link
              key={p.slug}
              href={`/analitika/${p.slug}`}
              className="group grid overflow-hidden rounded-3xl border border-sky-100 bg-white shadow-sm transition hover:shadow-md md:grid-cols-[1.1fr_0.9fr]"
            >
              <div className="relative min-h-[200px]">
                <Image src={p.image} alt="" fill className="object-cover transition duration-500 group-hover:scale-[1.02]" sizes="500px" />
              </div>
              <div className="flex flex-col p-8">
                <span className="text-xs font-bold uppercase tracking-wider text-sky-800">Аналитический материал</span>
                <h2 className="font-display mt-3 text-2xl font-semibold text-slate-900 group-hover:text-sky-950">
                  {p.title}
                </h2>
                <p className="mt-3 flex-1 text-slate-600 leading-relaxed">{p.lead}</p>
                {p.readMin ? (
                  <p className="mt-4 text-xs font-semibold text-slate-500">{p.readMin} минут чтения</p>
                ) : null}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
