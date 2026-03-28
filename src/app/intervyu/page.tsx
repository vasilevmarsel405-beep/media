import { PostCard } from "@/components/cards/PostCard";
import { SectionHeading } from "@/components/SectionHeading";
import { postsByKind } from "@/lib/content";

export default function IntervyuPage() {
  const list = postsByKind("interview").sort(
    (a, b) => +new Date(b.publishedAt) - +new Date(a.publishedAt)
  );

  return (
    <div className="border-b border-violet-100 bg-gradient-to-b from-violet-50/40 to-white">
      <div className="mx-auto max-w-[1400px] px-4 py-12 sm:px-6 lg:px-10">
        <SectionHeading title="Интервью" />
        <p className="-mt-4 mb-10 max-w-2xl text-slate-600">
          Текст, видео и смешанные форматы. Акцент на голосе гостя и контексте, а не на шумных заголовках.
        </p>
        <div className="grid gap-6 lg:grid-cols-2">
          {list.map((p) => (
            <PostCard key={p.slug} post={p} />
          ))}
        </div>
      </div>
    </div>
  );
}
