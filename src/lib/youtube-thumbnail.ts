import type { Post } from "@/lib/types";

const YT_THUMB_HOST_RE = /^https?:\/\/(?:(?:[a-z0-9-]+\.)?ytimg\.com|img\.youtube\.com)\//i;
const YT_ANY_RE = /(ytimg\.com|youtube\.com)/i;

/** Локальный плейсхолдер: пустой/битый `image` ломает next/image (fetch(undefined)). */
const FALLBACK_COVER = "/globe.svg";

export function youtubeThumbUrl(videoId: string, quality: "maxresdefault" | "hqdefault" = "hqdefault"): string {
  return `https://i.ytimg.com/vi/${encodeURIComponent(videoId)}/${quality}.jpg`;
}

/**
 * Для видео-материалов даем стабильный URL превью.
 * maxresdefault у части роликов отсутствует, поэтому используем hqdefault.
 */
export function resolvePostImage(post: Post): string {
  let image = post.image?.trim() ?? "";
  const videoId = post.youtubeId?.trim() ?? "";

  if (image.startsWith("/uploads/covers/")) {
    const file = image.split("/").pop() ?? "";
    if (file) image = `/api/media/covers/${file}`;
  }

  if (!videoId) return image || FALLBACK_COVER;
  if (!image) return youtubeThumbUrl(videoId, "hqdefault");

  // Иногда в админке/данных прилетает битый URL вида https://vi/...ytimg.com/vi/...
  // Для видео с youtubeId в таком случае надежнее вернуть валидный canonical thumbnail.
  if (YT_ANY_RE.test(image) && !YT_THUMB_HOST_RE.test(image)) {
    return youtubeThumbUrl(videoId, "hqdefault");
  }

  if (!YT_THUMB_HOST_RE.test(image)) return image || FALLBACK_COVER;
  if (image.includes("/maxresdefault.")) return youtubeThumbUrl(videoId, "hqdefault");

  return image || FALLBACK_COVER;
}
