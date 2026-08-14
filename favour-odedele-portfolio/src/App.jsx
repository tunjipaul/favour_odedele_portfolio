import { lazy, Suspense, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { authApi } from './admin/utils/api';
import { API_BASE_URL } from './config.js';

// Public portfolio sections
import Navbar from './components/Layout/Navbar';
import Footer from './components/Layout/Footer';
import Hero from './components/Sections/Hero';
import AboutMe from './components/Sections/Expertise';
import Highlights from './components/Sections/CaseStudies';
import BookTeaser from './components/Sections/BookTeaser';
import Gallery from './components/Sections/Gallery';
import Community from './components/Sections/Community';

// Lazy-loaded public pages
const BookPage = lazy(() => import('./components/Pages/BookPage'));

// Lazy-loaded Admin pages (reduces public bundle size for SEO & speed)
const AdminLayout = lazy(() => import('./admin/AdminLayout'));
const Login = lazy(() => import('./admin/pages/Login'));
const Dashboard = lazy(() => import('./admin/pages/Dashboard'));
const ProjectsManager = lazy(() => import('./admin/pages/ProjectsManager'));
const GalleryManager = lazy(() => import('./admin/pages/GalleryManager'));
const SettingsEditor = lazy(() => import('./admin/pages/SettingsEditor'));
const WaitlistViewer = lazy(() => import('./admin/pages/WaitlistViewer'));
const FrontPageEditor = lazy(() => import('./admin/pages/FrontPageEditor'));
const CommunityEditor = lazy(() => import('./admin/pages/CommunityEditor'));

// Admin fallback loader
function AdminLoadingFallback() {
  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-white gap-3">
      <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      <p className="text-xs uppercase tracking-widest text-slate-400">Loading admin...</p>
    </div>
  );
}

// ProtectedRoute — redirects to /admin/login if not authenticated
function ProtectedRoute({ children }) {
  return authApi.isLoggedIn() ? children : <Navigate to="/admin/login" replace />;
}

export default function App() {
  // Keep-alive pinger for Render free tier (prevents sleep)
  useEffect(() => {
    const ping = async () => {
      try {
        await fetch(`${API_BASE_URL}/health`);
      } catch {
        // Silently fail, just a keep-alive
      }
    };
    
    // Ping immediately on load
    ping();
    
    // Then every 14 minutes (Render sleeps at 15 mins)
    const interval = setInterval(ping, 14 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  // Scroll to hash target on initial load (e.g. /#book)
  useEffect(() => {
    const hash = window.location.hash;
    if (!hash) return;

    // Small delay to let React finish rendering all sections
    const timer = setTimeout(() => {
      const element = document.querySelector(hash);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }, 600);

    return () => clearTimeout(timer);
  }, []);

  return (
    <Routes>
      {/* ── Public Portfolio ─────────────────────── */}
      <Route
        path="/"
        element={
          <div className="bg-background-light text-slate-900 font-body">
            <Navbar />
            <main>
              <Hero />
              <AboutMe />
              <Highlights />
              <BookTeaser />
              <Community />
              <Gallery />
            </main>
            <Footer />
          </div>
        }
      />

      {/* ── Dedicated Book Page ────────────────────── */}
      <Route
        path="/book"
        element={
          <Suspense fallback={
            <div className="min-h-screen bg-[#0c0f0a] flex flex-col items-center justify-center text-white gap-3">
              <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
              <p className="text-xs uppercase tracking-widest text-white/40">Loading...</p>
            </div>
          }>
            <BookPage />
          </Suspense>
        }
      />

      {/* ── Admin Login (public) ──────────────────── */}
      <Route
        path="/admin/login"
        element={
          <Suspense fallback={<AdminLoadingFallback />}>
            <Login />
          </Suspense>
        }
      />

      {/* ── Admin Panel (protected) ───────────────── */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <Suspense fallback={<AdminLoadingFallback />}>
              <AdminLayout />
            </Suspense>
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/admin/dashboard" replace />} />
        <Route
          path="dashboard"
          element={
            <Suspense fallback={<AdminLoadingFallback />}>
              <Dashboard />
            </Suspense>
          }
        />
        <Route
          path="front-page"
          element={
            <Suspense fallback={<AdminLoadingFallback />}>
              <FrontPageEditor />
            </Suspense>
          }
        />
        <Route
          path="projects"
          element={
            <Suspense fallback={<AdminLoadingFallback />}>
              <ProjectsManager />
            </Suspense>
          }
        />
        <Route
          path="community"
          element={
            <Suspense fallback={<AdminLoadingFallback />}>
              <CommunityEditor />
            </Suspense>
          }
        />
        <Route
          path="waitlist"
          element={
            <Suspense fallback={<AdminLoadingFallback />}>
              <WaitlistViewer />
            </Suspense>
          }
        />
        <Route
          path="gallery"
          element={
            <Suspense fallback={<AdminLoadingFallback />}>
              <GalleryManager />
            </Suspense>
          }
        />
        <Route
          path="settings"
          element={
            <Suspense fallback={<AdminLoadingFallback />}>
              <SettingsEditor />
            </Suspense>
          }
        />
      </Route>

      {/* ── Catch-all ────────────────────────────── */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}




