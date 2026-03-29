import type { Crumb } from "@/components/Breadcrumbs";
import { siteUrl } from "@/lib/site";

function abs(href: string): string {
  if (href.startsWith("http")) return href;
  const path = href.startsWith("/") ? href : `/${href}`;
  return `${siteUrl}${path}`;
}

export function BreadcrumbJsonLd({ items }: { items: Crumb[] }) {
  if (items.length === 0) return null;

  const list = items.map((c, i) => ({
    "@type": "ListItem",
    position: i + 1,
    name: c.label,
    item: abs(c.href),
  }));

  const json = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: list,
  };

  return (
    <script
      type="application/ld+json"
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: JSON.stringify(json) }}
    />
  );
}
