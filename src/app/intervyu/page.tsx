import { PostCard } from "@/components/cards/PostCard";
import { SectionHeading } from "@/components/SectionHeading";
import { getPostsByKind } from "@/lib/posts-service";

export const revalidate = 30;

export default async function IntervyuPage() {
  const list = (await getPostsByKind("interview")).sort(
    (a, b) => +new Date(b.publishedAt) - +new Date(a.publishedAt)
  );

  return (
    <div className="border-b border-violet-100 bg-gradient-to-b from-violet-50/40 to-white">
      <div className="mx-auto max-w-[1400px] px-4 py-12 sm:px-6 lg:px-10">
        <SectionHeading title="РРЅС‚РµСЂРІСЊСЋ" />
        <p className="-mt-4 mb-10 max-w-2xl text-slate-600">
          РўРµРєСЃС‚, РІРёРґРµРѕ Рё СЃРјРµС€Р°РЅРЅС‹Рµ С„РѕСЂРјР°С‚С‹. РђРєС†РµРЅС‚ РЅР° РіРѕР»РѕСЃРµ РіРѕСЃС‚СЏ Рё РєРѕРЅС‚РµРєСЃС‚Рµ, Р° РЅРµ РЅР° С€СѓРјРЅС‹С… Р·Р°РіРѕР»РѕРІРєР°С….
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

