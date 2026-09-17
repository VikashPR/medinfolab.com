'use client';

import React from 'react';
import { ArrowDown, BookOpen, Activity, Sparkles, CheckCircle2, ShieldAlert } from 'lucide-react';
import { SignalMonitor } from './SignalMonitor';

interface HeroProps {
  onOpenCollab: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onOpenCollab }) => {
  return (
    <section id="home" className="relative pt-6 pb-12 sm:pt-10 sm:pb-16 lg:py-16 overflow-hidden bg-white dark:bg-[#120609]">
      {/* Subtle background glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-maroon-800/5 dark:bg-maroon-800/10 blur-[120px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: Headline, Mission Statement & Dual CTAs */}
          <div className="lg:col-span-6 flex flex-col justify-center space-y-6">
            {/* Clinical AI & Digital Health Pill */}
            <div className="inline-flex items-center gap-2 self-start px-3.5 py-1.5 rounded-full bg-maroon-50 dark:bg-maroon-950/60 border border-maroon-200/80 dark:border-maroon-800/80 text-maroon-800 dark:text-maroon-300 text-xs font-bold uppercase tracking-wider shadow-sm">
              <span className="w-2 h-2 rounded-full bg-maroon-700 animate-pulse"></span>
              Clinical AI & Digital Health
            </div>

            {/* High-Impact Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-[52px] font-extrabold text-slate-900 dark:text-white leading-[1.12] tracking-tight">
              Translational{' '}
              <span className="text-maroon-800 dark:text-maroon-400">Digital Health</span>{' '}
              Monitoring & AI
            </h1>

            {/* Supporting Mission Statement */}
            <p className="text-slate-600 dark:text-slate-300 text-base sm:text-lg leading-relaxed max-w-xl">
              Bridging the gap between advanced algorithms and clinical bedside deployment through physiological monitoring, biomedical signal processing, and medical informatics.
            </p>

            {/* Dual CTAs & Collaboration Trigger */}
            <div className="flex flex-wrap items-center gap-3.5 pt-2">
              <a
                href="#research"
                id="hero-cta-explore-research"
                className="px-6 py-3.5 bg-maroon-800 hover:bg-maroon-900 text-white rounded-xl font-semibold text-sm transition-all shadow-md hover:shadow-lg flex items-center gap-2"
              >
                <span>Explore Research</span>
                <ArrowDown className="w-4 h-4" />
              </a>

              <a
                href="#publications"
                id="hero-cta-view-publications"
                className="px-6 py-3.5 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-xl font-semibold text-sm hover:bg-maroon-50/50 hover:border-maroon-300 hover:text-maroon-800 dark:hover:bg-slate-700/80 transition-all shadow-sm flex items-center gap-2"
              >
                <BookOpen className="w-4 h-4 text-maroon-800 dark:text-maroon-400" />
                <span>View Publications</span>
              </a>

              <button
                onClick={onOpenCollab}
                className="px-4 py-3.5 text-xs font-semibold text-maroon-800 dark:text-maroon-300 hover:text-maroon-900 dark:hover:text-maroon-200 hover:underline"
              >
                Project Collaboration →
              </button>
            </div>

            {/* Trust & Clinical Rigor Badges */}
            <div className="pt-4 border-t border-slate-200/80 dark:border-slate-800 grid grid-cols-3 gap-4 text-left">
              <div>
                <span className="block text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">120+</span>
                <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">ICU Beds Validated</span>
              </div>
              <div>
                <span className="block text-xl sm:text-2xl font-bold text-maroon-800 dark:text-maroon-400">&lt;1.5 BPM</span>
                <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">rPPG Error Margin</span>
              </div>
              <div>
                <span className="block text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">Open</span>
                <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Science & Code</span>
              </div>
            </div>
          </div>

          {/* Right Column: Live Physiological Telemetry Card (Matching image layout) */}
          <div className="lg:col-span-6 flex flex-col justify-center">
            <SignalMonitor />
          </div>
        </div>
      </div>
    </section>
  );
};
