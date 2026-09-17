'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Building2,
  MapPin,
  ExternalLink,
  Search,
  Sparkles,
  FlaskConical,
  ArrowUpRight,
  Handshake,
} from 'lucide-react';
import { Collaborator, CollaboratorCategory } from '../types';
import { LAB_COLLABORATORS } from '../data/labData';
import { CollaboratorDetailModal } from './CollaboratorDetailModal';

interface CollaboratorsSectionProps {
  onOpenCollaborateModal: () => void;
}

const CATEGORIES: { id: 'All' | CollaboratorCategory; label: string }[] = [
  { id: 'All', label: 'All Partners' },
  { id: 'Clinical & Hospital', label: 'Clinical & Hospitals' },
  { id: 'Academic Institution', label: 'Academic Institutions' },
  { id: 'Industry & Technology', label: 'Industry & Tech' },
  { id: 'Grant & Funding', label: 'Grant & Funding Agencies' },
];

export const CollaboratorsSection: React.FC<CollaboratorsSectionProps> = ({
  onOpenCollaborateModal,
}) => {
  const [collaborators, setCollaborators] = useState<Collaborator[]>(LAB_COLLABORATORS);
  const [selectedCategory, setSelectedCategory] = useState<'All' | CollaboratorCategory>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCollaborator, setSelectedCollaborator] = useState<Collaborator | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch collaborators from backend API on mount
  useEffect(() => {
    let isMounted = true;
    async function loadCollaborators() {
      try {
        setIsLoading(true);
        const res = await fetch('/api/collaborators');
        if (res.ok) {
          const data = await res.json();
          if (data?.success && Array.isArray(data.collaborators)) {
            if (isMounted) {
              setCollaborators(data.collaborators);
            }
          }
        }
      } catch (err) {
        console.warn('Could not fetch from /api/collaborators, using local defaults:', err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }
    loadCollaborators();
    return () => {
      isMounted = false;
    };
  }, []);

  // Filter logic
  const filteredCollaborators = useMemo(() => {
    return collaborators.filter((collab) => {
      const matchesCategory =
        selectedCategory === 'All' || collab.category === selectedCategory;

      const query = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !query ||
        collab.name.toLowerCase().includes(query) ||
        (collab.shortName && collab.shortName.toLowerCase().includes(query)) ||
        collab.location.toLowerCase().includes(query) ||
        collab.description.toLowerCase().includes(query) ||
        collab.jointFocus.some((f) => f.toLowerCase().includes(query));

      return matchesCategory && matchesSearch;
    });
  }, [collaborators, selectedCategory, searchQuery]);

  const getCategoryBadgeClass = (category: string) => {
    switch (category) {
      case 'Clinical & Hospital':
        return 'bg-emerald-50 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800';
      case 'Academic Institution':
        return 'bg-maroon-50 dark:bg-maroon-950/70 text-maroon-800 dark:text-maroon-300 border-maroon-200 dark:border-maroon-800';
      case 'Industry & Technology':
        return 'bg-sky-50 dark:bg-sky-950/70 text-sky-800 dark:text-sky-300 border-sky-200 dark:border-sky-800';
      case 'Grant & Funding':
        return 'bg-amber-50 dark:bg-amber-950/70 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-800';
      default:
        return 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700';
    }
  };

  return (
    <section
      id="collaborators"
      className="py-16 px-4 sm:px-6 lg:px-8 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-[#0e0407] transition-colors"
    >
      <div className="max-w-7xl mx-auto space-y-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-3 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-maroon-50 dark:bg-maroon-950/80 text-maroon-800 dark:text-maroon-300 border border-maroon-200 dark:border-maroon-800/80">
              <Handshake className="w-3.5 h-3.5 text-maroon-700 dark:text-maroon-400" />
              <span>Translational Consortium & Research Network</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Clinical & Academic Collaborators
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base leading-relaxed">
              MINDH Lab partners with academic medical centers, tertiary hospitals,
              engineering research institutes, and technology leaders worldwide to accelerate the
              bench-to-bedside translation of continuous physiological monitoring and AI diagnostics.
            </p>
          </div>
        </div>

        {/* Filter Bar & Search */}
        <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between pb-2">
          {/* Category Chips */}
          <div className="flex flex-wrap gap-1.5 sm:gap-2">
            {CATEGORIES.map((cat) => {
              const active = selectedCategory === cat.id;
              const count =
                cat.id === 'All'
                  ? collaborators.length
                  : collaborators.filter((c) => c.category === cat.id).length;

              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
                    active
                      ? 'bg-maroon-800 text-white shadow-sm ring-2 ring-maroon-800/20'
                      : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  <span>{cat.label}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                      active
                        ? 'bg-white/20 text-white'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search partner, city, focus..."
              className="w-full pl-9 pr-3.5 py-2 text-xs rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-maroon-600/30 focus:border-maroon-600 transition-all"
            />
          </div>
        </div>

        {/* Collaborators Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div
                key={n}
                className="h-72 rounded-2xl bg-slate-100 dark:bg-slate-900/60 animate-pulse border border-slate-200 dark:border-slate-800"
              />
            ))}
          </div>
        ) : filteredCollaborators.length === 0 ? (
          <div className="p-12 text-center rounded-2xl border border-dashed border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-900/40">
            <Building2 className="w-10 h-10 text-slate-400 mx-auto mb-3 opacity-60" />
            <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">
              No matching partners found
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
              Try adjusting your category filter or keyword query to explore our clinical and academic consortium.
            </p>
            {(selectedCategory !== 'All' || searchQuery) && (
              <button
                type="button"
                onClick={() => {
                  setSelectedCategory('All');
                  setSearchQuery('');
                }}
                className="mt-4 px-4 py-2 rounded-xl bg-maroon-50 text-maroon-800 dark:bg-maroon-950/60 dark:text-maroon-300 text-xs font-semibold hover:bg-maroon-100 transition-colors"
              >
                Clear all filters
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCollaborators.map((collab) => (
              <motion.div
                key={collab.id}
                layout
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                onClick={() => setSelectedCollaborator(collab)}
                className="group relative flex flex-col justify-between rounded-2xl p-6 bg-white dark:bg-[#15070b] border border-slate-200 dark:border-slate-800 hover:border-maroon-300 dark:hover:border-maroon-700 shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer overflow-hidden"
              >
                {/* Card Top: Category & Image */}
                <div className="space-y-3.5">
                  <div className="flex items-center justify-between gap-2">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${getCategoryBadgeClass(
                        collab.category
                      )}`}
                    >
                      <Building2 className="w-3 h-3" />
                      <span>{collab.category}</span>
                    </span>

                    {collab.isFeatured && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 px-2 py-0.5 rounded-md border border-amber-200 dark:border-amber-900/60">
                        <Sparkles className="w-2.5 h-2.5" />
                        Featured
                      </span>
                    )}
                  </div>

                  {/* Institution Visual & Identity */}
                  <div className="flex items-start gap-3.5">
                    <div className="w-14 h-14 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shrink-0">
                      <img
                        src={collab.logoUrl || 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=400'}
                        alt={collab.name}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=400';
                        }}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-base font-bold text-slate-900 dark:text-white leading-snug group-hover:text-maroon-800 dark:group-hover:text-maroon-400 transition-colors line-clamp-2">
                        {collab.name}
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-1 font-medium">
                        <MapPin className="w-3 h-3 text-maroon-700 dark:text-maroon-400 shrink-0" />
                        <span className="truncate">{collab.location}</span>
                      </p>
                    </div>
                  </div>

                  {/* Collaborative Mission / Scope */}
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed line-clamp-3">
                    {collab.description}
                  </p>

                  {/* Joint Focus Badges */}
                  {collab.jointFocus && collab.jointFocus.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {collab.jointFocus.slice(0, 3).map((focus) => (
                        <span
                          key={focus}
                          className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800"
                        >
                          {focus}
                        </span>
                      ))}
                      {collab.jointFocus.length > 3 && (
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-md bg-slate-100 dark:bg-slate-900 text-slate-500 dark:text-slate-400">
                          +{collab.jointFocus.length - 3} more
                        </span>
                      )}
                    </div>
                  )}

                  {/* Active Clinical Trial Badge if exists */}
                  {collab.activeTrials && collab.activeTrials.length > 0 && (
                    <div className="flex items-center gap-1.5 text-[11px] text-emerald-800 dark:text-emerald-300 font-semibold bg-emerald-50/70 dark:bg-emerald-950/40 px-2.5 py-1 rounded-lg border border-emerald-200/80 dark:border-emerald-900/50">
                      <FlaskConical className="w-3 h-3 text-emerald-600 shrink-0" />
                      <span className="truncate">{collab.activeTrials[0]}</span>
                    </div>
                  )}
                </div>

                {/* Card Footer: Detail view link */}
                <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-850/80 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                  <span className="text-[11px] font-medium text-slate-400">
                    {collab.keyContacts ? `${collab.keyContacts.length} Joint Lead(s)` : 'Affiliated Partner'}
                  </span>
                  <span className="inline-flex items-center gap-1 font-semibold text-maroon-800 dark:text-maroon-300 group-hover:translate-x-0.5 transition-transform">
                    <span>View Consortium Scope</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Collaborate Callout Card */}
        <div className="rounded-2xl bg-gradient-to-br from-maroon-900 to-slate-950 text-white p-6 sm:p-8 border border-maroon-800/40 shadow-xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="relative z-10 space-y-2 max-w-2xl text-center md:text-left">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-white/10 text-maroon-200 border border-white/15 backdrop-blur-sm">
              <Sparkles className="w-3 h-3 text-maroon-300" />
              <span>Open Academic & Clinical Inquiries</span>
            </span>
            <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              Interested in Joint Clinical Trials or Biosignal Research?
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              We welcome clinical hospital networks, university laboratories, medical device manufacturers, and
              fellowship sponsors to join our multi-center telemetry and physiological AI trials.
            </p>
          </div>

          <div className="relative z-10 shrink-0">
            <button
              type="button"
              onClick={onOpenCollaborateModal}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white hover:bg-slate-100 text-maroon-950 font-bold text-xs sm:text-sm shadow-lg hover:shadow-xl transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <Handshake className="w-4 h-4 text-maroon-800" />
              <span>Initiate Collaborative Partnership</span>
            </button>
          </div>

          {/* Subtle background light effect */}
          <div className="absolute -right-16 -bottom-16 w-64 h-64 bg-maroon-600/20 rounded-full blur-3xl pointer-events-none" />
        </div>
      </div>

      {/* Detail Slideout/Modal */}
      <CollaboratorDetailModal
        collaborator={selectedCollaborator}
        onClose={() => setSelectedCollaborator(null)}
        onOpenCollab={onOpenCollaborateModal}
      />
    </section>
  );
};
