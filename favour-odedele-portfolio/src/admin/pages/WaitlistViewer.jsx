import { useEffect, useState, useMemo } from 'react';
import { api } from '../utils/api';
import { Upload, Download, Copy, Check, Search, FileSpreadsheet } from 'lucide-react';
import { DEFAULT_BOOK_SETTINGS, normalizeBookSettings } from '../../data/bookSettings.js';

const formatDate = (iso) =>
  new Date(iso).toLocaleDateString('en-NG', { day: 'numeric', month: 'short', year: 'numeric' });

export default function WaitlistViewer() {
  const [entries, setEntries] = useState([]);
  const [book, setBook] = useState(DEFAULT_BOOK_SETTINGS);
  const [loading, setLoading] = useState(true);
  const [savingBook, setSavingBook] = useState(false);
  const [uploadingCover, setUploadingCover] = useState(false);
  const [uploadingPdf, setUploadingPdf] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedAll, setCopiedAll] = useState(false);
  const [copiedId, setCopiedId] = useState(null);
  const [msg, setMsg] = useState('');

  const flash = (text) => {
    setMsg(text);
    setTimeout(() => setMsg(''), 3000);
  };

  const exportToCSV = () => {
    if (entries.length === 0) return;
    const header = 'Email,Sign-up Date\n';
    const rows = entries
      .map((entry) => `"${entry.email}","${new Date(entry.createdAt).toISOString()}"`)
      .join('\n');
    const blob = new Blob([header + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `favour-book-waitlist-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    flash('Waitlist exported to CSV!');
  };

  const copyAllEmails = () => {
    if (entries.length === 0) return;
    const emailList = entries.map((e) => e.email).join(', ');
    navigator.clipboard.writeText(emailList);
    setCopiedAll(true);
    flash(`Copied ${entries.length} emails to clipboard!`);
    setTimeout(() => setCopiedAll(false), 2500);
  };

  const copySingleEmail = (email, id) => {
    navigator.clipboard.writeText(email);
    setCopiedId(id);
    flash(`Copied ${email}`);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filteredEntries = useMemo(() => {
    if (!searchQuery.trim()) return entries;
    const q = searchQuery.toLowerCase();
    return entries.filter((e) => e.email?.toLowerCase().includes(q));
  }, [entries, searchQuery]);

  useEffect(() => {
    const load = async () => {
      try {
        const [subscriberData, settingsData] = await Promise.all([
          api.get('/admin/waitlist'),
          api.get('/admin/settings'),
        ]);
        setEntries(Array.isArray(subscriberData) ? subscriberData : []);
        setBook(normalizeBookSettings(settingsData?.book));
      } catch (error) {
        console.error('Failed to load book waitlist and book settings', error);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const updateBookField = (field, value) => {
    setBook((prev) => ({ ...prev, [field]: value }));
  };

  const saveBookSettings = async (event) => {
    event.preventDefault();
    setSavingBook(true);
    try {
      const current = await api.get('/admin/settings');
      await api.put('/admin/settings', { ...current, book });
      flash('Book settings saved.');
    } catch (err) {
      flash(err.message || 'Failed to save book settings.');
    } finally {
      setSavingBook(false);
    }
  };

  const uploadBookAsset = async (event, field, setUploading) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('image', file);
      const data = await api.upload('/admin/upload', formData);
      updateBookField(field, data.url || '');
      flash(field === 'pdfUrl' ? 'Book PDF uploaded. Save settings to publish it.' : 'Book cover uploaded. Save settings to publish it.');
    } catch (err) {
      flash(err.message || 'Upload failed.');
    } finally {
      setUploading(false);
      event.target.value = '';
    }
  };

  return (
    <div className="min-h-screen bg-background-dark text-white">
      <div className="max-w-6xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-6 sm:py-8 md:py-10 space-y-6 sm:space-y-8">
        <header className="flex flex-col gap-2 sm:gap-3">
          <p className="text-xs uppercase tracking-[0.4em] sm:tracking-[0.5em] text-emerald-300">Book</p>
          <h1 className="text-2xl sm:text-3xl font-black">Book Waitlist</h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl">
            Manage book content and review everyone who has joined the waitlist for Becoming the 1%.
          </p>
        </header>

        {msg && (
          <div className="rounded-xl border border-emerald-300/30 bg-emerald-500/10 px-4 py-3 text-xs sm:text-sm text-emerald-200">
            {msg}
          </div>
        )}

        <section className="bg-white/5 border border-white/10 rounded-2xl p-4 sm:p-6">
          <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">Book Settings</h2>
          <form onSubmit={saveBookSettings} className="space-y-4 sm:space-y-5">
            <div>
              <label className="block text-xs sm:text-sm text-slate-300 mb-2">Book Title</label>
              <input
                value={book.title || ''}
                onChange={(event) => updateBookField('title', event.target.value)}
                className="w-full bg-slate-900/70 border border-white/15 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
              />
            </div>
            <div>
              <label className="block text-xs sm:text-sm text-slate-300 mb-2">Short Description / Teaser</label>
              <textarea
                rows={4}
                value={book.teaser || ''}
                onChange={(event) => updateBookField('teaser', event.target.value)}
                className="w-full bg-slate-900/70 border border-white/15 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
              />
            </div>
            <div>
              <label className="block text-xs sm:text-sm text-slate-300 mb-2">Book Quote / Pull Quote</label>
              <textarea
                rows={3}
                value={book.quote || ''}
                onChange={(event) => updateBookField('quote', event.target.value)}
                placeholder="Enter a quote or excerpt from the book"
                className="w-full bg-slate-900/70 border border-white/15 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="rounded-xl border border-white/10 bg-slate-950/40 p-4">
                <p className="text-sm font-semibold text-slate-200 mb-3">Book Cover</p>
                {book.coverUrl && <img src={book.coverUrl} alt="Book cover preview" className="mb-3 h-44 w-32 object-cover rounded-lg border border-white/10" />}
                <label className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-white/20 text-sm font-semibold text-slate-200 hover:bg-white/5 cursor-pointer">
                  <Upload className="w-4 h-4" />
                  {uploadingCover ? 'Uploading...' : 'Upload Cover'}
                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/jpg,image/webp"
                    onChange={(event) => uploadBookAsset(event, 'coverUrl', setUploadingCover)}
                    className="hidden"
                    disabled={uploadingCover}
                  />
                </label>
              </div>

              <div className="rounded-xl border border-white/10 bg-slate-950/40 p-4">
                <p className="text-sm font-semibold text-slate-200 mb-3">Downloadable PDF</p>
                {book.pdfUrl ? (
                  <a href={book.pdfUrl} target="_blank" rel="noreferrer" className="mb-3 block text-sm text-emerald-300 underline underline-offset-4">
                    View current PDF
                  </a>
                ) : (
                  <p className="mb-3 text-sm text-slate-500">No PDF uploaded yet.</p>
                )}
                <label className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-white/20 text-sm font-semibold text-slate-200 hover:bg-white/5 cursor-pointer">
                  <Upload className="w-4 h-4" />
                  {uploadingPdf ? 'Uploading...' : 'Upload PDF'}
                  <input
                    type="file"
                    accept=".pdf,application/pdf"
                    onChange={(event) => uploadBookAsset(event, 'pdfUrl', setUploadingPdf)}
                    className="hidden"
                    disabled={uploadingPdf}
                  />
                </label>
              </div>
            </div>

            <div>
              <label className="block text-xs sm:text-sm text-slate-300 mb-2">Book Purchase Link</label>
              <p className="text-[11px] text-slate-500 mb-2">Paste the URL where people can buy the book (e.g. Selar, Amazon, Gumroad). This powers the "Get Book" button.</p>
              <input
                type="url"
                value={book.purchaseUrl || ''}
                onChange={(event) => updateBookField('purchaseUrl', event.target.value)}
                placeholder="https://selar.co/your-book"
                className="w-full bg-slate-900/70 border border-white/15 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
              />
            </div>

            <div>
              <label className="block text-xs sm:text-sm text-slate-300 mb-2">WhatsApp Community Link</label>
              <p className="text-[11px] text-slate-500 mb-2">Users who submit their email on the waitlist will be redirected here and receive this link in their confirmation email.</p>
              <input
                type="url"
                value={book.whatsappUrl || ''}
                onChange={(event) => updateBookField('whatsappUrl', event.target.value)}
                placeholder="https://chat.whatsapp.com/..."
                className="w-full bg-slate-900/70 border border-white/15 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
              />
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

        <section className="bg-white/5 border border-white/10 rounded-2xl p-4 sm:p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <p className="text-[10px] sm:text-xs uppercase tracking-[0.3em] sm:tracking-[0.4em] text-slate-400">Book waitlist</p>
              <h2 className="text-lg sm:text-xl font-semibold">{entries.length} {entries.length === 1 ? 'signup' : 'signups'}</h2>
            </div>

            {entries.length > 0 && (
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={copyAllEmails}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white/10 hover:bg-white/15 text-xs font-semibold text-white transition-colors cursor-pointer"
                  title="Copy all emails to clipboard (comma separated)"
                >
                  {copiedAll ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedAll ? 'Copied All!' : 'Copy All Emails'}</span>
                </button>

                <button
                  type="button"
                  onClick={exportToCSV}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-xs font-bold text-white transition-colors cursor-pointer shadow-sm"
                  title="Download waitlist as CSV file"
                >
                  <FileSpreadsheet className="w-3.5 h-3.5" />
                  <span>Export CSV</span>
                </button>
              </div>
            )}
          </div>

          {entries.length > 0 && (
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search emails..."
                className="w-full bg-slate-900/70 border border-white/10 rounded-lg pl-9 pr-3 py-2 text-xs sm:text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
              />
            </div>
          )}

          {loading ? (
            <div className="text-xs sm:text-sm text-slate-400 py-6 text-center">Loading waitlist...</div>
          ) : entries.length === 0 ? (
            <p className="text-xs sm:text-sm text-slate-500 py-6 text-center">No book waitlist signups yet.</p>
          ) : filteredEntries.length === 0 ? (
            <p className="text-xs sm:text-sm text-slate-500 py-6 text-center">No emails match &ldquo;{searchQuery}&rdquo;</p>
          ) : (
            <div className="overflow-x-auto rounded-xl border border-white/5">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead className="text-slate-400 text-[10px] sm:text-xs uppercase tracking-[0.3em] sm:tracking-[0.35em] bg-slate-950/40">
                  <tr>
                    <th className="px-3 sm:px-4 py-2.5 sm:py-3 whitespace-nowrap">Email</th>
                    <th className="px-3 sm:px-4 py-2.5 sm:py-3 whitespace-nowrap hidden sm:table-cell">Sign-up date</th>
                    <th className="px-3 sm:px-4 py-2.5 sm:py-3 whitespace-nowrap text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filteredEntries.map((entry, index) => {
                    const id = entry._id ?? index;
                    const isCopied = copiedId === id;
                    return (
                      <tr key={id} className="hover:bg-white/5 transition-colors">
                        <td className="px-3 sm:px-4 py-2.5 sm:py-3 text-slate-300 lowercase text-xs sm:text-sm font-medium">
                          <a href={`mailto:${entry.email}`} className="hover:text-white break-all">
                            {entry.email}
                          </a>
                        </td>
                        <td className="px-3 sm:px-4 py-2.5 sm:py-3 text-slate-400 text-xs sm:text-sm hidden sm:table-cell whitespace-nowrap">
                          {formatDate(entry.createdAt)}
                        </td>
                        <td className="px-3 sm:px-4 py-2.5 sm:py-3 text-right">
                          <button
                            type="button"
                            onClick={() => copySingleEmail(entry.email, id)}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-white/5 hover:bg-white/10 text-[11px] text-slate-300 hover:text-white transition-colors cursor-pointer"
                            title="Copy email"
                          >
                            {isCopied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                            <span>{isCopied ? 'Copied' : 'Copy'}</span>
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
