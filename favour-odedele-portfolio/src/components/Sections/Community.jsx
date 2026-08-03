import { useEffect, useState } from 'react';
import { ArrowUpRight, Users } from 'lucide-react';
import { API_BASE_URL } from '../../config.js';
import { DEFAULT_COMMUNITY_SETTINGS, normalizeCommunitySettings } from '../../data/communitySettings.js';

export default function Community() {
  const [community, setCommunity] = useState(DEFAULT_COMMUNITY_SETTINGS);

  useEffect(() => {
    let active = true;
    fetch(`${API_BASE_URL}/settings`)
      .then((response) => response.json())
      .then((data) => {
        if (active) setCommunity(normalizeCommunitySettings(data?.community));
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, []);

  const linkProps = community.openInNewTab
    ? { target: '_blank', rel: 'noopener noreferrer' }
    : {};

  return (
    <section id="community" className="py-20 sm:py-24 lg:py-32 bg-background-muted border-y border-slate-200/80">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-white px-4 py-2 text-xs font-black uppercase tracking-[0.25em] text-primary mb-8">
          <Users className="w-4 h-4" aria-hidden="true" />
          Community
        </div>

        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-normal text-slate-950 leading-snug">
          {community.title}
        </h2>

        <p className="mt-6 text-base sm:text-lg leading-relaxed text-slate-600 max-w-2xl mx-auto">
          {community.description}
        </p>

        <div className="mt-10">
          <a
            href={community.substackUrl}
            {...linkProps}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-950 px-8 py-4 text-sm font-black uppercase tracking-widest text-white transition-all hover:bg-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background-muted active:scale-[0.98]"
          >
            {community.buttonText}
            <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
          </a>
        </div>
      </div>
    </section>
  );
}

