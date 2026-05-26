import { Settings, Handshake, GraduationCap, BarChart3 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { API_BASE_URL } from '../../config.js';

const API = API_BASE_URL;

const iconMap = { Settings, Handshake, GraduationCap, BarChart3 };

const fallbackPillars = [
  {
    icon: 'Settings',
    title: 'Operational Excellence',
    description: 'Optimizing internal workflows and managing resources to ensure peak performance across global teams.',
    hoverColor: 'group-hover:bg-primary group-hover:text-white',
    iconBg: 'text-primary',
    borderHover: 'hover:border-primary',
  },
  {
    icon: 'Handshake',
    title: 'Strategic Partnerships',
    description: 'Cultivating high-value alliances with stakeholders, NGOs, and corporate entities to scale program reach.',
    hoverColor: 'group-hover:bg-accent-magenta group-hover:text-white',
    iconBg: 'bg-accent-magenta/10 text-accent-magenta',
    borderHover: 'hover:border-accent-magenta',
  },
  {
    icon: 'GraduationCap',
    title: 'Educational Innovation',
    description: 'Designing cutting-edge curriculum and hybrid learning frameworks for the modern digital era.',
    hoverColor: 'group-hover:bg-accent-green group-hover:text-white',
    iconBg: 'bg-accent-green/10 text-accent-green',
    borderHover: 'hover:border-accent-green',
  },
  {
    icon: 'BarChart3',
    title: 'Scalable Impact',
    description: 'Developing data-driven models to replicate success across multiple geographic and socio-economic contexts.',
    hoverColor: 'group-hover:bg-primary group-hover:text-white',
    iconBg: 'text-primary',
    borderHover: 'hover:border-primary',
  },
];

export default function Expertise() {
  const [pillars, setPillars] = useState(fallbackPillars);

  useEffect(() => {
    let active = true;

    fetch(`${API}/expertise`)
      .then((res) => res.json())
      .then((data) => {
        if (!active) return;

        if (Array.isArray(data) && data.length >= 4) {
          setPillars(data);
        }
      })
      .catch(() => {});

    return () => {
      active = false;
    };
  }, []);

  return (
    <section className="py-12 sm:py-16 md:py-20 lg:py-24 bg-white" id="expertise">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 sm:mb-12 md:mb-16 gap-4 sm:gap-6">
          <div className="max-w-2xl">
            <h2 className="text-accent-magenta font-bold tracking-widest uppercase text-xs sm:text-sm mb-3 sm:mb-4">
              Core Competencies
            </h2>
            <h3 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight">
              Strategic Pillars of Excellence
            </h3>
          </div>
          <p className="text-slate-500 text-sm sm:text-base md:text-lg">
            My methodology integrates operational rigor with human-centric design.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {pillars.map((pillar) => {
            const Icon = iconMap[pillar.icon] || Settings;
            return (
              <div
                key={pillar.title}
                className={`group p-8 rounded-xl border border-slate-200 transition-all cursor-pointer bg-background-muted ${pillar.borderHover || 'hover:border-primary'}`}
              >
                <div
                  className={`w-14 h-14 rounded-lg flex items-center justify-center mb-6 transition-all ${pillar.iconBg} ${pillar.hoverColor}`}
                >
                  <Icon className="w-7 h-7" />
                </div>
                <h4 className="text-xl font-bold mb-3">{pillar.title}</h4>
                <p className="text-slate-500 text-sm leading-relaxed">
                  {pillar.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
