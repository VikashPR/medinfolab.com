import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import {
  Users,
  Search,
  ArrowUpRight,
  GraduationCap,
  Sparkles,
} from 'lucide-react';
import { TeamMember, TeamCategory } from '../types';
import { LAB_TEAM } from '../data/labData';
import { TeamMemberDetailModal } from './TeamMemberDetailModal';

const ALL_CATEGORIES: Array<{ key: 'ALL' | TeamCategory; label: string }> = [
  { key: 'ALL', label: 'All Personnel' },
  { key: 'Faculty', label: 'Faculty & PIs' },
  { key: 'Researchers', label: 'Research Scientists & Postdocs' },
  { key: 'PhD Scholars', label: 'PhD Scholars' },
  { key: 'Students', label: 'Graduate Students' },
  { key: 'Alumni', label: 'Alumni' },
  { key: 'Collaborators', label: 'Clinical Collaborators' },
];

export const TeamSection: React.FC = () => {
  const prefersReducedMotion = useReducedMotion();
  const [team, setTeam] = useState<TeamMember[]>(LAB_TEAM);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);

  // Filtering & search
  const [activeCategory, setActiveCategory] = useState<'ALL' | TeamCategory>('ALL');
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

  // Filtered list
  const filteredTeam = useMemo(() => {
    return team.filter((member) => {
      // Obey isPublic
      if (member.isPublic === false) {
        return false;
      }

      // Category filter
      if (activeCategory !== 'ALL' && member.category !== activeCategory) {
        return false;
      }

      // Search filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = member.name.toLowerCase().includes(q);
        const matchesRole = member.role.toLowerCase().includes(q);
        const matchesBio = member.bio.toLowerCase().includes(q);
        const matchesFocus = member.focus.some((f) => f.toLowerCase().includes(q));
        const matchesSkills = member.skills?.some((s) => s.toLowerCase().includes(q));
        return matchesName || matchesRole || matchesBio || matchesFocus || matchesSkills;
      }

      return true;
    });
  }, [team, activeCategory, searchQuery]);

  // Category counts
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { ALL: team.filter((m) => m.isPublic !== false).length };
    team.forEach((m) => {
      if (m.isPublic !== false && m.category) {
        counts[m.category] = (counts[m.category] || 0) + 1;
      }
    });
    return counts;
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
              Faculty, Fellows & Researchers
            </h2>
            <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base mt-2 leading-relaxed">
              Biomedical engineers, clinician-scientists, machine learning researchers, and doctoral investigators collaborating on next-generation clinical intelligence.
            </p>
          </div>
        </div>

        {/* Category Navigation Pills & Search Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 pb-4 border-b border-slate-200 dark:border-slate-800">
          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
            {ALL_CATEGORIES.map(({ key, label }) => {
              const count = categoryCounts[key] || 0;
              const isActive = activeCategory === key;
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => setActiveCategory(key)}
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

        {/* Loading State Skeleton */}
        {isLoading && team.length === 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((n) => (
              <div
                key={n}
                className="h-80 rounded-2xl bg-slate-100 dark:bg-slate-850/60 animate-pulse border border-slate-200 dark:border-slate-800"
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
                    {/* Header Row: Category Badge */}
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-maroon-50 dark:bg-maroon-950/80 text-maroon-800 dark:text-maroon-300 border border-maroon-200/70 dark:border-maroon-800/60">
                        {member.category || 'Researcher'}
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

                  {/* Focus Tags & View Profile Link */}
                  <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80">
                    <div className="flex flex-wrap gap-1 mb-3">
                      {member.focus.slice(0, 2).map((tag) => (
                        <span
                          key={tag}
                          className="text-[10px] px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-850 text-slate-700 dark:text-slate-300 border border-slate-200/60 dark:border-slate-800 font-medium"
                        >
                          {tag}
                        </span>
                      ))}
                      {member.focus.length > 2 && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded-md text-slate-400 font-mono">
                          +{member.focus.length - 2}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 group-hover:text-maroon-800 dark:group-hover:text-maroon-400 font-semibold transition-colors">
                      <span>View Bio & Papers</span>
                      <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {/* Detailed Member Profile Side Panel Modal */}
      <TeamMemberDetailModal
        member={selectedMember}
        onClose={() => setSelectedMember(null)}
      />
    </section>
  );
};
