import type { Metadata } from "next";
import { ContactForm } from "@/components/ContactForm";
import { kontaktyCopy } from "@/lib/copy";
import { commercialEmail, editorialEmail } from "@/lib/site";

export const metadata: Metadata = {
  title: "Контакты",
  description: "Как связаться с редакцией и коммерческой службой КриптоМарс Медиа.",
};

export default function KontaktyPage() {
  return (
    <div className="mx-auto max-w-[760px] px-4 py-14 sm:px-6 lg:px-10">
      <h1 className="font-display text-4xl font-semibold text-slate-900">{kontaktyCopy.title}</h1>
      <p className="mt-4 text-lg text-slate-600">{kontaktyCopy.lead}</p>
      <p className="mt-3 text-sm text-slate-500">
        Регион работы редакции: Россия. Основной канал для официальных запросов — email.
      </p>

      <div className="mt-10 grid gap-8 rounded-3xl border border-slate-200 bg-slate-50/80 p-8">
        <section>
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">{kontaktyCopy.editorTitle}</h2>
          <p className="mt-2 text-slate-800">
            Email:{" "}
            <a href={`mailto:${editorialEmail}`} className="font-semibold text-mars-blue hover:underline">
              {editorialEmail}
            </a>
          </p>
        </section>
        <section>
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">{kontaktyCopy.adsTitle}</h2>
          <p className="mt-2 text-slate-800">
            Email:{" "}
            <a href={`mailto:${commercialEmail}`} className="font-semibold text-mars-blue hover:underline">
              {commercialEmail}
            </a>
          </p>
        </section>
        <section>
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">{kontaktyCopy.formTitle}</h2>
          <ContactForm />
          <p className="mt-3 text-xs text-slate-500">{kontaktyCopy.formNote}</p>
        </section>
      </div>
    </div>
  );
}
