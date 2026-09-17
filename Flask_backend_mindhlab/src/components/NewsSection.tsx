import React, { useState, useEffect } from 'react';
import {
  Calendar,
  Bell,
  ArrowUpRight,
  Award,
  FileCheck,
  Stethoscope,
  Plus,
  Edit2,
  Trash2,
  ExternalLink,
  Lock,
  Unlock,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  X,
  Image as ImageIcon,
  Sparkles,
  Search,
  Filter
} from 'lucide-react';
import { LAB_NEWS } from '../data/labData';
import { LabNewsItem } from '../types';

export const NewsSection: React.FC = () => {
  const [newsList, setNewsList] = useState<LabNewsItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  // Admin Mode state
  const [isAdminMode, setIsAdminMode] = useState<boolean>(true);
  
  // Modal for Add / Edit
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingItem, setEditingItem] = useState<LabNewsItem | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  // Form Fields
  const todayDate = new Date().toISOString().split('T')[0];
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    summary: '',
    image: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80&w=800',
    date: todayDate,
    category: 'Paper Accepted',
    linkText: 'Read More',
    linkUrl: '',
  });

  const PRESET_IMAGES = [
    { label: 'Hospital Telemetry', url: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&q=80&w=800' },
    { label: 'Clinical Laboratory', url: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80&w=800' },
    { label: 'Cardio Monitoring', url: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&q=80&w=800' },
    { label: 'Conference / Keynote', url: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&q=80&w=800' },
    { label: 'Microscopy / Neural', url: 'https://images.unsplash.com/photo-1507668077129-56e32842fceb?auto=format&fit=crop&q=80&w=800' },
  ];

  // Fetch news from backend on mount
  const fetchNews = async () => {
    setIsLoading(true);
    setErrorMsg(null);
    try {
      const res = await fetch('/api/news');
      if (!res.ok) {
        throw new Error(`HTTP error ${res.status}`);
      }
      const data = await res.json();
      if (data.news && Array.isArray(data.news)) {
        // Enforce reverse chronological order (newest date first, then newest createdAt)
        const sorted = sortNews(data.news);
        setNewsList(sorted);
      } else {
        setNewsList(sortNews(LAB_NEWS));
      }
    } catch (err: any) {
      console.warn('Could not fetch from backend /api/news, using local fallback:', err);
      setNewsList(sortNews(LAB_NEWS));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  // Helper to ensure reverse chronological ordering
  const sortNews = (items: LabNewsItem[]): LabNewsItem[] => {
    return [...items].sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      if (!isNaN(dateA) && !isNaN(dateB) && dateB !== dateA) {
        return dateB - dateA;
      }
      const createdA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const createdB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return createdB - createdA;
    });
  };

  const showToast = (msg: string) => {
    setSuccessToast(msg);
    setTimeout(() => {
      setSuccessToast(null);
    }, 4000);
  };

  // Open modal for adding
  const handleOpenAddModal = () => {
    setEditingItem(null);
    setFormData({
      title: '',
      description: '',
      summary: '',
      image: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80&w=800',
      date: new Date().toISOString().split('T')[0],
      category: 'Paper Accepted',
      linkText: 'Read Full Publication',
      linkUrl: '',
    });
    setIsModalOpen(true);
  };

  // Open modal for editing
  const handleOpenEditModal = (item: LabNewsItem) => {
    setEditingItem(item);
    setFormData({
      title: item.title,
      description: item.description || item.summary || '',
      summary: item.summary || '',
      image: item.image || 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80&w=800',
      date: item.date ? (item.date.includes('-') ? item.date : todayDate) : todayDate,
      category: item.category || 'Lab Update',
      linkText: item.linkText || 'Read More',
      linkUrl: item.linkUrl || '',
    });
    setIsModalOpen(true);
  };

  // Form Submission (Add or Edit)
  const handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      alert('Please enter a title for the news post.');
      return;
    }
    if (!formData.description.trim()) {
      alert('Please enter a description for the news post.');
      return;
    }

    try {
      if (editingItem) {
        // PUT edit
        const res = await fetch(`/api/news/${editingItem.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });
        const result = await res.json();
        if (!res.ok) throw new Error(result.message || 'Failed to update news post');

        if (result.news) {
          setNewsList(sortNews(result.news));
        } else {
          await fetchNews();
        }
        showToast('News post updated successfully!');
      } else {
        // POST create new
        const res = await fetch('/api/news', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });
        const result = await res.json();
        if (!res.ok) throw new Error(result.message || 'Failed to create news post');

        if (result.news) {
          setNewsList(sortNews(result.news));
        } else {
          await fetchNews();
        }
        showToast('New post published! It is now in position #1, shifting existing posts.');
      }
      setIsModalOpen(false);
      setEditingItem(null);
    } catch (err: any) {
      console.error('Error saving news item:', err);
      alert(`Error saving news post: ${err.message}`);
    }
  };

  // Delete news item
  const handleDeleteItem = async (id: string) => {
    try {
      const res = await fetch(`/api/news/${id}`, {
        method: 'DELETE',
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.message || 'Failed to delete post');

      if (result.news) {
        setNewsList(sortNews(result.news));
      } else {
        setNewsList((prev) => prev.filter((item) => item.id !== id));
      }
      setDeleteConfirmId(null);
      showToast('News post deleted successfully.');
    } catch (err: any) {
      console.error('Error deleting news item:', err);
      alert(`Error deleting post: ${err.message}`);
    }
  };

  // Reset to initial seed
  const handleResetDefaults = async () => {
    if (!window.confirm('Reset all news posts to default lab publications and announcements?')) {
      return;
    }
    try {
      const res = await fetch('/api/news/reset', { method: 'POST' });
      const result = await res.json();
      if (result.news) {
        setNewsList(sortNews(result.news));
      } else {
        await fetchNews();
      }
      showToast('Reset to original lab announcements.');
    } catch (err) {
      console.error('Failed to reset:', err);
      setNewsList(sortNews(LAB_NEWS));
      showToast('Reset local list.');
    }
  };

  // Format date helper
  const formatDateDisplay = (dateStr: string) => {
    if (!dateStr) return 'Recent';
    try {
      const parsed = new Date(dateStr);
      if (!isNaN(parsed.getTime())) {
        return parsed.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
        });
      }
    } catch (e) {
      // ignore
    }
    return dateStr;
  };

  const getCategoryIcon = (cat?: string) => {
    switch (cat) {
      case 'Paper Accepted':
        return <FileCheck className="w-3.5 h-3.5 text-maroon-700 dark:text-rose-400" />;
      case 'Grant Award':
        return <Award className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />;
      case 'Clinical Pilot':
        return <Stethoscope className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />;
      default:
        return <Bell className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />;
    }
  };

  // Filtered news
  const filteredNews = newsList.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (item.summary && item.summary.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCat =
      selectedCategory === 'All' || item.category === selectedCategory;

    return matchesSearch && matchesCat;
  });

  const categories = ['All', 'Paper Accepted', 'Clinical Pilot', 'Grant Award', 'Keynote', 'Lab Update'];

  return (
    <section id="news" className="py-14 sm:py-20 bg-white dark:bg-[#120609] border-t border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Toast Notification */}
        {successToast && (
          <div className="mb-6 p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/80 text-emerald-800 dark:text-emerald-200 flex items-center justify-between shadow-md animate-fade-in">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span className="text-sm font-semibold">{successToast}</span>
            </div>
            <button
              onClick={() => setSuccessToast(null)}
              className="text-emerald-600 hover:text-emerald-800 p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Header with Title & Admin Action Toolbar */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-maroon-50 dark:bg-maroon-950/60 border border-maroon-200/80 dark:border-maroon-800/80 text-maroon-800 dark:text-maroon-300 text-xs font-bold uppercase tracking-wider mb-2">
              <Bell className="w-3.5 h-3.5 text-maroon-700 dark:text-rose-400" />
              <span>Lab Dispatches & Announcements</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              News & Translational Updates
            </h2>
            <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base mt-2 max-w-2xl leading-relaxed">
              Real-time dispatches on peer-reviewed papers, clinical hospital pilots, multi-million dollar grants, and experimental testbed milestones.
            </p>
          </div>

          {/* Admin Management Toolbar */}
          <div className="flex flex-wrap items-center gap-3 self-start lg:self-auto">
            {/* Admin Toggle */}
            <button
              id="admin-mode-toggle"
              onClick={() => setIsAdminMode(!isAdminMode)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all shadow-sm border ${
                isAdminMode
                  ? 'bg-maroon-800 text-white border-maroon-700 dark:bg-maroon-700 dark:border-maroon-600'
                  : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700'
              }`}
              title="Toggle News Management Controls"
            >
              {isAdminMode ? <Unlock className="w-3.5 h-3.5 text-rose-200" /> : <Lock className="w-3.5 h-3.5" />}
              <span>{isAdminMode ? 'Admin Mode: Enabled' : 'Admin Mode: Off'}</span>
            </button>

            {/* Add Post Button (visible when Admin Mode is ON) */}
            {isAdminMode && (
              <>
                <button
                  id="add-news-btn"
                  onClick={handleOpenAddModal}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 text-xs font-bold hover:bg-maroon-900 dark:hover:bg-rose-100 transition-all shadow-sm"
                >
                  <Plus className="w-4 h-4 text-rose-400 dark:text-maroon-800" />
                  <span>New Post</span>
                </button>

                <button
                  onClick={handleResetDefaults}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-400 text-xs font-medium border border-slate-200 dark:border-slate-700 transition-colors"
                  title="Reset news data to default announcements"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Reset Defaults</span>
                </button>
              </>
            )}
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mb-8 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800">
          {/* Categories Pill Bar */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                  selectedCategory === cat
                    ? 'bg-maroon-800 text-white shadow-sm'
                    : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-700'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="relative min-w-[220px]">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search news titles or text..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-maroon-600 dark:focus:ring-maroon-500"
            />
          </div>
        </div>

        {/* Loading Skeleton */}
        {isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((n) => (
              <div
                key={n}
                className="h-80 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-800/50 animate-pulse"
              ></div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && filteredNews.length === 0 && (
          <div className="text-center py-16 px-4 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700">
            <Bell className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">No News Items Found</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
              No dispatches match the selected filter or search term. Click &quot;New Post&quot; above to create one.
            </p>
            {isAdminMode && (
              <button
                onClick={handleOpenAddModal}
                className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-maroon-800 text-white text-xs font-bold hover:bg-maroon-900"
              >
                <Plus className="w-4 h-4" />
                <span>Create New Post</span>
              </button>
            )}
          </div>
        )}

        {/* Reverse Chronological News Grid */}
        {!isLoading && filteredNews.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredNews.map((item, index) => {
              const isFirstItem = index === 0;
              return (
                <article
                  key={item.id}
                  id={`news-card-${item.id}`}
                  className={`group relative rounded-2xl border transition-all duration-200 flex flex-col justify-between overflow-hidden shadow-sm hover:shadow-xl ${
                    isFirstItem
                      ? 'border-maroon-400 dark:border-maroon-700 bg-white dark:bg-[#1a0810] ring-1 ring-maroon-400/20'
                      : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-[#16050b] hover:border-maroon-300 dark:hover:border-maroon-800'
                  }`}
                >
                  {/* Top Image Container */}
                  <div className="relative h-48 w-full overflow-hidden bg-slate-100 dark:bg-slate-900 shrink-0">
                    <img
                      src={item.image || 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80&w=800'}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                      loading="lazy"
                      onError={(e) => {
                        // Fallback image if broken URL
                        (e.target as HTMLImageElement).src =
                          'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80&w=800';
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>

                    {/* Top Overlay Badges */}
                    <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                      {/* Category Badge */}
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold tracking-wide uppercase bg-white/95 dark:bg-slate-900/90 text-slate-900 dark:text-white backdrop-blur-sm shadow">
                        {getCategoryIcon(item.category)}
                        <span>{item.category || 'Announcement'}</span>
                      </span>

                      {/* Reverse Chronological Rank Indicator / Newest Badge */}
                      {isFirstItem ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-maroon-700 text-white shadow-md animate-pulse">
                          <Sparkles className="w-3 h-3" />
                          <span>Latest Post (#1)</span>
                        </span>
                      ) : (
                        <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-black/50 text-white/90 backdrop-blur-sm">
                          #{index + 1}
                        </span>
                      )}
                    </div>

                    {/* Date Badge on bottom left of image */}
                    <div className="absolute bottom-2.5 left-3 flex items-center gap-1.5 text-xs text-white/95 font-medium drop-shadow">
                      <Calendar className="w-3.5 h-3.5 text-rose-300" />
                      <span>{formatDateDisplay(item.date)}</span>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      {/* Title */}
                      <h3 className="font-bold text-slate-900 dark:text-white text-base leading-snug mb-2 group-hover:text-maroon-800 dark:group-hover:text-rose-300 transition-colors">
                        {item.title}
                      </h3>

                      {/* Description */}
                      <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed line-clamp-4">
                        {item.description || item.summary}
                      </p>
                    </div>

                    {/* Card Footer: Links & Admin Action Buttons */}
                    <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between gap-3">
                      {/* Optional External Link */}
                      {item.linkUrl ? (
                        <a
                          href={item.linkUrl}
                          target={item.linkUrl.startsWith('http') ? '_blank' : '_self'}
                          rel={item.linkUrl.startsWith('http') ? 'noopener noreferrer' : undefined}
                          className="inline-flex items-center gap-1 text-xs font-bold text-maroon-800 dark:text-rose-300 hover:text-maroon-900 dark:hover:text-rose-200 group/link"
                        >
                          <span>{item.linkText || 'Read More'}</span>
                          <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5" />
                        </a>
                      ) : (
                        <span className="text-[11px] text-slate-400 dark:text-slate-500 italic">
                          Lab internal record
                        </span>
                      )}

                      {/* Admin Edit & Delete Actions */}
                      {isAdminMode && (
                        <div className="flex items-center gap-1.5 shrink-0">
                          <button
                            id={`edit-news-${item.id}`}
                            onClick={() => handleOpenEditModal(item)}
                            className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-950 text-slate-600 hover:text-blue-600 dark:text-slate-300 dark:hover:text-blue-400 transition-colors"
                            title="Edit News Post"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            id={`delete-news-${item.id}`}
                            onClick={() => setDeleteConfirmId(item.id)}
                            className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-rose-50 dark:hover:bg-rose-950 text-slate-600 hover:text-rose-600 dark:text-slate-300 dark:hover:text-rose-400 transition-colors"
                            title="Delete News Post"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {deleteConfirmId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
            <div className="bg-white dark:bg-[#1a0810] border border-slate-200 dark:border-rose-900/40 rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4">
              <div className="flex items-center gap-3 text-rose-600">
                <AlertCircle className="w-6 h-6 shrink-0" />
                <h4 className="text-lg font-bold text-slate-900 dark:text-white">Delete News Post?</h4>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Are you sure you want to remove this news item? It will be permanently removed from the server database.
              </p>
              <div className="flex justify-end gap-3 pt-2">
                <button
                  onClick={() => setDeleteConfirmId(null)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  id="confirm-delete-btn"
                  onClick={() => handleDeleteItem(deleteConfirmId)}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white shadow-md transition-colors"
                >
                  Yes, Delete Post
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Add / Edit News Post Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in overflow-y-auto">
            <div className="relative bg-white dark:bg-[#18060e] border border-slate-200 dark:border-maroon-900/50 rounded-2xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl my-8">
              {/* Close Button */}
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  setEditingItem(null);
                }}
                className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Modal Header */}
              <div className="mb-6">
                <div className="inline-flex items-center gap-2 text-maroon-800 dark:text-rose-400 text-xs font-bold uppercase tracking-wider mb-1">
                  <Bell className="w-4 h-4" />
                  <span>{editingItem ? 'Edit News Post' : 'Create New News Announcement'}</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
                  {editingItem ? 'Edit Post Details' : 'Publish News Dispatch'}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  {editingItem
                    ? 'Update publication date, title, imagery, and external references.'
                    : 'New posts automatically claim the first position (#1) in reverse chronological order.'}
                </p>
              </div>

              {/* Form Body */}
              <form onSubmit={handleSubmitForm} className="space-y-4 text-xs sm:text-sm">
                {/* Title */}
                <div>
                  <label className="block font-bold text-slate-800 dark:text-slate-200 mb-1">
                    Title <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Breakthrough in Contactless Blood Pressure Monitoring"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-maroon-600"
                  />
                </div>

                {/* Date & Category Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-slate-800 dark:text-slate-200 mb-1">
                      Publication Date <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="date"
                      required
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-maroon-600"
                    />
                    <span className="text-[10px] text-slate-400 mt-0.5 block">
                      Determines reverse chronological order (newest date first).
                    </span>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-800 dark:text-slate-200 mb-1">
                      Category
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-maroon-600"
                    >
                      <option value="Paper Accepted">Paper Accepted</option>
                      <option value="Clinical Pilot">Clinical Pilot</option>
                      <option value="Grant Award">Grant Award</option>
                      <option value="Keynote">Keynote</option>
                      <option value="Lab Update">Lab Update</option>
                      <option value="Award / Honors">Award / Honors</option>
                    </select>
                  </div>
                </div>

                {/* Image URL & Quick Presets */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="font-bold text-slate-800 dark:text-slate-200">
                      Image URL <span className="text-rose-500">*</span>
                    </label>
                    <span className="text-[11px] text-slate-400">Live preview below</span>
                  </div>
                  <input
                    type="url"
                    required
                    placeholder="https://images.unsplash.com/..."
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-maroon-600"
                  />

                  {/* Preset Photos */}
                  <div className="mt-2 flex flex-wrap items-center gap-1.5">
                    <span className="text-[10px] text-slate-400 font-semibold uppercase">Presets:</span>
                    {PRESET_IMAGES.map((preset, idx) => (
                      <button
                        type="button"
                        key={idx}
                        onClick={() => setFormData({ ...formData, image: preset.url })}
                        className={`text-[11px] px-2 py-0.5 rounded border transition-colors ${
                          formData.image === preset.url
                            ? 'bg-maroon-800 text-white border-maroon-700'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-maroon-400'
                        }`}
                      >
                        {preset.label}
                      </button>
                    ))}
                  </div>

                  {/* Image Preview */}
                  {formData.image && (
                    <div className="mt-2 relative h-28 w-full rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-900">
                      <img
                        src={formData.image}
                        alt="Preview"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80&w=800';
                        }}
                      />
                      <span className="absolute bottom-1 right-2 text-[10px] bg-black/60 text-white px-2 py-0.5 rounded font-mono">
                        Card Preview
                      </span>
                    </div>
                  )}
                </div>

                {/* Description */}
                <div>
                  <label className="block font-bold text-slate-800 dark:text-slate-200 mb-1">
                    Description <span className="text-rose-500">*</span>
                  </label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Provide full details regarding the clinical trial, grant, or publication methodology..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-maroon-600 leading-relaxed"
                  ></textarea>
                </div>

                {/* Optional External Link & Text */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-slate-800 dark:text-slate-200 mb-1">
                      External Link URL <span className="text-slate-400 font-normal">(Optional)</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. https://nature.com/articles/... or #publications"
                      value={formData.linkUrl}
                      onChange={(e) => setFormData({ ...formData, linkUrl: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-maroon-600"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-800 dark:text-slate-200 mb-1">
                      Link Label <span className="text-slate-400 font-normal">(Optional)</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Read Paper, View Program"
                      value={formData.linkText}
                      onChange={(e) => setFormData({ ...formData, linkText: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-maroon-600"
                    />
                  </div>
                </div>

                {/* Modal Footer Buttons */}
                <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setIsModalOpen(false);
                      setEditingItem(null);
                    }}
                    className="px-4 py-2.5 rounded-xl font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    id="submit-news-form-btn"
                    className="px-6 py-2.5 rounded-xl font-bold bg-maroon-800 hover:bg-maroon-900 text-white shadow-md hover:shadow-lg transition-all"
                  >
                    {editingItem ? 'Save Changes' : 'Publish to News Section'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
