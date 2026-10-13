import Link from "next/link";
import { ArrowRight, ArrowUpRight, Building2, ChevronRight, Users } from "lucide-react";
import { HeroCarousel } from "@/components/hero-carousel";
import {
  getFacilities,
  getNewsItems,
  getPublications,
  getResearchAreas,
  getTeamMembers,
} from "@/lib/content";

export async function HomePage() {
  const [researchAreas, publications, facilities, newsItems, teamMembers] = await Promise.all([
    getResearchAreas(),
    getPublications(),
    getFacilities(),
    getNewsItems(),
    getTeamMembers(),
  ]);


  let heroSlides = newsItems.slice(0, 3).map(n => ({
    image: n.imageUrl || "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1800&q=85",
    label: n.category || "Laboratory news",
    title: n.title,
    text: n.summary,
    href: n.url || `/news`,
    action: "Read the latest"
  }));

  if (heroSlides.length === 0) {
    heroSlides = [
      {
        image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1800&q=85",
        label: "Research focus",
        title: "Understanding health through data and context.",
        text: "Our research connects clinical questions with methods that can be examined, tested, and improved.",
        href: "/research",
        action: "Explore research",
      }
    ];
  }

  return (
    <>
      

      <section className="container-wide py-6 sm:py-10">
        <HeroCarousel slides={heroSlides} />
      </section>

      {/* Research Section */}
      <section className="border-y border-slate-200 bg-white">
        <div className="container-wide grid gap-12 py-20 sm:py-24 lg:grid-cols-[.72fr_1.28fr] lg:items-start">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-maroon-700">
              Research at MINDH
            </p>
            <h2 className="mt-5 max-w-md text-4xl font-extrabold leading-[1.08] tracking-[-0.03em] text-slate-950 sm:text-5xl">
              Questions before solutions.
            </h2>
            <Link
              href="/research"
              className="focus-ring mt-8 inline-flex items-center gap-2 text-sm font-bold text-maroon-800"
            >
              Explore the research program <ArrowRight size={15} />
            </Link>
          </div>
          <div className="divide-y divide-slate-200 border-y border-slate-200">
            {researchAreas.length === 0 ? (
              <p className="py-7 text-sm text-slate-500 italic">No research areas published yet.</p>
            ) : (
              researchAreas.map((area, index) => (
                <Link
                  key={area.id}
                  href={`/research#${area.slug}`}
                  className="focus-ring group grid gap-5 py-7 sm:grid-cols-[56px_1fr_auto] sm:items-start"
                >
                  <span className="text-xs font-bold tracking-[0.2em] text-maroon-700">
                    0{index + 1}
                  </span>
                  <span className="flex flex-col sm:flex-row gap-6 items-start">
                      {area.imageUrl && (
                        <span className="block w-full sm:w-48 h-32 shrink-0 rounded-xl overflow-hidden bg-slate-100 relative">
                          <img src={area.imageUrl} alt={area.title} className="w-full h-full object-cover" />
                        </span>
                      )}
                      <span>
                        <span className="block text-2xl font-bold tracking-tight text-slate-950 group-hover:text-maroon-800">
                          {area.title}
                        </span>
                        <span className="mt-2 block max-w-xl text-sm leading-6 text-slate-600">
                          {area.summary}
                        </span>
                      </span>
                    </span>
                  <ChevronRight
                    size={18}
                    className="hidden text-maroon-700 transition-transform group-hover:translate-x-1 sm:mt-1 sm:block"
                  />
                </Link>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Publications Section */}
      <section className="container-wide border-b border-slate-200 py-20 sm:py-24">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-maroon-700">
              Selected work
            </p>
            <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-slate-950 sm:text-4xl">
              From the publication record
            </h2>
          </div>
          <Link
            href="/publications"
            className="focus-ring inline-flex items-center gap-2 text-sm font-bold text-maroon-800"
          >
            All publications <ArrowUpRight size={16} />
          </Link>
        </div>
        <div className="mt-10 grid gap-4 lg:grid-cols-2">
          {publications.length === 0 ? (
            <p className="text-sm text-slate-500 italic">No publications recorded yet.</p>
          ) : (
            publications.slice(0, 2).map((publication) => (
              <article key={publication.id} className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm">
                <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-maroon-700">
                  <span>{publication.type}</span>
                  <span>{publication.year}</span>
                </div>
                <h3 className="mt-12 text-xl font-bold leading-snug text-slate-950">
                  {publication.title}
                </h3>
                <p className="mt-3 text-sm text-slate-500">{publication.venue}</p>
                <p className="mt-5 text-sm leading-7 text-slate-600">{publication.abstract}</p>
              </article>
            ))
          )}
        </div>
      </section>

      {/* Facilities Section */}
      <section className="bg-maroon-50">
        <div className="container-wide grid gap-12 py-20 sm:py-24 lg:grid-cols-[.8fr_1.2fr] lg:items-center">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-maroon-700">
              Research environments
            </p>
            <h2 className="mt-5 text-3xl font-extrabold tracking-tight text-slate-950 sm:text-4xl">
              Places to observe, build, and learn.
            </h2>
            <p className="mt-5 max-w-md text-base leading-7 text-slate-600">
              Our facilities support collaborative investigation across data, signals, and digital systems.
            </p>
            <Link
              href="/facilities"
              className="focus-ring mt-7 inline-flex items-center gap-2 rounded-xl bg-maroon-800 px-5 py-3 text-sm font-bold text-white hover:bg-maroon-900"
            >
              Explore facilities <Building2 size={16} />
            </Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {facilities.length === 0 ? (
              <p className="text-sm text-slate-500 italic">No facilities added yet.</p>
            ) : (
              facilities.map((facility) => (
                <article key={facility.id} className="overflow-hidden rounded-2xl border border-maroon-100 bg-white shadow-sm flex flex-col">
                  {facility.imageUrl && (
                    <div className="h-40 w-full overflow-hidden bg-slate-100 relative">
                      <img src={facility.imageUrl} alt={facility.name} className="w-full h-full object-cover" />
                    </div>
                  )}
                  <div className="p-6">
                    <p className="text-xs font-bold uppercase tracking-wider text-maroon-700">
                      {facility.category}
                    </p>
                    <h3 className="mt-6 text-xl font-bold text-slate-950">{facility.name}</h3>
                    <p className="mt-3 text-sm leading-6 text-slate-600 line-clamp-3">{facility.summary}</p>
                  </div>
                </article>
              ))
            )}
          </div>
        </div>
      </section>

      {/* News & Events Section */}
      <section className="container-wide border-b border-slate-200 py-20 sm:py-24">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-maroon-700">
              News &amp; events
            </p>
            <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-slate-950 sm:text-4xl">
              From the laboratory
            </h2>
          </div>
          <Link
            href="/news"
            className="focus-ring inline-flex items-center gap-2 text-sm font-bold text-maroon-800"
          >
            View all news <ArrowUpRight size={16} />
          </Link>
        </div>
        <div className="mt-10 grid gap-4 md:grid-cols-2">
          {newsItems.length === 0 ? (
            <p className="text-sm text-slate-500 italic">No news published yet.</p>
          ) : (
            newsItems.map((item) => (
              <article key={item.id} className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm flex flex-col">
                {item.imageUrl && (
                  <div className="h-48 w-full overflow-hidden bg-slate-100 relative">
                    <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" />
                  </div>
                )}
                <div className="p-7">
                  <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-maroon-700">
                    <span>{item.category}</span>
                    <time dateTime={item.date}>{item.date}</time>
                  </div>
                  <h3 className="mt-8 text-xl font-bold text-slate-950">{item.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-slate-600 line-clamp-3">{item.summary}</p>
                </div>
              </article>
            ))
          )}
        </div>
      </section>

      
      {/* Team Section */}
      <section className="border-y border-slate-200 bg-slate-50 py-20 sm:py-24">
        <div className="container-wide">
          <div className="flex flex-col items-center text-center">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-maroon-700">The People</p>
            <h2 className="mt-5 text-3xl font-extrabold tracking-tight text-slate-950 sm:text-4xl">
              Meet our team
            </h2>
            <Link href="/team" className="focus-ring mt-7 inline-flex items-center gap-2 rounded-xl bg-white border border-slate-200 px-5 py-3 text-sm font-bold text-slate-900 hover:bg-slate-50 shadow-sm">
              View all members <Users size={16} />
            </Link>
          </div>
          <div className="mt-16 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {teamMembers.length === 0 ? (
              <p className="col-span-full text-center text-sm text-slate-500 italic">No team members added yet.</p>
            ) : (
              teamMembers.slice(0, 4).map((member) => (
                <div key={member.id} className="flex flex-col items-center text-center p-6 bg-white rounded-2xl border border-slate-200 shadow-sm">
                  <div className="h-24 w-24 overflow-hidden rounded-full bg-slate-100 border-4 border-white shadow-sm mb-4">
                    {member.avatarUrl ? (
                      <img src={member.avatarUrl} alt={member.name} className="h-full w-full object-cover" />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-slate-100 text-xl font-bold text-slate-400">
                        {member.initials}
                      </div>
                    )}
                  </div>
                  <h3 className="font-bold text-slate-900">{member.name}</h3>
                  <p className="text-xs text-slate-500 mt-1">{member.role}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      <section className="container-wide pb-24 sm:pb-28">
        <div className="overflow-hidden rounded-[2rem] bg-gradient-to-r from-maroon-900 via-[#8d3048] to-[#eadfe1] p-8 shadow-[0_24px_60px_-28px_rgba(91,16,35,.55)] sm:p-12 lg:p-16">
          <div className="max-w-3xl">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-white/75">Connect</p>
            <h2 className="mt-5 max-w-3xl text-4xl font-extrabold leading-tight tracking-[-0.02em] text-white sm:text-5xl">
              Have a question about the work?
            </h2>
            <p className="mt-5 max-w-2xl text-base leading-7 text-white/80">
              Learn more about our research and how to contact the laboratory.
            </p>
            <Link
              href="/contact"
              className="focus-ring mt-8 inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3.5 text-sm font-bold text-maroon-900 hover:bg-rose-50"
            >
              Contact the laboratory <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
