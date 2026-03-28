import type { Metadata } from "next";
import { Rubik, Spectral, Geist } from "next/font/google";
import { metaCopy } from "@/lib/copy";
import "./globals.css";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { TopBar } from "@/components/layout/TopBar";
import { cn } from "@/lib/utils";

const spectral = Spectral({
  weight: ["400", "600", "700"],
  subsets: ["latin", "cyrillic"],
  variable: "--font-serif-display",
  display: "swap",
});

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

export const metadata: Metadata = {
  metadataBase: new URL("https://marsmedia.example.com"),
  title: {
    default: "МарсМедиа — цифровое медиа",
    template: "%s — МарсМедиа",
  },
  description: metaCopy.description,
  openGraph: {
    type: "website",
    locale: "ru_RU",
    siteName: "МарсМедиа",
    description: metaCopy.description,
  },
  twitter: {
    card: "summary_large_image",
    title: "МарсМедиа",
    description: metaCopy.description,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" className={cn("h-full", spectral.variable, "font-sans", geist.variable)}>
      <body className="mars-page-bg min-h-full flex flex-col antialiased text-slate-900">
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
