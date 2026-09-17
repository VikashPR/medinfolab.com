import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { CollaborateModal } from './components/CollaborateModal';
import { ScrollToTop } from './components/ScrollToTop';

import { HomePage } from './pages/HomePage';
import { PublicationsPage } from './pages/PublicationsPage';
import { NewsPage } from './pages/NewsPage';
import { FacilitiesPage } from './pages/FacilitiesPage';
import { ContactPage } from './pages/ContactPage';
import { AdminApp } from './admin/AdminApp';

interface PublicLayoutProps {
  darkMode: boolean;
  onToggleDarkMode: () => void;
  isCollabOpen: boolean;
  setIsCollabOpen: (open: boolean) => void;
}

const PublicLayout: React.FC<PublicLayoutProps> = ({
  darkMode,
  onToggleDarkMode,
  isCollabOpen,
  setIsCollabOpen,
}) => {
  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-[#120609] text-slate-900 dark:text-slate-100 font-sans selection:bg-maroon-100 dark:selection:bg-maroon-900/60 selection:text-maroon-900 dark:selection:text-maroon-100 transition-colors duration-200">
      {/* Sticky Header with Public Navigation */}
      <Header
        darkMode={darkMode}
        onToggleDarkMode={onToggleDarkMode}
        onOpenCollab={() => setIsCollabOpen(true)}
      />

      {/* Dynamic Route Pages */}
      <main id="main-content" className="flex-1">
        <Routes>
          <Route path="/" element={<HomePage onOpenCollab={() => setIsCollabOpen(true)} />} />
          <Route path="/publications" element={<PublicationsPage />} />
          <Route path="/news" element={<NewsPage />} />
          <Route path="/facilities" element={<FacilitiesPage />} />
          <Route path="/contact" element={<ContactPage />} />
          {/* Fallback to homepage */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      {/* Global Academic Footer */}
      <Footer onOpenCollab={() => setIsCollabOpen(true)} />

      {/* Quick Collaborate Modal */}
      <CollaborateModal
        isOpen={isCollabOpen}
        onClose={() => setIsCollabOpen(false)}
      />
    </div>
  );
};

export default function App() {
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('mindh-dark-mode');
      if (saved !== null) return saved === 'true';
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  const [isCollabOpen, setIsCollabOpen] = useState<boolean>(false);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('mindh-dark-mode', 'true');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('mindh-dark-mode', 'false');
    }
  }, [darkMode]);

  const handleToggleDarkMode = () => {
    setDarkMode((prev) => !prev);
  };

  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        {/* Completely isolated private Admin Mode */}
        <Route path="/admin/*" element={<AdminApp />} />

        {/* Public Website Interface */}
        <Route
          path="/*"
          element={
            <PublicLayout
              darkMode={darkMode}
              onToggleDarkMode={handleToggleDarkMode}
              isCollabOpen={isCollabOpen}
              setIsCollabOpen={setIsCollabOpen}
            />
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

