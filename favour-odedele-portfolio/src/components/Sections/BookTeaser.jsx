import { useEffect, useState } from 'react';
import { BookOpen, Download, Mail } from 'lucide-react';
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

  return (
    <section className="py-16 sm:py-20 lg:py-28 bg-background-dark text-white" id="book">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-[0.9fr_1.1fr] gap-10 lg:gap-16 items-center">
          <div className="relative mx-auto w-full max-w-sm">
            <div className="absolute -inset-5 rounded-3xl bg-primary/20 blur-2xl" />
            <div className="relative aspect-[3/4] rounded-2xl overflow-hidden border border-white/10 bg-slate-900">
              <img src={coverUrl} alt={`${book.title} cover`} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-linear-to-t from-slate-950/80 via-transparent to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <BookOpen className="w-8 h-8 text-primary mb-4" />
                <h3 className="text-2xl font-bold uppercase leading-tight">{book.title}</h3>
                <p className="mt-2 font-name text-2xl leading-none text-white/70">By Favour Odedele</p>
              </div>
            </div>
          </div>

          <div>
            <p className="text-accent-magenta font-black tracking-[0.35em] uppercase text-xs mb-5">My Book</p>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-normal leading-tight">
              {book.title || 'Becoming the 1%'}
            </h2>
            <p className="mt-8 text-base sm:text-lg leading-relaxed text-slate-300 max-w-2xl">
              {book.teaser || DEFAULT_BOOK_SETTINGS.teaser}
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <a
                href={book.pdfUrl || '#'}
                target={book.pdfUrl ? '_blank' : undefined}
                rel={book.pdfUrl ? 'noreferrer' : undefined}
                aria-disabled={!book.pdfUrl}
                className={`inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3 text-sm font-black uppercase tracking-widest transition ${
                  book.pdfUrl
                    ? 'bg-white text-slate-950 hover:bg-primary hover:text-white'
                    : 'bg-white/10 text-white/40 pointer-events-none'
                }`}
              >
                <Download className="w-4 h-4" /> Download PDF
              </a>
              <button
                type="button"
                onClick={toggleWaitlist}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-accent-magenta px-6 py-3 text-sm font-black uppercase tracking-widest text-white hover:bg-accent-magenta/90"
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



