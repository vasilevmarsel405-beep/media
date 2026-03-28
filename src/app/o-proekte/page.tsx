import type { Metadata } from "next";
import Link from "next/link";
import { SectionHeading } from "@/components/SectionHeading";
import { aboutPageCopy, oProekteCopy } from "@/lib/copy";

export const metadata: Metadata = {
  title: "О проекте",
  description: aboutPageCopy.metaDescription,
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-[760px] px-4 py-14 sm:px-6 lg:px-10">
      <SectionHeading title="О МарсМедиа" />
      <div className="prose-mars -mt-4 space-y-6 text-slate-700">
        <p className="text-lg font-medium leading-relaxed text-slate-800">{oProekteCopy.lead}</p>
        <p>{oProekteCopy.p1}</p>
        <p>{oProekteCopy.p2}</p>
        <p>{oProekteCopy.p3}</p>
      </div>
      <div className="mt-10 flex flex-wrap gap-4">
        <Link href="/redaktsionnaya-politika" className="text-sm font-semibold text-sky-700 hover:underline">
          {aboutPageCopy.linkEditorial}
        </Link>
        <Link href="/kontakty" className="text-sm font-semibold text-sky-700 hover:underline">
          {aboutPageCopy.linkContact}
        </Link>
        <Link href="/reklamodatelyam" className="text-sm font-semibold text-sky-700 hover:underline">
          {aboutPageCopy.linkPartners}
        </Link>
      </div>
    </div>
  );
}
