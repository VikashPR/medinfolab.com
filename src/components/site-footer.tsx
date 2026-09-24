import Link from "next/link";
import { navigation } from "@/lib/content";

export function SiteFooter() {
  return <footer className="border-t border-slate-200 bg-white"><div className="container-wide grid gap-10 py-14 md:grid-cols-[1.4fr_1fr_1fr]"><div><p className="text-xl font-extrabold tracking-tight text-slate-950">MINDH <span className="text-maroon-800">Lab</span></p><p className="mt-3 max-w-xs text-sm leading-6 text-slate-600">Medical Informatics and Digital Health research.</p></div><div><p className="text-xs font-bold uppercase tracking-[0.2em] text-maroon-700">Explore</p><div className="mt-4 grid gap-2">{navigation.slice(0, 4).map((item) => <Link key={item.href} href={item.href} className="text-sm text-slate-600 hover:text-maroon-800">{item.label}</Link>)}</div></div><div><p className="text-xs font-bold uppercase tracking-[0.2em] text-maroon-700">Connect</p><Link href="/contact" className="mt-4 inline-block text-sm text-slate-600 hover:text-maroon-800">Contact the laboratory</Link></div></div><div className="container-wide border-t border-slate-200 py-5 text-xs text-slate-500">© {new Date().getFullYear()} MINDH Laboratory</div></footer>;
}
