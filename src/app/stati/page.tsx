import { PostCard } from "@/components/cards/PostCard";
import { SectionHeading } from "@/components/SectionHeading";
import { ItemListJsonLd } from "@/components/seo/ItemListJsonLd";
import { postHref } from "@/lib/routes";
import { getPostsByKind } from "@/lib/posts-service";
import { siteUrl } from "@/lib/site";

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
        name="РЎС‚Р°С‚СЊРё"
        description="РљРѕР»РѕРЅРєРё, РѕР±Р·РѕСЂС‹ Рё РѕР±СЉСЏСЃРЅСЏСЋС‰РёРµ РјР°С‚РµСЂРёР°Р»С‹ РљСЂРёРїС‚РѕРњР°СЂСЃ РњРµРґРёР°."
        path="/stati"
        items={itemListLd}
      />
    <div className="mx-auto max-w-[1400px] px-4 py-10 sm:px-6 lg:px-10">
      <SectionHeading title="РЎС‚Р°С‚СЊРё" />
      <p className="-mt-4 mb-10 max-w-2xl text-lg text-slate-600 leading-relaxed">
        РЎРїРѕРєРѕР№РЅС‹Р№ С„РѕСЂРјР°С‚ РґР»СЏ РІРґСѓРјС‡РёРІРѕРіРѕ С‡С‚РµРЅРёСЏ: РєРѕР»РѕРЅРєРё, РѕР±Р·РѕСЂС‹ Рё РѕР±СЉСЏСЃРЅСЏСЋС‰РёРµ РјР°С‚РµСЂРёР°Р»С‹ СЃ СЃРёР»СЊРЅРѕР№ С‚РёРїРѕРіСЂР°С„РёРєРѕР№.
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

