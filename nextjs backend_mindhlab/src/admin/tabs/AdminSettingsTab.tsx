import React, { useState, useEffect } from 'react';
import {
  Settings,
  Mail,
  MapPin,
  Phone,
  Clock,
  Check,
  Shield,
  Save,
  AlertCircle,
  Image as ImageIcon,
  Building,
  ExternalLink,
  RotateCcw,
  Sparkles
} from 'lucide-react';
import { useAdminAuth } from '../context/AdminAuthContext';
import { ImageUploadInput } from '../components/ImageUploadInput';
import { SiteSettings } from '../../types';

export const AdminSettingsTab: React.FC = () => {
  const { user } = useAdminAuth();
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Settings form state
  const [settings, setSettings] = useState<SiteSettings>({
    labName: 'MINDH Laboratory',
    tagline: 'Medical Informatics and Digital Health Laboratory',
    headerLogoUrl: '',
    footerLogoUrl: '',
    bottomRightLogoUrl: '',
    bottomRightLogoText: 'Division of Medical Informatics & Health Sciences',
    bottomRightLogoLink: '',
    contactEmail: 'contact@mindh-lab.org',
    contactPhone: '+1 (415) 555-0198',
    address: 'Division of Medical Informatics, Health Sciences Center, University Medical Campus',
    roomLocation: 'Health Sciences Tower, Suite 740, Clinical Simulation Wing',
    visitingHours: 'Monday - Friday: 09:00 - 17:00 (By Appointment)',
    socialLinks: {
      linkedin: 'https://www.linkedin.com/company/medical-informatics-and-digital-health-lab/',
      twitter: 'https://twitter.com/MINDHLab',
      github: 'https://github.com/mindh-lab',
      scholar: 'https://scholar.google.com/citations?user=mindh-lab',
      youtube: 'https://youtube.com/@mindh-lab',
    },
  });

  const getHeaders = () => {
    const token = localStorage.getItem('mindh_admin_token');
    return {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch('/api/settings', { headers: getHeaders() });
        if (res.ok) {
          const data = await res.json();
          if (data.success && data.data) {
            setSettings((prev) => ({
              ...prev,
              ...data.data,
              socialLinks: {
                ...prev.socialLinks,
                ...(data.data.socialLinks || {}),
              },
            }));
          }
        }
      } catch (err) {
        console.warn('Failed to load settings:', err);
      }
    };

    fetchSettings();
  }, []);

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setErrorMessage(null);

    try {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(settings),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        showToast('All website logos and settings saved successfully.');
      } else {
        setErrorMessage(data.message || 'Failed to save settings.');
      }
    } catch (err: any) {
      setErrorMessage(err?.message || 'Error saving settings');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-8 max-w-5xl">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 bg-slate-800 text-white rounded-xl shadow-xl text-xs font-semibold border border-slate-700 animate-in fade-in">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-800">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
            <Settings className="w-6 h-6 text-maroon-500" />
            <span>Site Branding, Logos & Settings</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Manage top-left navbar logo, bottom-left footer logo, bottom-right institutional logo, and contact parameters.
          </p>
        </div>

        <button
          type="button"
          onClick={handleSaveSettings}
          disabled={isSaving}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-maroon-800 hover:bg-maroon-700 text-white text-xs font-bold shadow-md transition-colors disabled:opacity-50 self-start sm:self-auto"
        >
          <Save className="w-3.5 h-3.5" />
          <span>{isSaving ? 'Saving...' : 'Save All Changes'}</span>
        </button>
      </div>

      {errorMessage && (
        <div className="p-4 rounded-xl bg-rose-950/70 border border-rose-900 text-rose-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Profile summary banner */}
      <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-11 h-11 rounded-xl bg-maroon-800 text-white flex items-center justify-center font-bold text-base shadow-sm">
            {user?.username?.charAt(0).toUpperCase() || 'A'}
          </div>
          <div>
            <div className="text-sm font-bold text-white">{user?.username || 'Administrator'}</div>
            <div className="text-xs text-slate-400">{user?.email || 'admin@mindh-lab.org'}</div>
            <span className="inline-block mt-0.5 text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-semibold">
              {user?.role || 'Super Admin'}
            </span>
          </div>
        </div>

        <div className="text-right text-xs text-slate-500 font-mono hidden sm:block">
          <div>Status: Verified Session</div>
          <div className="text-[11px] text-emerald-400">Database Synchronized</div>
        </div>
      </div>

      {/* FORM WRAPPER */}
      <form onSubmit={handleSaveSettings} className="space-y-8">
        {/* ========================================================================= */}
        {/* 1. LOGOS & BRANDING SECTION (Top Left, Bottom Left, Bottom Right) */}
        {/* ========================================================================= */}
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 space-y-6">
          <div>
            <div className="flex items-center gap-2 text-white font-bold text-base">
              <ImageIcon className="w-5 h-5 text-maroon-500" />
              <span>Website Logo Placeholders & Branding</span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Upload from your computer or provide a URL for each designated logo placeholder shown in the website layout.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* 1A. Top-Left Logo (Header) */}
            <div className="p-5 rounded-2xl bg-slate-950/70 border border-slate-800/80 flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-xs font-bold text-white flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-maroon-500"></span>
                    Top-Left Logo (Header Navbar)
                  </span>
                  {settings.headerLogoUrl && (
                    <button
                      type="button"
                      onClick={() => setSettings({ ...settings, headerLogoUrl: '' })}
                      className="text-[11px] text-rose-400 hover:text-rose-300 flex items-center gap-1"
                      title="Reset to default icon"
                    >
                      <RotateCcw className="w-3 h-3" />
                      <span>Reset</span>
                    </button>
                  )}
                </div>
                <p className="text-[11px] text-slate-400 mb-3">
                  Appears at the top-left of the sticky header across all public pages.
                </p>

                <ImageUploadInput
                  label="Header Logo File / URL"
                  value={settings.headerLogoUrl || ''}
                  onChange={(url) => setSettings({ ...settings, headerLogoUrl: url })}
                  helperText="Upload transparent PNG or SVG logo."
                  recommendedSize="Recommended: 160×44px or square"
                />
              </div>

              {/* Live Preview */}
              <div className="pt-3 border-t border-slate-800/80">
                <div className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider mb-2">
                  Live Header Preview
                </div>
                <div className="p-3 rounded-xl bg-white dark:bg-[#120609] border border-slate-200 dark:border-slate-800 flex items-center gap-2.5">
                  {settings.headerLogoUrl ? (
                    <img
                      src={settings.headerLogoUrl}
                      alt="Header Preview"
                      className="h-8 w-auto max-w-[100px] object-contain rounded"
                    />
                  ) : (
                    <div className="w-7 h-7 rounded-lg bg-maroon-800 text-white flex items-center justify-center text-xs">
                      <svg className="w-4 h-4 stroke-white" viewBox="0 0 24 24" fill="none" strokeWidth="2.2">
                        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                      </svg>
                    </div>
                  )}
                  <div className="flex flex-col">
                    <span className="font-extrabold text-xs text-slate-900 dark:text-white leading-tight">
                      {settings.labName || 'MINDH Lab'}
                    </span>
                    <span className="text-[9px] text-slate-400 leading-tight">
                      {settings.tagline ? settings.tagline.slice(0, 32) + '...' : 'Medical Informatics'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* 1B. Bottom-Left Logo (Footer Brand) */}
            <div className="p-5 rounded-2xl bg-slate-950/70 border border-slate-800/80 flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-xs font-bold text-white flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-maroon-500"></span>
                    Bottom-Left Logo (Footer Brand)
                  </span>
                  {settings.footerLogoUrl && (
                    <button
                      type="button"
                      onClick={() => setSettings({ ...settings, footerLogoUrl: '' })}
                      className="text-[11px] text-rose-400 hover:text-rose-300 flex items-center gap-1"
                      title="Reset to default icon"
                    >
                      <RotateCcw className="w-3 h-3" />
                      <span>Reset</span>
                    </button>
                  )}
                </div>
                <p className="text-[11px] text-slate-400 mb-3">
                  Appears in the first column of the footer next to the mission statement and LinkedIn link.
                </p>

                <ImageUploadInput
                  label="Footer Brand Logo File / URL"
                  value={settings.footerLogoUrl || ''}
                  onChange={(url) => setSettings({ ...settings, footerLogoUrl: url })}
                  helperText="Upload transparent PNG, JPG, or SVG."
                  recommendedSize="Recommended: 140×40px or square"
                />
              </div>

              {/* Live Preview */}
              <div className="pt-3 border-t border-slate-800/80">
                <div className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider mb-2">
                  Live Footer Column 1 Preview
                </div>
                <div className="p-3 rounded-xl bg-white dark:bg-[#0c0305] border border-slate-200 dark:border-slate-800 space-y-2">
                  <div className="flex items-center gap-2">
                    {settings.footerLogoUrl ? (
                      <img
                        src={settings.footerLogoUrl}
                        alt="Footer Preview"
                        className="h-7 w-auto max-w-[90px] object-contain rounded"
                      />
                    ) : (
                      <div className="w-6 h-6 rounded-md bg-maroon-800 text-white flex items-center justify-center">
                        <svg className="w-3.5 h-3.5 stroke-white" viewBox="0 0 24 24" fill="none" strokeWidth="2">
                          <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                        </svg>
                      </div>
                    )}
                    <span className="font-bold text-xs text-slate-900 dark:text-white">
                      {settings.labName || 'MINDH Lab'}
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-400 line-clamp-2 leading-tight">
                    {settings.tagline || 'Advancing translational physiological monitoring and clinical AI.'}
                  </p>
                </div>
              </div>
            </div>

            {/* 1C. Bottom-Right Logo (Institutional / Partner Affiliation) */}
            <div className="p-5 rounded-2xl bg-slate-950/70 border border-slate-800/80 flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-xs font-bold text-white flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-maroon-500"></span>
                    Bottom-Right Logo (Contact / Partner)
                  </span>
                  {settings.bottomRightLogoUrl && (
                    <button
                      type="button"
                      onClick={() => setSettings({ ...settings, bottomRightLogoUrl: '' })}
                      className="text-[11px] text-rose-400 hover:text-rose-300 flex items-center gap-1"
                      title="Reset to default placeholder"
                    >
                      <RotateCcw className="w-3 h-3" />
                      <span>Reset</span>
                    </button>
                  )}
                </div>
                <p className="text-[11px] text-slate-400 mb-3">
                  Appears in Footer Column 4 (under Lab Location & Contact) and on the Contact page.
                </p>

                <ImageUploadInput
                  label="Affiliation / University Logo"
                  value={settings.bottomRightLogoUrl || ''}
                  onChange={(url) => setSettings({ ...settings, bottomRightLogoUrl: url })}
                  helperText="Hospital emblem, University seal, or Partner insignia."
                  recommendedSize="Recommended: 150×50px or crest"
                />

                <div className="mt-3 space-y-2">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                      Affiliation Text Label
                    </label>
                    <input
                      type="text"
                      value={settings.bottomRightLogoText || ''}
                      onChange={(e) => setSettings({ ...settings, bottomRightLogoText: e.target.value })}
                      placeholder="e.g. Division of Medical Informatics & Health Sciences"
                      className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-white text-xs focus:outline-none focus:border-maroon-600"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                      Target Link (Optional)
                    </label>
                    <input
                      type="url"
                      value={settings.bottomRightLogoLink || ''}
                      onChange={(e) => setSettings({ ...settings, bottomRightLogoLink: e.target.value })}
                      placeholder="https://healthsciences.university.edu"
                      className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-white text-xs focus:outline-none focus:border-maroon-600"
                    />
                  </div>
                </div>
              </div>

              {/* Live Preview */}
              <div className="pt-3 border-t border-slate-800/80">
                <div className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider mb-2">
                  Live Footer Column 4 Preview
                </div>
                <div className="p-3 rounded-xl bg-white dark:bg-[#0c0305] border border-slate-200 dark:border-slate-800">
                  <div className="text-[9px] uppercase font-semibold text-slate-400 mb-1.5">
                    Institutional Affiliation
                  </div>
                  {settings.bottomRightLogoUrl ? (
                    <div className="flex items-center gap-2 p-1.5 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                      <img
                        src={settings.bottomRightLogoUrl}
                        alt="Preview"
                        className="h-6 w-auto max-w-[80px] object-contain rounded"
                      />
                      <span className="text-[10px] font-medium text-slate-700 dark:text-slate-200 line-clamp-1">
                        {settings.bottomRightLogoText || 'Institutional Partner'}
                      </span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1.5 p-1.5 rounded-lg border border-dashed border-slate-300 dark:border-slate-700 text-slate-400 text-[10px]">
                      <Building className="w-3.5 h-3.5 text-maroon-700" />
                      <span className="line-clamp-1 font-medium">
                        {settings.bottomRightLogoText || 'Institutional Affiliation Placeholder'}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 2. PUBLIC LABORATORY CONTACT & PROFILE METADATA */}
        {/* ========================================================================= */}
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 space-y-6">
          <div className="flex items-center gap-2 text-white font-bold text-base">
            <Mail className="w-5 h-5 text-maroon-500" />
            <span>Public Laboratory Identity & Location Metadata</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Laboratory Full Name
              </label>
              <input
                type="text"
                required
                value={settings.labName}
                onChange={(e) => setSettings({ ...settings, labName: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-maroon-600"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Tagline / Subtitle
              </label>
              <input
                type="text"
                value={settings.tagline}
                onChange={(e) => setSettings({ ...settings, tagline: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-maroon-600"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                General Inquiry Email
              </label>
              <input
                type="email"
                required
                value={settings.contactEmail}
                onChange={(e) => setSettings({ ...settings, contactEmail: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-maroon-600"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Lab Contact Telephone
              </label>
              <input
                type="text"
                value={settings.contactPhone}
                onChange={(e) => setSettings({ ...settings, contactPhone: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-maroon-600"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Physical Address & Building
              </label>
              <input
                type="text"
                required
                value={settings.address}
                onChange={(e) => setSettings({ ...settings, address: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-maroon-600"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Suite / Room Location
              </label>
              <input
                type="text"
                value={settings.roomLocation}
                onChange={(e) => setSettings({ ...settings, roomLocation: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-maroon-600"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Visiting & Office Hours
              </label>
              <input
                type="text"
                value={settings.visitingHours}
                onChange={(e) => setSettings({ ...settings, visitingHours: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-maroon-600"
              />
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 3. SOCIAL MEDIA & ACADEMIC REPOSITORIES */}
        {/* ========================================================================= */}
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 space-y-6">
          <div className="flex items-center gap-2 text-white font-bold text-base">
            <ExternalLink className="w-5 h-5 text-maroon-500" />
            <span>Social & Academic Media Links</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                LinkedIn Company / Lab Page
              </label>
              <input
                type="url"
                value={settings.socialLinks?.linkedin || ''}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    socialLinks: { ...settings.socialLinks, linkedin: e.target.value },
                  })
                }
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-maroon-600"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Twitter / X Profile
              </label>
              <input
                type="url"
                value={settings.socialLinks?.twitter || ''}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    socialLinks: { ...settings.socialLinks, twitter: e.target.value },
                  })
                }
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-maroon-600"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                GitHub Lab Repository
              </label>
              <input
                type="url"
                value={settings.socialLinks?.github || ''}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    socialLinks: { ...settings.socialLinks, github: e.target.value },
                  })
                }
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-maroon-600"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Google Scholar Profile
              </label>
              <input
                type="url"
                value={settings.socialLinks?.scholar || ''}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    socialLinks: { ...settings.socialLinks, scholar: e.target.value },
                  })
                }
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-maroon-600"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                YouTube Channel
              </label>
              <input
                type="url"
                value={settings.socialLinks?.youtube || ''}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    socialLinks: { ...settings.socialLinks, youtube: e.target.value },
                  })
                }
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-maroon-600"
              />
            </div>
          </div>
        </div>

        {/* Submit Bar */}
        <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-900 border border-slate-800">
          <span className="text-xs text-slate-400">
            Changes will instantly update across the public header, footer, and contact page.
          </span>
          <button
            type="submit"
            disabled={isSaving}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-maroon-800 hover:bg-maroon-700 text-white text-xs font-bold shadow-md transition-colors disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{isSaving ? 'Saving Changes...' : 'Save All Changes'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
