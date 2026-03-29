"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

function send(path: string) {
  if (path.startsWith("/admin")) return;
  fetch("/api/analytics/track", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ path }),
    credentials: "include",
    keepalive: true,
  }).catch(() => {});
}

export function AnalyticsTracker() {
  const pathname = usePathname() ?? "/";
  const last = useRef<string | null>(null);

  useEffect(() => {
    if (pathname.startsWith("/admin")) return;
    if (last.current === pathname) return;
    last.current = pathname;
    send(pathname || "/");
  }, [pathname]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const tick = () => {
      const p = window.location.pathname;
      if (!p.startsWith("/admin")) send(p);
    };
    const id = setInterval(tick, 120000);
    return () => clearInterval(id);
  }, []);

  return null;
}
