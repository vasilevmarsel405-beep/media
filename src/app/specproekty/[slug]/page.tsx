import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PostCard } from "@/components/cards/PostCard";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { specialProjects } from "@/lib/content";
import { getPostBySlug } from "@/lib/posts-service";
import { siteUrl } from "@/lib/site";

type Props = { params: Promise<{ slug: string }> };

export const revalidate = 30;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const s = specialProjects.find((x) => x.slug === slug);
  if (!s) return {};
  return {
    title: s.title,
    description: s.lead,
    openGraph: { title: s.title, description: s.lead, images: [{ url: s.cover }] },
    alternates: { canonical: `${siteUrl}/specproekty/${slug}` },
  };
}

export default async function SpecialProjectPage({ params }: Props) {
  const { slug } = await params;
  const project = specialProjects.find((s) => s.slug === slug);
  if (!project) notFound();

  const related = (
    await Promise.all(project.relatedSlugs.map((s) => getPostBySlug(s)))
  ).filter((p): p is NonNullable<typeof p> => p != null);

  return (
    <article>
      <div className="relative border-b border-slate-200">
        <div className="relative h-[min(60vh,640px)] w-full">
          <Image src={project.cover} alt={`Обложка спецпроекта: ${project.title}`} fill priority className="object-cover" sizes="100vw" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 mx-auto max-w-[900px] px-4 pb-14 pt-20 text-center text-white sm:px-6">
            <Breadcrumbs
              tone="dark"
              items={[
                { href: "/", label: "Главная" },
                { href: "/specproekty", label: "Спецпроекты" },
                { href: `/specproekty/${slug}`, label: project.title },
              ]}
            />
            <p className="mt-8 text-xs font-bold uppercase tracking-wider text-white/70">{project.dek}</p>
            <h1 className="font-display mt-4 text-4xl font-semibold leading-tight sm:text-5xl lg:text-6xl">
              {project.title}
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-white/85">{project.lead}</p>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-[760px] px-4 py-14 sm:px-6 lg:px-10">
        <div className="space-y-12">
          {project.blocks.map((b, i) => {
            if (b.type === "quote") {
              return (
                <blockquote
                  key={i}
                  className="rounded-3xl border border-mars-accent/15 bg-mars-accent-soft/50 px-8 py-10 text-xl font-medium leading-relaxed text-slate-900"
                >
                  <p>«{b.content}»</p>
                  {b.cite ? <footer className="mt-4 text-sm font-normal text-slate-600">— {b.cite}</footer> : null}
                </blockquote>
              );
            }
            if (b.type === "stat") {
              return (
                <div
                  key={i}
                  className="rounded-3xl bg-slate-900 px-8 py-10 text-center text-white shadow-xl"
                >
                  <p className="font-display text-2xl font-semibold leading-snug sm:text-3xl">{b.content}</p>
                </div>
              );
            }
            return (
              <p key={i} className="text-lg leading-relaxed text-slate-700">
                {b.content}
              </p>
            );
          })}
        </div>

        <section className="mt-20 border-t border-slate-200 pt-12">
          <h2 className="font-display text-2xl font-semibold text-slate-900">Материалы проекта</h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-2">
            {related.map((p) =>
              p ? <PostCard key={p.slug} post={p} /> : null
            )}
          </div>
          <div className="mt-10 text-center">
            <Link href="/specproekty" className="text-sm font-semibold text-mars-blue hover:underline">
              ← Все спецпроекты
            </Link>
          </div>
        </section>
      </div>
    </article>
  );
}
