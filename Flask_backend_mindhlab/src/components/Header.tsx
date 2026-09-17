import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Sun, Moon, ArrowUpRight, Send, ChevronDown } from 'lucide-react';

interface HeaderProps {
  darkMode: boolean;
  onToggleDarkMode: () => void;
  onOpenCollab: () => void;
}

export const Header: React.FC<HeaderProps> = ({ darkMode, onToggleDarkMode, onOpenCollab }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  // Primary dedicated page routes
  const mainRoutes = [
    { label: 'Home', path: '/' },
    { label: 'Publications', path: '/publications' },
    { label: 'News', path: '/news' },
    { label: 'Facilities', path: '/facilities' },
    { label: 'Contact Us', path: '/contact' },
  ];

  // Secondary sub-sections on home
  const sectionLinks = [
    { label: 'Research', hash: '#research' },
    { label: 'Team', hash: '#team' },
    { label: 'Collaborators', hash: '#collaborators' },
  ];

  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/' && !location.hash;
    }
    return location.pathname.startsWith(path);
  };

  const handleSectionClick = (hash: string) => {
    setMobileMenuOpen(false);
    if (hash === '#collaborators') {
      if (location.pathname === '/contact') {
        const el = document.querySelector('#collaborators');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      } else {
        window.location.href = '/contact#collaborators';
      }
      return;
    }
    if (location.pathname !== '/') {
      window.location.href = `/${hash}`;
    } else {
      const el = document.querySelector(hash);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-[#120609]/95 backdrop-blur-md transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo & Node Icon */}
        <Link
          to="/"
          id="nav-logo"
          className="flex items-center gap-2.5 group focus:outline-none focus-visible:ring-2 focus-visible:ring-maroon-600 rounded-lg p-1"
        >
          {/* Medical Informatics Maroon Badge */}
          <div className="w-9 h-9 rounded-xl bg-maroon-800 text-white flex items-center justify-center transition-transform group-hover:scale-105 shadow-sm">
            <svg
              className="w-5 h-5 stroke-white"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
              <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
              <line x1="12" y1="22.08" x2="12" y2="12"></line>
            </svg>
          </div>
          <div className="flex flex-col">
            <span className="font-extrabold text-xl tracking-tight text-slate-900 dark:text-white">
              MINDH <span className="text-maroon-800 dark:text-maroon-300 font-bold">Lab</span>
            </span>
            <span className="text-[10px] tracking-wide text-slate-500 dark:text-slate-400 font-medium -mt-1 hidden sm:block">
              Medical Informatics & Digital Health
            </span>
          </div>
        </Link>

        {/* Desktop Nav Items */}
        <nav className="hidden lg:flex items-center gap-1 text-sm font-medium">
          {mainRoutes.map((route) => {
            const active = isActive(route.path);
            return (
              <Link
                key={route.label}
                to={route.path}
                className={`px-3.5 py-1.5 rounded-lg transition-all text-xs font-semibold ${
                  active
                    ? 'bg-maroon-50 text-maroon-900 dark:bg-maroon-950/80 dark:text-maroon-200 border border-maroon-200/80 dark:border-maroon-800/80 shadow-xs'
                    : 'text-slate-600 dark:text-slate-300 hover:text-maroon-800 dark:hover:text-maroon-300 hover:bg-slate-50 dark:hover:bg-slate-800/60'
                }`}
              >
                {route.label}
              </Link>
            );
          })}

          {/* Quick Sub-Sections */}
          <div className="h-4 w-[1px] bg-slate-200 dark:bg-slate-800 mx-1"></div>

          {sectionLinks.map((sec) => (
            <button
              key={sec.label}
              onClick={() => handleSectionClick(sec.hash)}
              className="px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-500 dark:text-slate-400 hover:text-maroon-800 dark:hover:text-maroon-300 hover:bg-slate-50 dark:hover:bg-slate-850 transition-colors"
            >
              {sec.label}
            </button>
          ))}

          {/* LinkedIn Icon */}
          <a
            href="https://www.linkedin.com/company/medical-informatics-and-digital-health-lab/"
            target="_blank"
            rel="noopener noreferrer"
            title="MINDH Lab on LinkedIn"
            className="p-2 ml-1 text-slate-400 hover:text-maroon-800 dark:hover:text-maroon-300 transition-colors"
          >
            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
              <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
            </svg>
            <span className="sr-only">LinkedIn</span>
          </a>

          {/* Dark Mode Toggle */}
          <button
            id="btn-dark-mode-toggle"
            onClick={onToggleDarkMode}
            aria-label="Toggle dark mode"
            className="p-2 rounded-lg text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* Quick CTA */}
          <button
            id="nav-btn-collab"
            onClick={onOpenCollab}
            className="ml-2 px-3.5 py-1.5 rounded-lg bg-maroon-800 hover:bg-maroon-900 text-white text-xs font-bold tracking-wide transition-all shadow-sm flex items-center gap-1.5"
          >
            <Send className="w-3 h-3" />
            <span>Collaborate</span>
          </button>
        </nav>

        {/* Medium Screen (md) Nav (Compact) */}
        <div className="hidden md:flex lg:hidden items-center gap-2">
          {mainRoutes.slice(0, 4).map((route) => (
            <Link
              key={route.label}
              to={route.path}
              className={`px-2.5 py-1 rounded-md text-xs font-semibold ${
                isActive(route.path)
                  ? 'bg-maroon-50 text-maroon-800 dark:bg-maroon-950 dark:text-maroon-200'
                  : 'text-slate-600 dark:text-slate-300'
              }`}
            >
              {route.label}
            </Link>
          ))}
          <Link
            to="/contact"
            className="px-2.5 py-1 rounded-md text-xs font-semibold bg-maroon-800 text-white"
          >
            Contact
          </Link>
          <button
            onClick={onToggleDarkMode}
            className="p-1.5 rounded-lg text-slate-500"
          >
            {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
          </button>
        </div>

        {/* Mobile Controls */}
        <div className="flex items-center gap-2 md:hidden">
          <button
            id="btn-mobile-dark-mode"
            onClick={onToggleDarkMode}
            aria-label="Toggle dark mode"
            className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
          >
            {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
          </button>

          <button
            id="btn-mobile-menu-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
            className="p-2 rounded-lg text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-[#15070c] px-4 pt-3 pb-5 space-y-1 shadow-lg animate-in fade-in slide-in-from-top-2">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-3 py-1">
            Pages
          </div>
          {mainRoutes.map((route) => {
            const active = isActive(route.path);
            return (
              <Link
                key={route.label}
                to={route.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-3 py-2 rounded-xl text-sm font-semibold transition-colors ${
                  active
                    ? 'bg-maroon-50 dark:bg-maroon-950/80 text-maroon-900 dark:text-maroon-200'
                    : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                {route.label}
              </Link>
            );
          })}

          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-3 pt-3 pb-1 border-t border-slate-100 dark:border-slate-800">
            Sections
          </div>
          {sectionLinks.map((sec) => (
            <button
              key={sec.label}
              onClick={() => handleSectionClick(sec.hash)}
              className="w-full text-left px-3 py-1.5 rounded-lg text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              {sec.label}
            </button>
          ))}

          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2">
            <Link
              to="/contact"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full py-2.5 rounded-xl bg-maroon-800 hover:bg-maroon-900 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Contact Us / Inquire</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
