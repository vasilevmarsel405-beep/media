import type { MetadataRoute } from "next";
import { authors, rubrics, specialProjects, tags } from "@/lib/content";
import { getAllPosts } from "@/lib/posts-service";
import { postHref } from "@/lib/routes";
import { siteUrl } from "@/lib/site";

const STATIC_PATHS = [
  "",
  "/novosti",
  "/stati",
  "/analitika",
  "/intervyu",
  "/video",
  "/rubriki",
  "/specproekty",
  "/podpiska",
  "/poisk",
  "/o-proekte",
  "/kontakty",
  "/kabinet",
  "/reklamodatelyam",
  "/politika-konfidencialnosti",
  "/polzovatelskoe-soglashenie",
  "/redaktsionnaya-politika",
  "/politika-faylov-cookie",
  "/rss.xml",
] as const;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const posts = await getAllPosts();

  const staticEntries: MetadataRoute.Sitemap = STATIC_PATHS.map((path) => ({
    url: `${siteUrl}${path || "/"}`,
    lastModified: now,
    changeFrequency: path === "" ? "daily" : "weekly",
    priority: path === "" ? 1 : 0.85,
  }));

  const postEntries: MetadataRoute.Sitemap = posts.map((p) => ({
    url: `${siteUrl}${postHref(p)}`,
    lastModified: new Date(p.publishedAt),
    changeFrequency: "weekly",
    priority: 0.75,
  }));

  const rubricEntries: MetadataRoute.Sitemap = rubrics.map((r) => ({
    url: `${siteUrl}/rubriki/${r.slug}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.65,
  }));

  const tagEntries: MetadataRoute.Sitemap = tags.map((t) => ({
    url: `${siteUrl}/teg/${t.slug}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.55,
  }));

  const authorEntries: MetadataRoute.Sitemap = authors.map((a) => ({
    url: `${siteUrl}/avtor/${a.slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.5,
  }));

  const specEntries: MetadataRoute.Sitemap = specialProjects.map((s) => ({
    url: `${siteUrl}/specproekty/${s.slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.65,
  }));

  return [
    ...staticEntries,
    ...postEntries,
    ...rubricEntries,
    ...tagEntries,
    ...authorEntries,
    ...specEntries,
  ];
}
