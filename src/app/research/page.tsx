'use client';

import React, { useState, useEffect, useMemo } from 'react';

import Link from 'next/link';
import {
  Activity,
  Cpu,
  Network,
  HeartPulse,
  Search,
  ArrowLeft,
  ChevronRight,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  BookOpen,
  FlaskConical,
  ExternalLink,
  ShieldCheck,
  Send
} from 'lucide-react';
import { ResearchPillar } from '@/types';



export default function ResearchPage() {
  
  const [researchList, setResearchList] = useState<ResearchPillar[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  const fetchResearch = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/research');
      if (res.ok) {
        const data = await res.json();
        if (data.success && Array.isArray(data.research) && data.research.length > 0) {
          setResearchList(data.research);
        } else {
          setResearchList([]);
        }
      } else {
        setResearchList([]);
      }
    } catch (err) {
      console.warn('Backend unavailable, using static research pillars:', err);
      setResearchList([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchResearch();
  }, []);

  const getPillarIcon = (iconName: string) => {
    switch (iconName) {
      case 'Cpu':
        return <Cpu className="w-6 h-6 text-maroon-700 dark:text-maroon-400" />;
      case 'Network':
        return <Network className="w-6 h-6 text-maroon-700 dark:text-maroon-400" />;
      case 'HeartPulse':
        return <HeartPulse className="w-6 h-6 text-maroon-700 dark:text-maroon-400" />;
      case 'Activity':
      default:
        return <Activity className="w-6 h-6 text-maroon-700 dark:text-maroon-400" />;
    }
  };

  
  // Filtering
  const filteredResearch = useMemo(() => {
    return researchList.filter((pillar) => {
      if (pillar.published === false) return false;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        pillar.title.toLowerCase().includes(q) ||
        (pillar.subtitle && pillar.subtitle.toLowerCase().includes(q)) ||
        pillar.description.toLowerCase().includes(q) ||
        (pillar.grantNumber && pillar.grantNumber.toLowerCase().includes(q)) ||
        pillar.technologies.some((t) => t.toLowerCase().includes(q));

      return matchesSearch;
    });
  }, [researchList, searchQuery]);

  return (
    <div className="min-h-screen bg-white dark:bg-[#120609] pt-24 pb-20 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mb-6">
          <Link
            href="/"
            className="hover:text-maroon-800 dark:hover:text-maroon-400 flex items-center gap-1 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Home
          </Link>
          <ChevronRight className="w-3 h-3 text-slate-400" />
          <span className="text-slate-900 dark:text-white font-medium">Research Thrusts</span>
        </nav>

        {/* Page Hero Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-8 mb-8 border-b border-slate-200 dark:border-slate-800">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-maroon-50 dark:bg-maroon-950/70 text-maroon-800 dark:text-maroon-300 border border-maroon-200/80 dark:border-maroon-800/80 text-xs font-bold uppercase tracking-wider mb-3">
              <FlaskConical className="w-3.5 h-3.5" />
              <span>Translational Science Programs</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight">
              Laboratory Research Thrusts
            </h1>
            <p className="mt-3 text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
              Bridging high-speed optical sensing, stochastic biomedical signal processing, continuous bio-telemetry, and foundation models for clinical bedside decision support.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 self-start lg:self-auto">
            <Link
              href="/publications"
              className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-xs font-semibold bg-maroon-800 hover:bg-maroon-900 text-white transition-colors shadow-sm"
            >
              <BookOpen className="w-3.5 h-3.5 text-rose-200" />
              <span>Explore Research Publications</span>
            </Link>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="bg-slate-50 dark:bg-[#18080e] p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-800/80 mb-10 space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search research thrusts, algorithms, sensor modalities, or grants..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-maroon-600 dark:focus:ring-maroon-500 shadow-xs"
              />
            </div>

            
          </div>
        </div>

        {/* Research Thrusts Cards */}
        {isLoading ? (
          <div className="py-20 text-center text-slate-500 text-sm">
            <div className="w-8 h-8 border-2 border-maroon-800 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
            Loading research programs...
          </div>
        ) : filteredResearch.length === 0 ? (
          <div className="py-20 text-center bg-slate-50 dark:bg-slate-900/40 rounded-2xl border border-slate-200 dark:border-slate-800 text-slate-500 text-sm">
            No research thrusts match your search criteria.
          </div>
        ) : (
          <div className="space-y-8">
            {filteredResearch.map((pillar, idx) => (
              <div
                key={pillar.id}
                id={`thrust-${pillar.id}`}
                className="rounded-3xl p-6 sm:p-8 bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 hover:border-maroon-300 dark:hover:border-maroon-900/60 transition-all shadow-sm hover:shadow-md flex flex-col lg:flex-row gap-8 items-start justify-between"
              >
                {/* Left details */}
                <div className="flex-1 space-y-4">
                  {/* Category Pill, Grant, Status */}
                  <div className="flex flex-wrap items-center gap-2">
                    <div className="w-10 h-10 rounded-2xl bg-maroon-50 dark:bg-maroon-950/80 border border-maroon-100 dark:border-maroon-900/80 flex items-center justify-center shrink-0">
                      {getPillarIcon(pillar.icon)}
                    </div>
                    <div>
                      <span className="text-[10px] font-mono text-maroon-800 dark:text-maroon-300 font-bold uppercase tracking-wider bg-maroon-50 dark:bg-maroon-950/80 px-2.5 py-1 rounded-full border border-maroon-200/60 dark:border-maroon-800/60">
                        Thrust {idx + 1}
                      </span>
                    </div>

                    

                    {pillar.grantNumber && (
                      <span className="text-[10px] font-mono text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-full">
                        {pillar.grantNumber}
                      </span>
                    )}
                  </div>

                  {/* Title & Subtitle */}
                  <div>
                    <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white leading-snug">
                      {pillar.title}
                    </h2>
                    {pillar.subtitle && (
                      <p className="text-sm font-semibold text-maroon-800 dark:text-maroon-400 mt-0.5">
                        {pillar.subtitle}
                      </p>
                    )}
                  </div>

                  {/* Description */}
                  <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
                    {pillar.description}
                  </p>

                  {/* Technologies & Signal Processing Methods */}
                  {pillar.technologies && pillar.technologies.length > 0 && (
                    <div className="pt-2">
                      <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">
                        Core Computational & Sensing Methods
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {pillar.technologies.map((tech) => (
                          <span
                            key={tech}
                            className="text-xs px-3 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-medium border border-slate-200/80 dark:border-slate-700/60"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Right Column: Performance Benchmarks & CTAs */}
                <div className="w-full lg:w-72 shrink-0 flex flex-col justify-between space-y-4 pt-4 lg:pt-0 lg:border-l lg:border-slate-100 lg:dark:border-slate-800/80 lg:pl-8">
                  {/* CTAs */}
                  <div className="pt-2">
                    <Link
                      href="/publications"
                      className="w-full py-2.5 px-4 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-semibold text-xs transition-colors flex items-center justify-center gap-1.5 shadow-xs"
                    >
                      <BookOpen className="w-3.5 h-3.5 text-maroon-800 dark:text-maroon-400" />
                      <span>View Related Publications</span>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Clinical Translation Mandate Banner */}
        <div className="mt-14 rounded-3xl bg-gradient-to-r from-maroon-950 via-slate-950 to-maroon-950 text-white p-8 sm:p-10 border border-maroon-900/60 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="max-w-2xl space-y-2">
            <div className="inline-flex items-center gap-2 text-rose-300 text-xs font-mono uppercase font-bold tracking-wider">
              <ShieldCheck className="w-4 h-4 text-rose-400" />
              <span>IRB-Governed Clinical Execution</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-extrabold text-white">
              Every Algorithm Must Survive Bedside Clinical Reality
            </h3>
            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
              We co-design and validate our optical sensing algorithms and telemetry foundation models directly alongside intensive care teams, cardiologists, and nursing staff in active inpatient environments.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
            <Link
              href="/publications"
              className="px-6 py-3 rounded-xl bg-white hover:bg-slate-100 text-maroon-950 font-bold text-xs tracking-wide transition-all shadow-md flex items-center gap-2"
            >
              <span>Explore Clinical Papers</span>
              <ArrowRight className="w-4 h-4 text-maroon-950" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};





