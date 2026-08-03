import { useEffect, useState } from 'react';
import { BookOpen, GraduationCap, Lightbulb, Users } from 'lucide-react';
import { API_BASE_URL } from '../../config.js';
import { DEFAULT_ABOUT_SETTINGS, normalizeAboutSettings } from '../../data/frontPageSettings.js';

const FOCUS_ICONS = [GraduationCap, Lightbulb, Users];

export default function AboutMe() {
  const [about, setAbout] = useState(DEFAULT_ABOUT_SETTINGS);

  useEffect(() => {
    let active = true;
    fetch(`${API_BASE_URL}/settings`)
      .then((response) => response.json())
      .then((data) => {
        if (active) setAbout(normalizeAboutSettings(data?.about));
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, []);

  return (
    <section className="py-16 sm:py-20 lg:py-28 bg-white" id="about">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-[0.9fr_1.1fr] gap-10 lg:gap-16 items-start">
          <div>
            <p className="text-accent-magenta font-bold tracking-widest uppercase text-xs sm:text-sm mb-4">
              {about.eyebrow}
            </p>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-normal leading-snug text-slate-950">
              {about.heading}
            </h2>
          </div>

          <div className="space-y-6 text-slate-600 text-base sm:text-lg leading-relaxed">
            <p>{about.paragraph1}</p>
            <p>{about.paragraph2}</p>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 pt-4">
              {about.focusAreas.map((item, index) => {
                const Icon = FOCUS_ICONS[index] || Users;
                return (
                  <div key={`${item.title}-${index}`} className="min-w-0 border border-slate-200 bg-background-muted p-5 rounded-xl">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center mb-4">
                      <Icon className="w-5 h-5" />
                    </div>
                    <h3 className="font-black text-slate-950 mb-2 break-words">{item.title}</h3>
                    <p className="text-sm leading-relaxed text-slate-500 break-words [overflow-wrap:anywhere]">{item.description}</p>
                  </div>
                );
              })}
            </div>
            <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700">
              <BookOpen className="w-4 h-4 text-accent-magenta" />
              {about.bookBadge}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}


