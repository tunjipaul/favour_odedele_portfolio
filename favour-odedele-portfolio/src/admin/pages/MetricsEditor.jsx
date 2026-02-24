import { useEffect, useState } from 'react';
import { api } from '../utils/api';
import { Pencil, Trash2, Plus, X } from 'lucide-react';

const EMPTY_FORM = { number: '', value: '', label: '', targetValue: 0, order: 0 };

export default function MetricsEditor() {
  const [metrics, setMetrics] = useState([]);
  const [form, setForm] = useState(EMPTY_FORM);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');

  const load = async () => { const data = await api.get('/admin/metrics'); setMetrics(data); };
  useEffect(() => { load(); }, []);
  const flash = (t) => { setMsg(t); setTimeout(() => setMsg(''), 3000); };

  const handleSubmit = async (e) => {
    e.preventDefault(); setLoading(true);
    try {
      if (editingId) { await api.put(`/admin/metrics/${editingId}`, form); flash('Updated ✅'); }
      else { await api.post('/admin/metrics', form); flash('Created ✅'); }
      setForm(EMPTY_FORM); setEditingId(null); setShowForm(false); load();
    } catch (err) { flash(err.message); }
    setLoading(false);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-extrabold text-gray-800">Impact Metrics</h2>
        <button onClick={() => { setForm(EMPTY_FORM); setEditingId(null); setShowForm(true); }}
          className="flex items-center gap-2 bg-[#064E3B] text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-[#065f46]">
          <Plus className="w-4 h-4" /> Add Metric
        </button>
      </div>

      {msg && <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-700 rounded-lg text-sm">{msg}</div>}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {metrics.map((m) => (
          <div key={m._id} className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 relative">
            <div className="flex gap-2 absolute top-3 right-3">
              <button onClick={() => { setForm({ ...m }); setEditingId(m._id); setShowForm(true); }}
                className="p-1 text-gray-400 hover:text-blue-600"><Pencil className="w-4 h-4" /></button>
              <button onClick={async () => { if (confirm('Delete?')) { await api.delete(`/admin/metrics/${m._id}`); load(); } }}
                className="p-1 text-gray-400 hover:text-red-600"><Trash2 className="w-4 h-4" /></button>
            </div>
            <p className="text-xs text-gray-400 font-mono mb-1">{m.number}</p>
            <p className="text-3xl font-black text-[#064E3B]">{m.value}</p>
            <p className="text-sm text-gray-500 mt-1">{m.label}</p>
          </div>
        ))}
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="flex items-center justify-between p-6 border-b">
              <h3 className="text-lg font-bold">{editingId ? 'Edit Metric' : 'New Metric'}</h3>
              <button onClick={() => setShowForm(false)}><X className="w-5 h-5 text-gray-400" /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {[['number', 'Number (e.g. 01)'], ['value', 'Display Value (e.g. 10k+)'], ['label', 'Label']].map(([field, label]) => (
                <div key={field}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
                  <input value={form[field]} onChange={(e) => setForm({ ...form, [field]: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#064E3B]" />
                </div>
              ))}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Target Value (for animation)</label>
                <input type="number" value={form.targetValue} onChange={(e) => setForm({ ...form, targetValue: +e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#064E3B]" />
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
