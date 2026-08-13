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
        {/* Two-column: heading + paragraphs */}
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
          </div>
        </div>

        {/* Full-width focus area cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-14">
          {about.focusAreas.map((item, index) => {
            const Icon = FOCUS_ICONS[index] || Users;
            return (
              <div
                key={`${item.title}-${index}`}
                className="flex flex-col min-w-0 border border-slate-200 bg-background-muted p-6 rounded-2xl transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-slate-300"
              >
                <div className="w-11 h-11 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-5">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="font-black text-slate-950 text-lg mb-2 break-words">{item.title}</h3>
                <p className="text-sm leading-relaxed text-slate-500 break-words [overflow-wrap:anywhere]">{item.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}


