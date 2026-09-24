import type { Metadata } from "next";
import { facilities } from "@/lib/content";

export const metadata: Metadata = { title: "Facilities" };

export default function FacilitiesPage() {
  return <div className="container-wide py-20 sm:py-28"><div className="max-w-3xl"><p className="text-xs font-bold uppercase tracking-[0.2em] text-maroon-700">Facilities</p><h1 className="mt-6 text-5xl font-extrabold leading-tight tracking-[-0.03em] text-slate-950 sm:text-6xl">Spaces for careful work.</h1><p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">Research spaces and shared environments that support the work.</p></div><div className="mt-16 grid gap-4 md:grid-cols-2">{facilities.map((facility) => <article key={facility.id} className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm"><div className="flex items-center justify-between gap-4"><p className="text-xs font-bold uppercase tracking-wider text-maroon-700">{facility.category}</p><p className="text-xs text-slate-500">{facility.availability}</p></div><h2 className="mt-12 text-2xl font-bold text-slate-950">{facility.name}</h2><p className="mt-3 text-sm leading-7 text-slate-600">{facility.summary}</p></article>)}</div></div>;
}
