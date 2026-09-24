import type { Metadata } from "next";
import { getNewsItems } from "@/lib/content";

export const metadata: Metadata = { title: "News" };
export const dynamic = "force-dynamic";

export default async function NewsPage() {
  const newsItems = await getNewsItems();

  return (
    <div className="container-wide py-20 sm:py-28">
      <div className="max-w-3xl">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-maroon-700">News</p>
        <h1 className="mt-6 text-5xl font-extrabold leading-tight tracking-[-0.03em] text-slate-950 sm:text-6xl">
          Notes from the laboratory.
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
          Announcements and updates from the group.
        </p>
      </div>

      <div className="mt-16 grid gap-4 md:grid-cols-2">
        {newsItems.length === 0 ? (
          <p className="text-slate-500 italic py-8">No news published yet.</p>
        ) : (
          newsItems.map((item) => (
            <article key={item.id} className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm">
              <div className="flex items-center justify-between gap-4 text-xs font-bold uppercase tracking-wider text-maroon-700">
                <span>{item.category}</span>
                <time dateTime={item.date}>{item.date}</time>
              </div>
              <h2 className="mt-12 text-2xl font-bold text-slate-950">{item.title}</h2>
              <p className="mt-3 text-sm leading-7 text-slate-600">{item.summary}</p>
            </article>
          ))
        )}
      </div>
    </div>
  );
}
