import type { Post } from "@/lib/types";

const YT_THUMB_HOST_RE = /^https?:\/\/(?:i\.ytimg\.com|img\.youtube\.com)\//i;

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

  if (!videoId) return image;
  if (!image) return youtubeThumbUrl(videoId, "hqdefault");

  if (!YT_THUMB_HOST_RE.test(image)) return image;
  if (image.includes("/maxresdefault.")) return youtubeThumbUrl(videoId, "hqdefault");

  return image;
}
