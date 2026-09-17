import React, { useState, useEffect } from 'react';
import {
  Layers,
  Plus,
  Search,
  Edit2,
  Trash2,
  Check,
  X,
  Camera,
  Radio,
  Server,
  Microscope,
  Headphones,
  ShieldCheck,
  Cpu,
  AlertTriangle
} from 'lucide-react';
import { LabFacility } from '../../types';
import { ImageUploadInput } from '../components/ImageUploadInput';

export const AdminFacilitiesTab: React.FC = () => {
  const [facilities, setFacilities] = useState<LabFacility[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingFacility, setEditingFacility] = useState<LabFacility | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  const [formData, setFormData] = useState({
    title: '',
    tag: 'Optics & Vision',
    desc: '',
    specsStr: '',
    status: 'Operational',
    imageUrl: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&q=80&w=800',
    iconName: 'Camera',
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

  const fetchFacilities = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/facilities', { headers: getHeaders() });
      if (res.ok) {
        const data = await res.json();
        if (data.success && Array.isArray(data.facilities)) {
          setFacilities(data.facilities);
        }
      }
    } catch (err) {
      console.warn('Failed to fetch facilities:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFacilities();
  }, []);

  const openAddModal = () => {
    setEditingFacility(null);
    setFormData({
      title: '',
      tag: 'Optics & Vision',
      desc: '',
      specsStr: '',
      status: 'Operational',
      imageUrl: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&q=80&w=800',
      iconName: 'Camera',
      published: true,
    });
    setIsModalOpen(true);
  };

  const openEditModal = (fac: LabFacility) => {
    setEditingFacility(fac);
    setFormData({
      title: fac.title,
      tag: fac.tag,
      desc: fac.desc,
      specsStr: (fac.specs || []).join('\n'),
      status: fac.status || 'Operational',
      imageUrl: fac.imageUrl || '',
      iconName: fac.iconName || 'Camera',
      published: (fac as any).published !== false,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const specs = formData.specsStr
        .split('\n')
        .map((s) => s.trim())
        .filter(Boolean);

      const payload = {
        title: formData.title,
        tag: formData.tag,
        desc: formData.desc,
        specs,
        status: formData.status,
        imageUrl: formData.imageUrl,
        iconName: formData.iconName,
        published: formData.published,
      };

      if (editingFacility) {
        const res = await fetch(`/api/facilities/${editingFacility.id}`, {
          method: 'PUT',
          headers: getHeaders(),
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (res.ok && data.success) {
          showToast('Facility updated successfully.');
          setIsModalOpen(false);
          fetchFacilities();
        } else {
          alert(data.message || 'Failed to update facility.');
        }
      } else {
        const res = await fetch('/api/facilities', {
          method: 'POST',
          headers: getHeaders(),
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (res.ok && data.success) {
          showToast('Facility added to inventory.');
          setIsModalOpen(false);
          fetchFacilities();
        } else {
          alert(data.message || 'Failed to create facility.');
        }
      }
    } catch (err: any) {
      alert(err?.message || 'Error saving facility');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/facilities/${id}`, {
        method: 'DELETE',
        headers: getHeaders(),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        showToast('Facility deleted successfully.');
        setDeleteConfirmId(null);
        fetchFacilities();
      } else {
        alert(data.message || 'Failed to delete facility.');
      }
    } catch (err: any) {
      alert(err?.message || 'Error deleting facility');
    }
  };

  const getIcon = (name?: string) => {
    switch (name) {
      case 'Radio':
        return <Radio className="w-4 h-4 text-maroon-400" />;
      case 'Server':
        return <Server className="w-4 h-4 text-maroon-400" />;
      case 'Microscope':
        return <Microscope className="w-4 h-4 text-maroon-400" />;
      case 'Headphones':
        return <Headphones className="w-4 h-4 text-maroon-400" />;
      case 'ShieldCheck':
        return <ShieldCheck className="w-4 h-4 text-maroon-400" />;
      case 'Cpu':
        return <Cpu className="w-4 h-4 text-maroon-400" />;
      default:
        return <Camera className="w-4 h-4 text-maroon-400" />;
    }
  };

  const filteredFacilities = facilities.filter((f) => {
    const query = searchQuery.toLowerCase().trim();
    return (
      !query ||
      f.title.toLowerCase().includes(query) ||
      f.desc.toLowerCase().includes(query) ||
      f.tag.toLowerCase().includes(query)
    );
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
            <Layers className="w-6 h-6 text-emerald-500" />
            <span>Facilities & Testing Rigs Manager</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Maintain hardware rigs, optical calibration arrays, GPU clusters, and availability statuses.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-maroon-800 hover:bg-maroon-700 text-white text-xs font-bold shadow-md transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Facility</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search facilities by name, spec, or tag..."
          className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-maroon-600"
        />
      </div>

      {/* Facility Grid */}
      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((n) => (
            <div key={n} className="h-24 bg-slate-900/60 rounded-2xl animate-pulse border border-slate-800" />
          ))}
        </div>
      ) : filteredFacilities.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-slate-900/40 border border-dashed border-slate-800 text-slate-400 text-xs">
          No facility rigs found.
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filteredFacilities.map((fac) => {
            const isPublished = (fac as any).published !== false;
            return (
              <div
                key={fac.id}
                className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 flex flex-col justify-between gap-4 transition-all"
              >
                <div className="flex items-start gap-4">
                  <div className="w-20 h-20 rounded-xl overflow-hidden bg-slate-950 shrink-0 border border-slate-800">
                    <img
                      src={fac.imageUrl}
                      alt={fac.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="space-y-1 flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full font-bold bg-slate-800 text-slate-300 border border-slate-700">
                        {fac.tag}
                      </span>
                      <span
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
                          fac.status === 'Operational'
                            ? 'bg-emerald-950 text-emerald-300 border-emerald-900'
                            : fac.status === 'Reserved'
                            ? 'bg-amber-950 text-amber-300 border-amber-900'
                            : 'bg-rose-950 text-rose-300 border-rose-900'
                        }`}
                      >
                        {fac.status || 'Operational'}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 pt-0.5">
                      {getIcon(fac.iconName)}
                      <h3 className="text-sm font-bold text-white truncate">{fac.title}</h3>
                    </div>
                    <p className="text-xs text-slate-400 line-clamp-2">{fac.desc}</p>
                  </div>
                </div>

                {/* Specs pills */}
                {fac.specs && fac.specs.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-2 border-t border-slate-850">
                    {fac.specs.slice(0, 3).map((sp, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] px-2 py-0.5 rounded-md bg-slate-950 text-slate-400 border border-slate-800 font-mono"
                      >
                        {sp}
                      </span>
                    ))}
                    {fac.specs.length > 3 && (
                      <span className="text-[10px] px-2 py-0.5 text-slate-500">
                        +{fac.specs.length - 3} more
                      </span>
                    )}
                  </div>
                )}

                {/* Actions */}
                <div className="flex items-center justify-between pt-2 border-t border-slate-850">
                  <span className="text-[11px] text-slate-500">
                    {isPublished ? '● Published' : '○ Draft'}
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => openEditModal(fac)}
                      className="p-1.5 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={() => setDeleteConfirmId(fac.id)}
                      className="p-1.5 px-3 rounded-lg bg-rose-950/50 hover:bg-rose-900/60 text-rose-300 text-xs font-semibold flex items-center gap-1.5 border border-rose-900/60 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Delete Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-sm w-full space-y-4 shadow-2xl">
            <div className="w-12 h-12 rounded-2xl bg-rose-950/70 border border-rose-900 flex items-center justify-center text-rose-400 mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div className="text-center space-y-1">
              <h3 className="text-base font-bold text-white">Delete Facility Rig?</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                This action is permanent and will remove this instrument from the public facilities page.
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

      {/* Add / Edit Facility Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto animate-in fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-2xl w-full my-8 shadow-2xl space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Layers className="w-5 h-5 text-emerald-500" />
                <span>{editingFacility ? 'Edit Testing Rig' : 'Register Testing Rig'}</span>
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
                  Facility / Rig Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Spectral Calibrated rPPG Optical Chamber"
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-maroon-600"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Tag / Focus *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.tag}
                    onChange={(e) => setFormData({ ...formData, tag: e.target.value })}
                    placeholder="Optics & Vision"
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-maroon-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Status *
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-maroon-600"
                  >
                    <option value="Operational">Operational</option>
                    <option value="Reserved">Reserved / In Trial Use</option>
                    <option value="Maintenance">Calibration / Maintenance</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Icon Theme
                  </label>
                  <select
                    value={formData.iconName}
                    onChange={(e) => setFormData({ ...formData, iconName: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-maroon-600"
                  >
                    <option value="Camera">Camera (Optical)</option>
                    <option value="Radio">Radio (Bio-Telemetry)</option>
                    <option value="Server">Server (Compute)</option>
                    <option value="Microscope">Microscope</option>
                    <option value="Headphones">Acoustic</option>
                    <option value="ShieldCheck">Validation / Shield</option>
                    <option value="Cpu">Microprocessor / GPU</option>
                  </select>
                </div>
              </div>

              <div>
                <ImageUploadInput
                  label="Equipment & Testing Rig Photo"
                  value={formData.imageUrl}
                  onChange={(url) => setFormData({ ...formData, imageUrl: url })}
                  recommendedSize="Recommended: 1200×800 or 16:9"
                  helperText="Upload a high-resolution photo of the laboratory instrument or test chamber directly from your computer, or paste a URL."
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Description *
                </label>
                <textarea
                  rows={3}
                  required
                  value={formData.desc}
                  onChange={(e) => setFormData({ ...formData, desc: e.target.value })}
                  placeholder="Purpose, engineering capabilities, and typical clinical studies conducted..."
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-maroon-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Rig Specifications (One item per line)
                </label>
                <textarea
                  rows={3}
                  value={formData.specsStr}
                  onChange={(e) => setFormData({ ...formData, specsStr: e.target.value })}
                  placeholder="e.g.&#10;4x Sony Pregius CMOS Global Shutter Sensors&#10;12-bit Raw Acquisition at 120 FPS&#10;Integrating Sphere Uniform Illumination"
                  className="w-full font-mono text-xs px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 focus:outline-none focus:border-maroon-600"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="fac-published-cb"
                  checked={formData.published}
                  onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                  className="w-4 h-4 rounded text-maroon-600 focus:ring-maroon-500 bg-slate-950 border-slate-800"
                />
                <label htmlFor="fac-published-cb" className="text-xs text-slate-300 font-medium cursor-pointer">
                  Display on public facilities page immediately
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
                  {isSaving ? 'Saving...' : editingFacility ? 'Update Rig' : 'Register Rig'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
