import { cn } from "@/lib/cn";

export function YouTubeEmbed({
  id,
  title,
  className,
}: {
  id: string;
  title: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "relative aspect-video w-full overflow-hidden rounded-2xl bg-slate-950 shadow-[0_24px_80px_-24px_rgb(0_0_0/0.75),0_0_0_1px_rgb(255_49_0/0.22)] ring-1 ring-white/10 sm:rounded-3xl",
        className
      )}
    >
      <div
        className="pointer-events-none absolute -inset-px rounded-2xl bg-gradient-to-br from-[#ff3100]/25 via-transparent to-mars-blue/15 opacity-90 sm:rounded-3xl"
        aria-hidden
      />
      <iframe
        className="relative z-[1] absolute inset-0 h-full w-full"
        src={`https://www.youtube-nocookie.com/embed/${id}?rel=0`}
        title={title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
        loading="lazy"
      />
    </div>
  );
}
