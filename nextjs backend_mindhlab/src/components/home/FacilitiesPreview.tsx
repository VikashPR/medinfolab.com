'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Layers, ArrowRight, Check, Camera, Radio, Server, Microscope, Headphones, ShieldCheck, Cpu } from 'lucide-react';
import { LabFacility } from '../../types';
import { LAB_FACILITIES } from '../../data/labData';

export const FacilitiesPreview: React.FC = () => {
  const [facilities, setFacilities] = useState<LabFacility[]>([]);
  const [totalCount, setTotalCount] = useState<number>(6);

  useEffect(() => {
    fetch('/api/facilities')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.facilities)) {
          setTotalCount(data.facilities.length);
          setFacilities(data.facilities.slice(0, 3));
        } else {
          setFacilities(LAB_FACILITIES.slice(0, 3));
        }
      })
      .catch(() => {
        setFacilities(LAB_FACILITIES.slice(0, 3));
      });
  }, []);

  const renderIcon = (name?: string) => {
    switch (name) {
      case 'Radio':
        return <Radio className="w-5 h-5 text-blue-600 dark:text-blue-400" />;
      case 'Server':
        return <Server className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />;
      case 'Microscope':
        return <Microscope className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />;
      case 'Headphones':
        return <Headphones className="w-5 h-5 text-amber-600 dark:text-amber-400" />;
      case 'ShieldCheck':
        return <ShieldCheck className="w-5 h-5 text-purple-600 dark:text-purple-400" />;
      case 'Camera':
      default:
        return <Camera className="w-5 h-5 text-maroon-700 dark:text-rose-300" />;
    }
  };

  return (
    <section id="facilities-preview" className="py-14 sm:py-20 bg-slate-50 dark:bg-[#15070c] border-t border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header with Title and "View All" Button */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-maroon-50 dark:bg-maroon-950/70 text-maroon-800 dark:text-maroon-300 border border-maroon-200/80 dark:border-maroon-800/80 text-xs font-bold uppercase tracking-wider mb-2">
              <Layers className="w-3.5 h-3.5" />
              <span>Experimental Testbenches</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Laboratory Facilities
            </h2>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400 max-w-xl">
              Specialized research testbeds for optical sensing, contactless vitals, and high-throughput physiological modeling.
            </p>
          </div>

          <Link
            href="/facilities"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-maroon-900 dark:text-maroon-300 border border-slate-200 dark:border-slate-700 font-semibold text-xs transition-all shadow-sm group self-start sm:self-auto"
          >
            <span>Explore All Facilities ({totalCount})</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        {/* 3 Highlighted Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {facilities.map((facility) => (
            <div
              key={facility.id}
              className="flex flex-col rounded-2xl bg-white dark:bg-[#1a080f] border border-slate-200 dark:border-slate-800/80 overflow-hidden hover:border-maroon-300 dark:hover:border-maroon-800/80 transition-all shadow-sm hover:shadow-md group"
            >
              {facility.imageUrl && (
                <div className="h-40 w-full overflow-hidden bg-slate-100 dark:bg-slate-900 relative">
                  <img
                    src={facility.imageUrl}
                    alt={facility.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute top-3 right-3">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-white/90 dark:bg-slate-900/90 text-slate-800 dark:text-slate-200 backdrop-blur-sm border border-slate-200/60 dark:border-slate-700/60">
                      {facility.status}
                    </span>
                  </div>
                </div>
              )}

              <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                <div className="space-y-2">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-maroon-800 dark:text-rose-300">
                      {renderIcon(facility.iconName)}
                    </div>
                    <div>
                      <span className="text-[11px] font-semibold text-maroon-800 dark:text-maroon-400 block">
                        {facility.tag}
                      </span>
                      <h3 className="text-base font-bold text-slate-900 dark:text-white leading-tight">
                        {facility.title}
                      </h3>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2">
                    {facility.desc}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400">
                    {facility.specs.length} Certified Specs
                  </span>
                  <Link
                    href="/facilities"
                    className="inline-flex items-center gap-1 text-xs font-bold text-maroon-800 dark:text-maroon-400 group-hover:underline"
                  >
                    <span>Learn More</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
