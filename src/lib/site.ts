/** Публичный URL без слэша в конце — canonical, OG, JSON-LD. */
export const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ?? "https://cryptomarsmedia.ru";

export const siteName = "КриптоМарс Медиа";

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
