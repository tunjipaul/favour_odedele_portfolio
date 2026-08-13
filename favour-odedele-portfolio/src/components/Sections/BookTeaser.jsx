import { useEffect, useRef, useState } from 'react';
import { BookOpen, Download, Mail, Sparkles } from 'lucide-react';
import useStore from '../../store/useStore';
import Modal from '../UI/Modal';
import { API_BASE_URL } from '../../config.js';
import { DEFAULT_BOOK_SETTINGS, normalizeBookSettings } from '../../data/bookSettings.js';

export default function BookTeaser() {
  const { isWaitlistOpen, toggleWaitlist } = useStore();
  const [book, setBook] = useState(DEFAULT_BOOK_SETTINGS);
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [confirmationMessage, setConfirmationMessage] = useState('');
  const [confirmationVisible, setConfirmationVisible] = useState(false);
  const [coverLoaded, setCoverLoaded] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.15 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!confirmationMessage) {
      setConfirmationVisible(false);
      return undefined;
    }

    setConfirmationVisible(true);
    const fadeTimer = setTimeout(() => setConfirmationVisible(false), 3500);
    const clearTimer = setTimeout(() => setConfirmationMessage(''), 4000);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(clearTimer);
    };
  }, [confirmationMessage]);

  useEffect(() => {
    let active = true;
    fetch(`${API_BASE_URL}/settings`)
      .then((res) => res.json())
      .then((data) => {
        if (active) setBook(normalizeBookSettings(data?.book));
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    setSubmitError('');
    setConfirmationMessage('');

    try {
      const response = await fetch(`${API_BASE_URL}/waitlist`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.message || 'Something went wrong.');
      setEmail('');
      setConfirmationMessage(data.message || 'You are on the list.');
    } catch (error) {
      setSubmitError(error.message || 'Something went wrong.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const coverUrl = book.coverUrl || '/images/placeholder-audacity.jpg';
  const paragraphs = (book.teaser || DEFAULT_BOOK_SETTINGS.teaser)
    .split('\n')
    .filter((line) => line.trim());

  return (
    <section ref={sectionRef} className="py-16 sm:py-20 lg:py-28 bg-white overflow-hidden" id="book">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-[0.9fr_1.1fr] gap-10 lg:gap-16 items-center">
          {/* ── 3D Realistic Book ── */}
          <div
            className={`relative mx-auto w-full max-w-xs flex items-center justify-center transition-all duration-1000 ease-out ${
              isVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-8 scale-95'
            }`}
            style={{ perspective: '1200px' }}
          >
            {/* Soft ambient glow behind the book */}
            <div className="absolute -inset-8 rounded-full bg-primary/10 blur-3xl" />

            <div className="book-3d relative" style={{ transformStyle: 'preserve-3d' }}>
              {/* Front Cover */}
              <div
                className="book-cover relative rounded-r-lg overflow-hidden shadow-2xl"
                style={{
                  width: '260px',
                  height: '370px',
                  transformStyle: 'preserve-3d',
                  transform: 'rotateY(-12deg)',
                  borderRadius: '3px 12px 12px 3px',
                }}
              >
                {/* Skeleton while cover loads */}
                {!coverLoaded && (
                  <div className="absolute inset-0 bg-slate-200 animate-pulse">
                    <div
                      className="absolute inset-0"
                      style={{
                        background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.5) 50%, transparent 100%)',
                        backgroundSize: '200% 100%',
                        animation: 'skeletonShimmer 1.5s ease-in-out infinite',
                      }}
                    />
                  </div>
                )}
                <img
                  src={coverUrl}
                  alt={`${book.title} cover`}
                  onLoad={() => setCoverLoaded(true)}
                  className={`w-full h-full object-cover transition-opacity duration-500 ${coverLoaded ? 'opacity-100' : 'opacity-0'}`}
                />
                {/* Cover gloss effect */}
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background: 'linear-gradient(135deg, rgba(255,255,255,0.25) 0%, transparent 40%, transparent 60%, rgba(255,255,255,0.08) 100%)',
                  }}
                />
              </div>

              {/* Book Spine */}
              <div
                className="absolute top-0 left-0"
                style={{
                  width: '40px',
                  height: '370px',
                  transform: 'rotateY(90deg) translateZ(0px) translateX(-20px)',
                  transformOrigin: 'left center',
                  background: 'linear-gradient(to right, #2c1810, #3d2317, #2c1810)',
                  borderRadius: '3px 0 0 3px',
                  boxShadow: 'inset -2px 0 4px rgba(0,0,0,0.3)',
                }}
              >
                {/* Spine title text */}
                <div
                  className="absolute inset-0 flex items-center justify-center"
                  style={{
                    writingMode: 'vertical-rl',
                    textOrientation: 'mixed',
                  }}
                >
                  <span className="text-white/80 text-xs font-bold tracking-[0.2em] uppercase rotate-180">
                    {book.title}
                  </span>
                </div>
              </div>

              {/* Page Edges (visible from the right side) */}
              <div
                className="absolute top-[3px] right-[-18px]"
                style={{
                  width: '18px',
                  height: '364px',
                  transform: 'rotateY(0deg)',
                  background: `
                    repeating-linear-gradient(
                      to bottom,
                      #f5f0e8 0px,
                      #f5f0e8 1px,
                      #e8e0d4 1px,
                      #e8e0d4 2px
                    )
                  `,
                  borderRadius: '0 2px 2px 0',
                  boxShadow: 'inset -3px 0 5px rgba(0,0,0,0.08), 2px 0 4px rgba(0,0,0,0.1)',
                }}
              />

              {/* Page Edges (visible from the bottom) */}
              <div
                className="absolute bottom-[-8px] left-[4px]"
                style={{
                  width: '252px',
                  height: '8px',
                  background: `
                    repeating-linear-gradient(
                      to right,
                      #f5f0e8 0px,
                      #f5f0e8 1px,
                      #e8e0d4 1px,
                      #e8e0d4 2px
                    )
                  `,
                  borderRadius: '0 0 2px 2px',
                  boxShadow: '0 3px 6px rgba(0,0,0,0.15)',
                }}
              />

              {/* Drop shadow underneath the book */}
              <div
                className="absolute -bottom-6 left-1/2 -translate-x-1/2"
                style={{
                  width: '220px',
                  height: '20px',
                  background: 'radial-gradient(ellipse at center, rgba(0,0,0,0.2) 0%, transparent 70%)',
                  filter: 'blur(4px)',
                }}
              />
            </div>
          </div>

          {/* ── Book Info / Author's Note ── */}
          <div className="space-y-6">
            <div
              className={`transition-all duration-700 ease-out ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent-magenta/10 border border-accent-magenta/20 text-accent-magenta font-black tracking-[0.25em] uppercase text-xs mb-3">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Author&apos;s Note</span>
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-normal leading-snug text-slate-900">
                {book.title || 'Becoming the 1%'}
              </h2>
            </div>

            {/* Story text with left editorial accent line and staggered fade-up */}
            <div className="border-l-2 border-primary/25 pl-4 sm:pl-6 space-y-3.5 max-w-2xl text-justify [text-align-last:left] [hyphens:auto]">
              {paragraphs.map((paragraph, index) => {
                const isFirst = index === 0;
                return (
                  <p
                    key={index}
                    style={{ transitionDelay: `${index * 90 + 150}ms` }}
                    className={`transition-all duration-700 ease-out text-justify [text-align-last:left] [hyphens:auto] ${
                      isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                    } ${
                      isFirst
                        ? 'text-base sm:text-lg font-medium text-slate-800 leading-relaxed'
                        : 'text-sm sm:text-base leading-relaxed text-slate-600'
                    }`}
                  >
                    {paragraph}
                  </p>
                );
              })}
            </div>

            {/* CTAs with entrance delay */}
            <div
              style={{ transitionDelay: `${paragraphs.length * 90 + 200}ms` }}
              className={`flex flex-col sm:flex-row gap-4 pt-3 transition-all duration-700 ease-out ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
            >
              <a
                href={book.purchaseUrl || book.pdfUrl || '#'}
                target={book.purchaseUrl || book.pdfUrl ? '_blank' : undefined}
                rel={book.purchaseUrl || book.pdfUrl ? 'noreferrer' : undefined}
                aria-disabled={!book.purchaseUrl && !book.pdfUrl}
                className={`inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3 text-sm font-black uppercase tracking-widest transition shadow-sm hover:shadow-md ${
                  book.purchaseUrl || book.pdfUrl
                    ? 'bg-slate-900 text-white hover:bg-slate-700 hover:text-slate-100 active:scale-[0.98]'
                    : 'bg-slate-100 text-slate-400 pointer-events-none'
                }`}
              >
                <Download className="w-4 h-4" /> Get Book
              </a>
              <button
                type="button"
                onClick={toggleWaitlist}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-accent-magenta px-6 py-3 text-sm font-black uppercase tracking-widest text-white shadow-sm hover:bg-accent-magenta/90 hover:shadow-md active:scale-[0.98] transition-all"
              >
                <Mail className="w-4 h-4" /> Join the waitlist
              </button>
            </div>
          </div>
        </div>
      </div>

      <Modal isOpen={isWaitlistOpen} onClose={toggleWaitlist} title="Get book updates">
        <div className="space-y-6">
          <p className="text-slate-600 leading-relaxed">
            Be first to know when <strong>{book.title}</strong> is available and receive early updates from Favour.
          </p>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="Enter your email address"
              required
              className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
            {submitError && <p className="text-sm text-red-600 font-medium">{submitError}</p>}
            {confirmationMessage && (
              <p
                className={`text-sm text-emerald-700 font-medium transition-opacity duration-500 ${
                  confirmationVisible ? 'opacity-100' : 'opacity-0'
                }`}
              >
                {confirmationMessage}
              </p>
            )}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-primary hover:bg-primary-dark disabled:opacity-60 disabled:cursor-not-allowed text-white py-3 rounded-xl font-bold transition-all"
            >
              {isSubmitting ? 'Submitting...' : 'Notify Me'}
            </button>
          </form>
        </div>
      </Modal>
    </section>
  );
}



