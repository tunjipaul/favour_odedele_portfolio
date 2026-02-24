import { BookOpen } from 'lucide-react';
import useStore from '../../store/useStore';
import Modal from '../UI/Modal';
import { useState, useEffect, useRef } from 'react';

const STATS = [
  { label: 'Days Left', target: 45 },
  { label: 'Chapters Done', target: 7 },
  { label: 'Key Pillars', target: 4 },
];

const easeOutQuart = (t) => 1 - Math.pow(1 - t, 4);

export default function BookTeaser() {
  const { isWaitlistOpen, toggleWaitlist } = useStore();
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const sectionRef = useRef(null);
  const [bookAnimationState, setBookAnimationState] = useState('closed');
  const [progressWidth, setProgressWidth] = useState(0);
  const [statCounts, setStatCounts] = useState([0, 0, 0]);
  const [statsAnimated, setStatsAnimated] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (bookAnimationState === 'closed') {
              // Book opening animation
              setTimeout(() => setBookAnimationState('opening'), 100);
              setTimeout(() => setBookAnimationState('opened'), 2000);
            }
            if (!statsAnimated) {
              setStatsAnimated(true);
              // Animate progress bar after book opens
              setTimeout(() => animateProgress(), 2200);
              // Animate stat counters after book opens
              setTimeout(() => animateStats(), 2200);
            }
          }
        });
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, [bookAnimationState, statsAnimated]);

  const animateProgress = () => {
    const duration = 4000; // slow: 4 seconds
    const frameRate = 1000 / 60;
    const totalFrames = Math.round(duration / frameRate);
    let frame = 0;
    const interval = setInterval(() => {
      frame++;
      const progress = easeOutQuart(frame / totalFrames);
      setProgressWidth(Math.round(progress * 70)); // target: 70%
      if (frame === totalFrames) clearInterval(interval);
    }, frameRate);
  };

  const animateStats = () => {
    const duration = 5000; // slow: 5 seconds
    const frameRate = 1000 / 60;
    const totalFrames = Math.round(duration / frameRate);
    let frame = 0;
    const interval = setInterval(() => {
      frame++;
      const progress = easeOutQuart(frame / totalFrames);
      setStatCounts(STATS.map((s) => Math.round(progress * s.target)));
      if (frame === totalFrames) clearInterval(interval);
    }, frameRate);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Try to save to backend — silently continue even if it fails
    try {
      await fetch('http://localhost:5000/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
    } catch {
      // API unreachable — still show success to the user
    }
    setIsSubmitted(true);
    setEmail('');
    // Auto-close after 3 seconds
    setTimeout(() => {
      setIsSubmitted(false);
      toggleWaitlist();
    }, 3000);
  };

  const handleClose = () => {
    setIsSubmitted(false);
    toggleWaitlist();
  };

  return (
    <section 
      ref={sectionRef}
      className="py-12 sm:py-16 md:py-20 lg:py-24 text-white relative overflow-hidden bg-background-dark" 
      id="book"
    >
      {/* Giant Book Icon Background */}
      <div 
        className={`absolute inset-0 flex items-center justify-center pointer-events-none transition-all duration-2000 ${
          bookAnimationState === 'closed' ? 'opacity-100 scale-100' : 
          bookAnimationState === 'opening' ? 'opacity-60 scale-150 book-opening' :
          'opacity-0 scale-200'
        }`}
      >
        <BookOpen 
          className={`text-primary/10 transition-all ${
            bookAnimationState === 'closed' ? 'w-64 h-64 sm:w-96 sm:h-96' :
            'w-96 h-96 sm:w-[600px] sm:h-[600px]'
          }`}
          strokeWidth={0.5}
        />
      </div>

      {/* Background Glow */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 right-0 w-64 h-64 sm:w-96 sm:h-96 bg-primary/40 blur-[120px]" />
        <div className="absolute bottom-0 left-0 w-64 h-64 sm:w-96 sm:h-96 bg-primary/20 blur-[120px]" />
      </div>

      {/* Content - fades in after book opens */}
      <div 
        className={`max-w-7xl mx-auto px-4 sm:px-6 relative z-10 transition-all duration-1000 ${
          bookAnimationState === 'opened' ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 sm:gap-12 md:gap-16 lg:gap-20 items-center">
          {/* Left Content */}
          <div>
            <h2 className="text-accent-magenta font-black tracking-widest text-xs sm:text-sm uppercase mb-4 sm:mb-6">
              Upcoming Publication
            </h2>
            <h3 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black mb-6 sm:mb-8 leading-tight font-serif">
              Success Leaves <span className="italic">Cues</span>
            </h3>
            <p className="text-slate-400 text-base sm:text-lg mb-8 sm:mb-10 leading-relaxed max-w-lg">
              An executive playbook on scaling operational excellence and building
              sustainable impact in developing markets. Pre-order details coming soon.
            </p>

            {/* Progress Bar */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold uppercase tracking-wider">
                  Manuscript Completion
                </span>
                <span className="text-primary font-black tabular-nums">{progressWidth}%</span>
              </div>
              <div className="w-full h-4 bg-slate-800 rounded-full overflow-hidden relative">
                {/* Filled bar */}
                <div
                  className="h-full bg-primary rounded-full transition-none relative overflow-hidden"
                  style={{ width: `${progressWidth}%` }}
                >
                  {/* Moving glow shimmer — always on, indicating ongoing work */}
                  {progressWidth > 0 && (
                    <div className="absolute inset-y-0 w-16 bg-white/30 blur-sm animate-shimmer rounded-full" />
                  )}
                </div>
                {/* Soft glow at the tip */}
                {progressWidth > 0 && (
                  <div
                    className="absolute top-1/2 -translate-y-1/2 w-6 h-6 bg-primary/60 rounded-full blur-md transition-none pointer-events-none"
                    style={{ left: `calc(${progressWidth}% - 12px)` }}
                  />
                )}
              </div>
            </div>

            {/* Stats */}
            <div className="flex gap-8 mt-12">
              {STATS.map((stat, i) => (
                <>
                  {i > 0 && <div key={`div-${i}`} className="w-px h-12 bg-slate-800" />}
                  <div key={stat.label}>
                    <div className="text-3xl font-black text-white mb-1 tabular-nums">
                      {String(statCounts[i]).padStart(2, '0')}
                    </div>
                    <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                      {stat.label}
                    </div>
                  </div>
                </>
              ))}
            </div>

            {/* Waitlist CTA */}
            <button
              onClick={toggleWaitlist}
              className="mt-10 bg-accent-magenta hover:bg-accent-magenta/90 text-white px-8 py-4 rounded-xl font-bold transition-all shadow-lg shadow-accent-magenta/20 active:scale-95"
            >
              Join Waitlist
            </button>
          </div>

          {/* Right: Book Mockup */}
          <div className="relative group">
            <div className="absolute -inset-4 bg-primary/20 blur-2xl group-hover:bg-primary/30 transition-all rounded-3xl" />
            <div className="aspect-square bg-slate-900 rounded-2xl border border-slate-800/30 flex items-center justify-center p-12 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8">
                <BookOpen className="w-16 h-16 text-primary/20" />
              </div>
              <div className="text-center relative z-10">
                <div className="w-16 h-1 bg-primary mx-auto mb-8" />
                <h4 className="text-3xl font-black mb-4 tracking-tighter uppercase">
                  Success <br /> Leaves Cues
                </h4>
                <p className="text-slate-500 text-sm font-bold tracking-widest uppercase">
                  By Favor Odedele
                </p>
              </div>
              {/* Geometric accent */}
              <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-accent-magenta/5 rounded-full border border-white/5" />
            </div>
          </div>
        </div>
      </div>

      {/* Waitlist Modal */}
      <Modal
        isOpen={isWaitlistOpen}
        onClose={handleClose}
        title="Join the Waitlist"
      >
        {isSubmitted ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-accent-green/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-accent-green" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h4 className="text-xl font-bold text-slate-900 mb-2">You're on the list!</h4>
            <p className="text-slate-600">
              We'll notify you when <strong>"Success Leaves Cues"</strong> is ready for pre-order.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            <p className="text-slate-600 leading-relaxed">
              Be the first to know when <strong>"Success Leaves Cues"</strong> is
              available. Get exclusive early access and launch day discounts.
            </p>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                required
                className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
              <button
                type="submit"
                className="w-full bg-primary hover:bg-primary-dark text-white py-3 rounded-xl font-bold transition-all"
              >
                Notify Me
              </button>
            </form>
          </div>
        )}
      </Modal>
    </section>
  );
}
