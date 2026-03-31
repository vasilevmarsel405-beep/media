/** Alt для обложек: on-page SEO / доступность (чеклисты IndexLift, seo-audit). */
export function postCoverImageAlt(title: string, customAlt?: string): string {
  const explicit = customAlt?.trim();
  if (explicit) return explicit;
  const t = title.trim();
  if (!t) return "Обложка материала";
  const short = t.length > 120 ? `${t.slice(0, 117)}…` : t;
  return `Иллюстрация к материалу: ${short}`;
}
