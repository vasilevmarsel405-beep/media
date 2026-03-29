import { unstable_cache } from "next/cache";

export type YoutubeVideoEnrichment = {
  title: string;
  description: string;
  channelTitle?: string;
  thumbnailUrl?: string;
  durationLabel?: string;
  source: "data-api" | "oembed";
};

function formatIso8601DurationToLabel(iso: string | undefined): string | undefined {
  if (!iso) return undefined;
  const m = iso.match(/^PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?$/);
  if (!m) return undefined;
  const h = Number(m[1] ?? "0");
  const min = Number(m[2] ?? "0");
  const sec = Number(m[3] ?? "0");
  if (Number.isNaN(h) || Number.isNaN(min) || Number.isNaN(sec)) return undefined;
  const mm = String(min).padStart(h > 0 ? 2 : 1, "0");
  const ss = String(sec).padStart(2, "0");
  if (h > 0) return `${h}:${String(min).padStart(2, "0")}:${ss}`;
  return `${mm}:${ss}`;
}

async function fetchYoutubeDataApi(videoId: string, apiKey: string): Promise<YoutubeVideoEnrichment | null> {
  try {
    const url = new URL("https://www.googleapis.com/youtube/v3/videos");
    url.searchParams.set("part", "snippet,contentDetails");
    url.searchParams.set("id", videoId);
    url.searchParams.set("key", apiKey);

    const res = await fetch(url.toString(), {
      next: { revalidate: 3600 },
      signal: AbortSignal.timeout(20_000),
    });
    if (!res.ok) return null;

    const data = (await res.json()) as {
      items?: Array<{
        snippet?: {
          title?: string;
          description?: string;
          channelTitle?: string;
          thumbnails?: {
            maxres?: { url?: string };
            high?: { url?: string };
            medium?: { url?: string };
          };
        };
        contentDetails?: {
          duration?: string;
        };
      }>;
    };

    const sn = data.items?.[0]?.snippet;
    if (!sn?.title) return null;

    const thumbnailUrl =
      sn.thumbnails?.maxres?.url ?? sn.thumbnails?.high?.url ?? sn.thumbnails?.medium?.url;
    const durationLabel = formatIso8601DurationToLabel(data.items?.[0]?.contentDetails?.duration);

    return {
      title: sn.title,
      description: (sn.description ?? "").trim(),
      channelTitle: sn.channelTitle,
      thumbnailUrl,
      durationLabel,
      source: "data-api",
    };
  } catch {
    return null;
  }
}

async function fetchYoutubeOembed(videoId: string): Promise<YoutubeVideoEnrichment | null> {
  try {
    const watch = `https://www.youtube.com/watch?v=${encodeURIComponent(videoId)}`;
    const oembedUrl = `https://www.youtube.com/oembed?url=${encodeURIComponent(watch)}&format=json`;

    const res = await fetch(oembedUrl, {
      next: { revalidate: 3600 },
      signal: AbortSignal.timeout(20_000),
    });
    if (!res.ok) return null;

    const j = (await res.json()) as {
      title?: string;
      author_name?: string;
      thumbnail_url?: string;
    };

    if (!j.title) return null;

    return {
      title: j.title,
      description: "",
      channelTitle: j.author_name,
      thumbnailUrl: j.thumbnail_url,
      source: "oembed",
    };
  } catch {
    return null;
  }
}

/** Прямой запрос без кеша (админка, диагностика). */
export async function fetchYoutubeVideoEnrichmentDirect(videoId: string): Promise<YoutubeVideoEnrichment | null> {
  try {
    const key = process.env.YOUTUBE_DATA_API_KEY?.trim();
    if (key) {
      const fromApi = await fetchYoutubeDataApi(videoId, key);
      if (fromApi) return fromApi;
    }
    return await fetchYoutubeOembed(videoId);
  } catch {
    return null;
  }
}

/** Метаданные ролика для страницы видео (кеш 1 ч на ID). */
export function getYoutubeVideoEnrichment(videoId: string): Promise<YoutubeVideoEnrichment | null> {
  return unstable_cache(
    () => fetchYoutubeVideoEnrichmentDirect(videoId),
    ["youtube-enrichment", videoId],
    { revalidate: 3600, tags: ["youtube-videos"] }
  )();
}
