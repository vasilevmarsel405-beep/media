import type { Metadata } from "next";
import { PostCard } from "@/components/cards/PostCard";
import { SectionHeading } from "@/components/SectionHeading";
import { ItemListJsonLd } from "@/components/seo/ItemListJsonLd";
import { hubPageMeta } from "@/lib/copy";
import { postHref } from "@/lib/routes";
import { getPostsByKind } from "@/lib/posts-service";
import { siteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: hubPageMeta.stati.title,
  description: hubPageMeta.stati.description,
};

export const revalidate = 30;

export default async function StatiPage() {
  const list = (await getPostsByKind("article")).sort(
    (a, b) => +new Date(b.publishedAt) - +new Date(a.publishedAt)
  );

  const itemListLd = list.slice(0, 40).map((p) => ({
    url: `${siteUrl}${postHref(p)}`,
    name: p.title,
  }));

  return (
    <>
      <ItemListJsonLd
        name="Статьи"
        description={hubPageMeta.stati.description}
        path="/stati"
        items={itemListLd}
      />
    <div className="mx-auto max-w-[1400px] px-4 py-10 sm:px-6 lg:px-10">
      <SectionHeading title="Статьи" />
      <p className="-mt-4 mb-10 max-w-2xl text-lg text-slate-600 leading-relaxed">
        Спокойный формат для вдумчивого чтения: колонки, обзоры и объясняющие материалы — с сильной типографикой и ясной логикой.
      </p>
      <div className="grid gap-8 lg:grid-cols-2">
        {list.map((p) => (
          <PostCard key={p.slug} post={p} />
        ))}
      </div>
    </div>
    </>
  );
}

