export const dynamic = "force-dynamic";

import { getAllPosts } from "@/lib/posts-service";
import { postHref } from "@/lib/routes";
import { siteName, siteUrl } from "@/lib/site";
import { escapeXml } from "@/lib/xml-escape";

export const runtime = "nodejs";

const MAX_ITEMS = 60;

export async function GET() {
  const posts = await getAllPosts();
  const sorted = [...posts].sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );
  const slice = sorted.slice(0, MAX_ITEMS);

  const items = slice
    .map((p) => {
      const link = `${siteUrl}${postHref(p)}`;
      const pub = new Date(p.publishedAt).toUTCString();
      const desc = escapeXml(p.lead.slice(0, 500) + (p.lead.length > 500 ? "…" : ""));
      return `
    <item>
      <title>${escapeXml(p.title)}</title>
      <link>${escapeXml(link)}</link>
      <guid isPermaLink="true">${escapeXml(link)}</guid>
      <pubDate>${pub}</pubDate>
      <description>${desc}</description>
    </item>`;
    })
    .join("");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(siteName)}</title>
    <link>${escapeXml(siteUrl)}</link>
    <description>${escapeXml("Новости, статьи, аналитика и видео")}</description>
    <language>ru-ru</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${escapeXml(`${siteUrl}/rss.xml`)}" rel="self" type="application/rss+xml"/>
    ${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
    },
  });
}
