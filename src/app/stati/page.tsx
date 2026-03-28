import { PostCard } from "@/components/cards/PostCard";
import { SectionHeading } from "@/components/SectionHeading";
import { postsByKind } from "@/lib/content";

export default function StatiPage() {
  const list = postsByKind("article").sort(
    (a, b) => +new Date(b.publishedAt) - +new Date(a.publishedAt)
  );

  return (
    <div className="mx-auto max-w-[1400px] px-4 py-10 sm:px-6 lg:px-10">
      <SectionHeading title="Статьи" />
      <p className="-mt-4 mb-10 max-w-2xl text-lg text-slate-600 leading-relaxed">
        Спокойный формат для вдумчивого чтения: колонки, обзоры и объясняющие материалы с сильной типографикой.
      </p>
      <div className="grid gap-8 lg:grid-cols-2">
        {list.map((p) => (
          <PostCard key={p.slug} post={p} />
        ))}
      </div>
    </div>
  );
}
