import { useEffect, useState } from 'react';
import { ArrowDown, BookOpen, Users } from 'lucide-react';
import { API_BASE_URL } from '../../config.js';

const FALLBACK_NAME = 'FAVOUR ODEDELE';
const FALLBACK_BIO = 'Author, community builder, and future social entrepreneur writing about education, leadership, entrepreneurship, and personal growth.';
const FALLBACK_PORTRAIT = '/images/placeholder-hero.jpg';
const LETTER_COLORS = ['#556b2f', '#1e3a5f', '#7c3aed'];

export default function Hero() {
  const [settings, setSettings] = useState({
    fullName: FALLBACK_NAME,
    bioText: FALLBACK_BIO,
    portrait: FALLBACK_PORTRAIT,
  });
  const [cardVisible, setCardVisible] = useState(false);
  const [typedCount, setTypedCount] = useState(0);
  const [cycleIndex, setCycleIndex] = useState(0);

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (!element) return;
    const header = document.querySelector('header');
    const offset = header ? header.offsetHeight : 0;
    const bodyRect = document.body.getBoundingClientRect().top;
    const elementRect = element.getBoundingClientRect().top;
    window.scrollTo({ top: elementRect - bodyRect - offset, behavior: 'smooth' });
  };

  useEffect(() => {
    let active = true;
    fetch(`${API_BASE_URL}/settings`)
      .then((response) => response.json())
      .then((data) => {
        if (!active) return;
        if (data?.hero) {
          setSettings({
            fullName: data.hero.fullName || FALLBACK_NAME,
            bioText: data.hero.bioText || FALLBACK_BIO,
            portrait: data.hero.portrait || FALLBACK_PORTRAIT,
          });
        }
      })
      .catch(() => {});

    const cardTimer = setTimeout(() => setCardVisible(true), 200);
    return () => {
      active = false;
      clearTimeout(cardTimer);
    };
  }, []);

  const fullName = settings.fullName.toUpperCase();

  useEffect(() => {
    if (!cardVisible) return;
    if (typedCount < fullName.length) {
      const timer = setTimeout(() => setTypedCount((count) => count + 1), typedCount === 0 ? 500 : 70);
      return () => clearTimeout(timer);
    }
  }, [cardVisible, typedCount, fullName.length]);

  useEffect(() => {
    if (typedCount < fullName.length) return;
    const timer = setInterval(() => setCycleIndex((index) => index + 1), 900);
    return () => clearInterval(timer);
  }, [typedCount, fullName.length]);

  const getLetterColor = (index) => {
    if (fullName[index] === ' ') return 'transparent';
    return LETTER_COLORS[(index + cycleIndex) % LETTER_COLORS.length];
  };

  const renderNameLine = (lineText, startIndex) =>
    lineText.split('').map((char, index) => {
      const globalIndex = startIndex + index;
      const visible = globalIndex < typedCount;
      return (
        <span
          key={`${char}-${index}`}
          className="inline-block"
          style={{
            color: visible ? getLetterColor(globalIndex) : 'transparent',
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0)' : 'translateY(20px)',
            transition: 'opacity 0.2s ease, transform 0.3s ease, color 0.7s ease',
          }}
        >
          {char}
        </span>
      );
    });

  const [firstName = 'FAVOUR', lastName = 'ODEDELE'] = fullName.split(' ');

  return (
    <section className="relative w-full bg-[#948a66] overflow-hidden">
      <div className="lg:hidden flex flex-col">
        <div className="bg-background-dark px-6 py-4 flex items-center justify-between">
          <div className="w-9 h-9 border-2 border-white flex items-center justify-center font-black text-lg text-white">F</div>
          <div className="flex gap-3">
            <button onClick={() => scrollToSection('highlights')} className="text-[0.6rem] font-bold uppercase tracking-widest text-white/60 hover:text-white transition-colors">Highlights</button>
            <button onClick={() => scrollToSection('community')} className="text-[0.6rem] font-bold uppercase tracking-widest text-accent-magenta hover:text-white transition-colors">Community</button>
          </div>
        </div>
        <div className="relative w-full h-[55vw] min-h-[260px] max-h-[420px] overflow-hidden">
          <img src={settings.portrait} alt={settings.fullName} className="w-full h-full object-cover object-top max-lg:grayscale-0 lg:grayscale lg:hover:grayscale-0 transition-all duration-700" />
          <div className="absolute inset-0 bg-linear-to-t from-[#948a66]/80 via-transparent to-transparent" />
          <h1 className="absolute bottom-2 left-4 font-name font-bold leading-[0.88] flex flex-col" style={{ fontSize: 'clamp(2.5rem, 12vw, 5rem)' }}>
            <span className="flex">{renderNameLine(firstName, 0)}</span>
            <span className="flex">{renderNameLine(lastName, firstName.length + 1)}</span>
          </h1>
        </div>
        <div className="bg-[#948a66] px-6 pt-5 pb-8 flex flex-col gap-4">
          <p className="text-white text-sm font-medium leading-relaxed max-w-sm">{settings.bioText}</p>
          <div className="flex gap-3 flex-wrap">
            <button onClick={() => scrollToSection('community')} className="inline-flex items-center gap-2 bg-white text-background-dark px-5 py-2.5 text-xs font-bold uppercase tracking-widest hover:bg-accent-magenta hover:text-white transition-all duration-300 rounded-lg shadow-sm">
              <Users className="w-4 h-4" /> Join Community
            </button>
            <button onClick={() => scrollToSection('book')} className="inline-flex items-center gap-2 border border-white/60 text-white px-5 py-2.5 text-xs font-bold uppercase tracking-widest hover:bg-white/10 transition-all duration-300 rounded-lg">
              <BookOpen className="w-4 h-4" /> Book Updates
            </button>
          </div>
        </div>
      </div>

      <div className="hidden lg:flex items-center justify-center py-8 px-8">
        <div
          className="relative w-full max-w-6xl aspect-16/10 bg-[#948a66] overflow-hidden flex flex-row rounded-[20px]"
          style={{
            opacity: cardVisible ? 1 : 0,
            transform: cardVisible ? 'translateY(0)' : 'translateY(40px)',
            transition: 'opacity 0.7s ease, transform 0.7s ease',
          }}
        >
          <aside className="w-1/4 bg-background-dark relative z-20 flex flex-col justify-between py-12 px-8 text-white shrink-0">
            <div className="w-10 h-10 border-2 border-white flex items-center justify-center font-black text-xl">F</div>
            <button onClick={() => scrollToSection('about')} className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.3em] text-white/70 hover:text-white">
              <ArrowDown className="w-4 h-4" /> Start here
            </button>
          </aside>

          <section className="flex-1 relative flex items-center overflow-hidden">
            <div className="absolute left-[-5%] z-30 pointer-events-none w-full">
              <h1 className="font-name font-bold flex flex-col leading-[0.88]" style={{ fontSize: 'clamp(3rem, 8vw, 7rem)' }}>
                <span className="flex">{renderNameLine(firstName, 0)}</span>
                <span className="flex">{renderNameLine(lastName, firstName.length + 1)}</span>
              </h1>
            </div>

            <div className="ml-auto w-full h-full flex flex-col justify-end items-end pr-12 pb-20 relative">
              <div className="z-40 text-right max-w-sm">
                <p className="text-white text-base font-medium leading-relaxed mb-6">{settings.bioText}</p>
                <div className="inline-flex gap-3">
                  <button onClick={() => scrollToSection('community')} className="inline-flex items-center gap-2 bg-white text-background-dark px-6 py-3 text-xs font-bold uppercase tracking-widest hover:bg-accent-magenta hover:text-white transition-all duration-300">
                    <Users className="w-4 h-4" /> Join Community
                  </button>
                  <button onClick={() => scrollToSection('book')} className="inline-flex items-center gap-2 border border-white/60 text-white px-6 py-3 text-xs font-bold uppercase tracking-widest hover:bg-white/10 transition-all duration-300">
                    <BookOpen className="w-4 h-4" /> Book Updates
                  </button>
                </div>
              </div>

              <div className="absolute bottom-0 right-0 w-[70%] h-[90%] z-10 overflow-hidden">
                <img src={settings.portrait} alt={settings.fullName} className="w-full h-full object-cover object-top max-lg:grayscale-0 lg:grayscale lg:hover:grayscale-0 transition-all duration-700" />
              </div>
              <div className="absolute bottom-0 left-0 right-0 h-8 bg-background-dark z-30" />
            </div>
          </section>
        </div>
      </div>
    </section>
  );
}


