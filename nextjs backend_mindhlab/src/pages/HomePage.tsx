'use client';

import React from 'react';
import Link from 'next/link';
import { Hero } from '../components/Hero';
import { PublicationsPreview } from '../components/home/PublicationsPreview';
import { ResearchSection } from '../components/ResearchSection';
import { TeamSection } from '../components/TeamSection';
import { FacilitiesPreview } from '../components/home/FacilitiesPreview';
import { CollaboratorsSection } from '../components/CollaboratorsSection';
import { NewsPreview } from '../components/home/NewsPreview';
import { ArrowRight, Mail, Sparkles } from 'lucide-react';

interface HomePageProps {
  onOpenCollab?: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onOpenCollab = () => {} }) => {
  return (
    <div className="space-y-0">
      {/* 1. Home Section with Live Telemetry & Signal Monitor */}
      <Hero onOpenCollab={onOpenCollab} />

      {/* 2. Selected Publications Preview (Concise with "View All Publications" CTA) */}
      <PublicationsPreview />

      {/* 3. Research Thrusts & Translational Focus */}
      <ResearchSection onOpenCollab={onOpenCollab} />

      {/* 4. Team & Investigators */}
      <TeamSection />

      {/* 5. Facilities Preview Section (Concise with "Explore All Facilities" CTA) */}
      <FacilitiesPreview />

      {/* 6. Partner Collaborators & Clinical Network */}
      <CollaboratorsSection onOpenCollaborateModal={onOpenCollab} />

      {/* 7. News & Announcements Preview (Concise with "View All News" CTA) */}
      <NewsPreview />

      {/* 8. Contact & Collaboration Callout Banner */}
      <section id="contact" className="py-16 bg-white dark:bg-[#120609] border-t border-slate-200 dark:border-slate-800 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl bg-gradient-to-r from-maroon-900 via-maroon-800 to-maroon-950 p-8 sm:p-12 text-white shadow-xl relative overflow-hidden">
            <div className="absolute right-0 top-0 -mt-10 -mr-10 w-80 h-80 rounded-full bg-white/5 blur-2xl pointer-events-none"></div>
            <div className="relative z-10 max-w-2xl space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-white border border-white/20 text-xs font-semibold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>Partner With Us</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Accelerating Translational Digital Health Together
              </h2>
              <p className="text-sm sm:text-base text-rose-100/90 leading-relaxed">
                Whether you are a hospital clinical team seeking non-contact monitoring validation, a researcher interested in joint NSF/NIH proposals, or an industry partner, we invite you to connect.
              </p>
              <div className="pt-2 flex flex-wrap items-center gap-4">
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white text-maroon-950 font-bold text-xs hover:bg-slate-100 transition-all shadow-md"
                >
                  <Mail className="w-4 h-4" />
                  <span>Visit Contact & Inquiry Page</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <button
                  onClick={onOpenCollab}
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs border border-white/20 transition-colors"
                >
                  <span>Quick Collab Form</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
