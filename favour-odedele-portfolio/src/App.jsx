import { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { authApi } from './admin/utils/api';

// Public portfolio sections
import Navbar from './components/Layout/Navbar';
import Footer from './components/Layout/Footer';
import Hero from './components/Sections/Hero';
import Expertise from './components/Sections/Expertise';
import ImpactMetrics from './components/Sections/ImpactMetrics';
import CaseStudies from './components/Sections/CaseStudies';
import BookTeaser from './components/Sections/BookTeaser';
import Gallery from './components/Sections/Gallery';

// Admin pages
import AdminLayout from './admin/AdminLayout';
import Login from './admin/pages/Login';
import Dashboard from './admin/pages/Dashboard';
import ProjectsManager from './admin/pages/ProjectsManager';
import GalleryManager from './admin/pages/GalleryManager';
import MetricsEditor from './admin/pages/MetricsEditor';
import ExpertiseEditor from './admin/pages/ExpertiseEditor';
import SettingsEditor from './admin/pages/SettingsEditor';
import WaitlistViewer from './admin/pages/WaitlistViewer';
import FrontPageEditor from './admin/pages/FrontPageEditor';

// ProtectedRoute — redirects to /admin/login if not authenticated
function ProtectedRoute({ children }) {
  return authApi.isLoggedIn() ? children : <Navigate to="/admin/login" replace />;
}

export default function App() {
  // Keep-alive pinger for Render free tier (prevents sleep)
  useEffect(() => {
    const ping = async () => {
      try {
        await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'}/health`);
      } catch (e) {
        // Silently fail, just a keep-alive
      }
    };
    
    // Ping immediately on load
    ping();
    
    // Then every 14 minutes (Render sleeps at 15 mins)
    const interval = setInterval(ping, 14 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Routes>
      {/* ── Public Portfolio ─────────────────────── */}
      <Route
        path="/"
        element={
          <div className="bg-background-light text-slate-900 font-display">
            <Navbar />
            <main>
              <Hero />
              <Expertise />
              <ImpactMetrics />
              <CaseStudies />
              <BookTeaser />
              <Gallery />
            </main>
            <Footer />
          </div>
        }
      />

      {/* ── Admin Login (public) ──────────────────── */}
      <Route path="/admin/login" element={<Login />} />

      {/* ── Admin Panel (protected) ───────────────── */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="front-page" element={<FrontPageEditor />} />
        <Route path="expertise" element={<ExpertiseEditor />} />
        <Route path="metrics" element={<MetricsEditor />} />
        <Route path="projects" element={<ProjectsManager />} />
        <Route path="waitlist" element={<WaitlistViewer />} />
        <Route path="gallery" element={<GalleryManager />} />
        <Route path="settings" element={<SettingsEditor />} />
      </Route>

      {/* ── Catch-all ────────────────────────────── */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
