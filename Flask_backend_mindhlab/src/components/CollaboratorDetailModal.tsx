import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Building2,
  MapPin,
  ExternalLink,
  Layers,
  FlaskConical,
  Users,
  CheckCircle2,
  Sparkles,
  ArrowUpRight,
  Shield,
  Send,
} from 'lucide-react';
import { Collaborator } from '../types';

interface CollaboratorDetailModalProps {
  collaborator: Collaborator | null;
  onClose: () => void;
  onOpenCollab?: () => void;
  isAdmin?: boolean;
  onEdit?: (collab: Collaborator) => void;
}

export const CollaboratorDetailModal: React.FC<CollaboratorDetailModalProps> = ({
  collaborator,
  onClose,
  onOpenCollab,
  isAdmin,
  onEdit,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (collaborator) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [collaborator, onClose]);

  if (!collaborator) return null;

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
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto" role="dialog" aria-modal="true">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm cursor-pointer"
          onClick={onClose}
          aria-label="Close modal overlay"
        />

        {/* Modal Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-10 w-full max-w-2xl bg-white dark:bg-[#120609] border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] text-slate-900 dark:text-slate-100"
        >
          {/* Header Bar with Image Banner */}
          <div className="relative h-44 sm:h-52 w-full overflow-hidden bg-slate-900">
            <img
              src={collaborator.logoUrl || 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=600'}
              alt={collaborator.name}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover opacity-60 filter brightness-90"
              onError={(e) => {
                (e.target as HTMLImageElement).src =
                  'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=600';
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

            {/* Top Close and Edit Buttons */}
            <div className="absolute top-4 right-4 flex items-center gap-2">
              {isAdmin && onEdit && (
                <button
                  type="button"
                  onClick={() => onEdit(collaborator)}
                  className="px-2.5 py-1 rounded-lg bg-black/50 hover:bg-black/70 text-white text-xs font-medium backdrop-blur-md border border-white/20 transition-colors"
                >
                  Edit Partner
                </button>
              )}
              <button
                type="button"
                onClick={onClose}
                className="p-1.5 rounded-lg bg-black/50 hover:bg-black/70 text-white backdrop-blur-md border border-white/20 transition-colors"
                aria-label="Close dialog"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Bottom Title on Banner */}
            <div className="absolute bottom-4 left-6 right-6">
              <span
                className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider border mb-2 backdrop-blur-md ${getCategoryBadgeClass(
                  collaborator.category
                )}`}
              >
                <Building2 className="w-3.5 h-3.5" />
                {collaborator.category}
              </span>
              <h2 className="text-xl sm:text-2xl font-extrabold text-white leading-snug">
                {collaborator.name}
              </h2>
              <p className="text-xs text-slate-300 flex items-center gap-1 mt-1 font-medium">
                <MapPin className="w-3.5 h-3.5 text-maroon-400 shrink-0" />
                <span>{collaborator.location}</span>
              </p>
            </div>
          </div>

          {/* Body Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Overview / Scope of Collaboration */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5 mb-2">
                <Sparkles className="w-3.5 h-3.5 text-maroon-700" />
                Translational Synergy & Research Mandate
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line">
                {collaborator.description}
              </p>
            </div>

            {/* Joint Focus Areas */}
            {collaborator.jointFocus && collaborator.jointFocus.length > 0 && (
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5 mb-2.5">
                  <Layers className="w-3.5 h-3.5 text-maroon-700" />
                  Key Research Thrusts & Joint Specializations
                </h3>
                <div className="flex flex-wrap gap-2">
                  {collaborator.jointFocus.map((focus) => (
                    <span
                      key={focus}
                      className="text-xs px-3 py-1 rounded-lg font-semibold bg-maroon-50 dark:bg-maroon-950/60 text-maroon-900 dark:text-maroon-200 border border-maroon-200 dark:border-maroon-800/60"
                    >
                      {focus}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Active Clinical Trials / Deployment Projects */}
            {collaborator.activeTrials && collaborator.activeTrials.length > 0 && (
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-2.5">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                  <FlaskConical className="w-3.5 h-3.5 text-maroon-700" />
                  Active Clinical Trials & Collaborative Protocols
                </h3>
                <ul className="space-y-1.5">
                  {collaborator.activeTrials.map((trial, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-xs text-slate-600 dark:text-slate-300">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <span className="font-medium">{trial}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Key Clinical & Scientific Contacts */}
            {collaborator.keyContacts && collaborator.keyContacts.length > 0 && (
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5 mb-2">
                  <Users className="w-3.5 h-3.5 text-maroon-700" />
                  Key Clinical & Scientific Liaisons
                </h3>
                <div className="space-y-1.5">
                  {collaborator.keyContacts.map((contact, idx) => (
                    <div
                      key={idx}
                      className="text-xs p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-850 text-slate-700 dark:text-slate-300 font-medium"
                    >
                      {contact}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Institutional Link */}
            {collaborator.websiteUrl && (
              <div className="pt-2">
                <a
                  href={collaborator.websiteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-maroon-800 dark:text-maroon-400 hover:underline"
                >
                  <span>Visit Institutional Portal</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            )}
          </div>

          {/* Bottom Actions */}
          <div className="p-4 sm:p-5 bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            >
              Close
            </button>
            {onOpenCollab && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenCollab();
                }}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-maroon-800 hover:bg-maroon-900 text-white text-xs font-bold shadow-sm transition-colors"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Inquire About Partnership</span>
              </button>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
