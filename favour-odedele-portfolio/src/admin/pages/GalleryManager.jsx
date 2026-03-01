import { useCallback, useEffect, useMemo, useState } from 'react';
import { api } from '../utils/api';
import { Pencil, Plus, Search, Trash2, Upload, X } from 'lucide-react';

const ACCENT_COLORS = ['primary', 'accent-magenta', 'accent-green'];
const EMPTY_FORM = { title: '', image: '', accentColor: 'primary', order: 0, isVisible: true };

const TAB_CONFIG = [
  { key: 'all', label: 'All Media' },
  { key: 'primary', label: 'Cohorts' },
  { key: 'accent-green', label: 'Speaking' },
  { key: 'accent-magenta', label: 'Panels' },
];

const BADGE_CLASS_BY_ACCENT = {
  primary: 'bg-slate-800 text-white',
  'accent-green': 'bg-emerald-700 text-white',
  'accent-magenta': 'bg-fuchsia-700 text-white',
};

const LABEL_BY_ACCENT = {
  primary: 'Cohorts',
  'accent-green': 'Speaking',
  'accent-magenta': 'Panels',
};

const SORT_OPTIONS = [
  { key: 'recent', label: 'Recent' },
  { key: 'order', label: 'Custom Order' },
  { key: 'title', label: 'Title (A-Z)' },
];

const VISIBILITY_OPTIONS = [
  { key: 'all', label: 'All' },
  { key: 'public', label: 'Public' },
  { key: 'hidden', label: 'Hidden' },
];

function formatDate(value) {
  if (!value) return 'No date';
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return 'No date';
  return parsed.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export default function GalleryManager() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(EMPTY_FORM);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');
  const [isError, setIsError] = useState(false);
  const [confirmingId, setConfirmingId] = useState(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [sortBy, setSortBy] = useState('recent');
  const [visibilityFilter, setVisibilityFilter] = useState('all');
  const [uploadingImage, setUploadingImage] = useState(false);

  const flash = (text, error = false) => {
    setMsg(text);
    setIsError(error);
    setTimeout(() => setMsg(''), 3000);
  };

  const load = useCallback(async () => {
    try {
      const data = await api.get('/admin/gallery');
      setItems(Array.isArray(data) ? data : []);
    } catch (err) {
      flash(err.message || 'Failed to load gallery', true);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const filteredItems = useMemo(() => {
    let next = [...items];

    if (activeTab !== 'all') {
      next = next.filter((item) => item.accentColor === activeTab);
    }

    if (visibilityFilter === 'public') {
      next = next.filter((item) => item.isVisible);
    }

    if (visibilityFilter === 'hidden') {
      next = next.filter((item) => !item.isVisible);
    }

    if (searchTerm.trim()) {
      const q = searchTerm.trim().toLowerCase();
      next = next.filter((item) => (item.title || '').toLowerCase().includes(q));
    }

    if (sortBy === 'title') {
      next.sort((a, b) => (a.title || '').localeCompare(b.title || ''));
    } else if (sortBy === 'order') {
      next.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
    } else {
      next.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
    }

    return next;
  }, [activeTab, items, searchTerm, sortBy, visibilityFilter]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.image) {
      flash('Please upload an image first.', true);
      return;
    }
    setLoading(true);

    try {
      const payload = {
        ...form,
        order: Number.isNaN(Number(form.order)) ? 0 : Number(form.order),
      };

      if (editingId) {
        await api.put(`/admin/gallery/${editingId}`, payload);
        flash('Media updated successfully.');
      } else {
        await api.post('/admin/gallery', payload);
        flash('Media created successfully.');
      }

      setForm(EMPTY_FORM);
      setEditingId(null);
      setShowForm(false);
      load();
    } catch (err) {
      flash(err.message || 'Save failed', true);
    }

    setLoading(false);
  };

  const handleEdit = (item) => {
    setForm({
      title: item.title || '',
      image: item.image || '',
      accentColor: item.accentColor || 'primary',
      order: item.order ?? 0,
      isVisible: Boolean(item.isVisible),
    });
    setEditingId(item._id);
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingId(null);
    setForm(EMPTY_FORM);
  };

  const handleDelete = async () => {
    if (!confirmingId) return;

    try {
      await api.delete(`/admin/gallery/${confirmingId}`);
      flash('Media deleted.');
      setConfirmingId(null);
      load();
    } catch (err) {
      flash(err.message || 'Delete failed', true);
    }
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    try {
      const formData = new FormData();
      formData.append('image', file);
      const data = await api.upload('/admin/upload', formData);
      setForm((prev) => ({ ...prev, image: data.url || '' }));
      flash('Image uploaded successfully.');
    } catch (err) {
      flash(err.message || 'Image upload failed.', true);
    } finally {
      setUploadingImage(false);
      event.target.value = '';
    }
  };

  return (
    <div className="px-3 sm:px-4 md:px-6 lg:px-8 py-5 sm:py-6">
      <div className="rounded-2xl border border-white/10 bg-slate-900/60 backdrop-blur-sm overflow-hidden">
        <div className="px-4 sm:px-5 md:px-6 py-4 border-b border-white/10 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <label className="relative block w-full max-w-xl">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search Gallery of Impact..."
              className="w-full h-10 rounded-xl border border-white/10 bg-slate-950/60 pl-10 pr-3 text-xs sm:text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
            />
          </label>

          <button
            type="button"
            onClick={() => {
              setForm(EMPTY_FORM);
              setEditingId(null);
              setShowForm(true);
            }}
            className="inline-flex items-center justify-center gap-2 h-10 px-4 rounded-xl bg-emerald-600 text-white text-xs sm:text-sm font-semibold hover:bg-emerald-500 flex-shrink-0"
          >
            <Upload className="w-4 h-4" />
            Add Media
          </button>
        </div>

        <div className="px-4 sm:px-5 md:px-6 pt-4 sm:pt-5">
          <h2 className="text-xl sm:text-2xl font-bold text-white">Gallery of Impact</h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">Manage photos from Speaking, Cohorts, and Panels.</p>
        </div>

        <div className="px-4 sm:px-5 md:px-6 mt-4 sm:mt-5 border-b border-white/10 flex items-center gap-4 sm:gap-6 overflow-x-auto">
          {TAB_CONFIG.map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key)}
              className={`pb-3 pt-2 text-xs sm:text-sm whitespace-nowrap border-b-2 transition-colors ${
                activeTab === tab.key
                  ? 'text-white border-emerald-400 font-semibold'
                  : 'text-slate-400 border-transparent hover:text-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="px-4 sm:px-5 md:px-6 py-3 sm:py-4 flex flex-wrap gap-2 sm:gap-3 border-b border-white/10">
          <label className="inline-flex items-center gap-2 h-9 rounded-full border border-white/10 bg-slate-950/60 px-3 sm:px-4 text-[11px] sm:text-xs text-slate-200">
            <span className="hidden sm:inline">Sort</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-transparent focus:outline-none text-[11px] sm:text-xs"
            >
              {SORT_OPTIONS.map((option) => (
                <option key={option.key} value={option.key} className="text-black">
                  {option.label}
                </option>
              ))}
            </select>
          </label>

          <label className="inline-flex items-center gap-2 h-9 rounded-full border border-white/10 bg-slate-950/60 px-3 sm:px-4 text-[11px] sm:text-xs text-slate-200">
            <span className="hidden sm:inline">Status</span>
            <select
              value={visibilityFilter}
              onChange={(e) => setVisibilityFilter(e.target.value)}
              className="bg-transparent focus:outline-none text-[11px] sm:text-xs"
            >
              {VISIBILITY_OPTIONS.map((option) => (
                <option key={option.key} value={option.key} className="text-black">
                  {option.label}
                </option>
              ))}
            </select>
          </label>
        </div>

        {msg && (
          <div
            className={`mx-4 sm:mx-5 md:mx-6 mt-4 rounded-xl border px-4 py-3 text-xs sm:text-sm ${
              isError
                ? 'border-red-400/40 bg-red-500/10 text-red-200'
                : 'border-emerald-400/30 bg-emerald-500/10 text-emerald-200'
            }`}
          >
            {msg}
          </div>
        )}

        <div className="px-4 sm:px-5 md:px-6 py-5 sm:py-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 md:gap-5">
          {filteredItems.map((item) => (
            <div
              key={item._id}
              className="group overflow-hidden rounded-xl border border-white/10 bg-slate-950/70"
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                {item.image ? (
                  <img
                    src={item.image}
                    alt={item.title || 'Gallery item'}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full grid place-items-center bg-slate-900 text-slate-500 text-sm">
                    No image
                  </div>
                )}

                <span
                  className={`absolute left-2 top-2 inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${
                    BADGE_CLASS_BY_ACCENT[item.accentColor] || BADGE_CLASS_BY_ACCENT.primary
                  }`}
                >
                  {LABEL_BY_ACCENT[item.accentColor] || 'Media'}
                </span>

                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                  <button
                    type="button"
                    onClick={() => handleEdit(item)}
                    className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-white text-slate-900 hover:bg-slate-100"
                    aria-label={`Edit ${item.title}`}
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setConfirmingId(item._id)}
                    className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-white text-red-600 hover:bg-red-50"
                    aria-label={`Delete ${item.title}`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="p-4 space-y-3">
                <div>
                  <p className="text-[10px] uppercase tracking-wide text-slate-500 font-semibold">Caption</p>
                  <p className="text-sm font-semibold text-slate-100 truncate">{item.title || 'Untitled media'}</p>
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-400">
                  <span>Uploaded {formatDate(item.createdAt)}</span>
                  <span>{item.isVisible ? 'Public' : 'Hidden'}</span>
                </div>
              </div>
            </div>
          ))}

          <button
            type="button"
            onClick={() => {
              setForm(EMPTY_FORM);
              setEditingId(null);
              setShowForm(true);
            }}
            className="rounded-xl border-2 border-dashed border-white/20 bg-slate-950/40 min-h-[250px] flex flex-col items-center justify-center gap-2 text-slate-500 hover:border-emerald-500/50 hover:text-slate-300"
          >
            <Plus className="w-8 h-8" />
            <span className="text-xs font-semibold tracking-wide uppercase">Add More</span>
          </button>
        </div>
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 bg-black/60 p-4 flex items-center justify-center">
          <div className="w-full max-w-lg rounded-2xl border border-white/10 bg-slate-900 text-slate-100 shadow-2xl">
            <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between">
              <h3 className="text-lg font-bold">{editingId ? 'Edit Media' : 'Create Media'}</h3>
              <button
                type="button"
                onClick={closeForm}
                className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Caption</label>
                <input
                  required
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full h-10 rounded-lg border border-white/15 bg-slate-950/60 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Media Image</label>
                <label className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-white/20 text-sm font-semibold text-slate-200 hover:bg-white/5 cursor-pointer">
                  <Upload className="w-4 h-4" />
                  {uploadingImage ? 'Uploading...' : 'Choose Image'}
                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/jpg,image/webp"
                    onChange={handleImageUpload}
                    className="hidden"
                    disabled={uploadingImage}
                  />
                </label>
              </div>

              {form.image ? (
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Image Preview</label>
                  <div className="rounded-lg border border-white/15 overflow-hidden">
                    <img
                      src={form.image}
                      alt={form.title || 'Media preview'}
                      className="w-full h-44 object-cover"
                    />
                  </div>
                </div>
              ) : null}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Category</label>
                  <select
                    value={form.accentColor}
                    onChange={(e) => setForm({ ...form, accentColor: e.target.value })}
                    className="w-full h-10 rounded-lg border border-white/15 bg-slate-950/60 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                  >
                    {ACCENT_COLORS.map((color) => (
                      <option key={color} value={color}>
                        {LABEL_BY_ACCENT[color] || color}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Order</label>
                  <input
                    type="number"
                    value={form.order}
                    onChange={(e) => setForm({ ...form, order: e.target.value })}
                    className="w-full h-10 rounded-lg border border-white/15 bg-slate-950/60 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                  />
                </div>
              </div>

              <label className="inline-flex items-center gap-2 text-sm text-slate-300">
                <input
                  type="checkbox"
                  checked={form.isVisible}
                  onChange={(e) => setForm({ ...form, isVisible: e.target.checked })}
                  className="rounded border-white/20 bg-slate-950/60 text-emerald-500"
                />
                Visible on public gallery
              </label>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={closeForm}
                  className="px-4 h-10 rounded-lg border border-white/20 text-sm font-semibold hover:bg-white/5"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 h-10 rounded-lg bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-500 disabled:opacity-60"
                >
                  {loading ? 'Saving...' : editingId ? 'Update Media' : 'Create Media'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {confirmingId && (
        <div className="fixed inset-0 z-50 bg-black/60 p-4 flex items-center justify-center">
          <div className="w-full max-w-md rounded-2xl border border-white/10 bg-slate-900 text-slate-100 shadow-2xl">
            <div className="p-6 border-b border-white/10">
              <h3 className="text-lg font-bold">Delete media item?</h3>
              <p className="text-sm text-slate-400 mt-2">This action cannot be undone.</p>
            </div>
            <div className="p-4 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setConfirmingId(null)}
                className="px-4 h-10 rounded-lg border border-white/20 text-sm font-semibold hover:bg-white/5"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDelete}
                className="px-4 h-10 rounded-lg bg-red-600 text-white text-sm font-semibold hover:bg-red-500"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
