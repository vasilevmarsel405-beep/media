import Link from "next/link";
import Image from "next/image";
import { SectionHeading } from "@/components/SectionHeading";
import { IconPlay } from "@/components/icons";
import { videoHubCopy } from "@/lib/copy";
import { postsByKind } from "@/lib/content";
import { formatDateTime } from "@/lib/format";

const categories = [
  { slug: "news", label: "Сводки дня" },
  { slug: "interview", label: "Разговоры" },
  { slug: "analysis", label: "Разборы на доске" },
  { slug: "opinion", label: "Позиция" },
  { slug: "report", label: "С улицы" },
  { slug: "special", label: "Спецэфиры" },
];

export default function VideoHubPage() {
  const videos = postsByKind("video").sort(
    (a, b) => +new Date(b.publishedAt) - +new Date(a.publishedAt)
  );

  return (
    <div className="bg-slate-950 text-white">
      <div className="border-b border-white/10 bg-gradient-to-b from-slate-900 to-slate-950">
        <div className="mx-auto max-w-[1400px] px-4 py-12 sm:px-6 lg:px-10">
          <SectionHeading title={videoHubCopy.title} variant="dark" />
          <p className="-mt-4 mb-8 max-w-2xl text-white/70">{videoHubCopy.subtitle}</p>
          <div className="flex flex-wrap gap-2">
            {categories.map((c) => (
              <span
                key={c.slug}
                className="rounded-full bg-white/10 px-3 py-1.5 text-xs font-semibold text-white/90 ring-1 ring-white/15"
              >
                {c.label}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-[1400px] px-4 py-12 sm:px-6 lg:px-10">
        <div className="grid gap-8 lg:grid-cols-3">
          {videos.map((v) => (
            <Link
              key={v.slug}
              href={`/video/${v.slug}`}
              className="group overflow-hidden rounded-2xl bg-slate-900 ring-1 ring-white/10 transition hover:ring-white/25"
            >
              <div className="relative aspect-video">
                <Image
                  src={v.image}
                  alt=""
                  fill
                  className="object-cover opacity-90 transition duration-500 group-hover:scale-[1.03]"
                  sizes="400px"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                  <span className="flex h-16 w-16 items-center justify-center rounded-full bg-white text-slate-900 shadow-xl">
                    <IconPlay className="ml-1 h-8 w-8" />
                  </span>
                </div>
                {v.durationLabel ? (
                  <span className="absolute bottom-3 right-3 rounded-md bg-black/75 px-2 py-1 text-xs font-bold text-white">
                    {v.durationLabel}
                  </span>
                ) : null}
              </div>
              <div className="p-5">
                <h2 className="font-display text-lg font-semibold leading-snug text-white group-hover:text-red-200">
                  {v.title}
                </h2>
                <p className="mt-2 line-clamp-2 text-sm text-white/65">{v.lead}</p>
                <time className="mt-3 block text-xs text-white/50" dateTime={v.publishedAt}>
                  {formatDateTime(v.publishedAt)}
                </time>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
