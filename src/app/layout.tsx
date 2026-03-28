import type { Metadata } from "next";
import { Rubik, Spectral } from "next/font/google";
import "./globals.css";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { TopBar } from "@/components/layout/TopBar";

const spectral = Spectral({
  weight: ["400", "600", "700"],
  subsets: ["latin", "cyrillic"],
  variable: "--font-serif-display",
  display: "swap",
});

const rubik = Rubik({
  subsets: ["latin", "cyrillic"],
  variable: "--font-sans-body",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://marsmedia.example.com"),
  title: {
    default: "МарсМедиа — цифровое медиа",
    template: "%s — МарсМедиа",
  },
  description:
    "Новости, статьи, аналитика, интервью и видео. Ежедневный контент с редакционной стандартизацией.",
  openGraph: {
    type: "website",
    locale: "ru_RU",
    siteName: "МарсМедиа",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" className={`${spectral.variable} ${rubik.variable} h-full`}>
      <body className="min-h-full flex flex-col antialiased text-slate-900">
        <a
          href="#main"
          className="focus-ring sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[200] focus:rounded-lg focus:bg-white focus:px-4 focus:py-2 focus:shadow-lg"
        >
          К основному содержимому
        </a>
        <TopBar />
        <SiteHeader />
        <main id="main" className="flex-1">
          {children}
        </main>
        <SiteFooter />
      </body>
    </html>
  );
}
