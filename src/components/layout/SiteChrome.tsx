"use client";

import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { TopBar } from "@/components/layout/TopBar";
import { AnalyticsTracker } from "@/components/AnalyticsTracker";
import { YandexMetrika } from "@/components/YandexMetrika";
import { usePathname } from "next/navigation";

export function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() ?? "";
  const isAdmin = pathname.startsWith("/admin");

  if (isAdmin) {
    return <>{children}</>;
  }

  return (
    <>
      <YandexMetrika />
      <AnalyticsTracker />
      <TopBar />
      <SiteHeader />
      <main id="main" className="flex-1">
        {children}
      </main>
      <SiteFooter />
    </>
  );
}
