import React, { useState } from 'react';
import { Activity, Cpu, Network, HeartPulse, CheckCircle2, ArrowRight } from 'lucide-react';
import { RESEARCH_PILLARS } from '../data/labData';
import { ResearchPillar } from '../types';

interface ResearchSectionProps {
  onOpenCollab: () => void;
}

export const ResearchSection: React.FC<ResearchSectionProps> = ({ onOpenCollab }) => {
  const [activePillar, setActivePillar] = useState<string>(RESEARCH_PILLARS[0].id);

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
        {/* Section Heading */}
        <div className="max-w-3xl mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-maroon-50 dark:bg-maroon-950/60 border border-maroon-200/80 dark:border-maroon-800/80 text-maroon-800 dark:text-maroon-300 text-xs font-bold uppercase tracking-wider mb-2">
            Research Thrusts
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Interdisciplinary Clinical Informatics & Physiological Sensing
          </h2>
          <p className="text-slate-600 dark:text-slate-300 text-base mt-2 leading-relaxed">
            Our lab tackles fundamental biomedical engineering challenges by combining high-speed optical sensing, stochastic signal processing, and robust translational neural networks.
          </p>
        </div>

        {/* 4 Core Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {RESEARCH_PILLARS.map((pillar) => {
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
                  </div>
                </div>

                {/* Metrics Footer */}
                <div className="pt-3 border-t border-slate-200/80 dark:border-slate-700/60 grid grid-cols-2 gap-2 text-left">
                  {pillar.metrics.map((metric) => (
                    <div key={metric.label}>
                      <span className="text-[10px] text-slate-400 uppercase font-mono block">
                        {metric.label}
                      </span>
                      <span className="text-xs font-bold text-slate-900 dark:text-slate-100">
                        {metric.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Clinical Deployment Note */}
        <div className="mt-8 bg-maroon-950 text-white rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 border border-maroon-900 shadow-lg">
          <div className="max-w-2xl">
            <span className="text-rose-300 text-xs font-mono uppercase font-bold tracking-wider block mb-1">
              Translational Mandate
            </span>
            <h4 className="text-lg sm:text-xl font-bold text-white">
              Every Algorithm Must Survive Bedside Clinical Reality
            </h4>
            <p className="text-slate-300 text-xs sm:text-sm mt-1 leading-relaxed">
              We validate every computational pipeline directly alongside board-certified intensivists and cardiologists in accredited hospital environments under IRB protocols.
            </p>
          </div>
          <button
            onClick={onOpenCollab}
            className="whitespace-nowrap px-5 py-3 rounded-xl bg-white hover:bg-slate-100 text-maroon-950 font-bold text-xs tracking-wide transition-all shadow-md flex items-center gap-2"
          >
            <span>Partner in Clinical Trials</span>
            <ArrowRight className="w-4 h-4 text-maroon-950" />
          </button>
        </div>
      </div>
    </section>
  );
};
