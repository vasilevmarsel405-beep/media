/**
 * Извлекает ID ролика YouTube из полного URL или из 11-символьного id.
 */
export function extractYoutubeVideoId(raw: string): string | null {
  const s = raw.trim();
  if (!s) return null;

  if (/^[a-zA-Z0-9_-]{11}$/.test(s)) return s;

  try {
    const u = new URL(s.startsWith("http") ? s : `https://${s}`);
    const host = u.hostname.replace(/^www\./, "");

    if (host === "youtu.be") {
      const id = u.pathname.replace(/^\//, "").split(/[/?#]/)[0];
      return id && /^[a-zA-Z0-9_-]{11}$/.test(id) ? id : null;
    }

    if (host.includes("youtube.com") || host === "m.youtube.com") {
      const v = u.searchParams.get("v");
      if (v && /^[a-zA-Z0-9_-]{11}$/.test(v)) return v;

      const embed = u.pathname.match(/^\/embed\/([a-zA-Z0-9_-]{11})/);
      if (embed) return embed[1];

      const shorts = u.pathname.match(/^\/shorts\/([a-zA-Z0-9_-]{11})/);
      if (shorts) return shorts[1];

      const live = u.pathname.match(/^\/live\/([a-zA-Z0-9_-]{11})/);
      if (live) return live[1];
    }
  } catch {
    return null;
  }

  return null;
}
