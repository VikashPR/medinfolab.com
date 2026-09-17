'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Camera,
  Radio,
  Server,
  Microscope,
  Headphones,
  ShieldCheck,
  Cpu,
  Layers,
  Search,
  Check,
  ChevronRight,
  ArrowLeft,
  ArrowRight,
  CalendarCheck
} from 'lucide-react';
import { LabFacility } from '../types';
import { LAB_FACILITIES } from '../data/labData';

export const FacilitiesPage: React.FC = () => {
  const [facilities, setFacilities] = useState<LabFacility[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedTag, setSelectedTag] = useState<string>('All');

  const tags = ['All', 'Optics & Vision', 'Bio-Telemetry', 'High-Performance Computing', 'Microscopy', 'Acoustics & Simulation', 'Clinical Validation'];

  const fetchFacilities = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/facilities');
      if (res.ok) {
        const data = await res.json();
        if (data.success && Array.isArray(data.facilities)) {
          setFacilities(data.facilities);
        } else {
          setFacilities(LAB_FACILITIES);
        }
      } else {
        setFacilities(LAB_FACILITIES);
      }
    } catch (err) {
      console.warn('Backend unavailable, using static fallback:', err);
      setFacilities(LAB_FACILITIES);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFacilities();
  }, []);

  const getIcon = (name?: string) => {
    switch (name) {
      case 'Radio':
        return <Radio className="w-5 h-5 text-maroon-700 dark:text-maroon-400" />;
      case 'Server':
        return <Server className="w-5 h-5 text-maroon-700 dark:text-maroon-400" />;
      case 'Microscope':
        return <Microscope className="w-5 h-5 text-maroon-700 dark:text-maroon-400" />;
      case 'Headphones':
        return <Headphones className="w-5 h-5 text-maroon-700 dark:text-maroon-400" />;
      case 'ShieldCheck':
        return <ShieldCheck className="w-5 h-5 text-maroon-700 dark:text-maroon-400" />;
      case 'Cpu':
        return <Cpu className="w-5 h-5 text-maroon-700 dark:text-maroon-400" />;
      default:
        return <Camera className="w-5 h-5 text-maroon-700 dark:text-maroon-400" />;
    }
  };

  const getStatusBadge = (status?: string) => {
    const s = status || 'Operational';
    switch (s) {
      case 'Operational':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-900">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Operational
          </span>
        );
      case 'Reserved':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 px-2.5 py-0.5 rounded-full border border-amber-200 dark:border-amber-900">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
            In Trial Use
          </span>
        );
      case 'Maintenance':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-rose-700 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/60 px-2.5 py-0.5 rounded-full border border-rose-200 dark:border-rose-900">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
            Calibration
          </span>
        );
      default:
        return null;
    }
  };

  // Filtering
  const filteredFacilities = facilities.filter((f) => {
    const matchesTag = selectedTag === 'All' || f.tag === selectedTag;
    const query = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !query ||
      f.title.toLowerCase().includes(query) ||
      f.desc.toLowerCase().includes(query) ||
      (f.tag && f.tag.toLowerCase().includes(query)) ||
      (f.specs && f.specs.some((spec) => spec.toLowerCase().includes(query)));

    return matchesTag && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#120609] pt-24 pb-20 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mb-6">
          <Link href="/" className="hover:text-maroon-800 dark:hover:text-maroon-400 flex items-center gap-1 transition-colors">
            <ArrowLeft className="w-3.5 h-3.5" />
            Home
          </Link>
          <ChevronRight className="w-3 h-3 text-slate-400" />
          <span className="text-slate-900 dark:text-white font-medium">Laboratory Facilities</span>
        </nav>

        {/* Page Hero Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-8 mb-8 border-b border-slate-200 dark:border-slate-800">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-maroon-50 dark:bg-maroon-950/70 text-maroon-800 dark:text-maroon-300 border border-maroon-200/80 dark:border-maroon-800/80 text-xs font-bold uppercase tracking-wider mb-3">
              <Layers className="w-3.5 h-3.5" />
              <span>Experimental Infrastructure</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight">
              Laboratory Facilities & Testing Rigs
            </h1>
            <p className="mt-3 text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
              Purpose-built hardware instrumentation, calibrated illumination arrays, high-throughput GPU clusters, and clinical audit suites supporting bench-to-bedside translation.
            </p>
          </div>

          {/* Equipment Access CTA */}
          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/contact"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-maroon-800 hover:bg-maroon-900 text-white shadow-sm transition-colors"
            >
              <CalendarCheck className="w-3.5 h-3.5" />
              <span>Request Equipment Access</span>
            </Link>
          </div>
        </div>

        {/* Search & Tag Filter Bar */}
        <div className="bg-white dark:bg-[#18080e] p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-800/80 mb-8 space-y-4 shadow-sm">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search facilities by name, instrument, spec, or tag..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-maroon-500"
            />
          </div>

          {/* Tag Pills */}
          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 mr-1">
              Category:
            </span>
            {tags.map((t) => {
              const active = selectedTag === t;
              return (
                <button
                  key={t}
                  type="button"
                  onClick={() => setSelectedTag(t)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                    active
                      ? 'bg-maroon-800 text-white shadow-sm'
                      : 'bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-800'
                  }`}
                >
                  {t}
                </button>
              );
            })}
          </div>
        </div>

        {/* Results Info */}
        <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-6">
          <span>
            Showing <strong className="text-slate-900 dark:text-white">{filteredFacilities.length}</strong> of{' '}
            <strong className="text-slate-900 dark:text-white">{facilities.length}</strong> facility rigs
          </span>
          {(searchQuery || selectedTag !== 'All') && (
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedTag('All');
              }}
              className="text-maroon-700 dark:text-maroon-400 hover:underline font-medium"
            >
              Reset filters
            </button>
          )}
        </div>

        {/* Facilities Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div
                key={n}
                className="h-96 rounded-2xl bg-slate-200/70 dark:bg-slate-900 animate-pulse border border-slate-200 dark:border-slate-800"
              />
            ))}
          </div>
        ) : filteredFacilities.length === 0 ? (
          <div className="p-12 text-center rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/20">
            <Layers className="w-10 h-10 text-slate-400 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">
              No matching laboratory rigs
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
              Try adjusting your category filter or keyword query.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filteredFacilities.map((fac) => (
              <div
                key={fac.id}
                className="group flex flex-col justify-between rounded-2xl overflow-hidden bg-white dark:bg-[#15070b] border border-slate-200 dark:border-slate-800 hover:border-maroon-300 dark:hover:border-maroon-700 shadow-sm hover:shadow-md transition-all duration-300"
              >
                <div>
                  {/* Image with Tag & Status */}
                  <div className="relative h-52 overflow-hidden bg-slate-100 dark:bg-slate-900">
                    <img
                      src={fac.imageUrl}
                      alt={fac.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&q=80&w=800';
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60" />

                    {/* Tag badge */}
                    <div className="absolute top-3 left-3">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-slate-900/80 text-white border border-white/20 backdrop-blur-md">
                        {fac.tag}
                      </span>
                    </div>

                    {/* Status badge */}
                    <div className="absolute top-3 right-3 backdrop-blur-md bg-white/90 dark:bg-slate-900/90 rounded-full px-1">
                      {getStatusBadge(fac.status)}
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-6 space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-xl bg-maroon-50 dark:bg-maroon-950/70 border border-maroon-200 dark:border-maroon-900/70 shrink-0">
                        {getIcon(fac.iconName)}
                      </div>
                      <h2 className="text-lg font-bold text-slate-900 dark:text-white leading-snug group-hover:text-maroon-800 dark:group-hover:text-maroon-400 transition-colors">
                        {fac.title}
                      </h2>
                    </div>

                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed line-clamp-3">
                      {fac.desc}
                    </p>

                    {/* Specs Bullet List */}
                    {fac.specs && fac.specs.length > 0 && (
                      <div className="pt-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
                          Rig Specifications:
                        </span>
                        <ul className="space-y-1.5">
                          {fac.specs.map((spec, i) => (
                            <li
                              key={i}
                              className="text-xs text-slate-600 dark:text-slate-300 flex items-start gap-2"
                            >
                              <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                              <span className="leading-tight">{spec}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>

                {/* Card Footer */}
                <div className="p-6 pt-0 border-t border-slate-100 dark:border-slate-850/80 mt-4 flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                    MINDH Telemetry Lab
                  </span>
                  <Link
                    href="/contact"
                    className="inline-flex items-center gap-1 text-xs font-bold text-maroon-800 dark:text-maroon-300 hover:text-maroon-900 group-hover:translate-x-0.5 transition-transform"
                  >
                    <span>Request Schedule</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Equipment Access Banner */}
        <div className="mt-16 p-8 rounded-3xl bg-gradient-to-br from-slate-900 via-maroon-950 to-slate-950 text-white border border-maroon-900/40 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <h3 className="text-xl sm:text-2xl font-bold">
              Reserve Instrument Time for Academic or Clinical Studies
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed">
              Faculty investigators, visiting researchers, and graduate fellows may schedule time on our spectral calibration racks and high-density GPU nodes.
            </p>
          </div>
          <Link
            href="/contact"
            className="px-6 py-3 rounded-xl bg-white hover:bg-slate-100 text-maroon-950 font-bold text-xs sm:text-sm shadow-md transition-transform hover:scale-105 shrink-0"
          >
            Contact Facility Coordinator
          </Link>
        </div>
      </div>
    </div>
  );
};
