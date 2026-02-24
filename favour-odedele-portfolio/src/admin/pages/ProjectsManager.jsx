import { useEffect, useState } from 'react';
import { api } from '../utils/api';
import { Pencil, Trash2, Plus, X, Check } from 'lucide-react';

const EMPTY_FORM = {
  title: '', tag: '', tagColor: 'primary', role: '', region: '',
  image: '', problem: '', outcome: '', description: '', keyOutput: '',
  order: 0, isVisible: true,
};

export default function ProjectsManager() {
  const [projects, setProjects] = useState([]);
  const [form, setForm] = useState(EMPTY_FORM);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');

  const loadProjects = async () => {
    const data = await api.get('/admin/projects');
    setProjects(data);
  };

  useEffect(() => { loadProjects(); }, []);

  const flash = (text) => { setMsg(text); setTimeout(() => setMsg(''), 3000); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editingId) {
        await api.put(`/admin/projects/${editingId}`, form);
        flash('Project updated ✅');
      } else {
        await api.post('/admin/projects', form);
        flash('Project created ✅');
      }
      setForm(EMPTY_FORM); setEditingId(null); setShowForm(false);
      loadProjects();
    } catch (err) { flash(err.message); }
    setLoading(false);
  };

  const handleEdit = (project) => {
    setForm({ ...project }); setEditingId(project._id); setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this project?')) return;
    await api.delete(`/admin/projects/${id}`);
    flash('Deleted ✅'); loadProjects();
  };

  const handleToggleVisible = async (project) => {
    await api.put(`/admin/projects/${project._id}`, { isVisible: !project.isVisible });
    loadProjects();
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-extrabold text-gray-800">Projects</h2>
        <button onClick={() => { setForm(EMPTY_FORM); setEditingId(null); setShowForm(true); }}
          className="flex items-center gap-2 bg-[#064E3B] text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-[#065f46]">
          <Plus className="w-4 h-4" /> Add Project
        </button>
      </div>

      {msg && <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-700 rounded-lg text-sm">{msg}</div>}

      {/* Project List */}
      <div className="space-y-3 mb-8">
        {projects.map((p) => (
          <div key={p._id} className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex items-center gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className="font-semibold text-gray-800 truncate">{p.title}</p>
                <span className={`text-xs px-2 py-0.5 rounded-full ${p.isVisible ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                  {p.isVisible ? 'Visible' : 'Hidden'}
                </span>
              </div>
              <p className="text-sm text-gray-500 truncate">{p.role} · {p.region}</p>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => handleToggleVisible(p)} title="Toggle visibility"
                className="p-1.5 text-gray-400 hover:text-[#064E3B] transition-colors">
                <Check className="w-4 h-4" />
              </button>
              <button onClick={() => handleEdit(p)} className="p-1.5 text-gray-400 hover:text-blue-600 transition-colors">
                <Pencil className="w-4 h-4" />
              </button>
              <button onClick={() => handleDelete(p._id)} className="p-1.5 text-gray-400 hover:text-red-600 transition-colors">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b">
              <h3 className="text-lg font-bold">{editingId ? 'Edit Project' : 'New Project'}</h3>
              <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {[
                ['title', 'Title'], ['tag', 'Tag'], ['role', 'Role'], ['region', 'Region'],
                ['image', 'Image URL'], ['problem', 'Problem'], ['outcome', 'Outcome'],
                ['description', 'Description'], ['keyOutput', 'Key Output'],
              ].map(([field, label]) => (
                <div key={field}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
                  {['problem', 'outcome', 'description', 'keyOutput'].includes(field) ? (
                    <textarea rows={3} value={form[field]} onChange={(e) => setForm({ ...form, [field]: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#064E3B]" />
                  ) : (
                    <input value={form[field]} onChange={(e) => setForm({ ...form, [field]: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#064E3B]" />
                  )}
                </div>
              ))}
              <div className="flex items-center gap-2">
                <input type="checkbox" checked={form.isVisible} onChange={(e) => setForm({ ...form, isVisible: e.target.checked })} id="visible" />
                <label htmlFor="visible" className="text-sm text-gray-700">Visible on portfolio</label>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="submit" disabled={loading}
                  className="flex-1 bg-[#064E3B] text-white py-2.5 rounded-lg font-semibold text-sm hover:bg-[#065f46] disabled:opacity-60">
                  {loading ? 'Saving...' : editingId ? 'Update Project' : 'Create Project'}
                </button>
                <button type="button" onClick={() => setShowForm(false)}
                  className="px-4 py-2.5 border border-gray-300 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-50">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
