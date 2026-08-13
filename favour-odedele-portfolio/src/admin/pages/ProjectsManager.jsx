import { useEffect, useMemo, useState } from 'react';
import { api } from '../utils/api';
import { Check, Pencil, Plus, Search, Trash2, Upload, X } from 'lucide-react';

const EMPTY_FORM = {
  title: '',
  tag: 'Community',
  tagColor: 'primary',
  category: 'highlight',
  role: 'Personal initiative',
  region: 'Independent work',
  image: '',
  problem: '',
  outcome: '',
  description: '',
  keyOutput: '',
  order: 0,
  isVisible: true,
};

const FILTERS = [
  { label: 'All Highlights', key: 'all' },
  { label: 'Published', key: 'published' },
  { label: 'Drafts', key: 'drafts' },
];

const TAG_OPTIONS = ['Writing', 'Leadership', 'Community', 'Speaking'];

export default function ProjectsManager() {
  const [projects, setProjects] = useState([]);
  const [form, setForm] = useState(EMPTY_FORM);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [loadingForm, setLoadingForm] = useState(false);
  const [msg, setMsg] = useState('');
  const [confirmingId, setConfirmingId] = useState(null);
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [loadingProjects, setLoadingProjects] = useState(true);
  const [uploadingImage, setUploadingImage] = useState(false);

  const loadProjects = async () => {
    setLoadingProjects(true);
    try {
      const data = await api.get('/admin/projects');
      setProjects(Array.isArray(data) ? data.filter((item) => (item.category || 'highlight') === 'highlight') : []);
    } finally {
      setLoadingProjects(false);
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  const flash = (text) => {
    setMsg(text);
    setTimeout(() => setMsg(''), 3000);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!form.image) {
      flash('Please upload a highlight image.');
      return;
    }
    setLoadingForm(true);
    const payload = { ...form, category: 'highlight' };
    try {
      if (editingId) {
        await api.put(`/admin/projects/${editingId}`, payload);
        flash('Highlight updated.');
      } else {
        await api.post('/admin/projects', payload);
        flash('Highlight created.');
      }
      setForm(EMPTY_FORM);
      setEditingId(null);
      setShowForm(false);
      loadProjects();
    } catch (err) {
      flash(err.message);
    } finally {
      setLoadingForm(false);
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
      flash(err.message || 'Image upload failed.');
    } finally {
      setUploadingImage(false);
      event.target.value = '';
    }
  };

  const filteredProjects = useMemo(() => {
    return projects
      .filter((project) => {
        const matchesFilter =
          activeFilter === 'all' ? true : activeFilter === 'published' ? project.isVisible : !project.isVisible;
        const matchesSearch = project.title
          ? project.title.toLowerCase().includes(searchTerm.toLowerCase())
          : true;
        return matchesFilter && matchesSearch;
      })
      .sort((a, b) => (a.order || 0) - (b.order || 0));
  }, [projects, activeFilter, searchTerm]);

  const publishedCount = useMemo(
    () => projects.filter((project) => project.isVisible !== false).length,
    [projects]
  );

  const openNewForm = () => {
    setForm(EMPTY_FORM);
    setEditingId(null);
    setShowForm(true);
  };

  const handleEdit = (project) => {
    setForm({ ...EMPTY_FORM, ...project, category: 'highlight' });
    setEditingId(project._id);
    setShowForm(true);
  };

  const handleToggleVisible = async (project) => {
    await api.put(`/admin/projects/${project._id}`, { isVisible: !project.isVisible, category: 'highlight' });
    loadProjects();
  };

  return (
    <>
      <div className="min-h-screen bg-[#0f172a] text-white">
        <div className="max-w-6xl mx-auto px-3 sm:px-4 lg:px-8 py-6 sm:py-10 space-y-6 sm:space-y-8">
          <header className="flex flex-col gap-4 sm:gap-0 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-[10px] sm:text-xs uppercase tracking-[0.4em] sm:tracking-[0.5em] text-emerald-300">Highlights</p>
              <h1 className="text-2xl sm:text-3xl font-black leading-tight">Manage personal highlights</h1>
              <p className="text-xs sm:text-sm text-slate-300 mt-1">
                Manage the highlight cards shown in the homepage Major Highlights section. All published highlights appear on the site, ordered by homepage order.
              </p>
              <p className="text-xs text-emerald-200/90 mt-2">
                {publishedCount} published on homepage
              </p>
            </div>
            <button
              onClick={openNewForm}
              className="w-full sm:w-auto justify-center flex items-center gap-2 bg-emerald-500 px-4 sm:px-5 py-2 sm:py-2.5 rounded-2xl text-xs sm:text-sm font-bold uppercase tracking-[0.2em] sm:tracking-[0.3em] text-slate-950 hover:bg-emerald-400 transition flex-shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>Create Highlight</span>
            </button>
          </header>

          <div className="flex flex-col gap-3 sm:gap-4">
            <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center sm:justify-between">
              <button
                type="button"
                onClick={() => setShowSearch((prev) => !prev)}
                className={`inline-flex items-center justify-center gap-2 self-start sm:self-auto rounded-2xl border px-4 py-2.5 text-xs font-bold uppercase tracking-[0.3em] transition ${
                  showSearch
                    ? 'border-emerald-400/50 bg-emerald-500 text-slate-950'
                    : 'border-white/10 bg-slate-900/70 text-slate-200 hover:bg-slate-900'
                }`}
                aria-label="Toggle highlight search"
                aria-expanded={showSearch}
              >
                <Search className="w-4 h-4" />
                <span className="hidden sm:inline">Search</span>
              </button>

              {showSearch && (
                <div className="flex flex-1 items-center bg-slate-900/70 rounded-2xl border border-white/10 px-3 py-2 sm:py-2.5">
                  <Search className="w-4 h-4 text-slate-400 shrink-0" />
                  <input
                    value={searchTerm}
                    onChange={(event) => setSearchTerm(event.target.value)}
                    placeholder="Search highlights..."
                    className="ml-2 flex-1 bg-transparent text-xs sm:text-sm text-white placeholder:text-slate-500 focus:outline-none"
                  />
                </div>
              )}
            </div>
            <div className="flex flex-wrap gap-2 text-xs uppercase tracking-[0.3em]">
              {FILTERS.map((filter) => (
                <button
                  key={filter.key}
                  onClick={() => setActiveFilter(filter.key)}
                  className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-2xl text-xs transition whitespace-nowrap ${
                    activeFilter === filter.key
                      ? 'bg-emerald-500 text-slate-900'
                      : 'bg-slate-900/40 text-slate-300 hover:bg-slate-900/70'
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          </div>

          <section className="overflow-hidden rounded-2xl bg-white/5 border border-white/10">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead className="bg-slate-900/70 text-slate-200">
                  <tr>
                    <th className="px-3 sm:px-6 py-3 sm:py-4 text-[10px] sm:text-xs font-semibold uppercase tracking-[0.3em] sm:tracking-[0.35em]">Image</th>
                    <th className="px-3 sm:px-6 py-3 sm:py-4 text-[10px] sm:text-xs font-semibold uppercase tracking-[0.3em] sm:tracking-[0.35em] hidden md:table-cell">Order</th>
                    <th className="px-3 sm:px-6 py-3 sm:py-4 text-[10px] sm:text-xs font-semibold uppercase tracking-[0.3em] sm:tracking-[0.35em]">Title</th>
                    <th className="px-3 sm:px-6 py-3 sm:py-4 text-[10px] sm:text-xs font-semibold uppercase tracking-[0.3em] sm:tracking-[0.35em] hidden sm:table-cell">Status</th>
                    <th className="px-3 sm:px-6 py-3 sm:py-4 text-[10px] sm:text-xs font-semibold uppercase tracking-[0.3em] sm:tracking-[0.35em] hidden lg:table-cell">Tag</th>
                    <th className="px-3 sm:px-6 py-3 sm:py-4 text-right text-[10px] sm:text-xs font-semibold uppercase tracking-[0.3em] sm:tracking-[0.35em]">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {loadingProjects ? (
                    <tr><td colSpan={6} className="px-6 py-8 text-center text-slate-400">Loading...</td></tr>
                  ) : filteredProjects.length === 0 ? (
                    <tr><td colSpan={6} className="px-6 py-8 text-center text-slate-400">No highlights match your filter.</td></tr>
                  ) : (
                    filteredProjects.map((project) => (
                      <tr key={project._id} className="hover:bg-white/5 transition-colors">
                        <td className="px-3 sm:px-6 py-3 sm:py-5">
                          {project.image ? (
                            <img src={project.image} alt={project.title || 'Highlight'} className="w-12 h-9 sm:w-16 sm:h-12 object-cover rounded-lg border border-white/10" />
                          ) : (
                            <div className="w-12 h-9 sm:w-16 sm:h-12 rounded-lg border border-white/10 bg-slate-900/60 text-[8px] sm:text-[10px] uppercase tracking-wide text-slate-500 grid place-items-center">No Image</div>
                          )}
                        </td>
                        <td className="px-3 sm:px-6 py-3 sm:py-5 hidden md:table-cell text-slate-300">{project.order ?? 0}</td>
                        <td className="px-3 sm:px-6 py-3 sm:py-5">
                          <span className="font-semibold text-white text-xs sm:text-sm truncate">{project.title}</span>
                        </td>
                        <td className="px-3 sm:px-6 py-3 sm:py-5 hidden sm:table-cell">
                          <span className={`inline-flex items-center gap-1 px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-semibold ${project.isVisible ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-800 text-slate-300'}`}>
                            {project.isVisible ? 'Published' : 'Draft'}
                          </span>
                        </td>
                        <td className="px-3 sm:px-6 py-3 sm:py-5 hidden lg:table-cell text-slate-300">{project.tag}</td>
                        <td className="px-3 sm:px-6 py-3 sm:py-5 text-right">
                          <div className="flex justify-end gap-1 sm:gap-2">
                            <button onClick={() => handleToggleVisible(project)} className="p-1 sm:p-1.5 rounded-full bg-slate-900/40 hover:bg-slate-900/70" title="Toggle visibility">
                              <Check className="w-3 h-3 sm:w-4 sm:h-4 text-slate-200" />
                            </button>
                            <button onClick={() => handleEdit(project)} className="p-1 sm:p-1.5 rounded-full bg-slate-900/40 hover:bg-slate-900/70" aria-label="Edit highlight">
                              <Pencil className="w-3 h-3 sm:w-4 sm:h-4 text-slate-200" />
                            </button>
                            <button onClick={() => setConfirmingId(project._id)} className="p-1 sm:p-1.5 rounded-full bg-slate-900/40 hover:bg-slate-900/70" aria-label="Delete highlight">
                              <Trash2 className="w-3 h-3 sm:w-4 sm:h-4 text-slate-200" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </div>

      {msg && (
        <div className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:bottom-6 sm:max-w-sm rounded-2xl bg-emerald-500/90 px-5 py-3 text-sm font-semibold text-slate-950">
          {msg}
        </div>
      )}

      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b">
              <h3 className="text-lg font-bold text-slate-900">{editingId ? 'Edit Highlight' : 'New Highlight'}</h3>
              <button onClick={() => setShowForm(false)} className="text-gray-500 hover:text-gray-700" aria-label="Close form">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4 text-slate-900">
              {[
                ['title', 'Title'],
                ['description', 'Description'],
                ['keyOutput', 'Key Detail'],
              ].map(([field, label]) => (
                <div key={field}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
                  {['description', 'keyOutput'].includes(field) ? (
                    <textarea rows={4} value={form[field]} onChange={(event) => setForm({ ...form, [field]: event.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#064E3B]" />
                  ) : (
                    <input value={form[field]} onChange={(event) => setForm({ ...form, [field]: event.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#064E3B]" />
                  )}
                </div>
              ))}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tag</label>
                <select value={form.tag} onChange={(event) => setForm({ ...form, tag: event.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#064E3B]">
                  {TAG_OPTIONS.map((tag) => (
                    <option key={tag} value={tag}>{tag}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <label className="block">
                  <span className="block text-sm font-medium text-gray-700 mb-1">Homepage order</span>
                  <input type="number" min="0" value={form.order ?? 0} onChange={(event) => setForm({ ...form, order: Number(event.target.value || 0) })} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#064E3B]" />
                  <p className="mt-1 text-xs text-gray-500">Lower numbers appear first on the homepage.</p>
                </label>
                <label className="block">
                  <span className="block text-sm font-medium text-gray-700 mb-1">Accent</span>
                  <select value={form.tagColor} onChange={(event) => setForm({ ...form, tagColor: event.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#064E3B]">
                    <option value="primary">Primary</option>
                    <option value="accent-magenta">Burgundy</option>
                    <option value="accent-green">Green</option>
                  </select>
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Image</label>
                <label className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-gray-300 text-sm font-semibold text-gray-700 hover:bg-gray-50 cursor-pointer">
                  <Upload className="w-4 h-4" />
                  {uploadingImage ? 'Uploading...' : 'Choose Image'}
                  <input type="file" accept="image/png,image/jpeg,image/jpg,image/webp" onChange={handleImageUpload} className="hidden" disabled={uploadingImage} />
                </label>
              </div>

              {form.image && (
                <div className="rounded-lg border border-gray-200 overflow-hidden">
                  <img src={form.image} alt={form.title || 'Highlight preview'} className="w-full h-44 object-cover" />
                </div>
              )}

              <label className="flex items-center gap-2">
                <input type="checkbox" checked={form.isVisible} onChange={(event) => setForm({ ...form, isVisible: event.target.checked })} className="h-4 w-4" />
                <span className="text-sm text-gray-700">Visible on homepage</span>
              </label>

              <div className="flex gap-3 pt-2">
                <button type="submit" disabled={loadingForm} className="flex-1 bg-[#064E3B] text-white py-2.5 rounded-lg font-semibold text-sm hover:bg-[#065f46] disabled:opacity-60">
                  {loadingForm ? 'Saving...' : editingId ? 'Update Highlight' : 'Create Highlight'}
                </button>
                <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2.5 border border-gray-300 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-50">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {confirmingId && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-sm">
            <div className="p-6 border-b">
              <h3 className="text-lg font-bold text-gray-900">Delete highlight?</h3>
              <p className="mt-2 text-sm text-gray-600">This action cannot be undone.</p>
            </div>
            <div className="p-4 flex justify-end gap-3">
              <button type="button" onClick={() => setConfirmingId(null)} className="px-4 py-2 text-sm font-semibold text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50">Cancel</button>
              <button
                type="button"
                onClick={async () => {
                  await api.delete(`/admin/projects/${confirmingId}`);
                  setConfirmingId(null);
                  flash('Deleted highlight.');
                  loadProjects();
                }}
                className="px-4 py-2 text-sm font-semibold text-white bg-red-600 rounded-lg hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
