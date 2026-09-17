'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Bell, ArrowRight, Calendar, Sparkles } from 'lucide-react';
import { LabNewsItem } from '../../types';
import { LAB_NEWS } from '../../data/labData';

export const NewsPreview: React.FC = () => {
  const [newsList, setNewsList] = useState<LabNewsItem[]>([]);

  useEffect(() => {
    fetch('/api/news')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.news)) {
          setNewsList(data.news.slice(0, 3));
        } else {
          setNewsList(LAB_NEWS.slice(0, 3));
        }
      })
      .catch(() => {
        setNewsList(LAB_NEWS.slice(0, 3));
      });
  }, []);

  const getCategoryClass = (cat?: string) => {
    switch (cat) {
      case 'Paper Accepted':
        return 'bg-emerald-50 text-emerald-800 dark:bg-emerald-950/70 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800';
      case 'Grant Award':
        return 'bg-amber-50 text-amber-900 dark:bg-amber-950/70 dark:text-amber-300 border-amber-200 dark:border-amber-800';
      case 'Clinical Pilot':
        return 'bg-blue-50 text-blue-800 dark:bg-blue-950/70 dark:text-blue-300 border-blue-200 dark:border-blue-800';
      default:
        return 'bg-maroon-50 text-maroon-800 dark:bg-maroon-950/70 dark:text-maroon-300 border-maroon-200 dark:border-maroon-800';
    }
  };

  return (
    <section id="news-preview" className="py-14 sm:py-20 bg-slate-50 dark:bg-[#15070c] border-t border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-maroon-50 dark:bg-maroon-950/70 text-maroon-800 dark:text-maroon-300 border border-maroon-200/80 dark:border-maroon-800/80 text-xs font-bold uppercase tracking-wider mb-2">
              <Bell className="w-3.5 h-3.5" />
              <span>Latest Updates</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              News & Announcements
            </h2>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400 max-w-xl">
              Breakthroughs, clinical trial launches, grants, and conference proceedings from the MINDH team.
            </p>
          </div>

          <Link
            href="/news"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-maroon-900 dark:text-maroon-300 border border-slate-200 dark:border-slate-700 font-semibold text-xs transition-all shadow-sm group self-start sm:self-auto"
          >
            <span>View All News & Updates</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        {/* 3 News Cards Preview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {newsList.map((item, idx) => (
            <article
              key={item.id}
              className="flex flex-col rounded-2xl bg-white dark:bg-[#1a080f] border border-slate-200 dark:border-slate-800/80 overflow-hidden hover:border-maroon-300 dark:hover:border-maroon-800/80 transition-all shadow-sm hover:shadow-md group"
            >
              {item.image && (
                <div className="relative h-44 w-full overflow-hidden bg-slate-100 dark:bg-slate-900">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute top-3 left-3">
                    <span className={`px-2.5 py-0.5 rounded text-[11px] font-bold border backdrop-blur-md ${getCategoryClass(item.category)}`}>
                      {item.category || 'Announcement'}
                    </span>
                  </div>
                  {idx === 0 && (
                    <div className="absolute top-3 right-3">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500 text-slate-950">
                        <Sparkles className="w-2.5 h-2.5" /> New
                      </span>
                    </div>
                  )}
                </div>
              )}

              <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                <div className="space-y-2">
                  <div className="flex items-center gap-1 text-[11px] text-slate-400 font-medium">
                    <Calendar className="w-3 h-3" />
                    <span>{item.date}</span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 dark:text-white leading-snug group-hover:text-maroon-800 dark:group-hover:text-maroon-400 transition-colors line-clamp-2">
                    {item.title}
                  </h3>

                  <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed">
                    {item.summary || item.description}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-end">
                  <Link
                    href="/news"
                    className="inline-flex items-center gap-1 text-xs font-bold text-maroon-800 dark:text-maroon-400 group-hover:underline"
                  >
                    <span>Read Full Story</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};
