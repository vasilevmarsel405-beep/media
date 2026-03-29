"use client";

import Script from "next/script";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

/** Только цифры счётчика из env — защита от инъекции в inline-скрипт. */
function counterIdFromEnv(): string | null {
  const raw = process.env.NEXT_PUBLIC_YANDEX_METRIKA_ID?.trim();
  if (!raw) return null;
  const digits = raw.replace(/\D/g, "");
  return digits.length >= 5 ? digits : null;
}

declare global {
  interface Window {
    ym?: (counterId: number, method: string, ...args: unknown[]) => void;
  }
}

/**
 * Яндекс.Метрика: задайте NEXT_PUBLIC_YANDEX_METRIKA_ID в .env (номер счётчика из metrika.yandex.ru).
 * Не грузится на маршрутах /admin (см. SiteChrome). Для SPA — дополнительный hit при смене маршрута.
 */
export function YandexMetrika() {
  const id = counterIdFromEnv();
  const pathname = usePathname() ?? "/";
  const skipFirstHit = useRef(true);

  useEffect(() => {
    if (!id) return;
    if (skipFirstHit.current) {
      skipFirstHit.current = false;
      return;
    }
    if (typeof window.ym !== "function") return;
    const url = window.location.pathname + window.location.search;
    window.ym(Number(id), "hit", url);
  }, [id, pathname]);

  if (!id) return null;

  const tagSrc = `https://mc.yandex.ru/metrika/tag.js?id=${id}`;

  return (
    <>
      <Script id="yandex-metrika" strategy="afterInteractive">
        {`
(function(m,e,t,r,i,k,a){
    m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
    m[i].l=1*new Date();
    for (var j = 0; j < document.scripts.length; j++) { if (document.scripts[j].src === r) { return; } }
    k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)
})(window, document, "script", "${tagSrc}", "ym");

window.dataLayer = window.dataLayer || [];

ym(${id}, "init", {
  ssr: true,
  webvisor: true,
  clickmap: true,
  ecommerce: "dataLayer",
  referrer: document.referrer,
  url: location.href,
  accurateTrackBounce: true,
  trackLinks: true
});
        `}
      </Script>
      <noscript>
        <div>
          <img
            src={`https://mc.yandex.ru/watch/${id}`}
            style={{ position: "absolute", left: "-9999px" }}
            alt=""
            width={1}
            height={1}
          />
        </div>
      </noscript>
    </>
  );
}
