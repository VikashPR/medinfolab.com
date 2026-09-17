'use client';

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { SiteSettingsProvider } from '../context/SiteSettingsContext';
import { Header } from './Header';
import { Footer } from './Footer';
import { ScrollToTop } from './ScrollToTop';
import { CollaborateModal } from './CollaborateModal';

export function SiteProviders({ children }: { children: React.ReactNode }) {
  const [isCollabOpen, setIsCollabOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith('/admin');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('theme');
      if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        setDarkMode(true);
        document.documentElement.classList.add('dark');
      }
    }
  }, []);

  const handleToggleDarkMode = () => {
    setDarkMode((prev) => {
      const next = !prev;
      if (typeof window !== 'undefined') {
        if (next) {
          document.documentElement.classList.add('dark');
          localStorage.setItem('theme', 'dark');
        } else {
          document.documentElement.classList.remove('dark');
          localStorage.setItem('theme', 'light');
        }
      }
      return next;
    });
  };

  return (
    <SiteSettingsProvider>
      <ScrollToTop />
      {isAdmin ? (
        children
      ) : (
        <div className="min-h-screen flex flex-col bg-white dark:bg-[#120609] text-slate-900 dark:text-slate-100 font-sans transition-colors duration-200">
          <Header
            darkMode={darkMode}
            onToggleDarkMode={handleToggleDarkMode}
            onOpenCollab={() => setIsCollabOpen(true)}
          />
          <main className="flex-grow">{children}</main>
          <Footer onOpenCollab={() => setIsCollabOpen(true)} />
          <CollaborateModal
            isOpen={isCollabOpen}
            onClose={() => setIsCollabOpen(false)}
          />
        </div>
      )}
    </SiteSettingsProvider>
  );
}

