import { useEffect, useState } from 'react';
import { api } from '../utils/api';
import { Pencil, Trash2, Plus, X } from 'lucide-react';

const ACCENT_COLORS = ['primary', 'accent-magenta', 'accent-green'];
const EMPTY_FORM = { title: '', image: '', accentColor: 'primary', order: 0, isVisible: true };

export default function GalleryManager() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(EMPTY_FORM);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');

  const load = async () => {
    const data = await api.get('/admin/gallery');
    setItems(data);
  };
  useEffect(() => { load(); }, []);

  const flash = (text) => { setMsg(text); setTimeout(() => setMsg(''), 3000); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editingId) {
        await api.put(`/admin/gallery/${editingId}`, form);
        flash('Updated ✅');
      } else {
        await api.post('/admin/gallery', form);
        flash('Created ✅');
      }
      setForm(EMPTY_FORM); setEditingId(null); setShowForm(false); load();
    } catch (err) { flash(err.message); }
    setLoading(false);
  };

  const handleEdit = (item) => { setForm({ ...item }); setEditingId(item._id); setShowForm(true); };
  const handleDelete = async (id) => {
    if (!confirm('Delete this gallery item?')) return;
    await api.delete(`/admin/gallery/${id}`);
    flash('Deleted ✅'); load();
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-extrabold text-gray-800">Gallery</h2>
        <button onClick={() => { setForm(EMPTY_FORM); setEditingId(null); setShowForm(true); }}
          className="flex items-center gap-2 bg-[#064E3B] text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-[#065f46]">
          <Plus className="w-4 h-4" /> Add Item
        </button>
      </div>

      {msg && <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-700 rounded-lg text-sm">{msg}</div>}

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
        {items.map((item) => (
          <div key={item._id} className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            {item.image
              ? <img src={item.image} alt={item.title} className="w-full h-32 object-cover" />
              : <div className="w-full h-32 bg-gray-100 flex items-center justify-center text-gray-400 text-sm">No image</div>
            }
            <div className="p-3 flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700 truncate">{item.title}</span>
              <div className="flex gap-1">
                <button onClick={() => handleEdit(item)} className="p-1 text-gray-400 hover:text-blue-600"><Pencil className="w-3.5 h-3.5" /></button>
                <button onClick={() => handleDelete(item._id)} className="p-1 text-gray-400 hover:text-red-600"><Trash2 className="w-3.5 h-3.5" /></button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="flex items-center justify-between p-6 border-b">
              <h3 className="text-lg font-bold">{editingId ? 'Edit Gallery Item' : 'New Gallery Item'}</h3>
              <button onClick={() => setShowForm(false)}><X className="w-5 h-5 text-gray-400" /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#064E3B]" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
                <input value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#064E3B]" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Accent Color</label>
                <select value={form.accentColor} onChange={(e) => setForm({ ...form, accentColor: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#064E3B]">
                  {ACCENT_COLORS.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="submit" disabled={loading}
                  className="flex-1 bg-[#064E3B] text-white py-2.5 rounded-lg font-semibold text-sm hover:bg-[#065f46] disabled:opacity-60">
                  {loading ? 'Saving...' : editingId ? 'Update' : 'Create'}
                </button>
                <button type="button" onClick={() => setShowForm(false)}
                  className="px-4 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
