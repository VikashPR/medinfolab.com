"use client";

import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { navigation } from "@/lib/content";

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  return <header className="sticky top-0 z-20 border-b border-slate-200/90 bg-white/95 backdrop-blur"><div className="container-wide flex min-h-[76px] items-center justify-between gap-6"><Link href="/" onClick={() => setOpen(false)} className="focus-ring flex items-center gap-3"><span className="grid size-9 place-items-center rounded-xl bg-maroon-800 text-sm font-bold text-white">M</span><span><span className="block text-xl font-extrabold tracking-tight text-slate-950">MINDH <span className="font-bold text-maroon-800">Lab</span></span><span className="hidden text-[10px] font-medium tracking-wide text-slate-500 sm:block">Medical Informatics &amp; Digital Health</span></span></Link><nav className="hidden items-center gap-1 md:flex" aria-label="Primary navigation">{navigation.map((item) => <Link key={item.href} href={item.href} className="focus-ring rounded-lg px-3.5 py-2 text-xs font-semibold text-slate-600 transition hover:bg-maroon-50 hover:text-maroon-800">{item.label === "Contact" ? "Contact Us" : item.label}</Link>)}<span className="mx-2 h-4 w-px bg-slate-200" /><Link href="/contact" className="focus-ring rounded-lg bg-maroon-800 px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-maroon-900">Collaborate</Link></nav><button type="button" className="focus-ring rounded-lg p-2 text-slate-800 md:hidden" aria-label={open ? "Close menu" : "Open menu"} onClick={() => setOpen((value) => !value)}>{open ? <X size={22} /> : <Menu size={22} />}</button></div>{open && <nav className="container-wide border-t border-slate-200 py-3 md:hidden" aria-label="Mobile navigation">{navigation.map((item) => <Link key={item.href} href={item.href} onClick={() => setOpen(false)} className="focus-ring block border-b border-slate-100 py-3 text-sm font-semibold text-slate-800 last:border-0">{item.label}</Link>)}</nav>}</header>;
}
