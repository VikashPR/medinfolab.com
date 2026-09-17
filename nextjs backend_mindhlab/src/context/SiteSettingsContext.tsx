'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { SiteSettings } from '../types';

interface SiteSettingsContextType {
  settings: SiteSettings;
  isLoading: boolean;
  refreshSettings: () => Promise<void>;
}

const DEFAULT_SETTINGS: SiteSettings = {
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
};

const SiteSettingsContext = createContext<SiteSettingsContextType>({
  settings: DEFAULT_SETTINGS,
  isLoading: false,
  refreshSettings: async () => {},
});

export const SiteSettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<SiteSettings>(DEFAULT_SETTINGS);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchSettings = async () => {
    try {
      const res = await fetch('/api/settings');
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.data) {
          setSettings({
            ...DEFAULT_SETTINGS,
            ...data.data,
            socialLinks: {
              ...DEFAULT_SETTINGS.socialLinks,
              ...(data.data.socialLinks || {}),
            },
          });
        }
      }
    } catch (err) {
      console.warn('Could not load site settings from server:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  return (
    <SiteSettingsContext.Provider
      value={{
        settings,
        isLoading,
        refreshSettings: fetchSettings,
      }}
    >
      {children}
    </SiteSettingsContext.Provider>
  );
};

export const useSiteSettings = () => useContext(SiteSettingsContext);
