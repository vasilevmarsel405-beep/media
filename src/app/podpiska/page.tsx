import type { Metadata } from "next";
import Link from "next/link";
import { NewsletterBlock } from "@/components/NewsletterBlock";
import { podpiskaCopy, podpiskaMetaDescription } from "@/lib/copy";

export const metadata: Metadata = {
  title: "Подписка",
  description: podpiskaMetaDescription,
  openGraph: {
    title: "Рассылка КриптоМарс Медиа",
    description: podpiskaMetaDescription,
    locale: "ru_RU",
  },
};

export default function PodpiskaPage() {
  return (
    <div className="relative">
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-56 bg-[linear-gradient(180deg,rgb(196_0_28/0.06)_0%,transparent_100%)]"
        aria-hidden
      />
      <div className="relative mx-auto max-w-[820px] px-4 py-12 sm:px-6 sm:py-16 lg:px-10">
        <p className="text-[11px] font-black uppercase tracking-[0.22em] text-mars-accent">Бесплатно</p>
        <h1 className="font-display mt-3 text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
          {podpiskaCopy.title}
        </h1>
        <p className="mt-5 text-lg text-slate-600 leading-relaxed sm:text-xl">{podpiskaCopy.lead}</p>

        <div className="mt-10">
          <NewsletterBlock />
        </div>

        <ul className="mt-12 space-y-4 border-t border-slate-200/80 pt-10">
          <li className="flex gap-3 text-slate-700 leading-relaxed">
            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-mars-accent" aria-hidden />
            {podpiskaCopy.bullet1}
          </li>
          <li className="flex gap-3 text-slate-700 leading-relaxed">
            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-mars-accent/70" aria-hidden />
            {podpiskaCopy.bullet2}
          </li>
        </ul>

        <p className="mt-10 text-center text-sm text-slate-500 sm:text-left">
          <Link href="/kontakty" className="font-medium text-mars-blue hover:underline">
            Вопросы по рассылке — в контакты
          </Link>
        </p>
      </div>
    </div>
  );
}
