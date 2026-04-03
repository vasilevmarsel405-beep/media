import Parser from "rss-parser";

/** Карточка выпуска для UI `/podkasty` (из RSS или статический fallback). */
export type PodcastEpisodeDisplay = {
  key: string;
  episodeLabel: string;
  title: string;
  description: string;
  durationLabel: string;
  dateLabel: string;
  listenUrl: string;
};

type RssItem = Parser.Item & {
  "itunes:duration"?: string;
  "itunes:episode"?: string;
  itunes?: { duration?: string; episode?: string };
};

const parser = new Parser({
  customFields: {
    item: ["itunes:duration", "itunes:episode"],
  },
});

function podcastRssRevalidateSeconds(): number {
  const n = Number(process.env.PODCAST_RSS_REVALIDATE_SECONDS);
  if (Number.isFinite(n) && n >= 60) return Math.min(n, 86400);
  return 600;
}

/** Публичный RSS подкаста (Mave, Anchor, Castos и т.д.). Без переменной — только статика из `copy.ts`. */
export function getPodcastRssUrl(): string | null {
  const u = process.env.PODCAST_RSS_URL?.trim();
  if (!u || !(u.startsWith("https://") || u.startsWith("http://"))) return null;
  return u;
}

function stripHtml(s: string): string {
  return s
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function formatSeconds(total: number): string {
  if (!Number.isFinite(total) || total <= 0) return "";
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  if (h > 0) return `${h} ч ${m} мин`;
  return `${Math.max(1, m)} мин`;
}

/** iTunes-тег: секунды, MM:SS или H:MM:SS */
function parseItunesDuration(raw: unknown): string {
  if (raw == null) return "";
  const s = String(raw).trim();
  if (!s) return "";
  if (/^\d+$/.test(s)) return formatSeconds(parseInt(s, 10));
  const parts = s.split(":").map((p) => parseInt(p.trim(), 10));
  if (parts.some((n) => Number.isNaN(n))) return s;
  if (parts.length === 1) return formatSeconds(parts[0]!);
  if (parts.length === 2) return formatSeconds(parts[0]! * 60 + parts[1]!);
  if (parts.length === 3) return formatSeconds(parts[0]! * 3600 + parts[1]! * 60 + parts[2]!);
  return s;
}

function ruDateLabel(isoOrPub: string | undefined): string {
  if (!isoOrPub) return "";
  const d = new Date(isoOrPub);
  if (Number.isNaN(d.getTime())) return "";
  return new Intl.DateTimeFormat("ru-RU", { day: "numeric", month: "long", year: "numeric" }).format(d);
}

function itemDuration(item: RssItem): string {
  const raw = item["itunes:duration"] ?? item.itunes?.duration;
  return parseItunesDuration(raw);
}

/**
 * Загружает и разбирает RSS. Кеш Next.js Data Cache: `revalidate` по `PODCAST_RSS_REVALIDATE_SECONDS` (по умолчанию 600 с).
 * При ошибке сети/разбора — `null` (страница покажет статический fallback).
 */
export async function fetchPodcastEpisodesFromRss(): Promise<PodcastEpisodeDisplay[] | null> {
  const url = getPodcastRssUrl();
  if (!url) return null;

  try {
    const res = await fetch(url, {
      next: { revalidate: podcastRssRevalidateSeconds() },
      headers: {
        "User-Agent": "CryptoMarsMediaPodcastHub/1.0",
        Accept: "application/rss+xml, application/xml, text/xml, */*",
      },
    });
    if (!res.ok) {
      console.error("[podcast-rss] HTTP", res.status, url);
      return null;
    }
    const xml = await res.text();
    const feed = await parser.parseString(xml);
    const items = (feed.items ?? []) as RssItem[];
    if (items.length === 0) return null;

    const total = items.length;

    return items.map((item, index) => {
      const title = item.title?.trim() || "Без названия";
      const descSource = item.contentSnippet || item.summary || item.content || "";
      const description =
        stripHtml(descSource).slice(0, 420) || "Описание доступно на странице выпуска.";

      const durationLabel = itemDuration(item) || "—";
      const dateLabel = ruDateLabel(item.isoDate || item.pubDate);

      const listenUrl =
        item.link?.trim() ||
        (item.enclosure?.url && String(item.enclosure.url).trim()) ||
        url;

      const epRaw = item["itunes:episode"] ?? item.itunes?.episode;
      const epStr = epRaw != null && String(epRaw).trim() ? String(epRaw).trim() : "";
      const episodeLabel = epStr ? epStr.padStart(2, "0") : String(total - index).padStart(2, "0");

      const key = String(item.guid || item.link || `rss-${index}`);

      return {
        key,
        episodeLabel,
        title,
        description,
        durationLabel,
        dateLabel,
        listenUrl,
      };
    });
  } catch (e) {
    console.error("[podcast-rss]", e);
    return null;
  }
}
