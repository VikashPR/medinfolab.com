import React, { useState, useEffect } from 'react';
import {
  Bell,
  Plus,
  Search,
  Edit2,
  Trash2,
  Check,
  X,
  Calendar,
  ExternalLink,
  AlertTriangle,
  Image as ImageIcon
} from 'lucide-react';
import { LabNewsItem } from '../../types';

export const AdminNewsTab: React.FC = () => {
  const [newsList, setNewsList] = useState<LabNewsItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingItem, setEditingItem] = useState<LabNewsItem | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  const todayDate = new Date().toISOString().split('T')[0];

  const PRESET_IMAGES = [
    { label: 'Hospital Telemetry', url: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&q=80&w=800' },
    { label: 'Clinical Laboratory', url: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80&w=800' },
    { label: 'Cardio Monitoring', url: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&q=80&w=800' },
    { label: 'Conference / Keynote', url: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&q=80&w=800' },
    { label: 'Microscopy / Neural', url: 'https://images.unsplash.com/photo-1507668077129-56e32842fceb?auto=format&fit=crop&q=80&w=800' },
  ];

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    summary: '',
    image: PRESET_IMAGES[0].url,
    date: todayDate,
    category: 'Paper Accepted',
    linkText: 'Read Details',
    linkUrl: '',
    published: true,
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

  const fetchNews = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/news', { headers: getHeaders() });
      if (res.ok) {
        const data = await res.json();
        if (data.success && Array.isArray(data.news)) {
          setNewsList(data.news);
        }
      }
    } catch (err) {
      console.warn('Failed to fetch news:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  const openAddModal = () => {
    setEditingItem(null);
    setFormData({
      title: '',
      description: '',
      summary: '',
      image: PRESET_IMAGES[0].url,
      date: new Date().toISOString().split('T')[0],
      category: 'Paper Accepted',
      linkText: 'Read Details',
      linkUrl: '',
      published: true,
    });
    setIsModalOpen(true);
  };

  const openEditModal = (item: LabNewsItem) => {
    setEditingItem(item);
    setFormData({
      title: item.title,
      description: item.description,
      summary: item.summary || '',
      image: item.image,
      date: item.date,
      category: item.category,
      linkText: item.linkText || 'Read Details',
      linkUrl: item.linkUrl || '',
      published: (item as any).published !== false,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      if (editingItem) {
        const res = await fetch(`/api/news/${editingItem.id}`, {
          method: 'PUT',
          headers: getHeaders(),
          body: JSON.stringify(formData),
        });
        const data = await res.json();
        if (res.ok && data.success) {
          showToast('News item updated successfully.');
          setIsModalOpen(false);
          fetchNews();
        } else {
          alert(data.message || 'Failed to update news item.');
        }
      } else {
        const res = await fetch('/api/news', {
          method: 'POST',
          headers: getHeaders(),
          body: JSON.stringify(formData),
        });
        const data = await res.json();
        if (res.ok && data.success) {
          showToast('News post created and published.');
          setIsModalOpen(false);
          fetchNews();
        } else {
          alert(data.message || 'Failed to create news item.');
        }
      }
    } catch (err: any) {
      alert(err?.message || 'Error saving news item');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/news/${id}`, {
        method: 'DELETE',
        headers: getHeaders(),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        showToast('News post deleted permanently.');
        setDeleteConfirmId(null);
        fetchNews();
      } else {
        alert(data.message || 'Failed to delete news post.');
      }
    } catch (err: any) {
      alert(err?.message || 'Error deleting news item');
    }
  };

  const handleTogglePublish = async (item: LabNewsItem) => {
    const nextPublished = !(item as any).published;
    try {
      const res = await fetch(`/api/news/${item.id}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify({ ...item, published: nextPublished }),
      });
      if (res.ok) {
        showToast(`News item ${nextPublished ? 'published' : 'hidden from public view'}.`);
        fetchNews();
      }
    } catch (err) {
      console.warn('Error toggling news state:', err);
    }
  };

  const filteredNews = newsList.filter((n) => {
    const matchesCat = selectedCategory === 'All' || n.category === selectedCategory;
    const query = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !query ||
      n.title.toLowerCase().includes(query) ||
      n.description.toLowerCase().includes(query) ||
      n.category.toLowerCase().includes(query);
    return matchesCat && matchesSearch;
  });

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
            <Bell className="w-6 h-6 text-amber-500" />
            <span>Laboratory News Wire Manager</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Post hospital trials, research grants, paper acceptances, and lab announcements.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-maroon-800 hover:bg-maroon-700 text-white text-xs font-bold shadow-md transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Post News Update</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search news by title, content, or category..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-maroon-600"
          />
        </div>

        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs focus:outline-none focus:border-maroon-600"
        >
          <option value="All">All Categories</option>
          <option value="Paper Accepted">Paper Accepted</option>
          <option value="Grant Award">Grant Award</option>
          <option value="Clinical Pilot">Clinical Pilot</option>
          <option value="Keynote">Keynote</option>
          <option value="Lab Update">Lab Update</option>
        </select>
      </div>

      {/* News Grid */}
      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((n) => (
            <div key={n} className="h-24 bg-slate-900/60 rounded-2xl animate-pulse border border-slate-800" />
          ))}
        </div>
      ) : filteredNews.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-slate-900/40 border border-dashed border-slate-800 text-slate-400 text-xs">
          No news items found.
        </div>
      ) : (
        <div className="space-y-3">
          {filteredNews.map((item) => {
            const isPublished = (item as any).published !== false;
            return (
              <div
                key={item.id}
                className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all"
              >
                <div className="flex items-start sm:items-center gap-4 flex-1 min-w-0">
                  <div className="w-16 h-16 rounded-xl overflow-hidden bg-slate-950 shrink-0 border border-slate-800">
                    <img
                      src={item.image}
                      alt={item.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="space-y-1 min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full font-bold bg-slate-800 text-slate-300 border border-slate-700">
                        {item.category}
                      </span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-950 text-slate-400 border border-slate-800 flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {item.date}
                      </span>
                      <button
                        onClick={() => handleTogglePublish(item)}
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full border transition-colors ${
                          isPublished
                            ? 'bg-emerald-950/80 text-emerald-300 border-emerald-800'
                            : 'bg-amber-950/80 text-amber-300 border-amber-800'
                        }`}
                      >
                        {isPublished ? '● Published' : '○ Hidden'}
                      </button>
                    </div>

                    <h3 className="text-sm font-bold text-white leading-snug truncate">{item.title}</h3>
                    <p className="text-xs text-slate-400 line-clamp-1">{item.description}</p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 self-end md:self-center shrink-0">
                  <button
                    onClick={() => openEditModal(item)}
                    className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    <span>Edit</span>
                  </button>
                  <button
                    onClick={() => setDeleteConfirmId(item.id)}
                    className="p-2 rounded-xl bg-rose-950/50 hover:bg-rose-900/60 text-rose-300 text-xs font-semibold flex items-center gap-1.5 border border-rose-900/60 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-sm w-full space-y-4 shadow-2xl">
            <div className="w-12 h-12 rounded-2xl bg-rose-950/70 border border-rose-900 flex items-center justify-center text-rose-400 mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div className="text-center space-y-1">
              <h3 className="text-base font-bold text-white">Delete News Post?</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                This action cannot be undone and will remove this post from the public news feed.
              </p>
            </div>
            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDeleteConfirmId(null)}
                className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleDelete(deleteConfirmId)}
                className="flex-1 py-2.5 rounded-xl bg-rose-700 hover:bg-rose-800 text-white text-xs font-bold"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add / Edit News Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto animate-in fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-2xl w-full my-8 shadow-2xl space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Bell className="w-5 h-5 text-amber-500" />
                <span>{editingItem ? 'Edit News Announcement' : 'Post News Update'}</span>
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  News Title *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Clinical rPPG Trial Accepted to Nature Digital Medicine"
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-maroon-600"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Announcement Category *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-maroon-600"
                  >
                    <option value="Paper Accepted">Paper Accepted</option>
                    <option value="Grant Award">Grant Award</option>
                    <option value="Clinical Pilot">Clinical Pilot</option>
                    <option value="Keynote">Keynote</option>
                    <option value="Lab Update">Lab Update</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Publication Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-maroon-600"
                  />
                </div>
              </div>

              {/* Cover Image Selector */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Cover Image
                </label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {PRESET_IMAGES.map((preset) => (
                    <button
                      key={preset.label}
                      type="button"
                      onClick={() => setFormData({ ...formData, image: preset.url })}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold border transition-colors ${
                        formData.image === preset.url
                          ? 'bg-maroon-900/60 border-maroon-500 text-white'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
                <input
                  type="text"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  placeholder="Or enter custom image URL"
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-maroon-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Full Description *
                </label>
                <textarea
                  rows={4}
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Comprehensive text detailing the award, trial findings, or event..."
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-maroon-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Brief Summary (Optional preview blurb)
                </label>
                <input
                  type="text"
                  value={formData.summary}
                  onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                  placeholder="1-2 sentences for concise cards"
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-maroon-600"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Call-to-Action Text
                  </label>
                  <input
                    type="text"
                    value={formData.linkText}
                    onChange={(e) => setFormData({ ...formData, linkText: e.target.value })}
                    placeholder="e.g. Read Details / View Program"
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-maroon-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Call-to-Action Link URL
                  </label>
                  <input
                    type="text"
                    value={formData.linkUrl}
                    onChange={(e) => setFormData({ ...formData, linkUrl: e.target.value })}
                    placeholder="https://... or /publications"
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-maroon-600"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="news-published-cb"
                  checked={formData.published}
                  onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                  className="w-4 h-4 rounded text-maroon-600 focus:ring-maroon-500 bg-slate-950 border-slate-800"
                />
                <label htmlFor="news-published-cb" className="text-xs text-slate-300 font-medium cursor-pointer">
                  Publish to public news page immediately
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-5 py-2 rounded-xl bg-maroon-800 hover:bg-maroon-700 text-white text-xs font-bold shadow-md disabled:opacity-50"
                >
                  {isSaving ? 'Saving...' : editingItem ? 'Update Post' : 'Publish Announcement'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
