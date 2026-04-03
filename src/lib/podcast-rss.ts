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
  /** Обложка эпизода из RSS (`itunes:image`), иначе `null`. */
  imageUrl: string | null;
  /** Для сортировки по дате публикации. */
  publishedAtMs: number;
};

export type PodcastFeedResult = {
  episodes: PodcastEpisodeDisplay[];
  /** Обложка шоу из канала RSS (`image` / `itunes:image`). */
  channelImageUrl: string | null;
};

type RssItem = Parser.Item & {
  "itunes:duration"?: string;
  "itunes:episode"?: string;
  "itunes:image"?: unknown;
  itunes?: { duration?: string; episode?: string; image?: string };
};

const parser = new Parser({
  customFields: {
    feed: ["itunes:image"],
    item: ["itunes:duration", "itunes:episode", "itunes:image"],
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

/** Извлекает URL из `itunes:image` (атрибут `href`) и похожих структур xml2js. */
function pickImageHref(raw: unknown): string | null {
  if (raw == null) return null;
  if (typeof raw === "string") {
    const t = raw.trim();
    return t.startsWith("http") ? t : null;
  }
  if (typeof raw !== "object") return null;
  const o = raw as Record<string, unknown>;
  if (typeof o.href === "string" && o.href.startsWith("http")) return o.href;
  const $ = o.$ as Record<string, unknown> | undefined;
  if ($ && typeof $.href === "string" && $.href.startsWith("http")) return $.href;
  return null;
}

function itemImageUrl(item: RssItem, channelFallback: string | null): string | null {
  const fromItem = pickImageHref(item["itunes:image"]) ?? pickImageHref(item.itunes?.image);
  if (fromItem) return fromItem;
  return channelFallback;
}

function channelImageUrl(feed: Parser.Output<RssItem>): string | null {
  const std = feed.image?.url;
  if (typeof std === "string" && std.startsWith("http")) return std;
  const feedRec = feed as unknown as Record<string, unknown>;
  return pickImageHref(feedRec["itunes:image"]) ?? pickImageHref(feed.itunes?.image);
}

function itemPublishedMs(item: Parser.Item): number {
  const t = Date.parse(item.isoDate || item.pubDate || "");
  return Number.isNaN(t) ? 0 : t;
}

/**
 * Загружает RSS, сортирует выпуски по дате (сначала новые), подтягивает обложки канала и эпизодов.
 * Кеш Next.js: `PODCAST_RSS_REVALIDATE_SECONDS` (по умолчанию 600 с).
 */
export async function fetchPodcastFeedFromRss(): Promise<PodcastFeedResult | null> {
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

    const channelCover = channelImageUrl(feed);

    const mapped: PodcastEpisodeDisplay[] = items.map((item, index) => {
      const title = item.title?.trim() || "Без названия";
      const descSource = item.contentSnippet || item.summary || item.content || "";
      const description =
        stripHtml(descSource).slice(0, 420) || "Описание доступно на странице выпуска.";

      const durationLabel = itemDuration(item) || "—";
      const dateLabel = ruDateLabel(item.isoDate || item.pubDate);
      const publishedAtMs = itemPublishedMs(item);

      const listenUrl =
        item.link?.trim() ||
        (item.enclosure?.url && String(item.enclosure.url).trim()) ||
        url;

      const epRaw = item["itunes:episode"] ?? item.itunes?.episode;
      const epStr = epRaw != null && String(epRaw).trim() ? String(epRaw).trim() : "";
      const episodeLabel = epStr ? epStr.padStart(2, "0") : String(index + 1).padStart(2, "0");

      const key = String(item.guid || item.link || `rss-${index}`);

      return {
        key,
        episodeLabel,
        title,
        description,
        durationLabel,
        dateLabel,
        listenUrl,
        imageUrl: itemImageUrl(item, channelCover),
        publishedAtMs,
      };
    });

    mapped.sort((a, b) => b.publishedAtMs - a.publishedAtMs);

    // Перенумерация метки эпизода, если в фиде не было itunes:episode — по убыванию даты: новый = больший номер
    const needsSynthetic = items.every((it) => {
      const ep = (it as RssItem)["itunes:episode"] ?? (it as RssItem).itunes?.episode;
      return ep == null || String(ep).trim() === "";
    });
    if (needsSynthetic && mapped.length > 0) {
      const n = mapped.length;
      mapped.forEach((ep, i) => {
        ep.episodeLabel = String(n - i).padStart(2, "0");
      });
    }

    return {
      episodes: mapped,
      channelImageUrl: channelCover,
    };
  } catch (e) {
    console.error("[podcast-rss]", e);
    return null;
  }
}
