import { metaCopy } from "@/lib/copy";
import {
  commercialEmail,
  editorialEmail,
  jsonLdOrganizationId,
  siteName,
  siteUrl,
  socialTelegram,
  socialYoutube,
} from "@/lib/site";

/**
 * Глобальный граф: Organization + WebSite + SearchAction (Яндекс/Google).
 * Один раз в корневом layout.
 */
export function WebSiteJsonLd() {
  const orgId = `${siteUrl}/#organization`;
  const webId = `${siteUrl}/#website`;
  const logoUrl = `${siteUrl}/icon`;

  const homePageId = `${siteUrl}/#webpage`;

  const knowsAbout = [...metaCopy.topics];

  const graph = [
    {
      "@type": ["Organization", "NewsMediaOrganization"],
      "@id": orgId,
      name: siteName,
      description: metaCopy.description,
      url: siteUrl,
      logo: {
        "@type": "ImageObject",
        url: logoUrl,
        contentUrl: logoUrl,
      },
      knowsAbout,
      areaServed: {
        "@type": "Country",
        name: "RU",
      },
      sameAs: [socialTelegram, socialYoutube],
      contactPoint: [
        {
          "@type": "ContactPoint",
          contactType: "editorial",
          email: editorialEmail,
          availableLanguage: ["Russian", "ru-RU"],
        },
        {
          "@type": "ContactPoint",
          contactType: "sales",
          email: commercialEmail,
          availableLanguage: ["Russian", "ru-RU"],
        },
      ],
    },
    {
      "@type": "WebSite",
      "@id": webId,
      url: siteUrl,
      name: siteName,
      description: metaCopy.description,
      inLanguage: "ru-RU",
      publisher: { "@id": orgId },
      potentialAction: {
        "@type": "SearchAction",
        target: {
          "@type": "EntryPoint",
          urlTemplate: `${siteUrl}/poisk?q={search_term_string}`,
        },
        "query-input": "required name=search_term_string",
      },
    },
    {
      "@type": "WebPage",
      "@id": homePageId,
      url: siteUrl,
      name: siteName,
      inLanguage: "ru-RU",
      isPartOf: { "@id": webId },
      about: { "@id": orgId },
    },
  ];

  const json = {
    "@context": "https://schema.org",
    "@graph": graph,
  };

  return (
    <script
      type="application/ld+json"
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: JSON.stringify(json) }}
    />
  );
}
