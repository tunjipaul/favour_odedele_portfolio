import { Settings, Handshake, GraduationCap, BarChart3 } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

const API = 'http://localhost:5000/api';

// Map icon name strings (stored in MongoDB) → actual Lucide components
const iconMap = { Settings, Handshake, GraduationCap, BarChart3 };

// Fallback — shown if the API is unreachable
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
  const sectionRef = useRef(null);
  const headerRef = useRef(null);
  const cardsRef = useRef([]);
  const iconsRef = useRef([]);
  const [pillars, setPillars] = useState(fallbackPillars); // fallback until API responds

  // Fetch live expertise data — falls back to hardcoded if API fails
  useEffect(() => {
    fetch(`${API}/expertise`)
      .then((res) => res.json())
      .then((data) => { if (Array.isArray(data) && data.length) setPillars(data); })
      .catch(() => {});
  }, []);

  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -100px 0px',
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('reveal-visible');
        }
      });
    }, observerOptions);

    // Observe header
    if (headerRef.current) {
      observer.observe(headerRef.current);
    }

    // Priority cards (0 and 3) - Operational Excellence and Scalable Impact
    const priorityIndices = [0, 3];
    const otherIndices = [1, 2];

    // Stage 1: Icons for priority cards pop first (0ms delay)
    priorityIndices.forEach((index) => {
      if (iconsRef.current[index]) {
        iconsRef.current[index].style.transitionDelay = '0ms';
        observer.observe(iconsRef.current[index]);
      }
    });

    // Stage 2: Full cards for priority cards appear (300ms after icons)
    priorityIndices.forEach((index) => {
      if (cardsRef.current[index]) {
        cardsRef.current[index].style.transitionDelay = '300ms';
        observer.observe(cardsRef.current[index]);
      }
    });

    // Stage 3: Other cards appear (600ms base + stagger)
    otherIndices.forEach((index, staggerIndex) => {
      if (iconsRef.current[index]) {
        iconsRef.current[index].style.transitionDelay = `${600 + staggerIndex * 150}ms`;
        observer.observe(iconsRef.current[index]);
      }
      if (cardsRef.current[index]) {
        cardsRef.current[index].style.transitionDelay = `${900 + staggerIndex * 150}ms`;
        observer.observe(cardsRef.current[index]);
      }
    });

    return () => observer.disconnect();
  }, []);

  return (
    <section className="py-12 sm:py-16 md:py-20 lg:py-24 bg-white" id="expertise" ref={sectionRef}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div 
          ref={headerRef}
          className="flex flex-col md:flex-row md:items-end justify بین mb-8 sm:mb-12 md:mb-16 gap-4 sm:gap-6 reveal-element"
        >
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

        {/* Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {pillars.map((pillar, index) => {
            const Icon = iconMap[pillar.icon] || Settings; // resolve string → component
            return (
              <div
                key={pillar.title}
                ref={(el) => (cardsRef.current[index] = el)}
                className={`reveal-element group p-8 rounded-xl border border-slate-200 transition-all cursor-pointer bg-background-muted ${pillar.borderHover || 'hover:border-primary'}`}
              >
                <div
                  ref={(el) => (iconsRef.current[index] = el)}
                  className={`reveal-element reveal-icon w-14 h-14 rounded-lg flex items-center justify-center mb-6 transition-all ${pillar.iconBg} ${pillar.hoverColor}`}
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
