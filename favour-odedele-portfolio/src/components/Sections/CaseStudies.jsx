import { useEffect, useState } from 'react';
import { Award, BookOpen, Megaphone, Sparkles, X } from 'lucide-react';
import { projects as fallbackProjects } from '../../data/projects';
import { API_BASE_URL } from '../../config.js';
import { DEFAULT_HIGHLIGHTS_SECTION, normalizeHighlightsSection } from '../../data/frontPageSettings.js';

const API = API_BASE_URL;
const iconByTag = {
  Writing: BookOpen,
  Leadership: Award,
  Community: Sparkles,
  Speaking: Megaphone,
};

const visibleHighlights = (items = []) =>
  items
    .filter((item) => (item.category || 'highlight') === 'highlight' && item.isVisible !== false)
    .sort((a, b) => (a.order || 0) - (b.order || 0));

export default function Highlights() {
  const [highlights, setHighlights] = useState(visibleHighlights(fallbackProjects));
  const [sectionCopy, setSectionCopy] = useState(DEFAULT_HIGHLIGHTS_SECTION);
  const [activeHighlight, setActiveHighlight] = useState(null);

  useEffect(() => {
    let active = true;

    Promise.all([
      fetch(`${API}/projects`).then((res) => res.json()),
      fetch(`${API}/settings`).then((res) => res.json()),
    ])
      .then(([projectData, settingsData]) => {
        if (!active) return;
        const next = visibleHighlights(Array.isArray(projectData) ? projectData : []);
        if (next.length) setHighlights(next);
        setSectionCopy(normalizeHighlightsSection(settingsData?.highlightsSection));
      })
      .catch(() => {});

    return () => {
      active = false;
    };
  }, []);

  return (
    <section className="py-16 sm:py-20 lg:py-28 bg-background-muted" id="highlights">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="max-w-3xl mb-10 sm:mb-14">
          <p className="text-primary font-bold tracking-widest uppercase text-xs sm:text-sm mb-4">
            {sectionCopy.eyebrow}
          </p>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-normal leading-snug text-slate-950">
            {sectionCopy.heading}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
          {highlights.map((highlight, index) => {
            const Icon = iconByTag[highlight.tag] || Sparkles;
            return (
              <button
                type="button"
                key={highlight._id || highlight.id || `${highlight.title}-${index}`}
                onClick={() => setActiveHighlight(highlight)}
                className="group text-left bg-white border border-slate-200 rounded-xl overflow-hidden transition-all"
              >
                <div className="aspect-[4/3] overflow-hidden bg-slate-200">
                  <img
                    src={highlight.image || '/images/placeholder-gallery-1.jpg'}
                    alt={highlight.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                </div>
                <div className="p-6">
                  <div className="flex items-center justify-between gap-3 mb-5">
                    <span className="text-[10px] font-black uppercase tracking-[0.25em] text-primary">
                      {highlight.tag || 'Highlight'}
                    </span>
                    <span className="w-10 h-10 rounded-full bg-primary/10 text-primary grid place-items-center">
                      <Icon className="w-5 h-5" />
                    </span>
                  </div>
                  <h3 className="text-xl font-black text-slate-950 mb-3">{highlight.title}</h3>
                  <p className="text-sm leading-relaxed text-slate-500 line-clamp-4">
                    {highlight.description || highlight.outcome || highlight.keyOutput}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {activeHighlight && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm p-4 flex items-center justify-center">
          <div className="w-full max-w-2xl bg-white rounded-2xl overflow-hidden">
            <div className="relative h-56 bg-slate-200">
              <img
                src={activeHighlight.image || '/images/placeholder-gallery-1.jpg'}
                alt={activeHighlight.title}
                className="w-full h-full object-cover"
              />
              <button
                type="button"
                onClick={() => setActiveHighlight(null)}
                className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/90 text-slate-900 grid place-items-center hover:bg-white"
                aria-label="Close highlight details"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 sm:p-8 space-y-5">
              <p className="text-xs font-black uppercase tracking-[0.25em] text-primary">
                {activeHighlight.tag || 'Personal Highlight'}
              </p>
              <h3 className="text-2xl sm:text-3xl font-black text-slate-950">{activeHighlight.title}</h3>
              <p className="text-slate-600 leading-relaxed">{activeHighlight.description}</p>
              {activeHighlight.keyOutput && (
                <div className="border-l-4 border-accent-magenta bg-slate-50 p-4">
                  <p className="text-sm font-semibold text-slate-800">{activeHighlight.keyOutput}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

