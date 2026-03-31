import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { metaCopy } from "@/lib/copy";
import "./globals.css";
import { SiteChrome } from "@/components/layout/SiteChrome";
import { WebSiteJsonLd } from "@/components/seo/WebSiteJsonLd";
import { cn } from "@/lib/utils";
import { getMetadataBaseUrl, siteName, siteUrl } from "@/lib/site";

/** Inter: кириллица, высокая читаемость в интерфейсе и длинных текстах — де-факто стандарт для медиа и веба. */
const inter = Inter({
  subsets: ["latin", "cyrillic", "cyrillic-ext"],
  variable: "--font-sans-body",
  display: "swap",
  adjustFontFallback: true,
});

const yandexVerify = process.env.NEXT_PUBLIC_YANDEX_VERIFICATION?.trim();
const googleVerify = process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION?.trim();
const verification =
  yandexVerify || googleVerify
    ? {
        ...(yandexVerify ? { yandex: yandexVerify } : {}),
        ...(googleVerify ? { google: googleVerify } : {}),
      }
    : undefined;

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fafaf9" },
    { media: "(prefers-color-scheme: dark)", color: "#0f172a" },
  ],
};

export const metadata: Metadata = {
  metadataBase: getMetadataBaseUrl(),
  applicationName: siteName,
  title: {
    default: `${siteName} — новости, аналитика и видео о криптоэкономике`,
    template: `%s — ${siteName}`,
  },
  description: metaCopy.description,
  keywords: [...metaCopy.topics, siteName, "крипто", "биткоин", "инвестиции"],
  category: "news",
  robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
  ...(verification ? { verification } : {}),
  openGraph: {
    type: "website",
    locale: "ru_RU",
    url: siteUrl,
    siteName,
    title: `${siteName} — новости, аналитика и видео о криптоэкономике`,
    description: metaCopy.description,
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteName} — новости, аналитика и видео`,
    description: metaCopy.description,
  },
};

// Глобально отключаем ISR/route-cache для "живого" режима:
// страницы всегда собираются по свежим данным на каждый запрос.
export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ru"
      className={cn("h-full font-sans antialiased", inter.variable)}
      suppressHydrationWarning
    >
      <body
        className="mars-page-bg text-mars-ink flex min-h-full touch-manipulation flex-col"
        suppressHydrationWarning
      >
        <a
          href="#main"
          className="focus-ring sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[200] focus:rounded-lg focus:bg-white focus:px-4 focus:py-2 focus:shadow-lg"
        >
          К основному содержимому
        </a>
        <WebSiteJsonLd />
        <SiteChrome>{children}</SiteChrome>
      </body>
    </html>
  );
}
