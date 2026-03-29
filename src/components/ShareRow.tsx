"use client";

import { usePathname } from "next/navigation";
import { IconShare } from "@/components/icons";
import { shareCopy } from "@/lib/copy";
import { siteUrl } from "@/lib/site";

export function ShareRow({ title }: { title: string }) {
  const pathname = usePathname();
  const text = encodeURIComponent(title);
  const url = encodeURIComponent(`${siteUrl}${pathname}`);

  return (
    <div className="flex flex-wrap items-center gap-3">
      <span className="flex items-center gap-2 text-sm font-medium text-slate-600">
        <IconShare className="h-4 w-4" aria-hidden />
        {shareCopy.label}
      </span>
      <a
        className="rounded-xl bg-mars-blue-soft px-3 py-1.5 text-xs font-semibold text-mars-blue ring-1 ring-mars-blue/20 hover:bg-[#e0e5ff] focus-ring"
        href={`https://t.me/share/url?url=${url}&text=${text}`}
        target="_blank"
        rel="noreferrer"
      >
        {shareCopy.telegram}
      </a>
      <a
        className="rounded-xl bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-800 hover:bg-slate-200 focus-ring"
        href={`https://vk.com/share.php?url=${url}&title=${text}`}
        target="_blank"
        rel="noreferrer"
      >
        {shareCopy.vk}
      </a>
    </div>
  );
}
