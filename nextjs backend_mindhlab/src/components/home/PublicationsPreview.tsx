'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { BookOpen, ArrowRight, FileText, ExternalLink, Sparkles } from 'lucide-react';
import { Publication, PublicationTopic } from '../../types';
import { LAB_PUBLICATIONS } from '../../data/labData';

export const PublicationsPreview: React.FC = () => {
  const [publications, setPublications] = useState<Publication[]>([]);
  const [totalCount, setTotalCount] = useState<number>(5);

  useEffect(() => {
    fetch('/api/publications')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.publications)) {
          setTotalCount(data.publications.length);
          setPublications(data.publications.slice(0, 3));
        } else {
          setPublications(LAB_PUBLICATIONS.slice(0, 3));
        }
      })
      .catch(() => {
        setPublications(LAB_PUBLICATIONS.slice(0, 3));
      });
  }, []);

  const getTopicColorClasses = (topic: PublicationTopic) => {
    switch (topic) {
      case 'Physiological Monitoring':
        return 'bg-maroon-50 text-maroon-800 dark:bg-maroon-950/70 dark:text-maroon-300 border-maroon-200 dark:border-maroon-800';
      case 'Clinical AI':
        return 'bg-emerald-50 text-emerald-800 dark:bg-emerald-950/70 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800';
      case 'Signal Processing':
        return 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200 border-slate-200 dark:border-slate-700';
      default:
        return 'bg-rose-50 text-rose-900 dark:bg-rose-950/70 dark:text-rose-300 border-rose-200 dark:border-rose-800';
    }
  };

  return (
    <section id="publications-preview" className="py-14 sm:py-20 bg-white dark:bg-[#120609] border-t border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-maroon-50 dark:bg-maroon-950/70 text-maroon-800 dark:text-maroon-300 border border-maroon-200/80 dark:border-maroon-800/80 text-xs font-bold uppercase tracking-wider mb-2">
              <BookOpen className="w-3.5 h-3.5" />
              <span>Academic Output</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Selected Publications
            </h2>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400 max-w-xl">
              Recent peer-reviewed articles in IEEE, Nature Digital Medicine, and clinical informatics journals.
            </p>
          </div>

          <Link
            href="/publications"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-maroon-900 dark:text-maroon-300 border border-slate-200 dark:border-slate-700 font-semibold text-xs transition-all shadow-sm group self-start sm:self-auto"
          >
            <span>View All Publications ({totalCount})</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        {/* 3 Publication Cards Preview */}
        <div className="space-y-4">
          {publications.map((pub, idx) => (
            <div
              key={pub.id}
              className="p-5 sm:p-6 rounded-2xl bg-slate-50 dark:bg-[#18080f] border border-slate-200 dark:border-slate-800/80 hover:border-maroon-300 dark:hover:border-maroon-800 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 group"
            >
              <div className="flex-1 space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${getTopicColorClasses(pub.topic)}`}>
                    {pub.topic}
                  </span>
                  <span className="text-xs text-slate-500 font-semibold">{pub.year}</span>
                  {idx === 0 && (
                    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300">
                      <Sparkles className="w-2.5 h-2.5" /> Latest
                    </span>
                  )}
                </div>

                <h3 className="text-base font-bold text-slate-900 dark:text-white leading-snug group-hover:text-maroon-800 dark:group-hover:text-maroon-400 transition-colors">
                  {pub.title}
                </h3>

                <p className="text-xs text-slate-600 dark:text-slate-300">
                  {pub.authors} — <span className="italic text-maroon-800 dark:text-maroon-400">{pub.journal}</span>
                </p>

                {pub.highlight && (
                  <p className="text-xs text-emerald-800 dark:text-emerald-300 font-medium">
                    ⚡ {pub.highlight}
                  </p>
                )}
              </div>

              <div className="flex items-center gap-3 self-end md:self-center shrink-0">
                <Link
                  href="/publications"
                  className="inline-flex items-center gap-1 px-3.5 py-2 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-semibold border border-slate-200 dark:border-slate-700 shadow-sm"
                >
                  <FileText className="w-3.5 h-3.5 text-maroon-800 dark:text-maroon-400" />
                  <span>Read Paper & BibTeX</span>
                  <ArrowRight className="w-3 h-3 ml-1" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
