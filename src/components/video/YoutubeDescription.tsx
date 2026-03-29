import Link from "next/link";
import { cn } from "@/lib/cn";
import type { ReactNode } from "react";

function linkifyLine(text: string, dark: boolean): ReactNode[] {
  const linkCls = dark
    ? "font-medium text-[#ffcba8] underline decoration-white/30 underline-offset-2 hover:text-white hover:decoration-white/60"
    : "font-medium text-mars-blue underline decoration-mars-blue/35 underline-offset-2 hover:decoration-mars-blue";

  const parts = text.split(/(https?:\/\/[^\s<]+[^\s<.,;:!?)])/g);
  return parts.map((part, i) => {
    if (/^https?:\/\//.test(part)) {
      return (
        <Link key={i} href={part} target="_blank" rel="noopener noreferrer" className={linkCls}>
          {part}
        </Link>
      );
    }
    return <span key={i}>{part}</span>;
  });
}

/** Текст описания YouTube: абзацы и кликабельные URL. */
export function YoutubeDescription({
  text,
  className,
  tone = "light",
}: {
  text: string;
  className?: string;
  tone?: "light" | "dark";
}) {
  const blocks = text
    .replace(/\r\n/g, "\n")
    .split(/\n{2,}/)
    .map((b) => b.trim())
    .filter(Boolean);

  if (!blocks.length) return null;

  const dark = tone === "dark";

  return (
    <div className={className}>
      {blocks.map((block, i) => (
        <p
          key={i}
          className={cn(
            "text-[0.9375rem] leading-relaxed",
            dark ? "text-white/75" : "text-slate-600"
          )}
        >
          {block.split("\n").map((line, li) => (
            <span key={li} className="mb-1.5 block last:mb-0">
              {linkifyLine(line, dark)}
            </span>
          ))}
        </p>
      ))}
    </div>
  );
}
