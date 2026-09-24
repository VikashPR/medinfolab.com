import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getResearchAreas } from "@/lib/content";

export const metadata: Metadata = { title: "Research" };
export const dynamic = "force-dynamic";

export default async function ResearchPage() {
  const researchAreas = await getResearchAreas();

  return (
    <div className="container-wide py-20 sm:py-28">
      <div className="max-w-3xl">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-maroon-700">Research</p>
        <h1 className="mt-6 text-5xl font-extrabold leading-tight tracking-[-0.03em] text-slate-950 sm:text-6xl">
          Questions before solutions.
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
          We work across clinical information, physiological signals, and digital systems with attention to context and use.
        </p>
      </div>

      <div className="mt-20 grid gap-4">
        {researchAreas.length === 0 ? (
          <p className="text-slate-500 italic py-8">No research areas published yet.</p>
        ) : (
          researchAreas.map((area, index) => (
            <article
              id={area.slug}
              key={area.id}
              className="grid gap-6 rounded-2xl border border-slate-200 bg-white p-7 shadow-sm md:grid-cols-[100px_1fr_auto] md:items-start"
            >
              <span className="text-xs font-bold tracking-[0.2em] text-maroon-700">
                0{index + 1}
              </span>
              <div>
                <h2 className="text-2xl font-bold text-slate-950">{area.title}</h2>
                <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600">{area.description}</p>
                <span className="mt-4 inline-block text-xs font-semibold uppercase tracking-wider text-maroon-700">
                  {area.status}
                </span>
              </div>
              <Link
                href="/contact"
                className="focus-ring inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-maroon-800"
              >
                Discuss a project <ArrowRight size={14} />
              </Link>
            </article>
          ))
        )}
      </div>
    </div>
  );
}
