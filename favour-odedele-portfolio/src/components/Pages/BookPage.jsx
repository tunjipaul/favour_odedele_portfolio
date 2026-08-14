import { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Download, Mail, ArrowLeft, Sparkles, BookOpen, Star, Quote } from 'lucide-react';
import { API_BASE_URL } from '../../config.js';
import { DEFAULT_BOOK_SETTINGS, normalizeBookSettings } from '../../data/bookSettings.js';

/* ───────────────────────── Floating Particles ───────────────────────── */
function FloatingParticles() {
  const canvasRef = useRef(null);
  const animRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const particles = Array.from({ length: 50 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      radius: Math.random() * 2 + 0.5,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      opacity: Math.random() * 0.4 + 0.1,
    }));

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(212, 175, 55, ${p.opacity})`;
        ctx.fill();
      });
      animRef.current = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animRef.current);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      aria-hidden="true"
    />
  );
}

/* ───────────────────────── Main Book Page ───────────────────────── */
export default function BookPage() {
  const [book, setBook] = useState(DEFAULT_BOOK_SETTINGS);
  const [coverLoaded, setCoverLoaded] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [confirmationMessage, setConfirmationMessage] = useState('');
  const [confirmationVisible, setConfirmationVisible] = useState(false);
  const heroRef = useRef(null);

  // Fetch book data from backend
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

  // Entrance animation
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 150);
    return () => clearTimeout(timer);
  }, []);

  // Confirmation auto-dismiss
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

  const handleSubmit = useCallback(async (event) => {
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
      setConfirmationMessage(data.message || 'You are on the list!');
    } catch (error) {
      setSubmitError(error.message || 'Something went wrong.');
    } finally {
      setIsSubmitting(false);
    }
  }, [email]);

  const coverUrl = book.coverUrl || '/images/placeholder-audacity.jpg';
  const paragraphs = useMemo(
    () => (book.teaser || DEFAULT_BOOK_SETTINGS.teaser).split('\n').filter((line) => line.trim()),
    [book.teaser]
  );
  const hasDownloadLink = book.purchaseUrl || book.pdfUrl;

  return (
    <div className="min-h-screen bg-[#0c0f0a] text-white relative overflow-hidden">
      <FloatingParticles />

      {/* ── Subtle radial glow background ── */}
      <div
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          background:
            'radial-gradient(ellipse 80% 60% at 50% 30%, rgba(85,107,47,0.08) 0%, transparent 70%)',
        }}
      />

      {/* ── Back to Portfolio ── */}
      <nav className="relative z-10 px-4 sm:px-6 lg:px-8 py-5">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm text-white/50 hover:text-white/90 transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span className="tracking-wide uppercase font-medium">Portfolio</span>
          </Link>
          <div className="inline-flex items-center gap-1.5 text-white/30 text-xs tracking-[0.2em] uppercase">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Favour Odedele</span>
          </div>
        </div>
      </nav>

      {/* ── Hero Section ── */}
      <section ref={heroRef} className="relative z-10 px-4 sm:px-6 lg:px-8 pt-8 sm:pt-12 lg:pt-16 pb-16 sm:pb-20 lg:pb-28">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">

            {/* ── 3D Book Showcase ── */}
            <div
              className={`relative mx-auto w-full max-w-sm flex items-center justify-center transition-all duration-1000 ease-out ${
                isVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-12 scale-90'
              }`}
              style={{ perspective: '1400px' }}
            >
              {/* Large ambient glow */}
              <div
                className="absolute rounded-full"
                style={{
                  width: '400px',
                  height: '400px',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  background: 'radial-gradient(circle, rgba(212,175,55,0.12) 0%, rgba(85,107,47,0.06) 50%, transparent 70%)',
                  filter: 'blur(40px)',
                }}
              />

              <div className="book-3d relative" style={{ transformStyle: 'preserve-3d' }}>
                {/* Front Cover */}
                <div
                  className="book-cover relative rounded-r-lg overflow-hidden shadow-2xl"
                  style={{
                    width: '300px',
                    height: '430px',
                    transformStyle: 'preserve-3d',
                    transform: 'rotateY(-15deg)',
                    borderRadius: '3px 14px 14px 3px',
                  }}
                >
                  {/* Skeleton */}
                  {!coverLoaded && (
                    <div className="absolute inset-0 bg-white/5 animate-pulse">
                      <div
                        className="absolute inset-0"
                        style={{
                          background:
                            'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.08) 50%, transparent 100%)',
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
                    className={`w-full h-full object-cover transition-opacity duration-700 ${
                      coverLoaded ? 'opacity-100' : 'opacity-0'
                    }`}
                  />
                  {/* Gloss overlay */}
                  <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      background:
                        'linear-gradient(135deg, rgba(255,255,255,0.2) 0%, transparent 40%, transparent 60%, rgba(255,255,255,0.05) 100%)',
                    }}
                  />
                </div>

                {/* Book Spine */}
                <div
                  className="absolute top-0 left-0"
                  style={{
                    width: '45px',
                    height: '430px',
                    transform: 'rotateY(90deg) translateZ(0px) translateX(-22.5px)',
                    transformOrigin: 'left center',
                    background: 'linear-gradient(to right, #1a1208, #2c1810, #1a1208)',
                    borderRadius: '3px 0 0 3px',
                    boxShadow: 'inset -2px 0 6px rgba(0,0,0,0.4)',
                  }}
                >
                  <div
                    className="absolute inset-0 flex items-center justify-center"
                    style={{ writingMode: 'vertical-rl', textOrientation: 'mixed' }}
                  >
                    <span className="text-amber-200/60 text-xs font-bold tracking-[0.25em] uppercase rotate-180">
                      {book.title}
                    </span>
                  </div>
                </div>

                {/* Page Edges — Right */}
                <div
                  className="absolute top-[3px] right-[-20px]"
                  style={{
                    width: '20px',
                    height: '424px',
                    background: `repeating-linear-gradient(to bottom, #e8dcc8 0px, #e8dcc8 1px, #d4c8b0 1px, #d4c8b0 2px)`,
                    borderRadius: '0 3px 3px 0',
                    boxShadow: 'inset -3px 0 6px rgba(0,0,0,0.1), 2px 0 6px rgba(0,0,0,0.15)',
                  }}
                />

                {/* Page Edges — Bottom */}
                <div
                  className="absolute bottom-[-10px] left-[4px]"
                  style={{
                    width: '292px',
                    height: '10px',
                    background: `repeating-linear-gradient(to right, #e8dcc8 0px, #e8dcc8 1px, #d4c8b0 1px, #d4c8b0 2px)`,
                    borderRadius: '0 0 3px 3px',
                    boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
                  }}
                />

                {/* Drop shadow */}
                <div
                  className="absolute -bottom-8 left-1/2 -translate-x-1/2"
                  style={{
                    width: '280px',
                    height: '24px',
                    background: 'radial-gradient(ellipse at center, rgba(0,0,0,0.35) 0%, transparent 70%)',
                    filter: 'blur(6px)',
                  }}
                />
              </div>
            </div>

            {/* ── Book Info ── */}
            <div className="space-y-8">
              {/* Badge */}
              <div
                className={`transition-all duration-700 delay-200 ease-out ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
                }`}
              >
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-amber-500/20 bg-amber-500/5 text-amber-400 text-xs font-bold tracking-[0.3em] uppercase mb-4">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>The Book</span>
                </div>
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.1] text-white">
                  {book.title || 'Becoming the 1%'}
                </h1>
                <p className="mt-3 text-base text-white/40 tracking-wide">
                  by <span className="text-amber-400/70 font-medium">Favour Odedele</span>
                </p>
              </div>

              {/* Teaser text */}
              <div
                className={`transition-all duration-700 delay-[400ms] ease-out ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
                }`}
              >
                <div className="border-l-2 border-amber-500/30 pl-5 space-y-3 max-w-xl">
                  {paragraphs.map((paragraph, index) => (
                    <p
                      key={index}
                      className={`leading-relaxed ${
                        index === 0
                          ? 'text-base sm:text-lg text-white/80 font-medium'
                          : 'text-sm sm:text-base text-white/50'
                      }`}
                    >
                      {paragraph}
                    </p>
                  ))}
                </div>
              </div>

              {/* CTA Buttons */}
              <div
                className={`flex flex-col sm:flex-row gap-4 transition-all duration-700 delay-[600ms] ease-out ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
                }`}
              >
                <a
                  href={book.purchaseUrl || book.pdfUrl || '#'}
                  target={hasDownloadLink ? '_blank' : undefined}
                  rel={hasDownloadLink ? 'noreferrer' : undefined}
                  aria-disabled={!hasDownloadLink}
                  className={`inline-flex items-center justify-center gap-2.5 rounded-xl px-8 py-3.5 text-sm font-black uppercase tracking-[0.2em] transition-all shadow-lg ${
                    hasDownloadLink
                      ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-black hover:from-amber-400 hover:to-amber-500 hover:shadow-amber-500/20 hover:shadow-xl active:scale-[0.97]'
                      : 'bg-white/10 text-white/30 pointer-events-none border border-white/5'
                  }`}
                >
                  <Download className="w-4 h-4" />
                  {hasDownloadLink ? 'Get the Book' : 'Coming Soon'}
                </a>
                <button
                  type="button"
                  onClick={() => {
                    const el = document.getElementById('book-waitlist');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="inline-flex items-center justify-center gap-2.5 rounded-xl px-8 py-3.5 text-sm font-black uppercase tracking-[0.2em] text-white border border-white/15 bg-white/5 hover:bg-white/10 hover:border-white/25 active:scale-[0.97] transition-all"
                >
                  <Mail className="w-4 h-4" />
                  Get Notified
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Decorative Divider ── */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-px bg-gradient-to-r from-transparent via-amber-500/20 to-transparent" />
      </div>

      {/* ── Quote / Pull Section ── */}
      <section className="relative z-10 px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-24">
        <div className="max-w-3xl mx-auto text-center">
          <Quote className="w-10 h-10 text-amber-500/20 mx-auto mb-6" />
          <blockquote className="text-xl sm:text-2xl lg:text-3xl font-medium leading-relaxed text-white/70 italic">
            &ldquo;This book is not about perfection. It&rsquo;s about the quiet, consistent decisions that separate the few who become from the many who remain.&rdquo;
          </blockquote>
          <div className="mt-6 flex items-center justify-center gap-3">
            <div className="w-8 h-px bg-amber-500/40" />
            <p className="text-sm text-amber-400/60 tracking-[0.2em] uppercase font-medium">Favour Odedele</p>
            <div className="w-8 h-px bg-amber-500/40" />
          </div>
        </div>
      </section>

      {/* ── Decorative Divider ── */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-px bg-gradient-to-r from-transparent via-amber-500/20 to-transparent" />
      </div>

      {/* ── What's Inside ── */}
      <section className="relative z-10 px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-24">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">What You&rsquo;ll Find Inside</h2>
            <p className="text-white/40 max-w-xl mx-auto">Themes woven throughout the pages of this book</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: '🎯',
                title: 'Discipline & Identity',
                desc: 'Practical frameworks for building the internal discipline that transforms who you are, not just what you do.',
              },
              {
                icon: '🌱',
                title: 'Personal Growth',
                desc: 'Honest reflections on the messy, non-linear process of becoming someone you can be proud of.',
              },
              {
                icon: '⚡',
                title: 'Excellence',
                desc: 'What it really means to pursue excellence — and why it starts with the small, invisible choices.',
              },
              {
                icon: '🧭',
                title: 'Career Navigation',
                desc: 'Actionable insights for undergraduates, NYSC members, and fresh graduates finding their path.',
              },
              {
                icon: '💡',
                title: 'Clarity & Courage',
                desc: 'How to develop the courage to walk an unconventional path and the clarity to know which path is yours.',
              },
              {
                icon: '🤝',
                title: 'Community & Belonging',
                desc: 'The role of meaningful relationships and rooms in shaping your growth journey.',
              },
            ].map((item, index) => (
              <div
                key={index}
                className="group p-6 rounded-2xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.05] hover:border-amber-500/15 transition-all duration-300"
              >
                <div className="text-2xl mb-3">{item.icon}</div>
                <h3 className="text-base font-bold text-white/90 mb-2">{item.title}</h3>
                <p className="text-sm text-white/40 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Decorative Divider ── */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-px bg-gradient-to-r from-transparent via-amber-500/20 to-transparent" />
      </div>

      {/* ── Waitlist / Get Notified Section ── */}
      <section id="book-waitlist" className="relative z-10 px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-24">
        <div className="max-w-xl mx-auto text-center">
          <div className="p-8 sm:p-10 rounded-3xl border border-white/5 bg-white/[0.02] backdrop-blur-sm">
            <div className="w-12 h-12 rounded-full bg-amber-500/10 flex items-center justify-center mx-auto mb-5">
              <Mail className="w-5 h-5 text-amber-400" />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">Stay in the Loop</h2>
            <p className="text-sm text-white/40 mb-6 max-w-sm mx-auto leading-relaxed">
              Be the first to know when <strong className="text-white/60">{book.title}</strong> is available and receive early updates from Favour.
            </p>

            <form onSubmit={handleSubmit} className="space-y-3">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                required
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/25 focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500/30 transition-all text-sm"
              />
              {submitError && (
                <p className="text-sm text-red-400 font-medium">{submitError}</p>
              )}
              {confirmationMessage && (
                <p
                  className={`text-sm text-emerald-400 font-medium transition-opacity duration-500 ${
                    confirmationVisible ? 'opacity-100' : 'opacity-0'
                  }`}
                >
                  {confirmationMessage}
                </p>
              )}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 disabled:opacity-50 disabled:cursor-not-allowed text-black py-3 rounded-xl font-bold text-sm uppercase tracking-widest transition-all"
              >
                {isSubmitting ? 'Submitting...' : 'Notify Me'}
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="relative z-10 px-4 sm:px-6 lg:px-8 py-8 border-t border-white/5">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-white/25 tracking-wide">
            &copy; {new Date().getFullYear()} Favour Odedele. All rights reserved.
          </p>
          <Link
            to="/"
            className="text-xs text-white/25 hover:text-white/50 transition-colors tracking-wide uppercase"
          >
            Visit Full Portfolio →
          </Link>
        </div>
      </footer>
    </div>
  );
}
