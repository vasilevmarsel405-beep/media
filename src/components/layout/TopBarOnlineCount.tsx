"use client";

import { useEffect, useState } from "react";
import { topBarCopy } from "@/lib/copy";
import { pseudoOnlineForWindow } from "@/lib/top-bar-online-display";

export function TopBarOnlineCount() {
  const [online, setOnline] = useState<number | null>(null);

  useEffect(() => {
    const tick = () => setOnline(pseudoOnlineForWindow());
    tick();
    const id = window.setInterval(tick, 60_000);
    return () => window.clearInterval(id);
  }, []);

  const formatted =
    online === null ? "—" : online.toLocaleString("ru-RU");

  return (
    <span className="font-normal normal-case tracking-normal text-mars-muted/90">
      {topBarCopy.online}{" "}
      <span className="tabular-nums font-semibold text-mars-ink/85">{formatted}</span>
    </span>
  );
}
