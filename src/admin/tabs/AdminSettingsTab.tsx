import React, { useState, useEffect } from 'react';
import {
  Settings,
  Lock,
  Mail,
  MapPin,
  Phone,
  Clock,
  Check,
  Shield,
  Save,
  AlertCircle
} from 'lucide-react';
import { useAdminAuth } from '../context/AdminAuthContext';

export const AdminSettingsTab: React.FC = () => {
  const { user } = useAdminAuth();
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Settings form state
  const [settings, setSettings] = useState({
    contactEmail: 'contact@mindh-lab.org',
    contactPhone: '+1 (617) 555-0198',
    labLocation: 'Room 412, Bioengineering Sciences Building, 500 Technology Square, Cambridge, MA',
    officeHours: 'Monday – Friday, 9:00 AM – 5:00 PM EST',
    twitterUrl: 'https://twitter.com',
    linkedinUrl: 'https://linkedin.com',
    githubUrl: 'https://github.com',
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
    setTimeout(() => setToastMessage(null), 3000);
  };

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch('/api/settings', { headers: getHeaders() });
        if (res.ok) {
          const data = await res.json();
          if (data.success && data.data) {
            setSettings((prev) => ({ ...prev, ...data.data }));
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
        showToast('Settings saved successfully.');
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
    <div className="space-y-6">
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
            <Settings className="w-6 h-6 text-slate-400" />
            <span>Lab Profile & System Settings</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Configure contact metadata, lab location coordinates, and administrator profile.
          </p>
        </div>
      </div>

      {errorMessage && (
        <div className="p-4 rounded-xl bg-rose-950/70 border border-rose-900 text-rose-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Profile summary card */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-maroon-800 text-white flex items-center justify-center font-bold text-lg shadow-md">
            {user?.username?.charAt(0).toUpperCase() || 'A'}
          </div>
          <div>
            <div className="text-sm font-bold text-white">{user?.username || 'Administrator'}</div>
            <div className="text-xs text-slate-400">{user?.email || 'admin@mindh-lab.org'}</div>
            <span className="inline-block mt-1 text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-semibold">
              {user?.role || 'Super Admin'}
            </span>
          </div>
        </div>

        <div className="text-right text-xs text-slate-500 font-mono hidden sm:block">
          <div>Status: Active Session</div>
          <div className="text-[11px] text-emerald-400">Authenticated</div>
        </div>
      </div>

      {/* Contact & Meta Form */}
      <form onSubmit={handleSaveSettings} className="p-6 sm:p-8 rounded-2xl bg-slate-900 border border-slate-800 space-y-6">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <Mail className="w-4 h-4 text-maroon-500" />
          <span>Public Laboratory Contact Details</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
              Lab Telephone
            </label>
            <input
              type="text"
              value={settings.contactPhone}
              onChange={(e) => setSettings({ ...settings, contactPhone: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-maroon-600"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">
            Physical Lab Address & Building
          </label>
          <input
            type="text"
            required
            value={settings.labLocation}
            onChange={(e) => setSettings({ ...settings, labLocation: e.target.value })}
            className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-maroon-600"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">
            Office & Laboratory Working Hours
          </label>
          <input
            type="text"
            value={settings.officeHours}
            onChange={(e) => setSettings({ ...settings, officeHours: e.target.value })}
            className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-maroon-600"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">GitHub Organization</label>
            <input
              type="text"
              value={settings.githubUrl}
              onChange={(e) => setSettings({ ...settings, githubUrl: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-maroon-600"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">LinkedIn Page</label>
            <input
              type="text"
              value={settings.linkedinUrl}
              onChange={(e) => setSettings({ ...settings, linkedinUrl: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-maroon-600"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Twitter / X</label>
            <input
              type="text"
              value={settings.twitterUrl}
              onChange={(e) => setSettings({ ...settings, twitterUrl: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-maroon-600"
            />
          </div>
        </div>

        <div className="flex justify-end pt-4 border-t border-slate-800">
          <button
            type="submit"
            disabled={isSaving}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-maroon-800 hover:bg-maroon-700 text-white text-xs font-bold shadow-md transition-colors disabled:opacity-50"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{isSaving ? 'Saving Changes...' : 'Save Settings'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
