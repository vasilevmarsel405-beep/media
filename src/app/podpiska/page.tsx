import type { Metadata } from "next";
import { NewsletterBlock } from "@/components/NewsletterBlock";
import { podpiskaCopy, podpiskaMetaDescription } from "@/lib/copy";

export const metadata: Metadata = {
  title: "Подписка",
  description: podpiskaMetaDescription,
};

export default function PodpiskaPage() {
  return (
    <div className="mx-auto max-w-[720px] px-4 py-14 sm:px-6 lg:px-10">
      <h1 className="font-display text-4xl font-semibold text-slate-900">{podpiskaCopy.title}</h1>
      <p className="mt-4 text-lg text-slate-600 leading-relaxed">{podpiskaCopy.lead}</p>
      <div className="mt-10">
        <NewsletterBlock />
      </div>
      <ul className="mt-10 list-disc space-y-3 pl-5 text-slate-700">
        <li>{podpiskaCopy.bullet1}</li>
        <li>{podpiskaCopy.bullet2}</li>
      </ul>
    </div>
  );
}
