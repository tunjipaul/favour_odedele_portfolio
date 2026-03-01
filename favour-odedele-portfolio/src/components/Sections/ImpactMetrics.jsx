import { useEffect, useRef, useState } from 'react';
import { API_BASE_URL } from '../../config.js';

const API = API_BASE_URL;

// Fallback data — shown if the API is unreachable
const fallbackMetrics = [
  { number: '01', value: '10k+', label: 'Lives Impacted', targetValue: 10000 },
  { number: '02', value: '20+', label: 'Global Contributors', targetValue: 20 },
  { number: '03', value: 'Multi', label: 'Country Oversight', targetValue: null },
];

// Easing function for smooth animation
const easeOutQuart = (t) => 1 - Math.pow(1 - t, 4);

export default function ImpactMetrics() {
  const sectionRef = useRef(null);
  const numberRefs = useRef([]);
  const [metrics, setMetrics] = useState(fallbackMetrics); // fallback until API responds
  const [counts, setCounts] = useState(fallbackMetrics.map(() => 0));
  const [hasAnimated, setHasAnimated] = useState(false);
  const [showValues, setShowValues] = useState(fallbackMetrics.map(() => false));

  // Fetch live metrics — falls back to hardcoded if API is unreachable
  useEffect(() => {
    fetch(`${API}/metrics`)
      .then((res) => res.json())
      .then((data) => { 
        if (Array.isArray(data) && data.length) {
          setMetrics(data);
          setCounts(data.map(() => 0));
          setShowValues(data.map(() => false));
        } 
      })
      .catch((err) => console.error('Failed to fetch metrics', err));
  }, []);

  useEffect(() => {
    const observerOptions = {
      threshold: 0.5,
      rootMargin: '0px',
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          startAnimation();
        }
      });
    }, observerOptions);

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, [hasAnimated, metrics]); // re-run if metrics change before animation

  const startAnimation = () => {
    // Stage 1: Fade in numbers 01, 02, 03 with stagger
    numberRefs.current.forEach((ref, index) => {
      if (ref) {
        setTimeout(() => {
          ref.classList.add('reveal-visible');
        }, index * 200); // 200ms stagger
      }
    });

    // Stage 2: Show static values first (metrics where targetValue is null)
    setTimeout(() => {
      setShowValues(prev => prev.map((val, idx) => metrics[idx].targetValue === null ? true : val));
    }, 600);

    // Stage 3: Start counting for dynamic values
    setTimeout(() => {
      animateCounters();
    }, 900);
  };

  const animateCounters = () => {
    const duration = 2000; // 2 seconds
    const frameRate = 1000 / 60; // 60fps
    const totalFrames = Math.round(duration / frameRate);
    let frame = 0;

    const counter = setInterval(() => {
      frame++;
      const progress = easeOutQuart(frame / totalFrames);

      setCounts(metrics.map((m, idx) => {
        if (m.targetValue === null) return 0;
        return Math.round(progress * m.targetValue);
      }));

      // Show values as they start counting
      if (frame === 1) {
        setShowValues(metrics.map(() => true));
      }

      if (frame === totalFrames) {
        clearInterval(counter);
      }
    }, frameRate);
  };

  const formatValue = (index) => {
    if (!showValues[index]) return '';
    const metric = metrics[index];
    if (!metric) return '';

    // If static text
    if (metric.targetValue === null || metric.targetValue === undefined) {
      return metric.value;
    }

    const val = counts[index];
    const target = metric.targetValue;
    
    // If finished, show the display value from DB (which might have "+" or "k")
    if (val >= target) return metric.value;

    // During animation, try to be smart about the suffix
    const suffix = metric.value.replace(/[0-9]/g, '');
    
    if (metric.value.toLowerCase().includes('k')) {
      if (val >= 1000) return `${Math.floor(val / 1000)}k${suffix.replace('k', '')}`;
      return `${val}${suffix.replace('k', '')}`;
    }

    return `${val}${suffix}`;
  };

  return (
    <section ref={sectionRef} className="py-6 sm:py-8 bg-primary-dark" id="impact">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-10 md:gap-12 text-white">
        {metrics.map((metric, index) => (
          <div
            key={metric.number}
            className={`flex items-center gap-4 sm:gap-6 ${
              index === 1
                ? 'border-y md:border-y-0 md:border-x border-white/20 py-6 sm:py-8 md:py-0 md:px-8 lg:px-12'
                : ''
            }`}
          >
            <span
              ref={(el) => (numberRefs.current[index] = el)}
              className="reveal-element text-4xl sm:text-5xl font-black text-white/40 tabular-nums"
            >
              {metric.number}
            </span>
            <div>
              <div className="text-3xl sm:text-4xl font-black mb-1 min-h-[2.5rem] sm:min-h-[3rem] tabular-nums">
                {formatValue(index)}
              </div>
              <div className="text-xs sm:text-sm font-bold uppercase tracking-widest text-white/80">
                {metric.label}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
