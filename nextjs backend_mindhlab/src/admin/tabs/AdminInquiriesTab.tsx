import React, { useState, useEffect } from 'react';
import {
  Mail,
  Search,
  Check,
  X,
  Clock,
  Trash2,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  Archive,
  MessageSquare
} from 'lucide-react';
import { ContactInquiry } from '../../types';

export const AdminInquiriesTab: React.FC = () => {
  const [inquiries, setInquiries] = useState<ContactInquiry[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [selectedInquiry, setSelectedInquiry] = useState<ContactInquiry | null>(null);

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

  const fetchInquiries = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/admin/inquiries', { headers: getHeaders() });
      if (res.ok) {
        const data = await res.json();
        if (data.success && Array.isArray(data.inquiries)) {
          setInquiries(data.inquiries);
        }
      }
    } catch (err) {
      console.warn('Failed to fetch inquiries:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchInquiries();
  }, []);

  const handleUpdateStatus = async (id: string, status: string) => {
    try {
      const res = await fetch(`/api/admin/inquiries/${id}/status`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        showToast(`Inquiry marked as ${status}.`);
        if (selectedInquiry && selectedInquiry.id === id) {
          setSelectedInquiry({ ...selectedInquiry, status: status as any });
        }
        fetchInquiries();
      }
    } catch (err) {
      console.warn('Failed to update status:', err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this inquiry permanently?')) return;
    try {
      const res = await fetch(`/api/admin/inquiries/${id}`, {
        method: 'DELETE',
        headers: getHeaders(),
      });
      if (res.ok) {
        showToast('Inquiry deleted.');
        if (selectedInquiry && selectedInquiry.id === id) {
          setSelectedInquiry(null);
        }
        fetchInquiries();
      }
    } catch (err) {
      console.warn('Failed to delete inquiry:', err);
    }
  };

  const filtered = inquiries.filter((inq) => {
    const matchesStatus =
      statusFilter === 'All' ||
      (statusFilter === 'New' && (!inq.status || inq.status === 'New')) ||
      inq.status === statusFilter;

    const q = searchQuery.toLowerCase().trim();
    const matchesQuery =
      !q ||
      inq.name.toLowerCase().includes(q) ||
      inq.email.toLowerCase().includes(q) ||
      inq.message.toLowerCase().includes(q) ||
      (inq.affiliation && inq.affiliation.toLowerCase().includes(q));

    return matchesStatus && matchesQuery;
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
            <Mail className="w-6 h-6 text-rose-500" />
            <span>Contact & Collaboration Inquiries</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Submitted messages from prospective students, clinical trial collaborators, and industry sponsors.
          </p>
        </div>

        <button
          onClick={fetchInquiries}
          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold self-start sm:self-auto transition-colors"
        >
          <span>Refresh Inbox</span>
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
            placeholder="Search inquiries by sender, email, or keywords..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-maroon-600"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs focus:outline-none focus:border-maroon-600"
        >
          <option value="All">All Inquiries</option>
          <option value="New">New / Pending</option>
          <option value="Reviewed">Reviewed</option>
          <option value="Responded">Responded</option>
          <option value="Archived">Archived</option>
        </select>
      </div>

      {/* Inquiries List & Detail Split */}
      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((n) => (
            <div key={n} className="h-20 bg-slate-900/60 rounded-2xl animate-pulse border border-slate-800" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-slate-900/40 border border-dashed border-slate-800 text-slate-400 text-xs">
          No inquiries found matching current filter.
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Inquiries List */}
          <div className="lg:col-span-6 space-y-3">
            {filtered.map((inq) => {
              const isSelected = selectedInquiry?.id === inq.id;
              const isNew = !inq.status || inq.status === 'New';

              return (
                <div
                  key={inq.id}
                  onClick={() => setSelectedInquiry(inq)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-slate-850 border-maroon-600 ring-1 ring-maroon-600/50 shadow-lg'
                      : isNew
                      ? 'bg-slate-900/90 border-slate-700 hover:border-slate-600'
                      : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 opacity-80'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-white truncate">{inq.name}</span>
                      {isNew ? (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-950 text-rose-300 border border-rose-900 font-semibold">
                          New
                        </span>
                      ) : (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 font-medium">
                          {inq.status}
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] font-mono text-slate-500">
                      {new Date(inq.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  <div className="text-xs text-maroon-400 font-medium mb-1 truncate">
                    {inq.interestType}
                    {inq.affiliation ? ` • ${inq.affiliation}` : ''}
                  </div>

                  <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">{inq.message}</p>
                </div>
              );
            })}
          </div>

          {/* Inquiry Detail View */}
          <div className="lg:col-span-6">
            {selectedInquiry ? (
              <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-5 sticky top-6">
                <div className="flex items-start justify-between gap-3 border-b border-slate-800 pb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
                        {selectedInquiry.interestType}
                      </span>
                      <span className="text-xs font-mono text-slate-500">
                        {new Date(selectedInquiry.createdAt).toLocaleString()}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-white">{selectedInquiry.name}</h3>
                    <p className="text-xs text-slate-400">
                      {selectedInquiry.affiliation ? `${selectedInquiry.affiliation} • ` : ''}
                      <a
                        href={`mailto:${selectedInquiry.email}`}
                        className="text-maroon-400 hover:underline"
                      >
                        {selectedInquiry.email}
                      </a>
                    </p>
                  </div>

                  <button
                    onClick={() => setSelectedInquiry(null)}
                    className="p-1 rounded-lg text-slate-400 hover:text-white"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Message Body */}
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-850 text-xs text-slate-200 leading-relaxed whitespace-pre-wrap">
                  {selectedInquiry.message}
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleUpdateStatus(selectedInquiry.id, 'Reviewed')}
                      className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors"
                    >
                      Mark Reviewed
                    </button>
                    <button
                      onClick={() => handleUpdateStatus(selectedInquiry.id, 'Responded')}
                      className="px-3 py-1.5 rounded-xl bg-emerald-950 hover:bg-emerald-900 text-emerald-300 border border-emerald-800 text-xs font-semibold transition-colors"
                    >
                      Mark Responded
                    </button>
                    <button
                      onClick={() => handleUpdateStatus(selectedInquiry.id, 'Archived')}
                      className="px-3 py-1.5 rounded-xl bg-slate-950 hover:bg-slate-800 text-slate-400 text-xs font-semibold transition-colors"
                    >
                      Archive
                    </button>
                  </div>

                  <div className="flex items-center gap-2">
                    <a
                      href={`mailto:${selectedInquiry.email}?subject=RE: ${selectedInquiry.interestType} - MINDH Lab`}
                      className="px-3 py-1.5 rounded-xl bg-maroon-800 hover:bg-maroon-700 text-white text-xs font-bold shadow-md transition-colors flex items-center gap-1.5"
                    >
                      <Mail className="w-3.5 h-3.5" />
                      <span>Reply via Email</span>
                    </a>
                    <button
                      onClick={() => handleDelete(selectedInquiry.id)}
                      className="p-2 rounded-xl bg-rose-950/60 hover:bg-rose-900 text-rose-300 transition-colors"
                      title="Delete inquiry"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-12 text-center rounded-2xl bg-slate-900/40 border border-dashed border-slate-800 text-slate-400 text-xs flex flex-col items-center justify-center min-h-[300px]">
                <MessageSquare className="w-8 h-8 text-slate-600 mb-2" />
                Select an inquiry from the list on the left to read the full message and respond.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
