import type { Metadata } from "next";
import { kontaktyCopy } from "@/lib/copy";

export const metadata: Metadata = {
  title: "Контакты",
  description: "Как связаться с редакцией и коммерческой службой МарсМедиа.",
};

export default function KontaktyPage() {
  return (
    <div className="mx-auto max-w-[760px] px-4 py-14 sm:px-6 lg:px-10">
      <h1 className="font-display text-4xl font-semibold text-slate-900">{kontaktyCopy.title}</h1>
      <p className="mt-4 text-lg text-slate-600">{kontaktyCopy.lead}</p>

      <div className="mt-10 grid gap-8 rounded-3xl border border-slate-200 bg-slate-50/80 p-8">
        <section>
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">{kontaktyCopy.editorTitle}</h2>
          <p className="mt-2 text-slate-800">
            Email:{" "}
            <a href="mailto:red@marsmedia.example.com" className="font-semibold text-sky-700 hover:underline">
              red@marsmedia.example.com
            </a>
          </p>
        </section>
        <section>
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">{kontaktyCopy.adsTitle}</h2>
          <p className="mt-2 text-slate-800">
            Email:{" "}
            <a href="mailto:ads@marsmedia.example.com" className="font-semibold text-sky-700 hover:underline">
              ads@marsmedia.example.com
            </a>
          </p>
        </section>
        <section>
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">{kontaktyCopy.formTitle}</h2>
          <form className="mt-4 space-y-4" action="#" method="post">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-slate-700">
                Как к вам обращаться
              </label>
              <input
                id="name"
                name="name"
                className="focus-ring mt-1 w-full rounded-xl border border-slate-200 px-4 py-3"
                required
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-700">
                Email для ответа
              </label>
              <input
                id="email"
                name="email"
                type="email"
                className="focus-ring mt-1 w-full rounded-xl border border-slate-200 px-4 py-3"
                required
              />
            </div>
            <div>
              <label htmlFor="msg" className="block text-sm font-medium text-slate-700">
                Суть вопроса
              </label>
              <textarea
                id="msg"
                name="message"
                rows={5}
                className="focus-ring mt-1 w-full rounded-xl border border-slate-200 px-4 py-3"
                required
              />
            </div>
            <button
              type="submit"
              className="focus-ring rounded-full bg-red-600 px-6 py-3 text-sm font-semibold text-white hover:bg-red-700"
            >
              {kontaktyCopy.submit}
            </button>
            <p className="text-xs text-slate-500">{kontaktyCopy.formNote}</p>
          </form>
        </section>
      </div>
    </div>
  );
}
