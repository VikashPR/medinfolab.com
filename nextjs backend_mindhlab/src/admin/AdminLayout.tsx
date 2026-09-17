'use client';

import React, { useState } from 'react';
import { useAdminAuth } from './context/AdminAuthContext';
import {
  LayoutDashboard,
  BookOpen,
  Bell,
  Layers,
  Users,
  Building,
  Mail,
  Settings,
  LogOut,
  ExternalLink,
  Shield,
  Menu,
  X,
  ChevronRight
} from 'lucide-react';
import Link from 'next/link';

interface AdminLayoutProps {
  activeTab: string;
  onSelectTab: (tabId: string) => void;
  children: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ activeTab, onSelectTab, children }) => {
  const { user, logout } = useAdminAuth();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const navItems = [
    { id: 'overview', label: 'Dashboard Overview', icon: LayoutDashboard },
    { id: 'publications', label: 'Publications', icon: BookOpen },
    { id: 'news', label: 'News & Announcements', icon: Bell },
    { id: 'facilities', label: 'Facilities & Testing Rigs', icon: Layers },
    { id: 'team', label: 'Faculty & Researchers', icon: Users },
    { id: 'collaborators', label: 'Partner Institutions', icon: Building },
    { id: 'inquiries', label: 'Inquiries & Messages', icon: Mail },
    { id: 'settings', label: 'System Settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-maroon-900 selection:text-white">
      {/* Top Mobile Bar */}
      <div className="lg:hidden flex items-center justify-between px-4 py-3 bg-slate-900/90 border-b border-slate-800 backdrop-blur sticky top-0 z-40">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-maroon-800 flex items-center justify-center text-white shadow-md">
            <Shield className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-extrabold text-white leading-tight">MINDH Lab</div>
            <div className="text-[10px] text-maroon-400 font-bold uppercase tracking-wider">Admin Portal</div>
          </div>
        </div>

        <button
          onClick={() => setMobileNavOpen(!mobileNavOpen)}
          className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800"
        >
          {mobileNavOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      <div className="flex-1 flex">
        {/* Desktop & Mobile Sidebar */}
        <aside
          className={`fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 border-r border-slate-800 flex flex-col justify-between transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-auto ${
            mobileNavOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'
          }`}
        >
          <div>
            {/* Lab Branding Header */}
            <div className="p-6 border-b border-slate-800/80 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-maroon-800 flex items-center justify-center text-white shadow-lg ring-2 ring-maroon-900/40">
                  <Shield className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-sm font-extrabold text-white leading-snug">MINDH Lab</div>
                  <div className="text-[10px] text-maroon-400 font-bold uppercase tracking-wider">
                    Console v2.4
                  </div>
                </div>
              </div>

              <button
                onClick={() => setMobileNavOpen(false)}
                className="lg:hidden p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Navigation Menu */}
            <nav className="p-3 space-y-1">
              <div className="px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                Core Lab Management
              </div>

              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      onSelectTab(item.id);
                      setMobileNavOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                      isActive
                        ? 'bg-maroon-800 text-white shadow-md'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                      <span>{item.label}</span>
                    </div>
                    {isActive && <ChevronRight className="w-3.5 h-3.5 text-maroon-300" />}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* User Account & Logout */}
          <div className="p-4 border-t border-slate-800/80 space-y-3">
            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-maroon-900/80 text-maroon-200 flex items-center justify-center font-bold text-xs">
                {user?.username?.charAt(0).toUpperCase() || 'A'}
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-xs font-bold text-white truncate">{user?.username || 'Administrator'}</div>
                <div className="text-[10px] text-slate-400 truncate">{user?.role || 'Super Admin'}</div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <a
                href="/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-semibold text-center transition-colors flex items-center justify-center gap-1.5"
              >
                <span>Live Site</span>
                <ExternalLink className="w-3 h-3" />
              </a>

              <button
                onClick={logout}
                className="py-2 px-3 rounded-xl bg-rose-950/40 hover:bg-rose-900 text-rose-300 text-[11px] font-semibold transition-colors flex items-center justify-center gap-1.5 border border-rose-900/50"
                title="Log out of administrator session"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Exit</span>
              </button>
            </div>
          </div>
        </aside>

        {/* Overlay backdrop on mobile */}
        {mobileNavOpen && (
          <div
            onClick={() => setMobileNavOpen(false)}
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          />
        )}

        {/* Main Content Area */}
        <main className="flex-1 min-w-0 bg-slate-950 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          <div className="max-w-6xl mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
};
