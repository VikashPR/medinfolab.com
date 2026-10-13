"use client";

import Link from "next/link";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";

const SLIDE_DURATION = 7000;



export function HeroCarousel({ slides }: { slides: any[] }) {
  const [active, setActive] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const slide = slides[active];
  if (!slide) return null;

  useEffect(() => {
    if (isPaused) return;
    const timer = window.setTimeout(() => setActive((current) => (current + 1) % slides.length), SLIDE_DURATION);
    return () => window.clearTimeout(timer);
  }, [active, isPaused]);

  return <div className="relative min-h-[560px] overflow-hidden rounded-[2rem] bg-slate-950 shadow-[0_28px_70px_-30px_rgba(91,16,35,.6)] sm:min-h-[620px]" onMouseEnter={() => setIsPaused(true)} onMouseLeave={() => setIsPaused(false)}>{slides.map((item, index) => <div key={item.title} className={`absolute inset-0 bg-cover bg-center transition-opacity duration-700 ${index === active ? "opacity-100" : "opacity-0"}`} style={{ backgroundImage: `url(${item.image})` }} aria-hidden={index !== active} />)}<div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-maroon-900/65 to-maroon-900/10" /><div className="relative flex min-h-[560px] flex-col justify-between p-7 text-white sm:min-h-[620px] sm:p-12"><div className="flex items-center justify-between gap-6 text-xs font-bold uppercase tracking-[0.2em] text-white/75"><span>{slide.label}</span><span>{String(active + 1).padStart(2, "0")} / {String(slides.length).padStart(2, "0")}</span></div><div className="max-w-2xl"><h1 className="max-w-2xl text-4xl font-extrabold leading-[1.05] tracking-[-0.03em] sm:text-6xl">{slide.title}</h1><p className="mt-6 max-w-xl text-base leading-7 text-white/80 sm:text-lg">{slide.text}</p><Link href={slide.href} className="focus-ring mt-8 inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3.5 text-sm font-bold text-maroon-900 hover:bg-rose-50">{slide.action} <ArrowRight size={16} /></Link></div><div className="flex items-center justify-between gap-6"><div className="flex gap-2">{slides.map((item, index) => <button key={item.title} type="button" aria-label={`Show slide ${index + 1}`} aria-pressed={active === index} onClick={() => setActive(index)} className={`relative h-1.5 overflow-hidden rounded-full transition-all ${active === index ? "w-12 bg-white/40" : "w-6 bg-white/40"}`}><span className={`absolute inset-y-0 left-0 rounded-full bg-white ${active === index ? "hero-progress" : "w-0"}`} style={{ animationPlayState: isPaused ? "paused" : "running" }} /></button>)}</div><div className="flex gap-2"><button type="button" aria-label="Previous slide" onClick={() => setActive((active - 1 + slides.length) % slides.length)} className="focus-ring rounded-full border border-white/30 p-2 hover:bg-white/10"><ChevronLeft size={18} /></button><button type="button" aria-label="Next slide" onClick={() => setActive((active + 1) % slides.length)} className="focus-ring rounded-full border border-white/30 p-2 hover:bg-white/10"><ChevronRight size={18} /></button></div></div></div></div>;
}
