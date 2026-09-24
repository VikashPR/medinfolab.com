import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";

export const metadata: Metadata = { title: "Contact" };

export default function ContactPage() {
  return <div className="container-wide py-20 sm:py-28"><div className="grid gap-14 lg:grid-cols-[.9fr_1.1fr] lg:items-start"><div className="max-w-xl"><p className="text-xs font-bold uppercase tracking-[0.2em] text-maroon-700">Contact</p><h1 className="mt-6 text-5xl font-extrabold leading-tight tracking-[-0.03em] text-slate-950 sm:text-6xl">Start a conversation.</h1><p className="mt-6 text-lg leading-8 text-slate-600">For research collaborations, student inquiries, or questions about our work, send us a note.</p></div><div className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm sm:p-9"><h2 className="text-2xl font-bold text-slate-950">Research inquiries</h2><p className="mt-3 text-sm leading-6 text-slate-600">Contact details and the inquiry form will be added here.</p><button type="button" disabled className="mt-8 inline-flex cursor-not-allowed items-center gap-2 rounded-xl bg-slate-200 px-5 py-3 text-sm font-semibold text-slate-500">Contact details pending <ArrowRight size={16} /></button></div></div></div>;
}
