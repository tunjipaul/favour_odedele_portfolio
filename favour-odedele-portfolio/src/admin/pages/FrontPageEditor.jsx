import { useEffect, useMemo, useState } from 'react';
import { ImagePlus, Info, Save, Undo2, Upload } from 'lucide-react';
import { api } from '../utils/api';

const EMPTY_SETTINGS = {
  hero: {
    fullName: '',
    bioText: '',
    portrait: '',
  },
};

function safeSettingsShape(data) {
  return {
    ...data,
    hero: {
      ...EMPTY_SETTINGS.hero,
      ...(data?.hero || {}),
    },
  };
}

export default function FrontPageEditor() {
  const [settings, setSettings] = useState(EMPTY_SETTINGS);
  const [savedSnapshot, setSavedSnapshot] = useState(EMPTY_SETTINGS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');
  const [isError, setIsError] = useState(false);
  const [uploadingPortrait, setUploadingPortrait] = useState(false);

  const flash = (text, error = false) => {
    setMsg(text);
    setIsError(error);
    setTimeout(() => setMsg(''), 3000);
  };

  useEffect(() => {
    let active = true;

    const load = async () => {
      setLoading(true);
      try {
        const data = await api.get('/admin/settings');
        if (!active) return;
        const shaped = safeSettingsShape(data);
        setSettings(shaped);
        setSavedSnapshot(shaped);
      } catch (err) {
        if (active) flash(err.message || 'Failed to load front page settings', true);
      } finally {
        if (active) setLoading(false);
      }
    };

    load();
    return () => {
      active = false;
    };
  }, []);

  const updateHero = (key, value) => {
    setSettings((prev) => ({
      ...prev,
      hero: {
        ...prev.hero,
        [key]: value,
      },
    }));
  };

  const hasChanges = useMemo(
    () => JSON.stringify(settings) !== JSON.stringify(savedSnapshot),
    [savedSnapshot, settings]
  );

  const handleDiscard = () => {
    setSettings(savedSnapshot);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const updated = await api.put('/admin/settings', settings);
      const shaped = safeSettingsShape(updated);
      setSettings(shaped);
      setSavedSnapshot(shaped);
      flash('Front page updated successfully.');
    } catch (err) {
      flash(err.message || 'Could not save front page settings', true);
    } finally {
      setSaving(false);
    }
  };

  const handlePortraitUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploadingPortrait(true);
    try {
      const formData = new FormData();
      formData.append('image', file);
      const data = await api.upload('/admin/upload', formData);
      updateHero('portrait', data.url || '');
      flash('Portrait uploaded successfully.');
    } catch (err) {
      flash(err.message || 'Portrait upload failed', true);
    } finally {
      setUploadingPortrait(false);
      event.target.value = '';
    }
  };

  if (loading) {
    return <div className="p-8 text-slate-300">Loading front page editor...</div>;
  }

  return (
    <div className="px-3 sm:px-4 md:px-6 lg:px-8 py-5 sm:py-6">
      <div className="mx-auto max-w-6xl">
        <div className="rounded-2xl border border-white/10 bg-slate-900/60 overflow-hidden">
          <div className="px-4 sm:px-6 py-4 sm:py-5 border-b border-white/10">
            <p className="text-[10px] sm:text-xs font-semibold uppercase tracking-[0.25em] text-slate-400">Front Page</p>
            <div className="mt-2 sm:mt-3 flex flex-col gap-3 sm:gap-4 md:flex-row md:items-end md:justify-between">
              <div>
                <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">Edit Hero Section</h1>
                <p className="mt-1 text-xs sm:text-sm text-slate-400 max-w-2xl">
                  Configure the visual identity and messaging for the top section of the landing page.
                </p>
              </div>

              <div className="flex w-full md:w-auto gap-2 sm:gap-3">
                <button
                  type="button"
                  onClick={handleDiscard}
                  disabled={!hasChanges || saving}
                  className="flex-1 md:flex-none inline-flex items-center justify-center gap-2 px-4 sm:px-5 h-9 sm:h-10 rounded-xl border border-white/20 text-slate-100 text-xs sm:text-sm font-semibold hover:bg-white/5 disabled:opacity-50"
                >
                  <Undo2 className="w-4 h-4" />
                  <span className="hidden sm:inline">Discard</span>
                </button>
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={!hasChanges || saving}
                  className="flex-1 md:flex-none inline-flex items-center justify-center gap-2 px-4 sm:px-5 h-9 sm:h-10 rounded-xl bg-orange-500 text-white text-xs sm:text-sm font-bold hover:bg-orange-400 disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  {saving ? <span>Saving...</span> : <span className="hidden sm:inline">Publish Changes</span>}
                  {saving ? <span className="sm:hidden">Saving...</span> : <span className="sm:hidden">Publish</span>}
                </button>
              </div>
            </div>
          </div>

          {msg && (
            <div
              className={`mx-4 sm:mx-6 mt-4 rounded-xl border px-4 py-3 text-xs sm:text-sm ${
                isError
                  ? 'border-red-400/40 bg-red-500/10 text-red-200'
                  : 'border-emerald-400/40 bg-emerald-500/10 text-emerald-200'
              }`}
            >
              {msg}
            </div>
          )}

          <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
            <section className="rounded-2xl border border-white/10 bg-slate-950/50 overflow-hidden">
              <div className="px-4 sm:px-5 py-3 sm:py-4 border-b border-white/10">
                <h2 className="text-base sm:text-lg font-bold text-white">Text Content</h2>
              </div>
              <div className="p-4 sm:p-5 space-y-4 sm:space-y-5">
                <label className="block">
                  <span className="mb-2 block text-xs sm:text-sm font-semibold text-slate-200">Main Headline</span>
                  <input
                    value={settings.hero.fullName}
                    onChange={(e) => updateHero('fullName', e.target.value)}
                    className="w-full h-10 sm:h-11 rounded-xl border border-white/15 bg-slate-900 px-3 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-orange-400/60"
                    placeholder="Enter headline..."
                  />
                </label>

                <label className="block">
                  <span className="mb-2 block text-xs sm:text-sm font-semibold text-slate-200">Sub-headline</span>
                  <textarea
                    value={settings.hero.bioText}
                    onChange={(e) => updateHero('bioText', e.target.value)}
                    rows={3}
                    className="w-full rounded-xl border border-white/15 bg-slate-900 px-3 py-2 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-orange-400/60"
                    placeholder="Enter sub-headline..."
                  />
                </label>
              </div>
            </section>

            <section className="rounded-2xl border border-white/10 bg-slate-950/50 overflow-hidden">
              <div className="px-4 sm:px-5 py-3 sm:py-4 border-b border-white/10 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <h2 className="text-base sm:text-lg font-bold text-white">Hero Media Assets</h2>
                <span className="text-[10px] sm:text-xs text-slate-400">Aspect ratio 4:5 recommended</span>
              </div>
              <div className="p-5 grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-1">
                  <p className="text-sm font-semibold text-slate-200 mb-3">Main Hero Portrait</p>
                  <div className="aspect-[4/5] rounded-2xl border-2 border-dashed border-white/20 bg-slate-900 overflow-hidden">
                    {settings.hero.portrait ? (
                      <img
                        src={settings.hero.portrait}
                        alt="Hero portrait preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="h-full w-full grid place-items-center text-slate-500">
                        <div className="text-center">
                          <ImagePlus className="w-7 h-7 mx-auto mb-2" />
                          <p className="text-xs font-semibold uppercase tracking-wide">No portrait set</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="lg:col-span-2 space-y-4">
                  <label className="block">
                    <span className="mb-2 block text-sm font-semibold text-slate-200">Hero Portrait</span>
                    <label className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-white/20 text-sm font-semibold text-slate-200 hover:bg-white/5 cursor-pointer">
                      <Upload className="w-4 h-4" />
                      {uploadingPortrait ? 'Uploading...' : 'Choose Portrait'}
                      <input
                        type="file"
                        accept="image/png,image/jpeg,image/jpg,image/webp"
                        onChange={handlePortraitUpload}
                        className="hidden"
                        disabled={uploadingPortrait}
                      />
                    </label>
                  </label>

                  <div className="rounded-xl border border-blue-400/20 bg-blue-500/10 p-4 flex items-start gap-3">
                    <Info className="w-4 h-4 mt-0.5 text-blue-300 shrink-0" />
                    <p className="text-xs leading-relaxed text-blue-100">
                      This editor maps to existing hero settings used by the site: name, bio text, and portrait image.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <section className="rounded-2xl border border-white/10 bg-slate-950/40 overflow-hidden">
              <div className="px-5 py-4 border-b border-white/10">
                <h2 className="text-lg font-bold text-white">Live Preview (Desktop)</h2>
              </div>
              <div className="p-5 bg-slate-950">
                <div className="rounded-xl overflow-hidden border border-white/10 min-h-[240px] flex">
                  <div className="w-[55%] p-6 bg-slate-900 flex flex-col justify-center">
                    <p className="text-[10px] uppercase tracking-[0.2em] text-orange-300 font-bold mb-3">Front Page</p>
                    <h3 className="text-2xl font-black leading-tight text-white">
                      {settings.hero.fullName || 'Main Headline'}
                    </h3>
                    <p className="text-sm text-slate-300 mt-3 line-clamp-4">
                      {settings.hero.bioText || 'Sub-headline preview'}
                    </p>
                  </div>
                  <div className="w-[45%] bg-slate-800">
                    {settings.hero.portrait ? (
                      <img
                        src={settings.hero.portrait}
                        alt="Hero preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full grid place-items-center text-slate-500">
                        <span className="text-xs font-semibold uppercase tracking-wide">Portrait Preview</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
