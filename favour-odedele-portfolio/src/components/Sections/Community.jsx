import { useState } from 'react';
import { Mail, Send, Users } from 'lucide-react';
import { API_BASE_URL } from '../../config.js';

export default function Community() {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [status, setStatus] = useState('idle');
  const [message, setMessage] = useState('');

  const submit = async (event) => {
    event.preventDefault();
    setStatus('loading');
    setMessage('');

    try {
      const response = await fetch(`${API_BASE_URL}/waitlist`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ email, name }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.message || 'Could not join right now.');
      setStatus('success');
      setMessage(data.message || 'You are in. Watch your inbox for future updates.');
      setEmail('');
      setName('');
    } catch (error) {
      setStatus('error');
      setMessage(error.message || 'Could not join right now.');
    }
  };

  return (
    <section id="community" className="py-16 sm:py-20 lg:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_0.9fr] gap-10 lg:gap-16 items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-2 text-xs font-black uppercase tracking-[0.25em] text-primary mb-6">
              <Users className="w-4 h-4" /> Community
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-6xl font-black tracking-tight text-slate-950 leading-tight">
              Join my community
            </h2>
            <p className="mt-6 text-base sm:text-lg leading-relaxed text-slate-600 max-w-2xl">
              Receive reflections, opportunities, book updates, and insights on education, leadership, entrepreneurship, and personal growth.
            </p>
            <div className="mt-8 flex flex-wrap gap-3 text-sm font-semibold text-slate-600">
              <span className="rounded-full bg-background-muted px-4 py-2">Reflections</span>
              <span className="rounded-full bg-background-muted px-4 py-2">Opportunities</span>
              <span className="rounded-full bg-background-muted px-4 py-2">Book updates</span>
              <span className="rounded-full bg-background-muted px-4 py-2">Growth notes</span>
            </div>
          </div>

          <form onSubmit={submit} className="bg-slate-950 text-white rounded-2xl p-6 sm:p-8 shadow-2xl space-y-4">
            <div className="w-12 h-12 rounded-xl bg-primary text-white grid place-items-center mb-2">
              <Mail className="w-6 h-6" />
            </div>
            <h3 className="text-2xl font-black">Stay connected</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Join once and get both community notes and updates about Becoming the 1%.
            </p>
            <input
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Your name"
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-primary/60"
            />
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="Your email address"
              required
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-primary/60"
            />
            {message && (
              <p className={`text-sm ${status === 'error' ? 'text-red-300' : 'text-emerald-300'}`}>{message}</p>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <button
                type="submit"
                disabled={status === 'loading'}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-accent-magenta px-5 py-3 text-sm font-black uppercase tracking-widest text-white hover:bg-accent-magenta/90 disabled:opacity-60"
              >
                <Send className="w-4 h-4" /> {status === 'loading' ? 'Joining...' : 'Join the community'}
              </button>
              <button
                type="button"
                onClick={() => document.getElementById('book')?.scrollIntoView({ behavior: 'smooth' })}
                className="rounded-xl border border-white/15 px-5 py-3 text-sm font-black uppercase tracking-widest text-white hover:bg-white/10"
              >
                Get book updates
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
