import React, { useState, useEffect } from 'react';
import {
  X,
  Plus,
  Trash2,
  Upload,
  Link as LinkIcon,
  BookOpen,
  Layers,
  Award,
  Shield,
  Eye,
  Check,
  Building,
} from 'lucide-react';
import { TeamMember, TeamCategory, ProjectItem, PublicationItem, AwardItem } from '../types';

interface TeamAdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (memberData: Partial<TeamMember>) => Promise<void>;
  initialMember?: TeamMember | null;
}

const CATEGORIES: TeamCategory[] = [
  'Faculty',
  'Researchers',
  'PhD Scholars',
  'Students',
  'Alumni',
  'Collaborators',
];

const PHOTO_PRESETS = [
  { label: 'Director / PI', url: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=600' },
  { label: 'Vision Scientist', url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=600' },
  { label: 'Signal Fellow', url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=600' },
  { label: 'AI Doctoral', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=600' },
  { label: 'Acoustics RA', url: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=600' },
  { label: 'Alumni Postdoc', url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=600' },
  { label: 'Clinical MD', url: 'https://images.unsplash.com/photo-1594824813571-638f02614d3f?auto=format&fit=crop&q=80&w=600' },
  { label: 'Biomedical Engineer', url: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&q=80&w=600' },
];

export const TeamAdminModal: React.FC<TeamAdminModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialMember,
}) => {
  const [activeTab, setActiveTab] = useState<'basics' | 'projects' | 'pubs' | 'links' | 'visibility'>('basics');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form states
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [category, setCategory] = useState<TeamCategory>('Researchers');
  const [credentials, setCredentials] = useState('');
  const [bio, setBio] = useState('');
  const [detailedBio, setDetailedBio] = useState('');
  const [labRoleDetail, setLabRoleDetail] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [focusInput, setFocusInput] = useState('');
  const [skillsInput, setSkillsInput] = useState('');
  const [contributionsInput, setContributionsInput] = useState('');

  // Socials / Links
  const [email, setEmail] = useState('');
  const [scholarUrl, setScholarUrl] = useState('');
  const [orcidUrl, setOrcidUrl] = useState('');
  const [researchGateUrl, setResearchGateUrl] = useState('');
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [linkedinUrl, setLinkedinUrl] = useState('');
  const [twitterUrl, setTwitterUrl] = useState('');
  const [instagramUrl, setInstagramUrl] = useState('');

  // Complex lists
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [publications, setPublications] = useState<PublicationItem[]>([]);
  const [awards, setAwards] = useState<AwardItem[]>([]);

  // Visibility toggles
  const [showEmail, setShowEmail] = useState(true);
  const [showSocialLinks, setShowSocialLinks] = useState(true);
  const [showPublications, setShowPublications] = useState(true);
  const [showProjects, setShowProjects] = useState(true);
  const [isPublic, setIsPublic] = useState(true);

  // Populate when editing
  useEffect(() => {
    if (initialMember) {
      setName(initialMember.name || '');
      setRole(initialMember.role || '');
      setCategory(initialMember.category || 'Researchers');
      setCredentials(initialMember.credentials || '');
      setBio(initialMember.bio || '');
      setDetailedBio(initialMember.detailedBio || '');
      setLabRoleDetail(initialMember.labRoleDetail || '');
      setAvatarUrl(initialMember.avatarUrl || '');
      setFocusInput(initialMember.focus ? initialMember.focus.join(', ') : '');
      setSkillsInput(initialMember.skills ? initialMember.skills.join(', ') : '');
      setContributionsInput(initialMember.contributions ? initialMember.contributions.join('\n') : '');
      setEmail(initialMember.email || '');
      setScholarUrl(initialMember.scholarUrl || '');
      setOrcidUrl(initialMember.orcidUrl || '');
      setResearchGateUrl(initialMember.researchGateUrl || '');
      setWebsiteUrl(initialMember.websiteUrl || '');
      setLinkedinUrl(initialMember.linkedinUrl || '');
      setTwitterUrl(initialMember.twitterUrl || '');
      setInstagramUrl(initialMember.instagramUrl || '');
      setProjects(initialMember.projects || []);
      setPublications(initialMember.publications || []);
      setAwards(initialMember.awards || []);
      setShowEmail(initialMember.showEmail !== false);
      setShowSocialLinks(initialMember.showSocialLinks !== false);
      setShowPublications(initialMember.showPublications !== false);
      setShowProjects(initialMember.showProjects !== false);
      setIsPublic(initialMember.isPublic !== false);
    } else {
      // Default new state
      setName('');
      setRole('');
      setCategory('Researchers');
      setCredentials('');
      setBio('');
      setDetailedBio('');
      setLabRoleDetail('');
      setAvatarUrl('https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=600');
      setFocusInput('Physiological Telemetry, Clinical Informatics');
      setSkillsInput('Signal Processing, Python, PyTorch');
      setContributionsInput('');
      setEmail('');
      setScholarUrl('');
      setOrcidUrl('');
      setResearchGateUrl('');
      setWebsiteUrl('');
      setLinkedinUrl('');
      setTwitterUrl('');
      setInstagramUrl('');
      setProjects([]);
      setPublications([]);
      setAwards([]);
      setShowEmail(true);
      setShowSocialLinks(true);
      setShowPublications(true);
      setShowProjects(true);
      setIsPublic(true);
    }
    setError(null);
  }, [initialMember, isOpen]);

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      setError('Image file size exceeds 2MB limit. Please choose a smaller image.');
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === 'string') {
        setAvatarUrl(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleAddProject = () => {
    setProjects([
      ...projects,
      { title: '', status: 'Active', description: '', link: '' },
    ]);
  };

  const handleRemoveProject = (index: number) => {
    setProjects(projects.filter((_, i) => i !== index));
  };

  const handleUpdateProject = (index: number, field: keyof ProjectItem, value: string) => {
    const updated = [...projects];
    updated[index] = { ...updated[index], [field]: value };
    setProjects(updated);
  };

  const handleAddPublication = () => {
    setPublications([
      ...publications,
      { title: '', year: new Date().getFullYear(), journalOrConference: '', link: '', doi: '' },
    ]);
  };

  const handleRemovePublication = (index: number) => {
    setPublications(publications.filter((_, i) => i !== index));
  };

  const handleUpdatePublication = (index: number, field: keyof PublicationItem, value: any) => {
    const updated = [...publications];
    updated[index] = { ...updated[index], [field]: value };
    setPublications(updated);
  };

  const handleAddAward = () => {
    setAwards([
      ...awards,
      { title: '', year: new Date().getFullYear(), organization: '' },
    ]);
  };

  const handleRemoveAward = (index: number) => {
    setAwards(awards.filter((_, i) => i !== index));
  };

  const handleUpdateAward = (index: number, field: keyof AwardItem, value: any) => {
    const updated = [...awards];
    updated[index] = { ...updated[index], [field]: value };
    setAwards(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Full name is required.');
      setActiveTab('basics');
      return;
    }
    if (!role.trim()) {
      setError('Position/Role in the lab is required.');
      setActiveTab('basics');
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);

      const focusArray = focusInput
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);

      const skillsArray = skillsInput
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);

      const contributionsArray = contributionsInput
        .split('\n')
        .map((s) => s.trim())
        .filter(Boolean);

      await onSave({
        name: name.trim(),
        role: role.trim(),
        category,
        credentials: credentials.trim(),
        bio: bio.trim(),
        detailedBio: detailedBio.trim(),
        labRoleDetail: labRoleDetail.trim(),
        avatarUrl: avatarUrl.trim() || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=600',
        focus: focusArray,
        skills: skillsArray,
        contributions: contributionsArray,
        projects: projects.filter((p) => p.title.trim()),
        publications: publications.filter((p) => p.title.trim()),
        awards: awards.filter((a) => a.title.trim()),
        email: email.trim() || undefined,
        scholarUrl: scholarUrl.trim() || undefined,
        orcidUrl: orcidUrl.trim() || undefined,
        researchGateUrl: researchGateUrl.trim() || undefined,
        websiteUrl: websiteUrl.trim() || undefined,
        linkedinUrl: linkedinUrl.trim() || undefined,
        twitterUrl: twitterUrl.trim() || undefined,
        instagramUrl: instagramUrl.trim() || undefined,
        showEmail,
        showSocialLinks,
        showPublications,
        showProjects,
        isPublic,
      });

      onClose();
    } catch (err: any) {
      setError(err?.message || 'Failed to save team member changes.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Card */}
      <div className="relative w-full max-w-3xl bg-white dark:bg-[#120609] rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 z-10 flex flex-col max-h-[90vh] overflow-hidden text-slate-900 dark:text-slate-100">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-900/60">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-maroon-800 text-white flex items-center justify-center">
              <Building className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                {initialMember ? `Edit Member: ${initialMember.name}` : 'Add New Team Member'}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Manage academic profile, research credentials, and publications.
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

        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 px-6 bg-slate-50/50 dark:bg-slate-900/30 overflow-x-auto">
          <button
            type="button"
            onClick={() => setActiveTab('basics')}
            className={`py-3 px-3 text-xs font-semibold border-b-2 whitespace-nowrap transition-colors ${
              activeTab === 'basics'
                ? 'border-maroon-800 text-maroon-800 dark:text-maroon-300'
                : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-slate-300'
            }`}
          >
            Basic Info & Bio
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('projects')}
            className={`py-3 px-3 text-xs font-semibold border-b-2 whitespace-nowrap transition-colors ${
              activeTab === 'projects'
                ? 'border-maroon-800 text-maroon-800 dark:text-maroon-300'
                : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-slate-300'
            }`}
          >
            Projects & Awards ({projects.length + awards.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('pubs')}
            className={`py-3 px-3 text-xs font-semibold border-b-2 whitespace-nowrap transition-colors ${
              activeTab === 'pubs'
                ? 'border-maroon-800 text-maroon-800 dark:text-maroon-300'
                : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-slate-300'
            }`}
          >
            Publications ({publications.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('links')}
            className={`py-3 px-3 text-xs font-semibold border-b-2 whitespace-nowrap transition-colors ${
              activeTab === 'links'
                ? 'border-maroon-800 text-maroon-800 dark:text-maroon-300'
                : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-slate-300'
            }`}
          >
            Social & Academic Links
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('visibility')}
            className={`py-3 px-3 text-xs font-semibold border-b-2 whitespace-nowrap transition-colors ${
              activeTab === 'visibility'
                ? 'border-maroon-800 text-maroon-800 dark:text-maroon-300'
                : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-slate-300'
            }`}
          >
            Field Visibility
          </button>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mx-6 mt-4 p-3 rounded-lg bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 text-rose-800 dark:text-rose-300 text-xs flex items-center justify-between">
            <span>{error}</span>
            <button type="button" onClick={() => setError(null)} className="text-rose-500 hover:text-rose-800 font-bold ml-2">
              Dismiss
            </button>
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* TAB 1: BASIC INFO & BIO */}
          {activeTab === 'basics' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Prof. David K. Patel, MD, PhD"
                    className="w-full px-3 py-2 text-xs sm:text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-maroon-600 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                    Lab Position / Role *
                  </label>
                  <input
                    type="text"
                    required
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    placeholder="e.g. Principal Investigator & Lab Director"
                    className="w-full px-3 py-2 text-xs sm:text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-maroon-600 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                    Category *
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as TeamCategory)}
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
                    Academic Qualifications / Degree
                  </label>
                  <input
                    type="text"
                    value={credentials}
                    onChange={(e) => setCredentials(e.target.value)}
                    placeholder="e.g. MD (Cardiology), PhD (Biomedical Eng, MIT)"
                    className="w-full px-3 py-2 text-xs sm:text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-maroon-600 focus:outline-none"
                  />
                </div>
              </div>

              {/* Profile Photo Management */}
              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 space-y-3">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  Profile Photograph
                </label>
                <div className="flex flex-col sm:flex-row items-center gap-4">
                  <img
                    src={avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400'}
                    alt="Preview"
                    referrerPolicy="no-referrer"
                    className="w-16 h-16 rounded-xl object-cover border-2 border-maroon-700/40 shadow-sm shrink-0"
                  />
                  <div className="flex-1 w-full space-y-2">
                    <input
                      type="url"
                      value={avatarUrl}
                      onChange={(e) => setAvatarUrl(e.target.value)}
                      placeholder="Image URL (https://...)"
                      className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-maroon-600 focus:outline-none font-mono"
                    />
                    <div className="flex items-center gap-2">
                      <label className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 cursor-pointer transition-colors">
                        <Upload className="w-3.5 h-3.5" />
                        <span>Upload File (Max 2MB)</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleFileUpload}
                          className="hidden"
                        />
                      </label>
                    </div>
                  </div>
                </div>

                {/* Quick Presets */}
                <div>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400">Or pick an academic headshot preset:</span>
                  <div className="flex flex-wrap gap-1.5 mt-1.5">
                    {PHOTO_PRESETS.map((preset) => (
                      <button
                        key={preset.label}
                        type="button"
                        onClick={() => setAvatarUrl(preset.url)}
                        className={`text-[10px] px-2 py-1 rounded border transition-colors ${
                          avatarUrl === preset.url
                            ? 'bg-maroon-800 text-white border-maroon-800'
                            : 'bg-white dark:bg-slate-850 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        {preset.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                  Short Research Summary (Shown on Card)
                </label>
                <textarea
                  rows={2}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Concise 1-2 sentence overview of research focus..."
                  className="w-full px-3 py-2 text-xs sm:text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-maroon-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                  Detailed Academic Biography (Shown in Detailed Panel)
                </label>
                <textarea
                  rows={4}
                  value={detailedBio}
                  onChange={(e) => setDetailedBio(e.target.value)}
                  placeholder="Full background, academic career, laboratory leadership, prior appointments..."
                  className="w-full px-3 py-2 text-xs sm:text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-maroon-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                  Current Laboratory Responsibility / Scope
                </label>
                <input
                  type="text"
                  value={labRoleDetail}
                  onChange={(e) => setLabRoleDetail(e.target.value)}
                  placeholder="e.g. Oversees multi-center hospital deployments and clinical trial telemetry."
                  className="w-full px-3 py-2 text-xs sm:text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-maroon-600 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                    Research-Interest Tags (Comma separated)
                  </label>
                  <input
                    type="text"
                    value={focusInput}
                    onChange={(e) => setFocusInput(e.target.value)}
                    placeholder="e.g. Translational Informatics, rPPG, Edge AI"
                    className="w-full px-3 py-2 text-xs sm:text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-maroon-600 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                    Skills & Areas of Expertise (Comma separated)
                  </label>
                  <input
                    type="text"
                    value={skillsInput}
                    onChange={(e) => setSkillsInput(e.target.value)}
                    placeholder="e.g. PyTorch, Clinical Trials, Signal Processing"
                    className="w-full px-3 py-2 text-xs sm:text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-maroon-600 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                  Major Research Contributions (One per line)
                </label>
                <textarea
                  rows={3}
                  value={contributionsInput}
                  onChange={(e) => setContributionsInput(e.target.value)}
                  placeholder="Pioneered sub-1.5 BPM video-based contactless vital estimation.&#10;Deployed edge-AI early warning system in 3 hospitals."
                  className="w-full px-3 py-2 text-xs sm:text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-maroon-600 focus:outline-none font-sans"
                />
              </div>
            </div>
          )}

          {/* TAB 2: PROJECTS & AWARDS */}
          {activeTab === 'projects' && (
            <div className="space-y-6">
              {/* Projects Section */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-maroon-700" />
                    Current & Completed Projects
                  </h3>
                  <button
                    type="button"
                    onClick={handleAddProject}
                    className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-bold rounded bg-maroon-50 dark:bg-maroon-950/60 text-maroon-800 dark:text-maroon-300 border border-maroon-200 dark:border-maroon-800 hover:bg-maroon-100 transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Add Project
                  </button>
                </div>

                {projects.length === 0 ? (
                  <p className="text-xs text-slate-500 italic p-3 border border-dashed rounded-lg">
                    No projects listed yet. Click "Add Project" above.
                  </p>
                ) : (
                  <div className="space-y-3">
                    {projects.map((proj, idx) => (
                      <div
                        key={idx}
                        className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/40 space-y-2 relative"
                      >
                        <button
                          type="button"
                          onClick={() => handleRemoveProject(idx)}
                          className="absolute top-3 right-3 text-slate-400 hover:text-rose-600 p-1"
                          title="Remove project"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pr-8">
                          <div className="sm:col-span-2">
                            <input
                              type="text"
                              value={proj.title}
                              onChange={(e) => handleUpdateProject(idx, 'title', e.target.value)}
                              placeholder="Project Title"
                              className="w-full px-2.5 py-1.5 text-xs rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-850 text-slate-900 dark:text-white"
                            />
                          </div>
                          <div>
                            <select
                              value={proj.status}
                              onChange={(e) => handleUpdateProject(idx, 'status', e.target.value)}
                              className="w-full px-2.5 py-1.5 text-xs rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-850 text-slate-900 dark:text-white"
                            >
                              <option value="Active">Active</option>
                              <option value="Completed">Completed</option>
                              <option value="In Review">In Review</option>
                            </select>
                          </div>
                        </div>
                        <input
                          type="text"
                          value={proj.description || ''}
                          onChange={(e) => handleUpdateProject(idx, 'description', e.target.value)}
                          placeholder="Brief description of the project..."
                          className="w-full px-2.5 py-1 text-xs rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-850 text-slate-900 dark:text-white"
                        />
                        <input
                          type="url"
                          value={proj.link || ''}
                          onChange={(e) => handleUpdateProject(idx, 'link', e.target.value)}
                          placeholder="Project Link URL (optional)"
                          className="w-full px-2.5 py-1 text-xs rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-850 text-slate-900 dark:text-white font-mono text-[11px]"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Awards Section */}
              <div className="space-y-3 pt-4 border-t border-slate-200 dark:border-slate-800">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-1.5">
                    <Award className="w-3.5 h-3.5 text-amber-600" />
                    Awards & Honors
                  </h3>
                  <button
                    type="button"
                    onClick={handleAddAward}
                    className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-bold rounded bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800 hover:bg-amber-100 transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Add Award
                  </button>
                </div>

                {awards.length === 0 ? (
                  <p className="text-xs text-slate-500 italic p-3 border border-dashed rounded-lg">
                    No awards listed. Click "Add Award" above.
                  </p>
                ) : (
                  <div className="space-y-2">
                    {awards.map((award, idx) => (
                      <div
                        key={idx}
                        className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/40 flex items-center gap-2"
                      >
                        <input
                          type="text"
                          value={award.title}
                          onChange={(e) => handleUpdateAward(idx, 'title', e.target.value)}
                          placeholder="Award Name"
                          className="flex-2 px-2.5 py-1 text-xs rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-850 text-slate-900 dark:text-white"
                        />
                        <input
                          type="text"
                          value={award.organization || ''}
                          onChange={(e) => handleUpdateAward(idx, 'organization', e.target.value)}
                          placeholder="Awarding Organization"
                          className="flex-1 px-2.5 py-1 text-xs rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-850 text-slate-900 dark:text-white"
                        />
                        <input
                          type="text"
                          value={award.year || ''}
                          onChange={(e) => handleUpdateAward(idx, 'year', e.target.value)}
                          placeholder="Year"
                          className="w-20 px-2 py-1 text-xs rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-850 text-slate-900 dark:text-white text-center font-mono"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveAward(idx)}
                          className="text-slate-400 hover:text-rose-600 p-1"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 3: PUBLICATIONS */}
          {activeTab === 'pubs' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5 text-maroon-700" />
                    Key Research Publications
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Add selected peer-reviewed papers with publication venue and links.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleAddPublication}
                  className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-bold rounded bg-maroon-50 dark:bg-maroon-950/60 text-maroon-800 dark:text-maroon-300 border border-maroon-200 dark:border-maroon-800 hover:bg-maroon-100 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Add Publication
                </button>
              </div>

              {publications.length === 0 ? (
                <p className="text-xs text-slate-500 italic p-4 border border-dashed rounded-lg text-center">
                  No publications listed for this member yet. Click "Add Publication" to add one.
                </p>
              ) : (
                <div className="space-y-3">
                  {publications.map((pub, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/40 space-y-2 relative"
                    >
                      <button
                        type="button"
                        onClick={() => handleRemovePublication(idx)}
                        className="absolute top-3 right-3 text-slate-400 hover:text-rose-600 p-1"
                        title="Remove publication"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>

                      <div className="pr-8">
                        <label className="block text-[10px] uppercase font-bold text-slate-500 mb-0.5">
                          Paper Title *
                        </label>
                        <input
                          type="text"
                          value={pub.title}
                          onChange={(e) => handleUpdatePublication(idx, 'title', e.target.value)}
                          placeholder="Title of published paper or preprint..."
                          className="w-full px-2.5 py-1.5 text-xs rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-850 text-slate-900 dark:text-white font-semibold"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                        <div className="sm:col-span-2">
                          <label className="block text-[10px] uppercase font-bold text-slate-500 mb-0.5">
                            Journal or Conference
                          </label>
                          <input
                            type="text"
                            value={pub.journalOrConference}
                            onChange={(e) => handleUpdatePublication(idx, 'journalOrConference', e.target.value)}
                            placeholder="e.g. Nature Digital Medicine, IEEE TBME"
                            className="w-full px-2.5 py-1 text-xs rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-850 text-slate-900 dark:text-white"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] uppercase font-bold text-slate-500 mb-0.5">
                            Year
                          </label>
                          <input
                            type="text"
                            value={pub.year}
                            onChange={(e) => handleUpdatePublication(idx, 'year', e.target.value)}
                            placeholder="2024"
                            className="w-full px-2.5 py-1 text-xs rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-850 text-slate-900 dark:text-white text-center font-mono"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <div>
                          <label className="block text-[10px] uppercase font-bold text-slate-500 mb-0.5">
                            DOI Identifier
                          </label>
                          <input
                            type="text"
                            value={pub.doi || ''}
                            onChange={(e) => handleUpdatePublication(idx, 'doi', e.target.value)}
                            placeholder="e.g. 10.1038/s41746-024-01120-x"
                            className="w-full px-2.5 py-1 text-xs rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-850 text-slate-900 dark:text-white font-mono text-[11px]"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] uppercase font-bold text-slate-500 mb-0.5">
                            Full Publication Link URL
                          </label>
                          <input
                            type="url"
                            value={pub.link || ''}
                            onChange={(e) => handleUpdatePublication(idx, 'link', e.target.value)}
                            placeholder="https://..."
                            className="w-full px-2.5 py-1 text-xs rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-850 text-slate-900 dark:text-white font-mono text-[11px]"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 4: SOCIAL & ACADEMIC LINKS */}
          {activeTab === 'links' && (
            <div className="space-y-4">
              <p className="text-xs text-slate-500">
                Provide academic and professional profiles. Links with values will appear in the detailed profile.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                    Professional Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@mindh-lab.org"
                    className="w-full px-3 py-2 text-xs rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                    LinkedIn URL
                  </label>
                  <input
                    type="url"
                    value={linkedinUrl}
                    onChange={(e) => setLinkedinUrl(e.target.value)}
                    placeholder="https://linkedin.com/in/..."
                    className="w-full px-3 py-2 text-xs rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                    Google Scholar Profile URL
                  </label>
                  <input
                    type="url"
                    value={scholarUrl}
                    onChange={(e) => setScholarUrl(e.target.value)}
                    placeholder="https://scholar.google.com/citations?user=..."
                    className="w-full px-3 py-2 text-xs rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                    ORCID Profile URL
                  </label>
                  <input
                    type="url"
                    value={orcidUrl}
                    onChange={(e) => setOrcidUrl(e.target.value)}
                    placeholder="https://orcid.org/0000-0000-0000-0000"
                    className="w-full px-3 py-2 text-xs rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                    ResearchGate URL
                  </label>
                  <input
                    type="url"
                    value={researchGateUrl}
                    onChange={(e) => setResearchGateUrl(e.target.value)}
                    placeholder="https://researchgate.net/profile/..."
                    className="w-full px-3 py-2 text-xs rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                    Personal / Academic Website URL
                  </label>
                  <input
                    type="url"
                    value={websiteUrl}
                    onChange={(e) => setWebsiteUrl(e.target.value)}
                    placeholder="https://mindh-lab.org/..."
                    className="w-full px-3 py-2 text-xs rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                    X / Twitter URL
                  </label>
                  <input
                    type="url"
                    value={twitterUrl}
                    onChange={(e) => setTwitterUrl(e.target.value)}
                    placeholder="https://x.com/..."
                    className="w-full px-3 py-2 text-xs rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                    Instagram URL (Optional)
                  </label>
                  <input
                    type="url"
                    value={instagramUrl}
                    onChange={(e) => setInstagramUrl(e.target.value)}
                    placeholder="https://instagram.com/..."
                    className="w-full px-3 py-2 text-xs rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-mono"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: FIELD VISIBILITY CONTROLS */}
          {activeTab === 'visibility' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/40 space-y-3">
                <div className="flex items-center gap-2 mb-2">
                  <Shield className="w-4 h-4 text-maroon-700" />
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                    Public Display Options
                  </h3>
                </div>
                <p className="text-xs text-slate-500">
                  Select which sections of this member's profile are displayed to the public.
                </p>

                <div className="space-y-3 pt-2">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isPublic}
                      onChange={(e) => setIsPublic(e.target.checked)}
                      className="w-4 h-4 text-maroon-800 rounded border-slate-300 focus:ring-maroon-600"
                    />
                    <div>
                      <span className="text-xs font-semibold text-slate-900 dark:text-white block">
                        Publish member profile
                      </span>
                      <span className="text-[11px] text-slate-500 block">
                        When unchecked, the card will be hidden from the public laboratory roster.
                      </span>
                    </div>
                  </label>

                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={showEmail}
                      onChange={(e) => setShowEmail(e.target.checked)}
                      className="w-4 h-4 text-maroon-800 rounded border-slate-300 focus:ring-maroon-600"
                    />
                    <div>
                      <span className="text-xs font-semibold text-slate-900 dark:text-white block">
                        Show email address
                      </span>
                      <span className="text-[11px] text-slate-500 block">
                        Display the contact email button publicly in the profile view.
                      </span>
                    </div>
                  </label>

                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={showSocialLinks}
                      onChange={(e) => setShowSocialLinks(e.target.checked)}
                      className="w-4 h-4 text-maroon-800 rounded border-slate-300 focus:ring-maroon-600"
                    />
                    <div>
                      <span className="text-xs font-semibold text-slate-900 dark:text-white block">
                        Show academic and social links
                      </span>
                      <span className="text-[11px] text-slate-500 block">
                        Show Google Scholar, ORCID, LinkedIn, and website badges.
                      </span>
                    </div>
                  </label>

                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={showPublications}
                      onChange={(e) => setShowPublications(e.target.checked)}
                      className="w-4 h-4 text-maroon-800 rounded border-slate-300 focus:ring-maroon-600"
                    />
                    <div>
                      <span className="text-xs font-semibold text-slate-900 dark:text-white block">
                        Show publications section
                      </span>
                      <span className="text-[11px] text-slate-500 block">
                        Display the list of peer-reviewed papers for this member.
                      </span>
                    </div>
                  </label>

                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={showProjects}
                      onChange={(e) => setShowProjects(e.target.checked)}
                      className="w-4 h-4 text-maroon-800 rounded border-slate-300 focus:ring-maroon-600"
                    />
                    <div>
                      <span className="text-xs font-semibold text-slate-900 dark:text-white block">
                        Show active & completed projects
                      </span>
                      <span className="text-[11px] text-slate-500 block">
                        Display the project cards associated with this investigator.
                      </span>
                    </div>
                  </label>
                </div>
              </div>
            </div>
          )}

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
              <span>{isSubmitting ? 'Saving...' : initialMember ? 'Update Member' : 'Create Member'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
