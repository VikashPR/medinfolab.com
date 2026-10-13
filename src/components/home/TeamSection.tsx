'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import {
  Users,
  Search,
  ArrowUpRight,
  ArrowRight,
  GraduationCap,
  Sparkles,
  Filter,
} from 'lucide-react';
import { TeamMember } from '@/types';


import {
  TEAM_PRIORITY_CATEGORIES,
  CategoryFilterKey,
  SubFilterKey,
  sortTeamMembersByPriority,
  filterTeamMembers,
  getTeamCategoryBadge,
  isExternalTrack,
} from '@/lib/teamUtils';

export const TeamSection: React.FC = () => {
  const prefersReducedMotion = useReducedMotion();
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);

  // Filtering & search
  const [activeCategory, setActiveCategory] = useState<CategoryFilterKey>('ALL');
  const [subFilter, setSubFilter] = useState<SubFilterKey>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Fetch team from backend API
  const fetchTeam = async () => {
    try {
      setIsLoading(true);
      const res = await fetch('/api/team');
      if (res.ok) {
        const data = await res.json();
        if (data.success && Array.isArray(data.team) && data.team.length > 0) {
          setTeam(data.team);
        }
      }
    } catch (err) {
      console.warn('Could not fetch team from /api/team, using local seed fallback:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTeam();
  }, []);

  // When changing category, reset sub-filter to ALL
  const handleCategoryChange = (key: CategoryFilterKey) => {
    setActiveCategory(key);
    setSubFilter('ALL');
  };

  // Filtered and priority-sorted list
  const filteredTeam = useMemo(() => {
    const filtered = filterTeamMembers(team, activeCategory, subFilter, searchQuery);
    return sortTeamMembersByPriority(filtered);
  }, [team, activeCategory, subFilter, searchQuery]);

  // Category counts
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {
      ALL: team.filter((m) => m.isPublic !== false).length,
    };

    TEAM_PRIORITY_CATEGORIES.forEach(({ key }) => {
      if (key === 'ALL') return;
      counts[key] = team.filter((m) => {
        if (m.isPublic === false) return false;
        if (key === 'Professor') return m.category === 'Professor' || m.category === 'Faculty';
        if (key === 'Post Doc') return m.category === 'Post Doc' || m.category === 'Researchers';
        if (key === 'PhD') return m.category === 'PhD' || m.category === 'PhD Scholars';
        if (key === 'M.tech') return m.category === 'M.tech' || m.category === 'Students';
        if (key === 'Interns') return (m.category as string) === 'Interns' || (m.category as string) === 'Interns';
        if (key === 'Project Staff') return m.category === 'Project Staff';
        if (key === 'Alumni') return m.category === 'Alumni';
        return m.category === key;
      }).length;
    });

    return counts;
  }, [team]);

  // Sub-counts for PhD and M.tech
  const subCounts = useMemo(() => {
    const phdMembers = team.filter(
      (m) => m.isPublic !== false && (m.category === 'PhD' || m.category === 'PhD Scholars')
    );
    const mtechMembers = team.filter(
      (m) => m.isPublic !== false && (m.category === 'M.tech' || m.category === 'Students')
    );

    return {
      phdAll: phdMembers.length,
      phdRegular: phdMembers.filter((m) => !isExternalTrack(m)).length,
      phdExternal: phdMembers.filter((m) => isExternalTrack(m)).length,
      mtechAll: mtechMembers.length,
      mtechRegular: mtechMembers.filter((m) => !isExternalTrack(m)).length,
      mtechExternal: mtechMembers.filter((m) => isExternalTrack(m)).length,
    };
  }, [team]);

  return (
    <section
      id="team"
      className="relative py-16 sm:py-20 bg-white dark:bg-[#120609] border-t border-slate-200 dark:border-slate-800 transition-colors"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-maroon-50 dark:bg-maroon-950/60 text-maroon-800 dark:text-maroon-300 border border-maroon-200/80 text-xs font-bold uppercase tracking-wider mb-2.5">
              <Users className="w-3.5 h-3.5" />
              <span>Interdisciplinary Laboratory Personnel</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Laboratory Research Team
            </h2>
            <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base mt-2 leading-relaxed">
              Professors, postdoctoral researchers, regular & external PhD scholars, M.Tech fellows, research interns, and project engineers collaborating on bedside clinical telemetry.
            </p>
          </div>

          <Link
            href="/team"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-maroon-900 dark:text-maroon-300 border border-slate-200 dark:border-slate-700 font-semibold text-xs transition-all shadow-xs group self-start lg:self-auto shrink-0"
          >
            <span>View Full Lab Directory</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        {/* Category Navigation Pills & Search Bar (In Strict Priority Order) */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4 pb-4 border-b border-slate-200 dark:border-slate-800">
          {/* Category Tabs: Professor, Post Doc, PhD, M.Tech, Interns, Project Staff */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full scrollbar-none">
            {TEAM_PRIORITY_CATEGORIES.map(({ key, label }) => {
              const count = categoryCounts[key] || 0;
              const isActive = activeCategory === key;
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => handleCategoryChange(key)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                    isActive
                      ? 'bg-maroon-800 text-white shadow-sm'
                      : 'bg-slate-100 dark:bg-slate-850 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-800'
                  }`}
                >
                  <span>{label}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                      isActive
                        ? 'bg-maroon-900/80 text-white'
                        : 'bg-slate-200/70 dark:bg-slate-750 text-slate-500 dark:text-slate-400'
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-72 shrink-0">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search member, skill, topic..."
              className="w-full pl-9 pr-4 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-maroon-600/30 focus:border-maroon-600 transition-all"
            />
          </div>
        </div>

        {/* Sub-Option Selector for PhD Track (Regular PhD vs External PhD) */}
        {activeCategory === 'PhD' && (
          <div className="flex items-center gap-2 mb-6 p-2 rounded-xl bg-slate-50 dark:bg-[#18090d] border border-slate-200/80 dark:border-slate-800 animate-in fade-in duration-200">
            <span className="text-xs font-bold text-slate-600 dark:text-slate-400 pl-2 flex items-center gap-1">
              <Filter className="w-3.5 h-3.5 text-maroon-700" />
              <span>PhD Scholar Sub-Option:</span>
            </span>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setSubFilter('ALL')}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                  subFilter === 'ALL'
                    ? 'bg-maroon-800 text-white shadow-xs'
                    : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 border border-slate-200 dark:border-slate-700'
                }`}
              >
                All PhD ({subCounts.phdAll})
              </button>
              <button
                type="button"
                onClick={() => setSubFilter('Regular')}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                  subFilter === 'Regular'
                    ? 'bg-sky-700 text-white shadow-xs'
                    : 'bg-white dark:bg-slate-800 text-sky-800 dark:text-sky-300 hover:bg-sky-50 border border-slate-200 dark:border-slate-700'
                }`}
              >
                Regular PhD ({subCounts.phdRegular})
              </button>
              <button
                type="button"
                onClick={() => setSubFilter('External')}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                  subFilter === 'External'
                    ? 'bg-purple-800 text-white shadow-xs ring-1 ring-purple-500'
                    : 'bg-purple-50 dark:bg-purple-950/40 text-purple-800 dark:text-purple-300 hover:bg-purple-100 border border-purple-200 dark:border-purple-800/80'
                }`}
              >
                External PhD ({subCounts.phdExternal})
              </button>
            </div>
          </div>
        )}

        {/* Sub-Option Selector for M.Tech Track (Regular M.Tech vs External M.Tech) */}
        {activeCategory === 'M.tech' && (
          <div className="flex items-center gap-2 mb-6 p-2 rounded-xl bg-slate-50 dark:bg-[#18090d] border border-slate-200/80 dark:border-slate-800 animate-in fade-in duration-200">
            <span className="text-xs font-bold text-slate-600 dark:text-slate-400 pl-2 flex items-center gap-1">
              <Filter className="w-3.5 h-3.5 text-maroon-700" />
              <span>M.Tech Sub-Option:</span>
            </span>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setSubFilter('ALL')}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                  subFilter === 'ALL'
                    ? 'bg-maroon-800 text-white shadow-xs'
                    : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 border border-slate-200 dark:border-slate-700'
                }`}
              >
                All M.Tech ({subCounts.mtechAll})
              </button>
              <button
                type="button"
                onClick={() => setSubFilter('Regular')}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                  subFilter === 'Regular'
                    ? 'bg-teal-700 text-white shadow-xs'
                    : 'bg-white dark:bg-slate-800 text-teal-800 dark:text-teal-300 hover:bg-teal-50 border border-slate-200 dark:border-slate-700'
                }`}
              >
                Regular M.Tech ({subCounts.mtechRegular})
              </button>
              <button
                type="button"
                onClick={() => setSubFilter('External')}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                  subFilter === 'External'
                    ? 'bg-indigo-800 text-white shadow-xs ring-1 ring-indigo-500'
                    : 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-800 dark:text-indigo-300 hover:bg-indigo-100 border border-indigo-200 dark:border-indigo-800/80'
                }`}
              >
                External M.Tech ({subCounts.mtechExternal})
              </button>
            </div>
          </div>
        )}

        {/* Member Grid / Loading / Empty states */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="h-80 rounded-2xl bg-slate-100 dark:bg-slate-800/50 animate-pulse border border-slate-200/60 dark:border-slate-800"
              />
            ))}
          </div>
        ) : filteredTeam.length === 0 ? (
          <div className="text-center py-16 px-4 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40">
            <Users className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">No personnel found</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
              No laboratory members match the selected category or search keywords.
            </p>
            <button
              type="button"
              onClick={() => {
                setActiveCategory('ALL');
                setSubFilter('ALL');
                setSearchQuery('');
              }}
              className="mt-4 px-4 py-1.5 text-xs font-semibold rounded-lg bg-maroon-50 text-maroon-800 dark:bg-maroon-950/80 dark:text-maroon-300 hover:bg-maroon-100 transition-colors"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredTeam.map((member) => {
              const badge = getTeamCategoryBadge(member);

              return (
                <motion.div
                  key={member.id}
                  layout={!prefersReducedMotion}
                  initial={prefersReducedMotion ? false : { opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35 }}
                  onClick={() => setSelectedMember(member)}
                  className="group relative bg-white dark:bg-[#18090d] rounded-2xl border border-slate-200/80 dark:border-slate-800 hover:border-maroon-300 dark:hover:border-maroon-800/80 p-4 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between cursor-pointer"
                >
                  <div>
                    {/* Header Row: Category Badge (with Regular/External indicators) */}
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span
                        className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${badge.colorClass}`}
                      >
                        {badge.label}
                      </span>
                    </div>

                    {/* Profile Photograph Container */}
                    <div className="relative mb-4 overflow-hidden rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200/60 dark:border-slate-750">
                      <img
                        src={member.avatarUrl}
                        alt={member.name}
                        referrerPolicy="no-referrer"
                        className="w-full h-44 sm:h-48 object-cover object-center group-hover:scale-104 transition-transform duration-300"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400';
                        }}
                      />
                      {/* Hover overlay hint */}
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                        <span className="text-[11px] font-semibold text-white flex items-center gap-1">
                          <span>View Full Profile</span>
                          <ArrowUpRight className="w-3.5 h-3.5" />
                        </span>
                      </div>
                    </div>

                    {/* Full Name & Position */}
                    <h3 className="font-bold text-slate-900 dark:text-white text-base leading-snug group-hover:text-maroon-800 dark:group-hover:text-maroon-400 transition-colors">
                      {member.name}
                    </h3>

                    <p className="text-xs font-semibold text-maroon-800 dark:text-maroon-400 mt-0.5">
                      {member.role}
                    </p>

                    {member.credentials && (
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 font-medium flex items-center gap-1">
                        <GraduationCap className="w-3 h-3 text-slate-400 shrink-0" />
                        <span className="truncate">{member.credentials}</span>
                      </p>
                    )}

                    {/* Short Bio snippet */}
                    <p className="text-xs text-slate-600 dark:text-slate-300 mt-2.5 line-clamp-3 leading-relaxed">
                      {member.bio}
                    </p>
                  </div>

                  {/* Skills/Tags Preview */}
                  {member.focus && member.focus.length > 0 && (
                    <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-wrap gap-1">
                      {member.focus.slice(0, 3).map((f) => (
                        <span
                          key={f}
                          className="text-[10px] px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-medium"
                        >
                          {f}
                        </span>
                      ))}
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {/* Modal Profile View */}
        </section>
  );
};

