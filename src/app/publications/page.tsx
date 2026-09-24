import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { publications } from "@/lib/content";

export const metadata: Metadata = { title: "Publications" };

export default function PublicationsPage() {
  return <div className="container-wide py-20 sm:py-28"><div className="max-w-3xl"><p className="text-xs font-bold uppercase tracking-[0.2em] text-maroon-700">Publications</p><h1 className="mt-6 text-5xl font-extrabold leading-tight tracking-[-0.03em] text-slate-950 sm:text-6xl">A record of the work.</h1><p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">Selected publications and research outputs from the group.</p></div><div className="mt-16 grid gap-4">{publications.map((publication) => <article key={publication.id} className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm"><div className="flex flex-wrap items-center justify-between gap-3 text-xs font-semibold uppercase tracking-wider text-maroon-700"><span>{publication.type}</span><span>{publication.year}</span></div><h2 className="mt-5 max-w-3xl text-2xl font-bold text-slate-950">{publication.title}</h2><p className="mt-3 text-sm text-slate-500">{publication.authors.join(", ")} · {publication.venue}</p><p className="mt-5 max-w-3xl text-sm leading-7 text-slate-600">{publication.abstract}</p><Link href={publication.url} className="focus-ring mt-6 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-maroon-800">View record <ArrowUpRight size={14} /></Link></article>)}</div></div>;
}
