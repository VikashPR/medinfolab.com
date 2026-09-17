import React, { useState, useEffect } from 'react';
import {
  X,
  Building2,
  MapPin,
  Globe,
  Upload,
  Layers,
  FlaskConical,
  Users,
  Shield,
  Check,
} from 'lucide-react';
import { Collaborator, CollaboratorCategory } from '../types';

interface CollaboratorAdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Partial<Collaborator>) => Promise<void>;
  initialCollaborator?: Collaborator | null;
}

const CATEGORIES: CollaboratorCategory[] = [
  'Clinical & Hospital',
  'Academic Institution',
  'Industry & Technology',
  'Grant & Funding',
];

const PRESET_LOGOS = [
  { label: 'Hospital Campus', url: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=600' },
  { label: 'University Quad', url: 'https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&q=80&w=600' },
  { label: 'Clinical Center', url: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&q=80&w=600' },
  { label: 'Bio-Tech Lab', url: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=600' },
  { label: 'Engineering Hall', url: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&q=80&w=600' },
  { label: 'Tech Hardware', url: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=600' },
  { label: 'Medical Research', url: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&q=80&w=600' },
];

export const CollaboratorAdminModal: React.FC<CollaboratorAdminModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialCollaborator,
}) => {
  const [name, setName] = useState('');
  const [shortName, setShortName] = useState('');
  const [category, setCategory] = useState<CollaboratorCategory>('Clinical & Hospital');
  const [location, setLocation] = useState('');
  const [logoUrl, setLogoUrl] = useState('');
  const [description, setDescription] = useState('');
  const [jointFocusInput, setJointFocusInput] = useState('');
  const [keyContactsInput, setKeyContactsInput] = useState('');
  const [activeTrialsInput, setActiveTrialsInput] = useState('');
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [isFeatured, setIsFeatured] = useState(true);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initialCollaborator) {
      setName(initialCollaborator.name || '');
      setShortName(initialCollaborator.shortName || '');
      setCategory(initialCollaborator.category || 'Clinical & Hospital');
      setLocation(initialCollaborator.location || '');
      setLogoUrl(initialCollaborator.logoUrl || '');
      setDescription(initialCollaborator.description || '');
      setJointFocusInput(initialCollaborator.jointFocus ? initialCollaborator.jointFocus.join(', ') : '');
      setKeyContactsInput(initialCollaborator.keyContacts ? initialCollaborator.keyContacts.join('\n') : '');
      setActiveTrialsInput(initialCollaborator.activeTrials ? initialCollaborator.activeTrials.join('\n') : '');
      setWebsiteUrl(initialCollaborator.websiteUrl || '');
      setIsFeatured(initialCollaborator.isFeatured !== false);
    } else {
      setName('');
      setShortName('');
      setCategory('Clinical & Hospital');
      setLocation('');
      setLogoUrl('https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=600');
      setDescription('');
      setJointFocusInput('Clinical Telemetry, Patient Monitoring');
      setKeyContactsInput('');
      setActiveTrialsInput('');
      setWebsiteUrl('');
      setIsFeatured(true);
    }
    setError(null);
  }, [initialCollaborator, isOpen]);

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      setError('Image file size exceeds 2MB limit.');
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === 'string') {
        setLogoUrl(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Institution / Partner name is required.');
      return;
    }
    if (!location.trim()) {
      setError('Geographic location is required.');
      return;
    }
    if (!description.trim()) {
      setError('Collaboration description is required.');
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);

      const jointFocus = jointFocusInput
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);

      const keyContacts = keyContactsInput
        .split('\n')
        .map((s) => s.trim())
        .filter(Boolean);

      const activeTrials = activeTrialsInput
        .split('\n')
        .map((s) => s.trim())
        .filter(Boolean);

      await onSave({
        name: name.trim(),
        shortName: shortName.trim() || undefined,
        category,
        location: location.trim(),
        logoUrl: logoUrl.trim() || 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=600',
        description: description.trim(),
        jointFocus,
        keyContacts,
        activeTrials,
        websiteUrl: websiteUrl.trim() || undefined,
        isFeatured,
      });

      onClose();
    } catch (err: any) {
      setError(err?.message || 'Failed to save collaborator.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm" onClick={onClose} />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-2xl bg-white dark:bg-[#120609] rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 z-10 flex flex-col max-h-[90vh] overflow-hidden text-slate-900 dark:text-slate-100">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-900/60">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-maroon-800 text-white flex items-center justify-center">
              <Building2 className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                {initialCollaborator ? `Edit Partner: ${initialCollaborator.name}` : 'Add New Collaborator'}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Manage partner institutions, joint focus areas, and clinical trials.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mx-6 mt-4 p-3 rounded-lg bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 text-rose-800 dark:text-rose-300 text-xs">
            {error}
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                Institution / Partner Name *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Johns Hopkins Medicine"
                className="w-full px-3 py-2 text-xs sm:text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-maroon-600 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                Short Name / Label
              </label>
              <input
                type="text"
                value={shortName}
                onChange={(e) => setShortName(e.target.value)}
                placeholder="e.g. Johns Hopkins"
                className="w-full px-3 py-2 text-xs sm:text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-maroon-600 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                Partner Category *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as CollaboratorCategory)}
                className="w-full px-3 py-2 text-xs sm:text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-maroon-600 focus:outline-none"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                Geographic Location *
              </label>
              <input
                type="text"
                required
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Baltimore, Maryland, USA"
                className="w-full px-3 py-2 text-xs sm:text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-maroon-600 focus:outline-none"
              />
            </div>
          </div>

          {/* Logo / Image URL & Preset Selection */}
          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 space-y-3">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              Institutional Photo / Logo
            </label>
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <img
                src={logoUrl || 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=400'}
                alt="Logo preview"
                referrerPolicy="no-referrer"
                className="w-16 h-16 rounded-xl object-cover border border-slate-300 dark:border-slate-700 shrink-0"
              />
              <div className="flex-1 w-full space-y-2">
                <input
                  type="url"
                  value={logoUrl}
                  onChange={(e) => setLogoUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-3 py-1.5 text-xs rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-mono"
                />
                <label className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 cursor-pointer transition-colors">
                  <Upload className="w-3.5 h-3.5" />
                  <span>Upload Local File (Max 2MB)</span>
                  <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                </label>
              </div>
            </div>
            {/* Quick Presets */}
            <div className="flex flex-wrap gap-1 mt-1">
              {PRESET_LOGOS.map((p) => (
                <button
                  key={p.label}
                  type="button"
                  onClick={() => setLogoUrl(p.url)}
                  className={`text-[10px] px-2 py-0.5 rounded border transition-colors ${
                    logoUrl === p.url
                      ? 'bg-maroon-800 text-white border-maroon-800'
                      : 'bg-white dark:bg-slate-850 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
              Collaboration Description & Mandate *
            </label>
            <textarea
              rows={3}
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Detail the collaborative partnership scope, joint clinical pilot, or scientific objectives..."
              className="w-full px-3 py-2 text-xs sm:text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-maroon-600 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
              Joint Research Focus Tags (Comma separated)
            </label>
            <input
              type="text"
              value={jointFocusInput}
              onChange={(e) => setJointFocusInput(e.target.value)}
              placeholder="e.g. Zero-Contact ICU Sensing, Explainable AI, Pediatric Telemetry"
              className="w-full px-3 py-2 text-xs sm:text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-maroon-600 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                Active Trials & Protocols (One per line)
              </label>
              <textarea
                rows={3}
                value={activeTrialsInput}
                onChange={(e) => setActiveTrialsInput(e.target.value)}
                placeholder="Contactless ICU Vital Sign Extraction Trial (NCT05128911)&#10;Pediatric Early Warning Pilot"
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-maroon-600 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                Key Contacts & Liaisons (One per line)
              </label>
              <textarea
                rows={3}
                value={keyContactsInput}
                onChange={(e) => setKeyContactsInput(e.target.value)}
                placeholder="Dr. Sarah Al-Mansoor, MD (ICU Director)&#10;Prof. David K. Patel, MD, PhD"
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-maroon-600 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
              External Website URL
            </label>
            <input
              type="url"
              value={websiteUrl}
              onChange={(e) => setWebsiteUrl(e.target.value)}
              placeholder="https://institution.org"
              className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-mono"
            />
          </div>

          <label className="flex items-center gap-2 cursor-pointer pt-2">
            <input
              type="checkbox"
              checked={isFeatured}
              onChange={(e) => setIsFeatured(e.target.checked)}
              className="w-4 h-4 text-maroon-800 rounded border-slate-300 focus:ring-maroon-600"
            />
            <span className="text-xs font-semibold text-slate-900 dark:text-white">
              Highlight as Featured Partner in Consortium Header
            </span>
          </label>

          {/* Footer Actions */}
          <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 text-xs font-bold rounded-lg bg-maroon-800 hover:bg-maroon-900 text-white transition-colors shadow-sm disabled:opacity-50 flex items-center gap-1.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-maroon-600"
            >
              <Check className="w-4 h-4" />
              <span>{isSubmitting ? 'Saving...' : initialCollaborator ? 'Update Collaborator' : 'Add Collaborator'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
