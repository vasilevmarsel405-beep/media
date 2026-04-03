/** Публичный URL без слэша в конце — canonical, OG, JSON-LD, ShareRow. */
const rawSiteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim().replace(/\/$/, "") ?? "";
export const siteUrl =
  rawSiteUrl.startsWith("http://") || rawSiteUrl.startsWith("https://")
    ? rawSiteUrl
    : "https://cryptomarsmedia.ru";

export const siteName = "КриптоМарс Медиа";

/**
 * Другие написания бренда для Organization JSON-LD (`alternateName`).
 * Помогает поисковикам связать запросы вроде «Крипто Марс медиа» с той же сущностью.
 */
export const siteBrandAlternateNames = [
  "Крипто Марс Медиа",
  "CryptoMars Media",
  "Криптомарс Медиа",
] as const;

/** Совпадает с `@id` Organization в JSON-LD — ссылки из Article / Video. */
export const jsonLdOrganizationId = `${siteUrl}/#organization`;

export const editorialEmail = "red@cryptomarsmedia.ru";
export const commercialEmail = "ads@cryptomarsmedia.ru";

export const socialTelegram = "https://t.me/+wvWKuimGT6lhNjhi";
export const socialYoutube = "https://www.youtube.com/@cryptomars1";

export function getMetadataBaseUrl(): URL {
  const base = siteUrl.startsWith("http") ? siteUrl : `https://${siteUrl}`;
  try {
    return new URL(base);
  } catch {
    return new URL("https://cryptomarsmedia.ru");
  }
}
