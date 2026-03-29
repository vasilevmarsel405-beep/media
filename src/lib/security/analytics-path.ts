const MAX = 512;

/** Разрешены только относительные пути без обхода каталога и управляющих символов. */
export function sanitizeAnalyticsPath(raw: unknown): string {
  if (typeof raw !== "string") return "/";
  let p = raw.trim();
  if (!p.startsWith("/")) return "/";
  if (p.length > MAX) p = p.slice(0, MAX);
  if (p.includes("..") || p.includes("\\") || p.includes("\0") || p.includes("\r") || p.includes("\n")) {
    return "/";
  }
  // только путь: без схемы внутри строки
  if (/^[a-zA-Z][a-zA-Z0-9+.-]*:/.test(p.slice(1))) {
    return "/";
  }
  return p;
}
