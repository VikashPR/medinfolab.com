import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  Plus,
  Search,
  Edit2,
  Trash2,
  Check,
  X,
  FileText,
  ExternalLink,
  Code2,
  Sparkles,
  RotateCcw,
  AlertTriangle
} from 'lucide-react';
import { Publication, PublicationTopic } from '../../types';

export const AdminPublicationsTab: React.FC = () => {
  const [publications, setPublications] = useState<Publication[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedTopic, setSelectedTopic] = useState<string>('All');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingPub, setEditingPub] = useState<Publication | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  const [formData, setFormData] = useState({
    title: '',
    authors: '',
    journal: '',
    year: new Date().getFullYear(),
    topic: 'Physiological Monitoring' as PublicationTopic,
    abstract: '',
    highlight: '',
    doiUrl: '',
    pdfUrl: '',
    codeUrl: '',
    bibtex: '',
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

  const fetchPublications = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/publications', { headers: getHeaders() });
      if (res.ok) {
        const data = await res.json();
        if (data.success && Array.isArray(data.publications)) {
          setPublications(data.publications);
        }
      }
    } catch (err) {
      console.warn('Failed to fetch publications:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPublications();
  }, []);

  const openAddModal = () => {
    setEditingPub(null);
    setFormData({
      title: '',
      authors: '',
      journal: '',
      year: new Date().getFullYear(),
      topic: 'Physiological Monitoring',
      abstract: '',
      highlight: '',
      doiUrl: '',
      pdfUrl: '',
      codeUrl: '',
      bibtex: '',
      published: true,
    });
    setIsModalOpen(true);
  };

  const openEditModal = (pub: Publication) => {
    setEditingPub(pub);
    setFormData({
      title: pub.title,
      authors: pub.authors,
      journal: pub.journal,
      year: pub.year,
      topic: pub.topic,
      abstract: pub.abstract,
      highlight: pub.highlight || '',
      doiUrl: pub.doiUrl || '',
      pdfUrl: pub.pdfUrl || '',
      codeUrl: pub.codeUrl || '',
      bibtex: pub.bibtex || '',
      published: (pub as any).published !== false,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      let finalBibtex = formData.bibtex.trim();
      if (!finalBibtex && formData.title) {
        const firstAuthor = formData.authors.split(',')[0].trim().split(' ').pop()?.toLowerCase() || 'author';
        const key = `${firstAuthor}${formData.year}`;
        finalBibtex = `@article{${key},\n  title={${formData.title}},\n  author={${formData.authors}},\n  journal={${formData.journal}},\n  year={${formData.year}}\n}`;
      }

      const payload = {
        ...formData,
        bibtex: finalBibtex,
      };

      if (editingPub) {
        const res = await fetch(`/api/publications/${editingPub.id}`, {
          method: 'PUT',
          headers: getHeaders(),
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (res.ok && data.success) {
          showToast('Publication updated successfully.');
          setIsModalOpen(false);
          fetchPublications();
        } else {
          alert(data.message || 'Failed to update publication.');
        }
      } else {
        const res = await fetch('/api/publications', {
          method: 'POST',
          headers: getHeaders(),
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (res.ok && data.success) {
          showToast('Publication added to catalog.');
          setIsModalOpen(false);
          fetchPublications();
        } else {
          alert(data.message || 'Failed to create publication.');
        }
      }
    } catch (err: any) {
      alert(err?.message || 'Error saving publication');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/publications/${id}`, {
        method: 'DELETE',
        headers: getHeaders(),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        showToast('Publication removed permanently.');
        setDeleteConfirmId(null);
        fetchPublications();
      } else {
        alert(data.message || 'Failed to delete publication.');
      }
    } catch (err: any) {
      alert(err?.message || 'Error deleting publication');
    }
  };

  const handleTogglePublish = async (pub: Publication) => {
    const nextPublished = !(pub as any).published;
    try {
      const res = await fetch(`/api/publications/${pub.id}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify({ ...pub, published: nextPublished }),
      });
      if (res.ok) {
        showToast(`Publication ${nextPublished ? 'published' : 'hidden from public view'}.`);
        fetchPublications();
      }
    } catch (err) {
      console.warn('Error toggling publication state:', err);
    }
  };

  const filteredPubs = publications.filter((p) => {
    const matchesTopic = selectedTopic === 'All' || p.topic === selectedTopic;
    const query = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !query ||
      p.title.toLowerCase().includes(query) ||
      p.authors.toLowerCase().includes(query) ||
      p.journal.toLowerCase().includes(query);
    return matchesTopic && matchesSearch;
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
            <BookOpen className="w-6 h-6 text-maroon-500" />
            <span>Publications Manager</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Manage laboratory papers, update DOIs, citations, and quantitative highlights.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-maroon-800 hover:bg-maroon-700 text-white text-xs font-bold shadow-md transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Publication</span>
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
            placeholder="Search papers by title, author, or journal..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-maroon-600"
          />
        </div>

        <select
          value={selectedTopic}
          onChange={(e) => setSelectedTopic(e.target.value)}
          className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs focus:outline-none focus:border-maroon-600"
        >
          <option value="All">All Research Topics</option>
          <option value="Physiological Monitoring">Physiological Monitoring</option>
          <option value="Clinical AI">Clinical AI</option>
          <option value="Signal Processing">Signal Processing</option>
          <option value="Digital Health">Digital Health</option>
        </select>
      </div>

      {/* Publications Table / Card List */}
      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((n) => (
            <div key={n} className="h-24 bg-slate-900/60 rounded-2xl animate-pulse border border-slate-800" />
          ))}
        </div>
      ) : filteredPubs.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-slate-900/40 border border-dashed border-slate-800 text-slate-400 text-xs">
          No publications found matching your query.
        </div>
      ) : (
        <div className="space-y-3">
          {filteredPubs.map((pub) => {
            const isPublished = (pub as any).published !== false;
            return (
              <div
                key={pub.id}
                className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all"
              >
                <div className="space-y-1.5 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full font-bold bg-slate-800 text-slate-300 border border-slate-700">
                      {pub.topic}
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-950 text-slate-400 border border-slate-800">
                      {pub.year}
                    </span>
                    <button
                      onClick={() => handleTogglePublish(pub)}
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full border transition-colors ${
                        isPublished
                          ? 'bg-emerald-950/80 text-emerald-300 border-emerald-800'
                          : 'bg-amber-950/80 text-amber-300 border-amber-800'
                      }`}
                    >
                      {isPublished ? '● Published (Public)' : '○ Draft / Hidden'}
                    </button>
                  </div>

                  <h3 className="text-sm font-bold text-white leading-snug">{pub.title}</h3>
                  <p className="text-xs text-slate-400">{pub.authors}</p>
                  <p className="text-xs text-maroon-400 italic font-medium">{pub.journal}</p>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 self-end md:self-center shrink-0">
                  <button
                    onClick={() => openEditModal(pub)}
                    className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    <span>Edit</span>
                  </button>
                  <button
                    onClick={() => setDeleteConfirmId(pub.id)}
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
              <h3 className="text-base font-bold text-white">Delete Publication?</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                This action is permanent and will remove this paper from both the public catalog and database.
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

      {/* Add / Edit Publication Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto animate-in fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-2xl w-full my-8 shadow-2xl space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-maroon-500" />
                <span>{editingPub ? 'Edit Publication' : 'Add New Laboratory Publication'}</span>
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
                  Publication Title *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Real-Time Contactless rPPG Monitoring in Intensive Care"
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-maroon-600"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Authors *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.authors}
                    onChange={(e) => setFormData({ ...formData, authors: e.target.value })}
                    placeholder="e.g. R. Sharma, E. Vance, C. Zhang"
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-maroon-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Research Topic *
                  </label>
                  <select
                    value={formData.topic}
                    onChange={(e) => setFormData({ ...formData, topic: e.target.value as PublicationTopic })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-maroon-600"
                  >
                    <option value="Physiological Monitoring">Physiological Monitoring</option>
                    <option value="Clinical AI">Clinical AI</option>
                    <option value="Signal Processing">Signal Processing</option>
                    <option value="Digital Health">Digital Health</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Journal / Conference *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.journal}
                    onChange={(e) => setFormData({ ...formData, journal: e.target.value })}
                    placeholder="e.g. IEEE Transactions on Biomedical Engineering"
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-maroon-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Year *
                  </label>
                  <input
                    type="number"
                    required
                    value={formData.year}
                    onChange={(e) => setFormData({ ...formData, year: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-maroon-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">DOI URL</label>
                  <input
                    type="text"
                    value={formData.doiUrl}
                    onChange={(e) => setFormData({ ...formData, doiUrl: e.target.value })}
                    placeholder="https://doi.org/..."
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-maroon-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">PDF URL</label>
                  <input
                    type="text"
                    value={formData.pdfUrl}
                    onChange={(e) => setFormData({ ...formData, pdfUrl: e.target.value })}
                    placeholder="https://arxiv.org/..."
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-maroon-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Code URL</label>
                  <input
                    type="text"
                    value={formData.codeUrl}
                    onChange={(e) => setFormData({ ...formData, codeUrl: e.target.value })}
                    placeholder="https://github.com/..."
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-maroon-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Key Quantitative Highlight (Optional)
                </label>
                <input
                  type="text"
                  value={formData.highlight}
                  onChange={(e) => setFormData({ ...formData, highlight: e.target.value })}
                  placeholder="e.g. Mean absolute error < 1.42 BPM across 120 intensive care subjects."
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-maroon-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Abstract *
                </label>
                <textarea
                  rows={3}
                  required
                  value={formData.abstract}
                  onChange={(e) => setFormData({ ...formData, abstract: e.target.value })}
                  placeholder="Summary of methodology, validation datasets, and clinical findings..."
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-maroon-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  BibTeX Citation (Optional - auto-generated if left blank)
                </label>
                <textarea
                  rows={2}
                  value={formData.bibtex}
                  onChange={(e) => setFormData({ ...formData, bibtex: e.target.value })}
                  placeholder="@article{...}"
                  className="w-full font-mono text-[11px] px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 focus:outline-none focus:border-maroon-600"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="pub-published-cb"
                  checked={formData.published}
                  onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                  className="w-4 h-4 rounded text-maroon-600 focus:ring-maroon-500 bg-slate-950 border-slate-800"
                />
                <label htmlFor="pub-published-cb" className="text-xs text-slate-300 font-medium cursor-pointer">
                  Publish to public website immediately
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
                  {isSaving ? 'Saving...' : editingPub ? 'Update Publication' : 'Add to Catalog'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
