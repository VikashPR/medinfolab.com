'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Mail, MapPin, Building, ArrowUpRight, Shield } from 'lucide-react';
import { navigation } from '@/lib/navigation';
import { useSiteSettings } from '@/context/SiteSettingsContext';

export function SiteFooter() {
  const pathname = usePathname();
  const { settings } = useSiteSettings();

  // Hide in admin
  if (pathname.startsWith('/admin')) {
    return null;
  }

  return (
    <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0c0305] text-slate-600 dark:text-slate-400 transition-colors">
      <div className="container-wide grid gap-10 py-14 md:grid-cols-4">
        {/* Brand & Mission */}
        <div className="space-y-3">
          <div className="flex items-center gap-2.5">
            {settings.footerLogoUrl ? (
              <img
                src={settings.footerLogoUrl}
                alt={settings.labName || 'MINDH Lab'}
                className="h-8 w-auto max-w-[140px] max-h-8 object-contain rounded-lg shadow-xs"
              />
            ) : (
              <span className="grid size-8 place-items-center rounded-xl bg-maroon-800 text-sm font-bold text-white shadow-sm">
                M
              </span>
            )}
            <p className="text-xl font-extrabold tracking-tight text-slate-950 dark:text-white">
              {settings.labName ? (
                settings.labName
              ) : (
                <>MINDH <span className="text-maroon-800 dark:text-maroon-400 font-bold">Lab</span></>
              )}
            </p>
          </div>
          <p className="max-w-xs text-xs leading-5 text-slate-600 dark:text-slate-400">
            {settings.tagline || 'Medical Informatics and Digital Health research.'}
          </p>
          {settings.socialLinks?.linkedin && (
            <div className="pt-1">
              <a
                href={settings.socialLinks.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-maroon-50 dark:bg-slate-800 text-maroon-900 dark:text-slate-200 text-xs font-semibold hover:bg-maroon-100 transition-colors"
              >
                <span>LinkedIn</span>
                <ArrowUpRight className="w-3 h-3 text-maroon-700" />
              </a>
            </div>
          )}
        </div>

        {/* Quick Links */}
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-maroon-700 dark:text-maroon-400">
            Explore
          </p>
          <div className="mt-4 grid gap-2">
            {navigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-xs text-slate-600 dark:text-slate-300 hover:text-maroon-800 dark:hover:text-maroon-400 transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Contact Info */}
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-maroon-700 dark:text-maroon-400">
            Headquarters
          </p>
          <div className="mt-4 space-y-2 text-xs text-slate-600 dark:text-slate-300">
            <p className="flex items-start gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-maroon-700 shrink-0 mt-0.5" />
              <span>{settings.address || 'Division of Medical Informatics, Health Sciences Center'}</span>
            </p>
            <p className="flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-maroon-700 shrink-0" />
              <a href={`mailto:${settings.contactEmail || 'contact@mindh-lab.org'}`} className="hover:underline">
                {settings.contactEmail || 'contact@mindh-lab.org'}
              </a>
            </p>
          </div>
        </div>

        {/* Administration & Governance */}
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-maroon-700 dark:text-maroon-400">
            Administration
          </p>
          <div className="mt-4 space-y-3">
            <p className="text-xs text-slate-600 dark:text-slate-400">
              {settings.bottomRightLogoText || 'Clinical AI & Digital Health Governance.'}
            </p>
            
          </div>
        </div>
      </div>

      <div className="container-wide border-t border-slate-200 dark:border-slate-800 py-5 text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-3">
        <p>© {new Date().getFullYear()} MINDH Laboratory. All rights reserved.</p>
        <p className="text-[11px] text-slate-400">
          Medical Informatics &amp; Digital Health Research
        </p>
      </div>
    </footer>
  );
}
