import { useEffect, useState } from 'react';
import { api } from '../utils/api';

export default function SettingsEditor() {
  const [footer, setFooter] = useState({
    email: '',
    linkedIn: '',
    bookCall: '',
    twitter: '',
    substack: '',
  });
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    api
      .get('/admin/settings')
      .then((data) => setFooter(data?.footer || {}))
      .catch(console.error);
  }, []);

  const flash = (text) => {
    setMsg(text);
    setTimeout(() => setMsg(''), 3000);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const current = await api.get('/admin/settings');
      await api.put('/admin/settings', { ...current, footer });
      flash('Contact settings saved.');
    } catch (err) {
      flash(err.message);
    }
    setLoading(false);
  };

  const updateField = (field, value) => {
    setFooter((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="p-3 sm:p-4 md:p-6 lg:p-8">
      <div className="max-w-2xl mx-auto">
      <h2 className="text-xl sm:text-2xl font-extrabold text-gray-800 mb-6 sm:mb-8">Contact Settings</h2>

      {msg && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-700 rounded-lg text-xs sm:text-sm">
          {msg}
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6 sm:space-y-8">
        <section>
          <h3 className="text-xs sm:text-sm font-bold text-gray-500 uppercase tracking-widest mb-4">Contact Links</h3>
          <div className="space-y-3 sm:space-y-4">
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Email Address</label>
              <input
                value={footer.email || ''}
                onChange={(e) => updateField('email', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#064E3B]"
              />
            </div>
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">LinkedIn URL</label>
              <input
                value={footer.linkedIn || ''}
                onChange={(e) => updateField('linkedIn', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#064E3B]"
              />
            </div>
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Book a Call URL</label>
              <input
                value={footer.bookCall || ''}
                onChange={(e) => updateField('bookCall', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#064E3B]"
              />
            </div>
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Twitter/X URL</label>
              <input
                value={footer.twitter || ''}
                onChange={(e) => updateField('twitter', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#064E3B]"
              />
            </div>
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Substack URL</label>
              <input
                value={footer.substack || ''}
                onChange={(e) => updateField('substack', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#064E3B]"
              />
            </div>
          </div>
        </section>

        <button
          type="submit"
          disabled={loading}
          className="w-full sm:w-auto bg-[#064E3B] text-white px-6 sm:px-8 py-2 sm:py-2.5 rounded-lg font-semibold text-xs sm:text-sm hover:bg-[#065f46] disabled:opacity-60"
        >
          {loading ? 'Saving...' : 'Save Contact Settings'}
        </button>
      </form>
      </div>
    </div>
  );
}
