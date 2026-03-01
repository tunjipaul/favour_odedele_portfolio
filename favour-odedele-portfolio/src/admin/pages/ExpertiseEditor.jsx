import { useEffect, useMemo, useState } from 'react';
import {
  BarChart3,
  CheckCircle2,
  GraduationCap,
  Handshake,
  Plus,
  Save,
  Settings,
  Trash2,
  Undo2,
} from 'lucide-react';
import { api } from '../utils/api';

const ICON_OPTIONS = [
  { value: 'Settings', label: 'Operational Excellence', Icon: Settings },
  { value: 'Handshake', label: 'Strategic Partnerships', Icon: Handshake },
  { value: 'GraduationCap', label: 'Educational Innovation', Icon: GraduationCap },
  { value: 'BarChart3', label: 'Scalable Impact', Icon: BarChart3 },
];

const FALLBACK_STYLE = {
  hoverColor: 'group-hover:bg-primary group-hover:text-white',
  iconBg: 'text-primary',
  borderHover: '',
};

const makeDraft = (pillar) => ({
  icon: pillar.icon || 'Settings',
  title: pillar.title || '',
  description: pillar.description || '',
  hoverColor: pillar.hoverColor || FALLBACK_STYLE.hoverColor,
  iconBg: pillar.iconBg || FALLBACK_STYLE.iconBg,
  borderHover: pillar.borderHover || FALLBACK_STYLE.borderHover,
  order: pillar.order ?? 0,
  isVisible: pillar.isVisible ?? true,
});

const payloadFromDraft = (draft) => ({
  ...draft,
  order: Number.isNaN(Number(draft.order)) ? 0 : Number(draft.order),
});

export default function ExpertiseEditor() {
  const [pillars, setPillars] = useState([]);
  const [drafts, setDrafts] = useState({});
  const [loading, setLoading] = useState(true);
  const [savingIds, setSavingIds] = useState([]);
  const [msg, setMsg] = useState('');
  const [isError, setIsError] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

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
        const data = await api.get('/admin/expertise');
        if (!active) return;
        const items = Array.isArray(data) ? [...data].sort((a, b) => (a.order ?? 0) - (b.order ?? 0)) : [];
        setPillars(items);
        setDrafts(Object.fromEntries(items.map((item) => [item._id, makeDraft(item)])));
      } catch (err) {
        if (active) flash(err.message || 'Failed to load expertise pillars', true);
      } finally {
        if (active) setLoading(false);
      }
    };

    load();
    return () => {
      active = false;
    };
  }, []);

  const filteredPillars = useMemo(() => {
    if (!searchTerm.trim()) return pillars;
    const q = searchTerm.trim().toLowerCase();
    return pillars.filter((pillar) => {
      const draft = drafts[pillar._id];
      return [draft?.title, draft?.description, draft?.icon].some((v) => (v || '').toLowerCase().includes(q));
    });
  }, [drafts, pillars, searchTerm]);

  const dirtyIds = useMemo(
    () =>
      pillars
        .map((pillar) => {
          const draft = drafts[pillar._id];
          if (!draft) return null;
          const changed = JSON.stringify(makeDraft(pillar)) !== JSON.stringify(draft);
          return changed ? pillar._id : null;
        })
        .filter(Boolean),
    [drafts, pillars]
  );

  const dirtyIdSet = useMemo(() => new Set(dirtyIds), [dirtyIds]);

  const updateDraft = (pillarId, field, value) => {
    setDrafts((prev) => ({
      ...prev,
      [pillarId]: {
        ...prev[pillarId],
        [field]: value,
      },
    }));
  };

  const savePillar = async (pillarId) => {
    const draft = drafts[pillarId];
    if (!draft) return;

    setSavingIds((prev) => [...prev, pillarId]);
    try {
      const isTemp = pillarId.startsWith('new-');
      const payload = payloadFromDraft(draft);

      if (isTemp) {
        await api.post('/admin/expertise', payload);
      } else {
        await api.put(`/admin/expertise/${pillarId}`, payload);
      }

      const data = await api.get('/admin/expertise');
      const items = Array.isArray(data) ? [...data].sort((a, b) => (a.order ?? 0) - (b.order ?? 0)) : [];
      setPillars(items);
      setDrafts(Object.fromEntries(items.map((item) => [item._id, makeDraft(item)])));
      flash('Pillar saved successfully.');
    } catch (err) {
      flash(err.message || 'Failed to save pillar', true);
    } finally {
      setSavingIds((prev) => prev.filter((id) => id !== pillarId));
    }
  };

  const discardPillar = (pillarId) => {
    const pillar = pillars.find((item) => item._id === pillarId);
    if (!pillar) return;
    setDrafts((prev) => ({
      ...prev,
      [pillarId]: makeDraft(pillar),
    }));
  };

  const discardAll = () => {
    setDrafts(Object.fromEntries(pillars.map((item) => [item._id, makeDraft(item)])));
  };

  const publishAll = async () => {
    if (!dirtyIds.length) return;

    setSavingIds((prev) => [...new Set([...prev, ...dirtyIds])]);
    try {
      for (const pillarId of dirtyIds) {
        const draft = drafts[pillarId];
        if (!draft) continue;
        const isTemp = pillarId.startsWith('new-');
        const payload = payloadFromDraft(draft);

        if (isTemp) await api.post('/admin/expertise', payload);
        else await api.put(`/admin/expertise/${pillarId}`, payload);
      }

      const data = await api.get('/admin/expertise');
      const items = Array.isArray(data) ? [...data].sort((a, b) => (a.order ?? 0) - (b.order ?? 0)) : [];
      setPillars(items);
      setDrafts(Object.fromEntries(items.map((item) => [item._id, makeDraft(item)])));
      flash(`Published ${dirtyIds.length} pillar${dirtyIds.length > 1 ? 's' : ''}.`);
    } catch (err) {
      flash(err.message || 'Failed to publish changes', true);
    } finally {
      setSavingIds([]);
    }
  };

  const addPillar = () => {
    const tempId = `new-${Date.now()}`;
    const tempPillar = {
      _id: tempId,
      icon: 'Settings',
      title: 'New Expertise Pillar',
      description: '',
      hoverColor: FALLBACK_STYLE.hoverColor,
      iconBg: FALLBACK_STYLE.iconBg,
      borderHover: FALLBACK_STYLE.borderHover,
      order: pillars.length ? Math.max(...pillars.map((item) => item.order ?? 0)) + 1 : 0,
      isVisible: true,
    };
    setPillars((prev) => [tempPillar, ...prev]);
    setDrafts((prev) => ({ ...prev, [tempId]: makeDraft(tempPillar) }));
  };

  const deletePillar = async (pillarId) => {
    if (pillarId.startsWith('new-')) {
      setPillars((prev) => prev.filter((item) => item._id !== pillarId));
      setDrafts((prev) => {
        const next = { ...prev };
        delete next[pillarId];
        return next;
      });
      return;
    }

    try {
      await api.delete(`/admin/expertise/${pillarId}`);
      setPillars((prev) => prev.filter((item) => item._id !== pillarId));
      setDrafts((prev) => {
        const next = { ...prev };
        delete next[pillarId];
        return next;
      });
      flash('Pillar deleted.');
    } catch (err) {
      flash(err.message || 'Failed to delete pillar', true);
    }
  };

  if (loading) {
    return <div className="p-8 text-slate-300">Loading expertise panel...</div>;
  }

  return (
    <div className="px-3 sm:px-4 md:px-6 lg:px-8 py-5 sm:py-6">
      <div className="mx-auto max-w-6xl">
        <div className="rounded-2xl border border-white/10 bg-slate-900/70 overflow-hidden">
          <div className="px-4 sm:px-6 py-4 sm:py-5 border-b border-white/10 flex flex-col gap-3 sm:gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">Core Expertise Pillars</h1>
              <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">Manage and edit the foundational pillars of the expertise framework.</p>
            </div>
            <div className="flex w-full lg:w-auto gap-2 sm:gap-3">
              <input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search pillars..."
                className="h-9 sm:h-10 flex-1 lg:w-64 rounded-xl border border-white/15 bg-slate-950/70 px-3 text-xs sm:text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-400/50"
              />
              <button
                type="button"
                onClick={addPillar}
                className="h-9 sm:h-10 px-3 sm:px-4 rounded-xl bg-orange-500 text-white text-xs sm:text-sm font-semibold hover:bg-orange-400 inline-flex items-center gap-2 flex-shrink-0"
              >
                <Plus className="w-4 h-4" />
                Add Pillar
              </button>
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

          <div className="p-4 sm:p-6 grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            {filteredPillars.map((pillar) => {
              const draft = drafts[pillar._id];
              const dirty = dirtyIdSet.has(pillar._id);
              const saving = savingIds.includes(pillar._id);
              const CurrentIcon = ICON_OPTIONS.find((option) => option.value === (draft?.icon || 'Settings'))?.Icon || Settings;

              return (
                <div key={pillar._id} className="rounded-xl border border-white/10 bg-slate-950/70 p-4 sm:p-5 space-y-4 sm:space-y-5">
                  <div className="flex items-center justify-between border-b border-white/10 pb-3 sm:pb-4">
                    <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                      <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-orange-500/15 text-orange-300 grid place-items-center flex-shrink-0">
                        <CurrentIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                      </div>
                      <h3 className="text-base sm:text-lg font-bold text-white truncate">{draft?.title || 'Untitled Pillar'}</h3>
                    </div>
                    <span
                      className={`text-[9px] sm:text-[10px] font-semibold px-2 py-1 rounded-full uppercase tracking-wider flex-shrink-0 ${
                        draft?.isVisible
                          ? 'bg-emerald-500/15 text-emerald-300'
                          : 'bg-slate-700/60 text-slate-300'
                      }`}
                    >
                      {draft?.isVisible ? 'Active' : 'Hidden'}
                    </span>
                  </div>

                  <div className="space-y-3 sm:space-y-4">
                    <label className="block">
                      <span className="mb-1 sm:mb-1.5 block text-xs sm:text-sm font-semibold text-slate-300">Title</span>
                      <input
                        value={draft?.title || ''}
                        onChange={(e) => updateDraft(pillar._id, 'title', e.target.value)}
                        className="w-full h-9 sm:h-10 rounded-lg border border-white/15 bg-slate-900 px-3 text-xs sm:text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-orange-400/50"
                      />
                    </label>

                    <label className="block">
                      <span className="mb-1 sm:mb-1.5 block text-xs sm:text-sm font-semibold text-slate-300">Description</span>
                      <textarea
                        rows={3}
                        value={draft?.description || ''}
                        onChange={(e) => updateDraft(pillar._id, 'description', e.target.value)}
                        className="w-full rounded-lg border border-white/15 bg-slate-900 px-3 py-2 text-xs sm:text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-orange-400/50"
                      />
                    </label>

                    <div className="grid grid-cols-2 gap-2 sm:gap-3">
                      <label className="block">
                        <span className="mb-1 sm:mb-1.5 block text-xs sm:text-sm font-semibold text-slate-300">Order</span>
                        <input
                          type="number"
                          value={draft?.order ?? 0}
                          onChange={(e) => updateDraft(pillar._id, 'order', e.target.value)}
                          className="w-full h-9 sm:h-10 rounded-lg border border-white/15 bg-slate-900 px-3 text-xs sm:text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-orange-400/50"
                        />
                      </label>
                      <label className="flex items-end pb-1 sm:pb-2 gap-2 text-xs sm:text-sm text-slate-300">
                        <input
                          type="checkbox"
                          checked={Boolean(draft?.isVisible)}
                          onChange={(e) => updateDraft(pillar._id, 'isVisible', e.target.checked)}
                          className="rounded border-white/20 bg-slate-900 text-orange-500"
                        />
                        Visible on client
                      </label>
                    </div>

                    <div>
                      <p className="mb-2 text-xs sm:text-sm font-semibold text-slate-300">Icon Selection</p>
                      <div className="grid grid-cols-4 gap-2">
                        {ICON_OPTIONS.map((option) => (
                          <button
                            key={option.value}
                            type="button"
                            onClick={() => updateDraft(pillar._id, 'icon', option.value)}
                            className={`h-9 sm:h-10 rounded-lg border grid place-items-center transition-colors ${
                              draft?.icon === option.value
                                ? 'border-orange-400 bg-orange-500/10 text-orange-300'
                                : 'border-white/15 bg-slate-900 text-slate-400 hover:border-orange-400/50'
                            }`}
                            title={option.label}
                            aria-label={option.label}
                          >
                            <option.Icon className="w-4 h-4" />
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <button
                      type="button"
                      onClick={() => deletePillar(pillar._id)}
                      className="inline-flex items-center gap-2 text-sm font-semibold text-red-300 hover:text-red-200"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </button>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => discardPillar(pillar._id)}
                        disabled={!dirty || saving}
                        className="h-9 px-4 rounded-lg border border-white/20 text-sm font-semibold text-slate-200 hover:bg-white/5 disabled:opacity-40"
                      >
                        <Undo2 className="w-4 h-4 inline mr-1" />
                        Discard
                      </button>
                      <button
                        type="button"
                        onClick={() => savePillar(pillar._id)}
                        disabled={!dirty || saving}
                        className="h-9 px-4 rounded-lg bg-orange-500 text-white text-sm font-semibold hover:bg-orange-400 disabled:opacity-50"
                      >
                        <Save className="w-4 h-4 inline mr-1" />
                        {saving ? 'Saving...' : 'Save'}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="px-6 py-5 border-t border-white/10 bg-slate-950/80 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h4 className="text-white font-bold inline-flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-orange-300" />
                Unsaved Changes
              </h4>
              <p className="text-sm text-slate-400 mt-1">
                {dirtyIds.length
                  ? `You have modified ${dirtyIds.length} pillar${dirtyIds.length > 1 ? 's' : ''}.`
                  : 'No pending changes.'}
              </p>
            </div>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={discardAll}
                disabled={!dirtyIds.length || savingIds.length > 0}
                className="h-10 px-5 rounded-lg border border-white/20 text-sm font-semibold text-slate-200 hover:bg-white/5 disabled:opacity-40"
              >
                Discard All
              </button>
              <button
                type="button"
                onClick={publishAll}
                disabled={!dirtyIds.length || savingIds.length > 0}
                className="h-10 px-5 rounded-lg bg-orange-500 text-white text-sm font-bold hover:bg-orange-400 disabled:opacity-40"
              >
                Publish Changes
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
