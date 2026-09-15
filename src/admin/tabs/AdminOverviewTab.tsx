import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  Bell,
  Layers,
  Users,
  Building,
  Mail,
  ArrowRight,
  TrendingUp,
  Clock,
  ShieldCheck,
  CheckCircle2,
  ExternalLink
} from 'lucide-react';
import { useAdminAuth } from '../context/AdminAuthContext';
import { Link } from 'react-router-dom';

interface AdminOverviewTabProps {
  onSelectTab: (tabId: string) => void;
}

export const AdminOverviewTab: React.FC<AdminOverviewTabProps> = ({ onSelectTab }) => {
  const { user } = useAdminAuth();
  const [counts, setCounts] = useState({
    publications: 0,
    news: 0,
    facilities: 0,
    team: 0,
    collaborators: 0,
    inquiries: 0,
  });
  const [unreadInquiries, setUnreadInquiries] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCounts = async () => {
      setIsLoading(true);
      try {
        const token = localStorage.getItem('mindh_admin_token');
        const headers = token ? { Authorization: `Bearer ${token}` } : {};

        const [pubsRes, newsRes, facsRes, teamRes, collabsRes, inqRes] = await Promise.allSettled([
          fetch('/api/publications', { headers }),
          fetch('/api/news', { headers }),
          fetch('/api/facilities', { headers }),
          fetch('/api/team', { headers }),
          fetch('/api/collaborators', { headers }),
          fetch('/api/admin/inquiries', { headers }),
        ]);

        let pCount = 0;
        let nCount = 0;
        let fCount = 0;
        let tCount = 0;
        let cCount = 0;
        let iCount = 0;
        let recentInqs: any[] = [];

        if (pubsRes.status === 'fulfilled' && pubsRes.value.ok) {
          const d = await pubsRes.value.json();
          pCount = d.publications?.length || 0;
        }
        if (newsRes.status === 'fulfilled' && newsRes.value.ok) {
          const d = await newsRes.value.json();
          nCount = d.news?.length || 0;
        }
        if (facsRes.status === 'fulfilled' && facsRes.value.ok) {
          const d = await facsRes.value.json();
          fCount = d.facilities?.length || 0;
        }
        if (teamRes.status === 'fulfilled' && teamRes.value.ok) {
          const d = await teamRes.value.json();
          tCount = d.team?.length || 0;
        }
        if (collabsRes.status === 'fulfilled' && collabsRes.value.ok) {
          const d = await collabsRes.value.json();
          cCount = d.collaborators?.length || 0;
        }
        if (inqRes.status === 'fulfilled' && inqRes.value.ok) {
          const d = await inqRes.value.json();
          iCount = d.inquiries?.length || 0;
          recentInqs = (d.inquiries || []).filter((inq: any) => inq.status === 'New' || inq.status === 'Pending').slice(0, 5);
        }

        setCounts({
          publications: pCount,
          news: nCount,
          facilities: fCount,
          team: tCount,
          collaborators: cCount,
          inquiries: iCount,
        });
        setUnreadInquiries(recentInqs);
      } catch (err) {
        console.warn('Overview stats error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCounts();
  }, []);

  const stats = [
    {
      id: 'publications',
      label: 'Publications',
      count: counts.publications,
      icon: BookOpen,
      color: 'from-maroon-700 to-maroon-900',
      description: 'Peer-reviewed papers & preprints',
    },
    {
      id: 'news',
      label: 'News & Updates',
      count: counts.news,
      icon: Bell,
      color: 'from-amber-600 to-amber-800',
      description: 'Announcements & milestones',
    },
    {
      id: 'facilities',
      label: 'Testing Rigs & Facilities',
      count: counts.facilities,
      icon: Layers,
      color: 'from-emerald-700 to-emerald-900',
      description: 'Hardware instruments & specs',
    },
    {
      id: 'team',
      label: 'Faculty & Researchers',
      count: counts.team,
      icon: Users,
      color: 'from-sky-700 to-sky-900',
      description: 'PI, postdocs & fellows',
    },
    {
      id: 'collaborators',
      label: 'Partner Institutions',
      count: counts.collaborators,
      icon: Building,
      color: 'from-purple-700 to-purple-900',
      description: 'Clinical & academic partners',
    },
    {
      id: 'inquiries',
      label: 'Contact Inquiries',
      count: counts.inquiries,
      icon: Mail,
      color: 'from-rose-700 to-rose-900',
      description: 'Submitted collaboration messages',
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in">
      {/* Welcome Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-maroon-950 to-slate-900 border border-slate-800 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-maroon-800/60 border border-maroon-600/60 text-xs font-bold uppercase tracking-wider text-maroon-200">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Authenticated as {user?.role || 'Super Admin'}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Welcome back, {user?.username || 'Administrator'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Manage your laboratory database, update research publications, announce clinical grants, review collaboration inquiries, and maintain facilities.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-white text-xs font-semibold border border-slate-700 transition-colors shadow-sm"
          >
            <span>Preview Public Site</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {stats.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className="group text-left p-6 rounded-2xl bg-slate-900/70 border border-slate-800 hover:border-maroon-600/50 hover:bg-slate-900 transition-all shadow-md hover:shadow-xl"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-xl bg-gradient-to-br ${item.color} text-white shadow-md`}>
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-xs text-slate-500 group-hover:text-maroon-400 flex items-center gap-1 font-semibold transition-colors">
                  Manage <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </span>
              </div>
              <div className="text-3xl font-extrabold text-white tracking-tight">
                {isLoading ? '...' : item.count}
              </div>
              <div className="text-sm font-bold text-slate-200 mt-1">{item.label}</div>
              <div className="text-xs text-slate-400 mt-0.5">{item.description}</div>
            </button>
          );
        })}
      </div>

      {/* Quick Action & Recent Inquiries Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Quick Actions */}
        <div className="lg:col-span-6 p-6 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-maroon-400" />
            <span>Frequent Management Shortcuts</span>
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              onClick={() => onSelectTab('publications')}
              className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80 hover:border-maroon-600 text-left transition-colors group"
            >
              <div className="text-xs font-bold text-white group-hover:text-maroon-300">
                + Add New Publication
              </div>
              <div className="text-[11px] text-slate-400 mt-1">Add title, authors, DOI, & BibTeX</div>
            </button>

            <button
              onClick={() => onSelectTab('news')}
              className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80 hover:border-maroon-600 text-left transition-colors group"
            >
              <div className="text-xs font-bold text-white group-hover:text-maroon-300">
                + Post News Wire Item
              </div>
              <div className="text-[11px] text-slate-400 mt-1">Publish grants, trials & updates</div>
            </button>

            <button
              onClick={() => onSelectTab('facilities')}
              className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80 hover:border-maroon-600 text-left transition-colors group"
            >
              <div className="text-xs font-bold text-white group-hover:text-maroon-300">
                + Register Testing Rig
              </div>
              <div className="text-[11px] text-slate-400 mt-1">Hardware specs & status updates</div>
            </button>

            <button
              onClick={() => onSelectTab('inquiries')}
              className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80 hover:border-maroon-600 text-left transition-colors group"
            >
              <div className="text-xs font-bold text-white group-hover:text-maroon-300">
                Inbox ({unreadInquiries.length} New)
              </div>
              <div className="text-[11px] text-slate-400 mt-1">Review contact form inquiries</div>
            </button>
          </div>
        </div>

        {/* Right: Unread Inquiries Preview */}
        <div className="lg:col-span-6 p-6 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Mail className="w-4 h-4 text-maroon-400" />
              <span>Recent Contact Inquiries</span>
            </h3>
            <button
              onClick={() => onSelectTab('inquiries')}
              className="text-xs font-semibold text-maroon-400 hover:text-maroon-300"
            >
              View All
            </button>
          </div>

          {unreadInquiries.length === 0 ? (
            <div className="p-8 text-center rounded-xl bg-slate-950/40 border border-dashed border-slate-800 text-slate-400 text-xs">
              <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2 opacity-80" />
              No pending unread inquiries. All messages are reviewed.
            </div>
          ) : (
            <div className="space-y-2.5">
              {unreadInquiries.map((inq: any) => (
                <div
                  key={inq.id}
                  onClick={() => onSelectTab('inquiries')}
                  className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 hover:border-slate-700 cursor-pointer transition-colors flex items-center justify-between gap-3"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-white truncate">{inq.name}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-950 text-rose-300 border border-rose-900 font-semibold">
                        {inq.status || 'New'}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-400 truncate mt-0.5">
                      {inq.interestType} - {inq.message}
                    </div>
                  </div>
                  <div className="text-[10px] text-slate-500 shrink-0 flex items-center gap-1 font-mono">
                    <Clock className="w-3 h-3" />
                    <span>{new Date(inq.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
