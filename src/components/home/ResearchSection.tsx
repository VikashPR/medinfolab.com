'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Activity, Cpu, Network, HeartPulse, ArrowRight } from 'lucide-react';

import { ResearchPillar } from '@/types';

interface ResearchSectionProps {
  onOpenCollab?: () => void;
}

export const ResearchSection: React.FC<ResearchSectionProps> = () => {
  const [pillars, setPillars] = useState<ResearchPillar[]>([]);
  const [activePillar, setActivePillar] = useState<string>('');

  useEffect(() => {
    let isMounted = true;
    async function loadResearch() {
      try {
        const res = await fetch('/api/research');
        if (res.ok) {
          const data = await res.json();
          if (data.success && Array.isArray(data.research) && data.research.length > 0 && isMounted) {
            setPillars(data.research);
            setActivePillar((prev) => (data.research.some((p: any) => p.id === prev) ? prev : data.research[0].id));
          }
        }
      } catch (err) {
        console.warn('Could not fetch /api/research, using static fallback:', err);
      }
    }
    loadResearch();
    return () => {
      isMounted = false;
    };
  }, []);

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Activity':
        return <Activity className="w-5 h-5 text-maroon-800 dark:text-maroon-400" />;
      case 'Cpu':
        return <Cpu className="w-5 h-5 text-maroon-800 dark:text-maroon-400" />;
      case 'Network':
        return <Network className="w-5 h-5 text-maroon-800 dark:text-maroon-400" />;
      case 'HeartPulse':
        return <HeartPulse className="w-5 h-5 text-maroon-800 dark:text-maroon-400" />;
      default:
        return <Activity className="w-5 h-5 text-maroon-800 dark:text-maroon-400" />;
    }
  };

  return (
    <section id="research" className="py-12 sm:py-16 bg-white dark:bg-[#120609] border-t border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading with Link to Dedicated Page */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-maroon-50 dark:bg-maroon-950/60 border border-maroon-200/80 dark:border-maroon-800/80 text-maroon-800 dark:text-maroon-300 text-xs font-bold uppercase tracking-wider mb-2">
              Research Thrusts
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Interdisciplinary Clinical Informatics &amp; Physiological Sensing
            </h2>
            <p className="text-slate-600 dark:text-slate-300 text-base mt-2 leading-relaxed">
              Our lab tackles fundamental biomedical engineering challenges by combining high-speed optical sensing, stochastic signal processing, and robust translational neural networks.
            </p>
          </div>

          <Link
            href="/research"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-maroon-900 dark:text-maroon-300 border border-slate-200 dark:border-slate-700 font-semibold text-xs transition-all shadow-xs group self-start sm:self-auto shrink-0"
          >
            <span>Explore All Research Programs</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        {/* 4 Core Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {pillars.map((pillar) => {
            const isSelected = activePillar === pillar.id;
            return (
              <div
                key={pillar.id}
                id={`research-pillar-${pillar.id}`}
                onClick={() => setActivePillar(pillar.id)}
                className={`cursor-pointer rounded-2xl p-6 border transition-all flex flex-col justify-between ${
                  isSelected
                    ? 'bg-maroon-50/30 dark:bg-slate-800/90 border-maroon-800 shadow-md ring-1 ring-maroon-800/20'
                    : 'bg-white dark:bg-slate-800/40 border-slate-200 dark:border-slate-700/80 hover:border-maroon-300 dark:hover:border-slate-600'
                }`}
              >
                <div>
                  {/* Icon & Category Pill */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 rounded-xl bg-maroon-50 dark:bg-maroon-950/80 flex items-center justify-center">
                      {getIcon(pillar.icon)}
                    </div>
                    <span className="text-[10px] font-mono text-maroon-800 dark:text-maroon-300 font-semibold uppercase tracking-wider bg-maroon-50/80 dark:bg-slate-900 px-2 py-0.5 rounded border border-maroon-200/60 dark:border-maroon-800/60">
                      Thrust
                    </span>
                  </div>

                  {/* Title & Subtitle */}
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white leading-snug mb-1">
                    {pillar.title}
                  </h3>
                  <p className="text-xs font-medium text-maroon-800 dark:text-maroon-400 mb-3">
                    {pillar.subtitle}
                  </p>

                  {/* Description */}
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
                    {pillar.description}
                  </p>

                  {/* Technologies */}
                  <div className="flex flex-wrap gap-1.5 mb-5">
                    {pillar.technologies.map((tech) => (
                      <span
                        key={tech}
                        className="text-[10px] px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-700/60 text-slate-700 dark:text-slate-300 font-medium"
                      >
                        {tech}
                      </span>
                    ))}
                  </div></div></div>);})}
        </div>

        </div>
    </section>
  );
};






