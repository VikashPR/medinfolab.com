'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, Shield, ArrowUpRight } from 'lucide-react';
import { navigation } from '@/lib/navigation';
import { useSiteSettings } from '@/context/SiteSettingsContext';

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const { settings } = useSiteSettings();

  // Hide public header in admin dashboard
  if (pathname.startsWith('/admin')) {
    return null;
  }

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200/90 dark:border-slate-800 bg-white/95 dark:bg-[#120609]/95 backdrop-blur-md transition-colors">
      <div className="container-wide flex min-h-[72px] items-center justify-between gap-6">
        <Link href="/" onClick={() => setOpen(false)} className="focus-ring flex items-center gap-3">
          {settings.headerLogoUrl ? (
            <img
              src={settings.headerLogoUrl}
              alt={settings.labName || 'MINDH Lab'}
              className="h-9 w-auto max-w-[140px] max-h-9 object-contain rounded-lg shadow-xs"
            />
          ) : (
            <span className="grid size-9 place-items-center rounded-xl bg-maroon-800 text-sm font-bold text-white shadow-sm">
              M
            </span>
          )}
          <span>
            <span className="block text-xl font-extrabold tracking-tight text-slate-950 dark:text-white">
              {settings.labName ? (
                settings.labName
              ) : (
                <>MINDH <span className="font-bold text-maroon-800 dark:text-maroon-400">Lab</span></>
              )}
            </span>
            <span className="hidden text-[10px] font-medium tracking-wide text-slate-500 dark:text-slate-400 sm:block">
              {settings.tagline || 'Medical Informatics & Digital Health'}
            </span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-1 md:flex" aria-label="Primary navigation">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`focus-ring rounded-lg px-3.5 py-2 text-xs font-semibold transition ${
                  isActive
                    ? 'bg-maroon-50 dark:bg-maroon-950/80 text-maroon-800 dark:text-maroon-300 font-bold'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-maroon-50 dark:hover:bg-maroon-950/60 hover:text-maroon-800 dark:hover:text-maroon-300'
                }`}
              >
                {item.label === 'Contact' ? 'Contact Us' : item.label}
              </Link>
            );
          })}
          <span className="mx-2 h-4 w-px bg-slate-200 dark:bg-slate-800" />
          
          
        </nav>

        {/* Mobile Hamburger */}
        <button
          type="button"
          className="focus-ring rounded-lg p-2 text-slate-800 dark:text-slate-200 md:hidden"
          aria-label={open ? 'Close menu' : 'Open menu'}
          onClick={() => setOpen((value) => !value)}
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {open && (
        <nav className="container-wide border-t border-slate-200 dark:border-slate-800 py-3 md:hidden bg-white dark:bg-[#120609]" aria-label="Mobile navigation">
          {navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className="focus-ring block border-b border-slate-100 dark:border-slate-800 py-3 text-sm font-semibold text-slate-800 dark:text-slate-200 last:border-0"
            >
              {item.label}
            </Link>
          ))}
          <div className="pt-3 flex items-center justify-between">
            
            
          </div>
        </nav>
      )}
    </header>
  );
}


