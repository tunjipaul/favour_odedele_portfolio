import { Mail, Linkedin, CalendarDays, Podcast, Star } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { API_BASE_URL } from '../../config.js';

const FULL_TEXT = "Let's Build the Future of Learning";
const API = API_BASE_URL;

const DEFAULT_CONTACTS = {
  email: 'favor@example.com',
  linkedIn: '',
  bookCall: '',
  substack: '',
  twitter: 'https://x.com',
};

export default function Footer() {
  const footerRef = useRef(null);
  const [displayedText, setDisplayedText] = useState('');
  const [hasAnimated, setHasAnimated] = useState(false);
  const [contacts, setContacts] = useState(DEFAULT_CONTACTS);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimated) {
            setHasAnimated(true);
            startTypewriter();
          }
        });
      },
      { threshold: 0.4 }
    );

    if (footerRef.current) observer.observe(footerRef.current);
    return () => observer.disconnect();
  }, [hasAnimated]);

  const startTypewriter = () => {
    let i = 0;
    // Small random delay per character to feel like real typing
    const type = () => {
      if (i <= FULL_TEXT.length) {
        setDisplayedText(FULL_TEXT.slice(0, i));
        i++;
        // Vary speed: faster in middle, slight pause at spaces
        const char = FULL_TEXT[i - 1];
        const delay = char === ' ' ? 80 : Math.random() * 40 + 40;
        setTimeout(type, delay);
      }
    };
    type();
  };

  // Split text to highlight "Learning" in primary color
  const beforeLearning = displayedText.includes('Learning')
    ? displayedText.slice(0, displayedText.indexOf('Learning'))
    : displayedText;
  const learningPart = displayedText.includes('Learning') ? 'Learning' : '';

  useEffect(() => {
    fetch(`${API}/settings`)
      .then((res) => res.json())
      .then((data) => {
        const footer = data?.footer || {};
        setContacts({
          email: footer.email || DEFAULT_CONTACTS.email,
          linkedIn: footer.linkedIn || DEFAULT_CONTACTS.linkedIn,
          bookCall: footer.bookCall || DEFAULT_CONTACTS.bookCall,
          substack: footer.substack || DEFAULT_CONTACTS.substack,
          twitter: footer.twitter || DEFAULT_CONTACTS.twitter,
        });
      })
      .catch(() => {});
  }, []);

  const mailHref = contacts.email ? `mailto:${contacts.email}` : 'mailto:favor@example.com';
  const linkedInHref = contacts.linkedIn || '#';
  const bookCallHref = contacts.bookCall || '#';
  const twitterHref = contacts.twitter || '#';
  const substackHref = contacts.substack || '#';

  return (
    <footer className="border-t border-slate-200 pt-12 sm:pt-16 md:pt-20 lg:pt-24 pb-8 sm:pb-12 bg-background-muted" id="contact" ref={footerRef}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* CTA Section */}
        <div className="text-center mb-12 sm:mb-16 md:mb-20">
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black mb-2 tracking-tighter min-h-[1.2em]">
            {beforeLearning}
            {learningPart && (
              <span className="text-primary">{learningPart}</span>
            )}
            {/* Blinking cursor while typing */}
            {displayedText.length < FULL_TEXT.length && (
              <span className="inline-block w-[3px] h-[0.85em] bg-primary ml-1 align-middle animate-blink" />
            )}
          </h2>

          {/* Infinite moving underline — always visible once heading starts */}
          {displayedText.length > 0 && (
            <div className="relative h-[3px] w-full max-w-2xl mx-auto mb-8 sm:mb-10 md:mb-12 overflow-hidden rounded-full bg-slate-200">
              <div className="absolute inset-y-0 w-1/3 bg-primary rounded-full animate-loading-bar" />
            </div>
          )}

          <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-3 sm:gap-4 md:gap-6">
            <a
              href={mailHref}
              className="flex items-center justify-center gap-3 px-6 sm:px-8 py-3 sm:py-4 bg-slate-900 text-white rounded-2xl hover:scale-105 transition-all shadow-xl"
            >
              <Mail className="w-5 h-5" />
              <span className="font-bold">Email Me</span>
            </a>
            <a
              href={linkedInHref}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-3 px-6 sm:px-8 py-3 sm:py-4 bg-primary text-white rounded-2xl hover:scale-105 transition-all shadow-xl"
            >
              <Linkedin className="w-5 h-5" />
              <span className="font-bold">LinkedIn</span>
            </a>
            <a
              href={bookCallHref}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-3 px-6 sm:px-8 py-3 sm:py-4 bg-accent-magenta text-white rounded-2xl hover:scale-105 transition-all shadow-xl"
            >
              <CalendarDays className="w-5 h-5" />
              <span className="font-bold">Book a Call</span>
            </a>
            <a
              href={twitterHref}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-3 px-6 sm:px-8 py-3 sm:py-4 bg-slate-700 text-white rounded-2xl hover:scale-105 transition-all shadow-xl"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.259 5.63 5.905-5.63zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
              <span className="font-bold">Twitter</span>
            </a>
            <a
              href={substackHref}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-3 px-6 sm:px-8 py-3 sm:py-4 bg-accent-green text-white rounded-2xl hover:scale-105 transition-all shadow-xl"
            >
              <Podcast className="w-5 h-5" />
              <span className="font-bold">Substack</span>
            </a>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col items-center justify-center border-t border-slate-200 pt-8 sm:pt-12 gap-6 sm:gap-8">
          <div className="flex items-center gap-3 opacity-60">
            <div className="w-8 h-8 bg-slate-400 rounded flex items-center justify-center text-white">
              <Star className="w-4 h-4 fill-current" />
            </div>
            <span className="font-black uppercase tracking-widest text-xs group cursor-default">
              <span className="transition-colors duration-300 hover:text-primary">Favor</span>
              {' '}
              <span className="transition-colors duration-300 hover:text-accent-magenta">Odedele</span>
              {' '}<span className="transition-colors duration-300 hover:text-[#1e3a5f]">© {new Date().getFullYear()}</span>
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
