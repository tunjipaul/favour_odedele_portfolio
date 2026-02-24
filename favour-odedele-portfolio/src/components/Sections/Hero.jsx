import { useEffect, useState } from 'react';

const FULL_NAME = 'FAVOR ODEDELE';
const BIO_TEXT = 'Programs Manager specializing in Education, Entrepreneurship, and Human Capacity Development.';
// Colors cycling per letter: army green, navy blue, purple
const LETTER_COLORS = ['#556b2f', '#1e3a5f', '#7c3aed'];

export default function Hero() {
  const [cardVisible, setCardVisible] = useState(false);
  const [typedCount, setTypedCount] = useState(0);
  const [cycleIndex, setCycleIndex] = useState(0);
  const [bioCount, setBioCount] = useState(0);
  const [bioVisible, setBioVisible] = useState(false);

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) element.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const dotPattern = {
    backgroundImage: 'radial-gradient(rgba(255,255,255,0.35) 1px, transparent 1px)',
    backgroundSize: '10px 10px',
  };

  useEffect(() => {
    // Step 1: card slides in after 200ms
    const cardTimer = setTimeout(() => setCardVisible(true), 200);
    return () => clearTimeout(cardTimer);
  }, []);

  useEffect(() => {
    if (!cardVisible) return;
    // Step 2: start typing letters after card appears (600ms delay)
    if (typedCount < FULL_NAME.length) {
      const t = setTimeout(() => setTypedCount((c) => c + 1), typedCount === 0 ? 600 : 80);
      return () => clearTimeout(t);
    }
  }, [cardVisible, typedCount]);

  useEffect(() => {
    if (typedCount < FULL_NAME.length) return;
    // Step 3: after name done, cycle colors every 800ms
    const t = setInterval(() => setCycleIndex((i) => i + 1), 800);
    // Step 4: start bio slide-in + typewriter after a short pause
    const bioDelay = setTimeout(() => setBioVisible(true), 300);
    return () => { clearInterval(t); clearTimeout(bioDelay); };
  }, [typedCount]);

  useEffect(() => {
    if (!bioVisible) return;
    if (bioCount < BIO_TEXT.length) {
      const t = setTimeout(() => setBioCount((c) => c + 1), 40); // slow: 40ms per char
      return () => clearTimeout(t);
    }
  }, [bioVisible, bioCount]);

  // Assign a color to each letter based on its index + cycleIndex
  const getLetterColor = (i) => {
    if (FULL_NAME[i] === ' ') return 'transparent';
    return LETTER_COLORS[(i + cycleIndex) % LETTER_COLORS.length];
  };

  const renderName = () =>
    FULL_NAME.split('').map((char, i) => {
      const visible = i < typedCount;
      if (char === ' ') return <span key={i} className="inline-block w-4" />;
      return (
        <span
          key={i}
          className="inline-block transition-colors duration-700"
          style={{
            color: visible ? getLetterColor(i) : 'transparent',
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0)' : 'translateY(20px)',
            transition: 'opacity 0.2s ease, transform 0.3s ease, color 0.7s ease',
          }}
        >
          {char}
        </span>
      );
    });

  return (
    <section className="relative w-full bg-[#948a66] overflow-hidden">

      {/* ── MOBILE LAYOUT (< lg) ── */}
      <div className="lg:hidden flex flex-col min-h-screen">
        <div className="bg-background-dark px-6 py-4 flex items-center justify-between">
          <div className="w-9 h-9 border-2 border-white flex items-center justify-center font-black text-lg text-white">F</div>
          <div className="flex gap-3">
            <button onClick={() => scrollToSection('case-studies')} className="text-[0.6rem] font-bold uppercase tracking-widest text-white/60 hover:text-white transition-colors">Work</button>
            <button onClick={() => scrollToSection('contact')} className="text-[0.6rem] font-bold uppercase tracking-widest text-accent-magenta hover:text-white transition-colors">Contact</button>
          </div>
        </div>
        <div className="relative w-full h-[55vw] min-h-[260px] max-h-[420px] overflow-hidden">
          <img src="/images/placeholder-hero.jpg" alt="Favor Odedele" className="w-full h-full object-cover object-top grayscale hover:grayscale-0 transition-all duration-700" />
          <div className="absolute inset-0 bg-linear-to-t from-[#948a66]/80 via-transparent to-transparent" />
          <h1 className="absolute bottom-2 left-4 font-black uppercase leading-[0.88]" style={{ fontSize: 'clamp(2.5rem, 12vw, 5rem)', letterSpacing: '-0.02em' }}>
            <span className="block" style={{ color: LETTER_COLORS[0] }}>FAVOR</span>
            <span className="block" style={{ color: LETTER_COLORS[1] }}>ODEDELE</span>
          </h1>
        </div>
        <div className="bg-[#948a66] px-6 py-8 flex flex-col gap-4">
          <p className="text-white text-sm font-medium leading-relaxed max-w-sm">Programs Manager specializing in Education, Entrepreneurship, and Human Capacity Development.</p>
          <div className="flex gap-3 flex-wrap">
            <a href="/cv.pdf" download className="inline-block bg-white text-background-dark px-5 py-2 text-xs font-bold uppercase tracking-widest hover:bg-accent-magenta hover:text-white transition-all duration-300">Download CV</a>
            <button onClick={() => scrollToSection('case-studies')} className="inline-block border border-white/60 text-white px-5 py-2 text-xs font-bold uppercase tracking-widest hover:bg-white/10 transition-all duration-300">View Work</button>
          </div>
        </div>
        <div className="bg-background-dark h-8 mt-auto" />
      </div>

      {/* ── DESKTOP LAYOUT (≥ lg) ── */}
      <div className="hidden lg:flex items-center justify-center py-8 px-8">
        {/* Hero Card — slides up on load */}
        <div
          className="relative w-full max-w-6xl aspect-[16/10] bg-[#948a66] shadow-2xl overflow-hidden flex flex-row rounded-[20px]"
          style={{
            opacity: cardVisible ? 1 : 0,
            transform: cardVisible ? 'translateY(0)' : 'translateY(40px)',
            transition: 'opacity 0.7s ease, transform 0.7s ease',
          }}
        >
          {/* Left Sidebar */}
          <aside className="w-1/4 bg-background-dark relative z-20 flex flex-col justify-between py-12 px-8 text-white shrink-0">
            <div>
              <div className="w-10 h-10 border-2 border-white flex items-center justify-center font-black text-xl">F</div>
            </div>
            <div />
            {/* Decorative dots */}
            <div className="absolute bottom-4 -right-10 w-24 h-24 opacity-40 pointer-events-none" style={dotPattern} />
          </aside>

          {/* Main Content */}
          <section className="flex-1 relative flex items-center overflow-hidden">

            {/* Animated FAVOR ODEDELE headline */}
            <div className="absolute left-[-5%] z-30 pointer-events-none w-full">
              <h1
                className="font-black uppercase flex flex-col leading-[0.88]"
                style={{ fontSize: 'clamp(3rem, 8vw, 7rem)', letterSpacing: '-0.02em' }}
              >
                {/* Render as two lines by splitting at the space */}
                <span className="flex">
                  {FULL_NAME.split(' ')[0].split('').map((char, i) => {
                    const globalIdx = i;
                    const visible = globalIdx < typedCount;
                    return (
                      <span
                        key={i}
                        className="inline-block"
                        style={{
                          color: visible ? getLetterColor(globalIdx) : 'transparent',
                          opacity: visible ? 1 : 0,
                          transform: visible ? 'translateY(0)' : 'translateY(20px)',
                          transition: 'opacity 0.2s ease, transform 0.3s ease, color 0.7s ease',
                        }}
                      >
                        {char}
                      </span>
                    );
                  })}
                </span>
                <span className="flex">
                  {FULL_NAME.split(' ')[1].split('').map((char, i) => {
                    const globalIdx = FULL_NAME.split(' ')[0].length + 1 + i;
                    const visible = globalIdx < typedCount;
                    return (
                      <span
                        key={i}
                        className="inline-block"
                        style={{
                          color: visible ? getLetterColor(globalIdx) : 'transparent',
                          opacity: visible ? 1 : 0,
                          transform: visible ? 'translateY(0)' : 'translateY(20px)',
                          transition: 'opacity 0.2s ease, transform 0.3s ease, color 0.7s ease',
                        }}
                      >
                        {char}
                      </span>
                    );
                  })}
                </span>
              </h1>
            </div>

            {/* Right: bio + portrait */}
            <div className="ml-auto w-full h-full flex flex-col justify-center items-end pr-12 relative">
              {/* Bio + CTA */}
              <div
                className="z-40 text-right max-w-xs mb-32"
                style={{
                  opacity: bioVisible ? 1 : 0,
                  transform: bioVisible ? 'translateY(0)' : 'translateY(16px)',
                  transition: 'opacity 0.6s ease, transform 0.6s ease',
                }}
              >
                <p className="text-white text-sm font-medium leading-relaxed mb-6 min-h-[4rem]">
                  {BIO_TEXT.slice(0, bioCount)}
                  {bioCount < BIO_TEXT.length && (
                    <span className="inline-block w-0.5 h-4 bg-white ml-0.5 animate-blink align-middle" />
                  )}
                </p>
                <a
                  href="/cv.pdf"
                  download
                  className="inline-block bg-white text-background-dark px-6 py-2 text-xs font-bold uppercase tracking-widest hover:bg-accent-magenta hover:text-white transition-all duration-300"
                >
                  Download CV
                </a>
              </div>

              {/* Portrait */}
              <div className="absolute bottom-0 right-0 w-[70%] h-[90%] z-10 overflow-hidden">
                <img
                  src="/images/placeholder-hero.jpg"
                  alt="Favor Odedele — Programs Manager"
                  className="w-full h-full object-cover object-top grayscale hover:grayscale-0 transition-all duration-700"
                />
              </div>

              {/* Decorative dots */}
              <div className="absolute bottom-20 -right-2 w-28 h-36 opacity-35 z-20 pointer-events-none" style={dotPattern} />

              {/* Prev / Next arrows */}
              <div className="absolute bottom-10 right-10 flex gap-2 z-40">
                <button onClick={() => scrollToSection('expertise')} className="w-9 h-9 border border-white/50 text-white flex items-center justify-center hover:bg-white/20 transition-colors" aria-label="Previous">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M15 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} /></svg>
                </button>
                <button onClick={() => scrollToSection('contact')} className="w-9 h-9 border border-white/50 text-white flex items-center justify-center hover:bg-white/20 transition-colors" aria-label="Next">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} /></svg>
                </button>
              </div>
            </div>

            {/* Bottom dark bar */}
            <div className="absolute bottom-0 left-0 right-0 h-8 bg-background-dark z-30" />
          </section>
        </div>
      </div>
    </section>
  );
}
