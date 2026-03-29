import type { Metadata } from "next";
import Link from "next/link";
import { SectionHeading } from "@/components/SectionHeading";
import { FaqJsonLd } from "@/components/seo/FaqJsonLd";
import { aboutPageCopy, oProekteCopy, oProekteFaq } from "@/lib/copy";

export const metadata: Metadata = {
  title: "О проекте",
  description: aboutPageCopy.metaDescription,
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-[760px] px-4 py-14 sm:px-6 lg:px-10">
      <FaqJsonLd items={oProekteFaq} />
      <SectionHeading title="О КриптоМарс Медиа" />
      <div className="prose-mars -mt-4 space-y-6 text-slate-700">
        <p className="text-lg font-medium leading-relaxed text-slate-800">{oProekteCopy.lead}</p>
        <p>{oProekteCopy.p1}</p>
        <p>{oProekteCopy.p2}</p>
        <p>{oProekteCopy.p3}</p>
      </div>

      <section className="mt-14 border-t border-slate-200 pt-10" aria-labelledby="o-proekte-faq">
        <h2 id="o-proekte-faq" className="font-display text-xl font-bold text-slate-900 sm:text-2xl">
          {oProekteCopy.faqTitle}
        </h2>
        <dl className="mt-6 space-y-4">
          {oProekteFaq.map((item) => (
            <div
              key={item.question}
              className="rounded-2xl border border-slate-200/90 bg-slate-50/60 px-4 py-4 sm:px-5 sm:py-5"
            >
              <dt className="font-semibold text-slate-900">{item.question}</dt>
              <dd className="mt-2 text-sm leading-relaxed text-slate-600">{item.answer}</dd>
            </div>
          ))}
        </dl>
      </section>

      <div className="mt-10 flex flex-wrap gap-4">
        <Link href="/redaktsionnaya-politika" className="text-sm font-semibold text-mars-blue hover:underline">
          {aboutPageCopy.linkEditorial}
        </Link>
        <Link href="/kontakty" className="text-sm font-semibold text-mars-blue hover:underline">
          {aboutPageCopy.linkContact}
        </Link>
        <Link href="/reklamodatelyam" className="text-sm font-semibold text-mars-blue hover:underline">
          {aboutPageCopy.linkPartners}
        </Link>
      </div>
    </div>
  );
}
