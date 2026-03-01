import { useEffect, useMemo, useState } from 'react';
import { api } from '../utils/api';
import { Pencil, Trash2, Plus, X, Check, Upload } from 'lucide-react';

const EMPTY_FORM = {
  title: '',
  tag: '',
  tagColor: 'primary',
  role: '',
  region: '',
  image: '',
  problem: '',
  outcome: '',
  description: '',
  keyOutput: '',
  order: 0,
  isVisible: true,
};

const FILTERS = [
  { label: 'All Cases', key: 'all' },
  { label: 'Published', key: 'published' },
  { label: 'Drafts', key: 'drafts' },
];

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
  const [loadingProjects, setLoadingProjects] = useState(true);
  const [uploadingImage, setUploadingImage] = useState(false);

  const loadProjects = async () => {
    setLoadingProjects(true);
    try {
      const data = await api.get('/admin/projects');
      setProjects(data);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.image) {
      flash('Please upload a case study cover image.');
      return;
    }
    setLoadingForm(true);
    try {
      if (editingId) {
        await api.put(`/admin/projects/${editingId}`, form);
        flash('Case study updated.');
      } else {
        await api.post('/admin/projects', form);
        flash('Case study created.');
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

  const handleEdit = (project) => {
    setForm({ ...project });
    setEditingId(project._id);
    setShowForm(true);
  };

  const handleDelete = (id) => {
    setConfirmingId(id);
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

  const handleToggleVisible = async (project) => {
    await api.put(`/admin/projects/${project._id}`, { isVisible: !project.isVisible });
    loadProjects();
  };

  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      const matchesFilter =
        activeFilter === 'all'
          ? true
          : activeFilter === 'published'
            ? project.isVisible
            : !project.isVisible;
      const matchesSearch = project.title
        ? project.title.toLowerCase().includes(searchTerm.toLowerCase())
        : true;
      return matchesFilter && matchesSearch;
    });
  }, [projects, activeFilter, searchTerm]);

  const getViews = (project) => 12000 + (project.order ?? 0) * 520;
  const getImpactScore = (project) => Math.min(100, 60 + ((project.order ?? 0) * 6));

  return (
    <>
      <div className="min-h-screen bg-[#0f172a] text-white">
        <div className="max-w-6xl mx-auto px-3 sm:px-4 lg:px-8 py-6 sm:py-10 space-y-6 sm:space-y-8">
          <header className="flex flex-col gap-4 sm:gap-0 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-[10px] sm:text-xs uppercase tracking-[0.4em] sm:tracking-[0.5em] text-emerald-300">Case Studies</p>
              <h1 className="text-2xl sm:text-3xl font-black leading-tight">Monitor impact stories</h1>
              <p className="text-xs sm:text-sm text-slate-300 mt-1">
                Stay on top of published, in-review, and draft case studies.
              </p>
            </div>
            <button
              onClick={() => {
                setForm(EMPTY_FORM);
                setEditingId(null);
                setShowForm(true);
              }}
              className="w-full sm:w-auto justify-center flex items-center gap-2 bg-emerald-500 px-4 sm:px-5 py-2 sm:py-2.5 rounded-2xl text-xs sm:text-sm font-bold uppercase tracking-[0.2em] sm:tracking-[0.3em] text-slate-950 hover:bg-emerald-400 transition flex-shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>Create New Case</span>
            </button>
          </header>

          <div className="flex flex-col gap-3 sm:gap-4">
            <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
              <div className="flex flex-1 items-center bg-slate-900/70 rounded-2xl border border-white/10 px-3 py-2 sm:py-2.5">
                <span className="material-symbols-outlined text-lg text-slate-400">search</span>
                <input
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search case studies..."
                  className="ml-2 flex-1 bg-transparent text-xs sm:text-sm text-white placeholder:text-slate-500 focus:outline-none"
                />
              </div>
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

          <section className="overflow-hidden rounded-2xl bg-white/5 border border-white/10 shadow-inner">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead className="bg-slate-900/70 text-slate-200">
                  <tr>
                    <th className="px-3 sm:px-6 py-3 sm:py-4 text-[10px] sm:text-xs font-semibold uppercase tracking-[0.3em] sm:tracking-[0.35em]">Cover</th>
                    <th className="px-3 sm:px-6 py-3 sm:py-4 text-[10px] sm:text-xs font-semibold uppercase tracking-[0.3em] sm:tracking-[0.35em]">Case Study Title</th>
                    <th className="px-3 sm:px-6 py-3 sm:py-4 text-[10px] sm:text-xs font-semibold uppercase tracking-[0.3em] sm:tracking-[0.35em] hidden sm:table-cell">Status</th>
                    <th className="px-3 sm:px-6 py-3 sm:py-4 text-center text-[10px] sm:text-xs font-semibold uppercase tracking-[0.3em] sm:tracking-[0.35em] hidden md:table-cell">Views</th>
                    <th className="px-3 sm:px-6 py-3 sm:py-4 text-[10px] sm:text-xs font-semibold uppercase tracking-[0.3em] sm:tracking-[0.35em] hidden lg:table-cell">Impact Score</th>
                    <th className="px-3 sm:px-6 py-3 sm:py-4 text-[10px] sm:text-xs font-semibold uppercase tracking-[0.3em] sm:tracking-[0.35em] hidden xl:table-cell">Last Updated</th>
                    <th className="px-3 sm:px-6 py-3 sm:py-4 text-right text-[10px] sm:text-xs font-semibold uppercase tracking-[0.3em] sm:tracking-[0.35em]">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {loadingProjects ? (
                    <tr>
                      <td colSpan={7} className="px-6 py-8 text-center text-slate-400">
                        Loading...
                      </td>
                    </tr>
                  ) : filteredProjects.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-6 py-8 text-center text-slate-400">
                        No case studies match your filter.
                      </td>
                    </tr>
                  ) : (
                    filteredProjects.map((project) => (
                      <tr key={project._id} className="hover:bg-white/5 transition-colors">
                        <td className="px-3 sm:px-6 py-3 sm:py-5">
                          {project.image ? (
                            <img
                              src={project.image}
                              alt={project.title || 'Case study image'}
                              className="w-12 h-9 sm:w-16 sm:h-12 object-cover rounded-lg border border-white/10"
                            />
                          ) : (
                            <div className="w-12 h-9 sm:w-16 sm:h-12 rounded-lg border border-white/10 bg-slate-900/60 text-[8px] sm:text-[10px] uppercase tracking-wide text-slate-500 grid place-items-center">
                              No Image
                            </div>
                          )}
                        </td>
                        <td className="px-3 sm:px-6 py-3 sm:py-5">
                          <div className="flex flex-col gap-1">
                            <span className="font-semibold text-white text-xs sm:text-sm truncate">{project.title}</span>
                            <span className="text-[10px] text-slate-400 hidden sm:block">{project.region || 'Various regions'}</span>
                          </div>
                        </td>
                        <td className="px-3 sm:px-6 py-3 sm:py-5 hidden sm:table-cell">
                          <span
                            className={`inline-flex items-center gap-1 px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-semibold ${
                              project.isVisible ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-800 text-slate-300'
                            }`}
                          >
                            <span
                              className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full ${
                                project.isVisible ? 'bg-emerald-500' : 'bg-slate-500'
                              }`}
                            />
                            <span className="hidden sm:inline">{project.isVisible ? 'Published' : 'Draft'}</span>
                          </span>
                        </td>
                        <td className="px-3 sm:px-6 py-3 sm:py-5 text-center font-semibold text-xs sm:text-sm hidden md:table-cell">
                          {getViews(project).toLocaleString()}
                        </td>
                        <td className="px-3 sm:px-6 py-3 sm:py-5 hidden lg:table-cell">
                          <div className="flex items-center gap-2 sm:gap-3">
                            <div className="flex-1 h-1 sm:h-1.5 bg-slate-800 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-emerald-500"
                                style={{ width: `${getImpactScore(project)}%` }}
                              ></div>
                            </div>
                            <span className="text-[9px] sm:text-xs font-bold text-slate-200 whitespace-nowrap">{getImpactScore(project)}</span>
                          </div>
                        </td>
                        <td className="px-3 sm:px-6 py-3 sm:py-5 text-xs sm:text-sm text-slate-400 hidden xl:table-cell">
                          {project.updatedAt ? new Date(project.updatedAt).toLocaleDateString() : '—'}
                        </td>
                        <td className="px-3 sm:px-6 py-3 sm:py-5 text-right">
                          <div className="flex justify-end gap-1 sm:gap-2">
                            <button
                              onClick={() => handleToggleVisible(project)}
                              className="p-1 sm:p-1.5 rounded-full bg-slate-900/40 hover:bg-slate-900/70"
                              title="Toggle visibility"
                            >
                              <Check className="w-3 h-3 sm:w-4 sm:h-4 text-slate-200" />
                            </button>
                            <button
                              onClick={() => handleEdit(project)}
                              className="p-1 sm:p-1.5 rounded-full bg-slate-900/40 hover:bg-slate-900/70"
                            >
                              <Pencil className="w-3 h-3 sm:w-4 sm:h-4 text-slate-200" />
                            </button>
                            <button
                              onClick={() => handleDelete(project._id)}
                              className="p-1 sm:p-1.5 rounded-full bg-slate-900/40 hover:bg-slate-900/70"
                            >
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
        <div className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:bottom-6 sm:max-w-sm rounded-2xl bg-emerald-500/90 px-5 py-3 text-sm font-semibold text-slate-950 shadow-2xl">
          {msg}
        </div>
      )}

      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b">
              <h3 className="text-lg font-bold">{editingId ? 'Edit Project' : 'New Project'}</h3>
              <button onClick={() => setShowForm(false)} className="text-gray-500 hover:text-gray-700">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {[
                ['title', 'Title'],
                ['tag', 'Tag'],
                ['role', 'Role'],
                ['region', 'Region'],
                ['problem', 'Problem'],
                ['outcome', 'Outcome'],
                ['description', 'Description'],
                ['keyOutput', 'Key Output'],
              ].map(([field, label]) => (
                <div key={field}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
                  {['problem', 'outcome', 'description', 'keyOutput'].includes(field) ? (
                    <textarea
                      rows={3}
                      value={form[field]}
                      onChange={(e) => setForm({ ...form, [field]: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#064E3B]"
                    />
                  ) : (
                    <input
                      value={form[field]}
                      onChange={(e) => setForm({ ...form, [field]: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#064E3B]"
                    />
                  )}
                </div>
              ))}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Cover Image</label>
                <label className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-gray-300 text-sm font-semibold text-gray-700 hover:bg-gray-50 cursor-pointer">
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
                <p className="mt-2 text-xs text-gray-500">Use JPG, PNG, or WEBP.</p>
              </div>
              {form.image ? (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Image Preview</label>
                  <div className="rounded-lg border border-gray-200 overflow-hidden">
                    <img
                      src={form.image}
                      alt={form.title || 'Case study preview'}
                      className="w-full h-44 object-cover"
                    />
                  </div>
                </div>
              ) : null}
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={form.isVisible}
                  onChange={(e) => setForm({ ...form, isVisible: e.target.checked })}
                  id="visible"
                  className="h-4 w-4"
                />
                <label htmlFor="visible" className="text-sm text-gray-700">
                  Visible on portfolio
                </label>
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  disabled={loadingForm}
                  className="flex-1 bg-[#064E3B] text-white py-2.5 rounded-lg font-semibold text-sm hover:bg-[#065f46] disabled:opacity-60"
                >
                  {loadingForm ? 'Saving...' : editingId ? 'Update Project' : 'Create Project'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-4 py-2.5 border border-gray-300 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {confirmingId && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm">
            <div className="p-6 border-b">
              <h3 className="text-lg font-bold text-gray-900">Delete project?</h3>
              <p className="mt-2 text-sm text-gray-600">
                This action cannot be undone. The project will be removed from the portfolio and admin list.
              </p>
            </div>
            <div className="p-4 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setConfirmingId(null)}
                className="px-4 py-2 text-sm font-semibold text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={async () => {
                  await api.delete(`/admin/projects/${confirmingId}`);
                  setConfirmingId(null);
                  flash('Deleted case study.');
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
