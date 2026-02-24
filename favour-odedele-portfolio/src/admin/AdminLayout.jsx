import { useState, useEffect } from 'react';
import { NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { authApi } from './utils/api';
import {
  LayoutDashboard,
  FolderOpen,
  Image,
  BarChart3,
  Star,
  Settings,
  Mail,
  LogOut,
  Menu,
  X,
} from 'lucide-react';

const navItems = [
  { to: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/admin/projects', icon: FolderOpen, label: 'Projects' },
  { to: '/admin/gallery', icon: Image, label: 'Gallery' },
  { to: '/admin/metrics', icon: BarChart3, label: 'Metrics' },
  { to: '/admin/expertise', icon: Star, label: 'Expertise' },
  { to: '/admin/settings', icon: Settings, label: 'Settings' },
  { to: '/admin/waitlist', icon: Mail, label: 'Waitlist' },
];

function Sidebar({ onClose }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    authApi.logout();
    navigate('/admin/login');
  };

  return (
    <aside className="w-64 bg-[#064E3B] text-white flex flex-col h-full">
      {/* Logo + close button (mobile only) */}
      <div className="px-6 py-6 border-b border-white/10 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-extrabold tracking-tight">Favor Odedele</h1>
          <p className="text-xs text-white/50 mt-1">Admin Panel</p>
        </div>
        {onClose && (
          <button onClick={onClose} className="text-white/60 hover:text-white lg:hidden">
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Nav Links */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            onClick={onClose}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                isActive
                  ? 'bg-white text-[#064E3B]'
                  : 'text-white/70 hover:bg-white/10 hover:text-white'
              }`
            }
          >
            <Icon className="w-4 h-4 shrink-0" />
            {label}
          </NavLink>
        ))}
      </nav>

      {/* Logout */}
      <div className="px-3 py-4 border-t border-white/10">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium text-white/70 hover:bg-white/10 hover:text-white transition-all"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </button>
      </div>
    </aside>
  );
}

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  // Close sidebar on route change (mobile)
  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  // Prevent body scroll when sidebar drawer is open
  useEffect(() => {
    if (sidebarOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [sidebarOpen]);

  return (
    <div className="flex h-screen bg-gray-100 font-sans overflow-hidden">

      {/* ── Desktop sidebar (always visible on lg+) ── */}
      <div className="hidden lg:flex lg:shrink-0">
        <Sidebar onClose={null} />
      </div>

      {/* ── Mobile sidebar drawer ── */}
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/50 z-40 lg:hidden transition-opacity duration-300 ${
          sidebarOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setSidebarOpen(false)}
      />
      {/* Drawer */}
      <div
        className={`fixed inset-y-0 left-0 z-50 lg:hidden flex transition-transform duration-300 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <Sidebar onClose={() => setSidebarOpen(false)} />
      </div>

      {/* ── Main area ── */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Mobile top bar */}
        <header className="lg:hidden flex items-center gap-4 px-4 py-3 bg-white border-b border-gray-200 shadow-sm">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
            aria-label="Open sidebar"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-3">
            <span className="font-extrabold text-[#064E3B] text-sm tracking-tight">Favor Odedele</span>
            <span className="text-gray-400 text-xs border-l border-gray-200 pl-3">Admin</span>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
