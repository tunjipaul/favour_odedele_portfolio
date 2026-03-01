import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { authApi } from '../utils/api';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const data = await authApi.login(email, password);
      localStorage.setItem('adminToken', data.token);
      navigate('/admin/dashboard');
    } catch (err) {
      setError(err.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#042a3c] to-[#051f2c] px-4 py-10 flex items-center justify-center">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 items-center">
        <div className="flex-1 text-center rounded-3xl border border-white/10 bg-white/10 p-8 text-white shadow-2xl lg:text-left">
          <p className="text-xs uppercase tracking-[0.4em] text-emerald-300">Admin Portal</p>
          <h1 className="mt-4 text-4xl font-black">Welcome back, Favor Odedele</h1>
          <p className="mt-4 text-sm text-white/70">
            Log in to manage the portfolio, monitor case studies, and keep the waitlist updated. The layout scales from mobile to desktop so you can sign in anywhere.
          </p>
        </div>

        <div className="w-full max-w-md">
          <div className="w-full rounded-3xl border border-white/10 bg-white/90 p-8 shadow-[0_20px_60px_rgba(0,0,0,0.35)] backdrop-blur">
            <h2 className="text-lg font-bold text-gray-800 mb-6">Sign in to continue</h2>

            {error && (
              <div className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full rounded-2xl border border-gray-300 px-4 py-2.5 text-sm focus:border-[#064E3B] focus:outline-none focus:ring-2 focus:ring-[#064E3B]"
                  placeholder="favour@example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full rounded-2xl border border-gray-300 px-4 py-2.5 pr-10 text-sm focus:border-[#064E3B] focus:outline-none focus:ring-2 focus:ring-[#064E3B]"
                    placeholder="••••••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-500 hover:text-gray-700 focus:outline-none"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-2xl bg-[#064E3B] px-4 py-2.5 text-sm font-semibold uppercase tracking-[0.2em] text-white transition hover:bg-[#065f46] disabled:opacity-60"
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
