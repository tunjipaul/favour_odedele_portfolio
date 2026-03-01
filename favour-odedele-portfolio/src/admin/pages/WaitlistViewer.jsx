import { useEffect, useState } from 'react';
import { api } from '../utils/api';
import { Mail } from 'lucide-react';

const formatDate = (iso) =>
  new Date(iso).toLocaleDateString('en-NG', { day: 'numeric', month: 'short', year: 'numeric' });

const EMPTY_BOOK = {
  title: '',
  teaser: '',
  progress: 0,
  stats: [
    { label: 'Days Left', target: 0 },
    { label: 'Chapters Done', target: 0 },
    { label: 'Key Pillars', target: 0 },
  ],
};

export default function WaitlistViewer() {
  const [entries, setEntries] = useState([]);
  const [book, setBook] = useState(EMPTY_BOOK);
  const [loading, setLoading] = useState(true);
  const [savingBook, setSavingBook] = useState(false);
  const [msg, setMsg] = useState('');

  const flash = (text) => {
    setMsg(text);
    setTimeout(() => setMsg(''), 3000);
  };

  useEffect(() => {
    const load = async () => {
      try {
        const [waitlistData, settingsData] = await Promise.all([
          api.get('/admin/waitlist'),
          api.get('/admin/settings'),
        ]);
        setEntries(Array.isArray(waitlistData) ? waitlistData : []);
        setBook({
          ...EMPTY_BOOK,
          ...(settingsData?.book || {}),
          stats: settingsData?.book?.stats?.length ? settingsData.book.stats : EMPTY_BOOK.stats,
        });
      } catch (error) {
        console.error('Failed to load waitlist and book settings', error);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const updateBookField = (field, value) => {
    setBook((prev) => ({ ...prev, [field]: value }));
  };

  const updateStat = (index, field, value) => {
    setBook((prev) => {
      const nextStats = [...prev.stats];
      const current = nextStats[index] || { label: '', target: 0 };
      nextStats[index] = {
        ...current,
        [field]: field === 'target' ? Number(value || 0) : value,
      };
      return { ...prev, stats: nextStats };
    });
  };

  const saveBookSettings = async (e) => {
    e.preventDefault();
    setSavingBook(true);
    try {
      const current = await api.get('/admin/settings');
      await api.put('/admin/settings', { ...current, book });
      flash('Book waitlist settings saved.');
    } catch (err) {
      flash(err.message || 'Failed to save book settings.');
    } finally {
      setSavingBook(false);
    }
  };

  return (
    <div className="min-h-screen bg-background-dark text-white">
      <div className="max-w-6xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-6 sm:py-8 md:py-10 space-y-6 sm:space-y-8">
        <header className="flex flex-col gap-2 sm:gap-3">
          <p className="text-xs uppercase tracking-[0.4em] sm:tracking-[0.5em] text-emerald-300">Waitlist Management</p>
          <h1 className="text-2xl sm:text-3xl font-black">Book Waitlist</h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl">
            Manage book teaser content and review everyone who has signed up.
          </p>
        </header>

        {msg && (
          <div className="rounded-xl border border-emerald-300/30 bg-emerald-500/10 px-4 py-3 text-xs sm:text-sm text-emerald-200">
            {msg}
          </div>
        )}

        <section className="bg-white/5 border border-white/10 rounded-2xl p-4 sm:p-6">
          <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">Book Teaser Settings</h2>
          <form onSubmit={saveBookSettings} className="space-y-4 sm:space-y-5">
            <div>
              <label className="block text-xs sm:text-sm text-slate-300 mb-2">Book Title</label>
              <input
                value={book.title || ''}
                onChange={(e) => updateBookField('title', e.target.value)}
                className="w-full bg-slate-900/70 border border-white/15 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
              />
            </div>
            <div>
              <label className="block text-xs sm:text-sm text-slate-300 mb-2">Teaser Text</label>
              <textarea
                rows={3}
                value={book.teaser || ''}
                onChange={(e) => updateBookField('teaser', e.target.value)}
                className="w-full bg-slate-900/70 border border-white/15 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
              />
            </div>
            <div>
              <label className="block text-xs sm:text-sm text-slate-300 mb-2">Progress % (0-100)</label>
              <input
                type="number"
                min="0"
                max="100"
                value={book.progress ?? 0}
                onChange={(e) => updateBookField('progress', Number(e.target.value || 0))}
                className="w-full bg-slate-900/70 border border-white/15 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3">
              {(book.stats || EMPTY_BOOK.stats).slice(0, 3).map((stat, index) => (
                <div key={index} className="bg-slate-950/40 border border-white/10 rounded-lg p-3 space-y-2">
                  <label className="block text-[10px] sm:text-xs uppercase tracking-wider text-slate-400">Stat Label</label>
                  <input
                    value={stat?.label || ''}
                    onChange={(e) => updateStat(index, 'label', e.target.value)}
                    className="w-full bg-slate-900/70 border border-white/15 rounded-lg px-3 py-1.5 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
                  />
                  <label className="block text-[10px] sm:text-xs uppercase tracking-wider text-slate-400">Target Value</label>
                  <input
                    type="number"
                    value={stat?.target ?? 0}
                    onChange={(e) => updateStat(index, 'target', e.target.value)}
                    className="w-full bg-slate-900/70 border border-white/15 rounded-lg px-3 py-1.5 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
                  />
                </div>
              ))}
            </div>

            <button
              type="submit"
              disabled={savingBook}
              className="inline-flex items-center rounded-xl bg-emerald-500 px-5 py-2 sm:py-2.5 text-xs sm:text-sm font-semibold text-slate-900 hover:bg-emerald-400 disabled:opacity-60"
            >
              {savingBook ? 'Saving...' : 'Save Book Settings'}
            </button>
          </form>
        </section>

        <section className="bg-white/5 border border-white/10 rounded-2xl p-4 sm:p-6">
          <div className="flex flex-col gap-3 sm:gap-4 mb-4 sm:mb-5">
            <div>
              <p className="text-[10px] sm:text-xs uppercase tracking-[0.3em] sm:tracking-[0.4em] text-slate-400">Current signups</p>
              <h2 className="text-lg sm:text-xl font-semibold">{entries.length} readers</h2>
            </div>
            <button className="w-full sm:w-auto flex items-center justify-center sm:justify-start gap-2 rounded-xl border border-white/20 px-4 py-2 text-[10px] sm:text-xs uppercase tracking-[0.2em] sm:tracking-[0.3em] text-slate-200 hover:border-white/40">
              <Mail className="w-4 h-4" />
              Export list
            </button>
          </div>

          {loading ? (
            <div className="text-xs sm:text-sm text-slate-400">Loading...</div>
          ) : entries.length === 0 ? (
            <p className="text-xs sm:text-sm text-slate-500">No waitlist entries yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead className="text-slate-400 text-[10px] sm:text-xs uppercase tracking-[0.3em] sm:tracking-[0.35em] bg-slate-950/40">
                  <tr>
                    <th className="px-3 sm:px-4 py-2 sm:py-3 whitespace-nowrap">Name</th>
                    <th className="px-3 sm:px-4 py-2 sm:py-3 whitespace-nowrap">Email</th>
                    <th className="px-3 sm:px-4 py-2 sm:py-3 whitespace-nowrap hidden sm:table-cell">Sign-up date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {entries.map((entry, index) => (
                    <tr key={entry._id ?? index} className="hover:bg-white/5 transition-colors">
                      <td className="px-3 sm:px-4 py-2 sm:py-3 text-slate-100 text-xs sm:text-sm">{entry.name || 'Anonymous Reader'}</td>
                      <td className="px-3 sm:px-4 py-2 sm:py-3 text-slate-300 lowercase text-xs sm:text-sm">
                        <a href={`mailto:${entry.email}`} className="hover:text-white break-all">
                          {entry.email}
                        </a>
                      </td>
                      <td className="px-3 sm:px-4 py-2 sm:py-3 text-slate-400 text-xs sm:text-sm hidden sm:table-cell whitespace-nowrap">{formatDate(entry.createdAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
