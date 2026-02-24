import { useEffect, useRef, useState } from 'react';

const API = 'http://localhost:5000/api';

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
  const [counts, setCounts] = useState([0, 0, 0]);
  const [hasAnimated, setHasAnimated] = useState(false);
  const [showValues, setShowValues] = useState([false, false, false]);

  // Fetch live metrics — falls back to hardcoded if API is unreachable
  useEffect(() => {
    fetch(`${API}/metrics`)
      .then((res) => res.json())
      .then((data) => { if (Array.isArray(data) && data.length) setMetrics(data); })
      .catch(() => {});
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
  }, [hasAnimated]);

  const startAnimation = () => {
    // Stage 1: Fade in numbers 01, 02, 03 with stagger
    numberRefs.current.forEach((ref, index) => {
      if (ref) {
        setTimeout(() => {
          ref.classList.add('reveal-visible');
        }, index * 200); // 200ms stagger
      }
    });

    // Stage 2: Show "Multi" first (after all numbers are visible)
    setTimeout(() => {
      setShowValues([false, false, true]); // Show "Multi" immediately
    }, 600); // After 01, 02, 03 are visible

    // Stage 3: Start counting for 10k+ and 20+ (after Multi appears)
    setTimeout(() => {
      animateCounters();
    }, 900); // 300ms after Multi appears
  };

  const animateCounters = () => {
    const duration = 2000; // 2 seconds
    const frameRate = 1000 / 60; // 60fps
    const totalFrames = Math.round(duration / frameRate);
    let frame = 0;

    const counter = setInterval(() => {
      frame++;
      const progress = easeOutQuart(frame / totalFrames);

      setCounts([
        Math.round(progress * metrics[0].targetValue), // 10000
        Math.round(progress * metrics[1].targetValue), // 20
        0, // Multi doesn't count
      ]);

      // Show values as they start counting
      if (frame === 1) {
        setShowValues([true, true, true]);
      }

      if (frame === totalFrames) {
        clearInterval(counter);
      }
    }, frameRate);
  };

  const formatValue = (index) => {
    if (!showValues[index]) return '';

    if (index === 0) {
      // 10k+ format
      const val = counts[0];
      if (val >= 10000) return '10k+';
      if (val >= 1000) return `${Math.floor(val / 1000)}k+`;
      return `${val}+`;
    } else if (index === 1) {
      // 20+ format
      return `${counts[1]}+`;
    } else {
      // Multi - static text
      return 'Multi';
    }
  };

  return (
    <section ref={sectionRef} className="py-8 sm:py-10 md:py-12 bg-primary-dark" id="impact">
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
