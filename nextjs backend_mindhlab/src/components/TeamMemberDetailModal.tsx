'use client';

import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Mail,
  Globe,
  ArrowUpRight,
  GraduationCap,
  Award,
  BookOpen,
  Briefcase,
  Layers,
  Sparkles,
  Calendar,
  Building,
  CheckCircle2,
  ExternalLink,
} from 'lucide-react';
import { TeamMember } from '../types';

interface TeamMemberDetailModalProps {
  member: TeamMember | null;
  onClose: () => void;
  onEdit?: (member: TeamMember) => void;
  isAdmin?: boolean;
}

export const TeamMemberDetailModal: React.FC<TeamMemberDetailModalProps> = ({
  member,
  onClose,
  onEdit,
  isAdmin,
}) => {
  // Handle ESC key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    if (member) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [member, onClose]);

  if (!member) return null;

  const showEmail = member.showEmail !== false && member.email;
  const showSocials = member.showSocialLinks !== false;
  const showPubs = member.showPublications !== false && member.publications && member.publications.length > 0;
  const showProjects = member.showProjects !== false && member.projects && member.projects.length > 0;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex justify-end overflow-hidden" role="dialog" aria-modal="true">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm cursor-pointer"
          onClick={onClose}
          aria-label="Close modal overlay"
        />

        {/* Animated Sliding Detailed Profile Panel */}
        <motion.div
          initial={{ x: '100%', opacity: 0.8 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: '100%', opacity: 0 }}
          transition={{ duration: 0.42, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-10 w-full max-w-2xl sm:max-w-3xl lg:max-w-4xl h-full bg-white dark:bg-[#120609] border-l border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col overflow-hidden text-slate-900 dark:text-slate-100"
        >
          {/* Top Bar with Member Category & Actions */}
          <div className="sticky top-0 z-20 flex items-center justify-between px-6 py-4 bg-white/95 dark:bg-[#120609]/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-maroon-50 dark:bg-maroon-950/80 text-maroon-800 dark:text-maroon-300 border border-maroon-200 dark:border-maroon-800/60">
                <Building className="w-3.5 h-3.5" />
                {member.category || 'MINDH Lab'}
              </span>
              {isAdmin && onEdit && (
                <button
                  type="button"
                  onClick={() => onEdit(member)}
                  className="text-xs px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 hover:bg-maroon-50 dark:hover:bg-maroon-900/40 text-slate-700 dark:text-slate-300 hover:text-maroon-800 dark:hover:text-maroon-300 font-medium transition-colors"
                >
                  Edit Profile
                </button>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="p-2 rounded-lg text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-maroon-600"
                aria-label="Close detailed profile"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Scrollable Profile Body */}
          <div className="flex-1 overflow-y-auto px-6 sm:px-8 py-6 space-y-8">
            {/* Header Hero: Prominent Enlarged Profile Photo + Designation */}
            <div className="flex flex-col sm:flex-row gap-6 items-start">
              <div className="relative shrink-0 group">
                <img
                  src={member.avatarUrl}
                  alt={member.name}
                  referrerPolicy="no-referrer"
                  className="w-28 h-28 sm:w-36 sm:h-36 rounded-2xl object-cover border-3 border-maroon-700/40 shadow-lg"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400';
                  }}
                />
                <div className="absolute -bottom-2 -right-2 bg-maroon-800 text-white p-1.5 rounded-full shadow-md">
                  <CheckCircle2 className="w-4 h-4 text-white" />
                </div>
              </div>

              <div className="flex-1 min-w-0">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-snug">
                  {member.name}
                </h1>
                <p className="text-base sm:text-lg font-semibold text-maroon-800 dark:text-maroon-400 mt-1">
                  {member.role}
                </p>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5 flex items-center gap-1.5">
                  <GraduationCap className="w-4 h-4 text-maroon-700 shrink-0" />
                  <span>{member.credentials}</span>
                </p>

                {member.labRoleDetail && (
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-2.5 bg-slate-50 dark:bg-slate-850 p-2.5 rounded-lg border border-slate-200 dark:border-slate-800">
                    <span className="font-semibold text-slate-800 dark:text-slate-200">Lab Responsibility: </span>
                    {member.labRoleDetail}
                  </p>
                )}

                {/* Professional External Links & Socials Bar */}
                <div className="flex flex-wrap items-center gap-2 mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
                  {showEmail && (
                    <a
                      href={`mailto:${member.email}`}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium bg-slate-100 dark:bg-slate-800 hover:bg-maroon-50 dark:hover:bg-maroon-950/60 text-slate-700 dark:text-slate-300 hover:text-maroon-800 dark:hover:text-maroon-300 transition-colors"
                      title={member.email}
                    >
                      <Mail className="w-3.5 h-3.5 text-maroon-700" />
                      <span>{member.email}</span>
                    </a>
                  )}

                  {showSocials && (
                    <>
                      {member.scholarUrl && (
                        <a
                          href={member.scholarUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-slate-100 dark:bg-slate-800 hover:bg-maroon-50 dark:hover:bg-maroon-950/60 text-slate-700 dark:text-slate-300 hover:text-maroon-800 dark:hover:text-maroon-300 transition-colors"
                        >
                          <BookOpen className="w-3.5 h-3.5 text-maroon-700" />
                          <span>Google Scholar</span>
                          <ArrowUpRight className="w-3 h-3 text-slate-400" />
                        </a>
                      )}

                      {member.orcidUrl && (
                        <a
                          href={member.orcidUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 hover:bg-emerald-100 transition-colors"
                        >
                          <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                          <span>ORCID</span>
                          <ArrowUpRight className="w-3 h-3 text-emerald-600" />
                        </a>
                      )}

                      {member.researchGateUrl && (
                        <a
                          href={member.researchGateUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-teal-50 dark:bg-teal-950/40 text-teal-800 dark:text-teal-300 hover:bg-teal-100 transition-colors"
                        >
                          <span className="font-bold text-[11px]">RG</span>
                          <span>ResearchGate</span>
                          <ArrowUpRight className="w-3 h-3 text-teal-600" />
                        </a>
                      )}

                      {member.linkedinUrl && (
                        <a
                          href={member.linkedinUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-sky-50 dark:bg-sky-950/40 text-sky-800 dark:text-sky-300 hover:bg-sky-100 transition-colors"
                        >
                          <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                            <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                          </svg>
                          <span>LinkedIn</span>
                          <ArrowUpRight className="w-3 h-3 text-sky-600" />
                        </a>
                      )}

                      {member.websiteUrl && (
                        <a
                          href={member.websiteUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors"
                        >
                          <Globe className="w-3.5 h-3.5 text-maroon-700" />
                          <span>Website</span>
                          <ArrowUpRight className="w-3 h-3 text-slate-400" />
                        </a>
                      )}

                      {member.twitterUrl && (
                        <a
                          href={member.twitterUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors"
                        >
                          <span className="font-bold text-[11px]">X</span>
                          <span>Twitter</span>
                          <ArrowUpRight className="w-3 h-3 text-slate-400" />
                        </a>
                      )}

                      {member.instagramUrl && (
                        <a
                          href={member.instagramUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-pink-50 dark:bg-pink-950/40 text-pink-700 dark:text-pink-300 hover:bg-pink-100 transition-colors"
                        >
                          <span>Instagram</span>
                          <ArrowUpRight className="w-3 h-3 text-pink-500" />
                        </a>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Research Interests Tags */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2.5 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-maroon-700" />
                Research Interests & Specializations
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {member.focus.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs px-3 py-1 rounded-full font-medium bg-maroon-50 dark:bg-maroon-950/60 text-maroon-900 dark:text-maroon-200 border border-maroon-200 dark:border-maroon-800/60"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Detailed Biography */}
            <div className="space-y-3">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-maroon-700" />
                Biography & Academic Background
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line">
                {member.detailedBio || member.bio}
              </p>
            </div>

            {/* Major Research Contributions */}
            {member.contributions && member.contributions.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-maroon-700" />
                  Major Research Contributions
                </h3>
                <ul className="space-y-2">
                  {member.contributions.map((contribution, idx) => (
                    <li
                      key={idx}
                      className="flex items-start gap-2.5 text-sm text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-850 p-3 rounded-lg border border-slate-100 dark:border-slate-800"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-maroon-700 mt-2 shrink-0"></span>
                      <span className="leading-relaxed">{contribution}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Skills & Areas of Expertise */}
            {member.skills && member.skills.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-maroon-700" />
                  Technical Skills & Experimental Expertise
                </h3>
                <div className="flex flex-wrap gap-2">
                  {member.skills.map((skill) => (
                    <span
                      key={skill}
                      className="text-xs px-2.5 py-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-mono"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Current & Completed Projects */}
            {showProjects && (
              <div className="space-y-3">
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-2">
                  <Layers className="w-4 h-4 text-maroon-700" />
                  Current & Completed Projects
                </h3>
                <div className="grid grid-cols-1 gap-3">
                  {member.projects!.map((project, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/50 hover:border-maroon-300 dark:hover:border-maroon-700/60 transition-colors"
                    >
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                          {project.title}
                        </h4>
                        <span
                          className={`text-[11px] px-2 py-0.5 rounded-full font-semibold uppercase tracking-wider ${
                            project.status?.toLowerCase().includes('active')
                              ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                              : 'bg-slate-200 dark:bg-slate-750 text-slate-700 dark:text-slate-300'
                          }`}
                        >
                          {project.status || 'Active'}
                        </span>
                      </div>
                      {project.description && (
                        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mt-1">
                          {project.description}
                        </p>
                      )}
                      {project.link && (
                        <a
                          href={project.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-xs text-maroon-700 dark:text-maroon-400 font-medium hover:underline mt-2"
                        >
                          <span>Learn more</span>
                          <ArrowUpRight className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Awards & Achievements */}
            {member.awards && member.awards.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-2">
                  <Award className="w-4 h-4 text-amber-600" />
                  Awards & Honors
                </h3>
                <div className="space-y-2">
                  {member.awards.map((award, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-3 rounded-lg border border-amber-200/60 dark:border-amber-900/30 bg-amber-50/50 dark:bg-amber-950/20 text-xs text-slate-700 dark:text-slate-200"
                    >
                      <div className="flex items-center gap-2">
                        <Award className="w-4 h-4 text-amber-600 shrink-0" />
                        <div>
                          <p className="font-semibold text-slate-900 dark:text-white">{award.title}</p>
                          {award.organization && (
                            <p className="text-[11px] text-slate-500 dark:text-slate-400">{award.organization}</p>
                          )}
                        </div>
                      </div>
                      {award.year && (
                        <span className="font-mono font-bold text-amber-800 dark:text-amber-400 text-xs px-2 py-0.5 rounded bg-amber-100 dark:bg-amber-900/40">
                          {award.year}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Selected Publications */}
            {showPubs && (
              <div className="space-y-3">
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-maroon-700" />
                  Key Research Publications
                </h3>
                <div className="space-y-2.5">
                  {member.publications!.map((pub, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-850 hover:border-maroon-300 dark:hover:border-maroon-700/60 transition-colors"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1">
                          <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white leading-snug">
                            {pub.title}
                          </h4>
                          <p className="text-xs text-maroon-800 dark:text-maroon-400 italic mt-1 font-medium">
                            {pub.journalOrConference} ({pub.year})
                          </p>
                          {pub.doi && (
                            <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5 font-mono">
                              DOI: {pub.doi}
                            </p>
                          )}
                        </div>
                        {pub.link && (
                          <a
                            href={pub.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-maroon-800 dark:hover:text-maroon-400 hover:bg-maroon-50 transition-colors shrink-0"
                            aria-label={`Open publication: ${pub.title}`}
                          >
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sticky Bottom Actions Bar */}
          <div className="px-6 sm:px-8 py-4 bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <span className="text-xs text-slate-500 dark:text-slate-400">
              Press <kbd className="px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-800 font-mono text-[10px]">Esc</kbd> or click outside to return to grid
            </span>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-maroon-800 hover:bg-maroon-900 text-white text-xs font-bold tracking-wide transition-colors shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-maroon-600"
            >
              Close Profile
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
