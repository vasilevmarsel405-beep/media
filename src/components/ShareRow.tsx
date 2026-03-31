"use client";

import { usePathname } from "next/navigation";
import { IconShare } from "@/components/icons";
import { shareCopy } from "@/lib/copy";
import { siteUrl } from "@/lib/site";

export function ShareRow({ title, tone = "light" }: { title: string; tone?: "light" | "dark" }) {
  const pathname = usePathname();
  const absoluteUrl =
    typeof window !== "undefined" ? window.location.href : `${siteUrl}${pathname ?? ""}`;
  const text = encodeURIComponent(title);
  const url = encodeURIComponent(absoluteUrl);

  const openShare = (href: string) => {
    if (typeof window === "undefined") return;
    window.open(href, "_blank", "noopener,noreferrer");
  };

  const shareTelegram = () => openShare(`https://t.me/share/url?url=${url}&text=${text}`);
  const shareVk = () => openShare(`https://vk.com/share.php?url=${url}&title=${text}`);

  if (tone === "dark") {
    return (
      <div className="flex flex-wrap items-center gap-3">
        <span className="flex items-center gap-2 text-sm font-medium text-white/70">
          <IconShare className="h-4 w-4 text-white/55" aria-hidden />
          {shareCopy.label}
        </span>
        <button
          type="button"
          className="rounded-xl border border-white/15 bg-white/[0.08] px-3 py-1.5 text-xs font-semibold text-white ring-1 ring-white/10 transition hover:bg-white/12 focus-ring"
          onClick={shareTelegram}
        >
          {shareCopy.telegram}
        </button>
        <button
          type="button"
          className="rounded-xl border border-white/12 bg-black/30 px-3 py-1.5 text-xs font-semibold text-white/90 transition hover:bg-black/45 focus-ring"
          onClick={shareVk}
        >
          {shareCopy.vk}
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap items-center gap-3">
      <span className="flex items-center gap-2 text-sm font-medium text-slate-600">
        <IconShare className="h-4 w-4" aria-hidden />
        {shareCopy.label}
      </span>
      <button
        type="button"
        className="rounded-xl bg-mars-blue-soft px-3 py-1.5 text-xs font-semibold text-mars-blue ring-1 ring-mars-blue/20 hover:bg-[#e0e5ff] focus-ring"
        onClick={shareTelegram}
      >
        {shareCopy.telegram}
      </button>
      <button
        type="button"
        className="rounded-xl bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-800 hover:bg-slate-200 focus-ring"
        onClick={shareVk}
      >
        {shareCopy.vk}
      </button>
    </div>
  );
}
