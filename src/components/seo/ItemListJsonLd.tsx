import { siteUrl } from "@/lib/site";

type Item = { url: string; name: string };

/** ItemList для лент (Яндекс/Google: структура списка материалов). */
export function ItemListJsonLd({
  name,
  description,
  path,
  items,
}: {
  name: string;
  description?: string;
  path: string;
  items: Item[];
}) {
  if (items.length === 0) return null;
  const pageUrl = `${siteUrl}${path.startsWith("/") ? path : `/${path}`}`;

  const json = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name,
    ...(description ? { description } : {}),
    url: pageUrl,
    numberOfItems: items.length,
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@type": "WebPage",
        "@id": it.url,
        url: it.url,
        name: it.name,
      },
    })),
  };

  return (
    <script
      type="application/ld+json"
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: JSON.stringify(json) }}
    />
  );
}
