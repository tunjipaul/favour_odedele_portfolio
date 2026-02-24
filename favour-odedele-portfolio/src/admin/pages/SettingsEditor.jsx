import { useEffect, useState } from 'react';
import { api } from '../utils/api';

export default function SettingsEditor() {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    api.get('/admin/settings').then(setSettings).catch(console.error);
  }, []);

  const flash = (t) => { setMsg(t); setTimeout(() => setMsg(''), 3000); };

  const handleSave = async (e) => {
    e.preventDefault(); setLoading(true);
    try {
      await api.put('/admin/settings', settings);
      flash('Settings saved ✅');
    } catch (err) { flash(err.message); }
    setLoading(false);
  };

  const update = (path, value) => {
    // path is like 'hero.fullName' or 'book.title'
    const [section, field] = path.split('.');
    setSettings((prev) => ({ ...prev, [section]: { ...prev[section], [field]: value } }));
  };

  if (!settings) return <div className="p-8 text-gray-500">Loading settings...</div>;

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-2xl">
      <h2 className="text-2xl font-extrabold text-gray-800 mb-6">Site Settings</h2>

      {msg && <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-700 rounded-lg text-sm">{msg}</div>}

      <form onSubmit={handleSave} className="space-y-8">
        {/* Hero */}
        <section>
          <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-4">Hero Section</h3>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <input value={settings.hero?.fullName || ''} onChange={(e) => update('hero.fullName', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#064E3B]" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Bio Text</label>
              <textarea rows={3} value={settings.hero?.bioText || ''} onChange={(e) => update('hero.bioText', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#064E3B]" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Portrait Image URL</label>
              <input value={settings.hero?.portrait || ''} onChange={(e) => update('hero.portrait', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#064E3B]" />
            </div>
          </div>
        </section>

        {/* Book */}
        <section>
          <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-4">Book Teaser</h3>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Book Title</label>
              <input value={settings.book?.title || ''} onChange={(e) => update('book.title', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#064E3B]" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Teaser Text</label>
              <textarea rows={3} value={settings.book?.teaser || ''} onChange={(e) => update('book.teaser', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#064E3B]" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Progress % (0–100)</label>
              <input type="number" min="0" max="100" value={settings.book?.progress || 0}
                onChange={(e) => update('book.progress', +e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#064E3B]" />
            </div>
          </div>
        </section>

        {/* Footer */}
        <section>
          <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-4">Footer</h3>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Quote</label>
              <textarea rows={2} value={settings.footer?.quote || ''} onChange={(e) => update('footer.quote', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#064E3B]" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">LinkedIn URL</label>
              <input value={settings.footer?.linkedIn || ''} onChange={(e) => update('footer.linkedIn', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#064E3B]" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
              <input value={settings.footer?.email || ''} onChange={(e) => update('footer.email', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#064E3B]" />
            </div>
          </div>
        </section>

        <button type="submit" disabled={loading}
          className="bg-[#064E3B] text-white px-8 py-2.5 rounded-lg font-semibold text-sm hover:bg-[#065f46] disabled:opacity-60">
          {loading ? 'Saving...' : 'Save All Settings'}
        </button>
      </form>
    </div>
  );
}
