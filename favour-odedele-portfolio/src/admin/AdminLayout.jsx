import { useEffect, useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { authApi } from './utils/api';
import {
  LayoutDashboard,
  Layers3,
  GraduationCap,
  BarChart3,
  FolderOpen,
  CalendarDays,
  Image,
  Mail,
  ArrowUpRight,
  LogOut,
  Menu,
  X,
} from 'lucide-react';

const navItems = [
  { to: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/admin/front-page', icon: Layers3, label: 'Front Page' },
  { to: '/admin/expertise', icon: GraduationCap, label: 'Expertise' },
  { to: '/admin/metrics', icon: BarChart3, label: 'Impact' },
  { to: '/admin/projects', icon: FolderOpen, label: 'Case Studies' },
  { to: '/admin/waitlist', icon: CalendarDays, label: 'Book Waitlist' },
  { to: '/admin/gallery', icon: Image, label: 'Gallery of Impact' },
  { to: '/admin/settings', icon: Mail, label: 'Contact' },
];

function Sidebar({ onClose }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    authApi.logout();
    navigate('/admin/login');
  };

  return (
    <aside className="w-64 sm:w-72 bg-slate-950 border-r border-white/10 text-slate-200 flex flex-col">
      <div className="px-4 sm:px-6 py-5 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 sm:w-11 h-10 sm:h-11 rounded-full bg-emerald-600 flex flex-shrink-0 items-center justify-center font-bold text-white text-sm sm:text-base">F</div>
          <div className="min-w-0">
            <p className="text-xs sm:text-sm font-semibold text-white truncate">Favor Admin</p>
            <p className="text-[10px] sm:text-xs text-slate-400 truncate">Portfolio Management</p>
          </div>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="p-1 rounded-lg bg-white/10 hover:bg-white/20 text-slate-200"
            aria-label="Close sidebar"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      <nav className="flex-1 px-3 sm:px-4 py-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            onClick={() => onClose?.()}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm rounded-lg transition-colors whitespace-nowrap ${
                isActive
                  ? 'bg-emerald-600/30 text-white font-semibold border-l-4 border-emerald-400'
                  : 'text-slate-300 hover:bg-slate-900/60'
              }`
            }
          >
            <item.icon className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
            <span className="hidden sm:inline">{item.label}</span>
          </NavLink>
        ))}

      </nav>

      <div className="px-4 sm:px-6 py-4 sm:py-6 space-y-2 sm:space-y-3 border-t border-white/5">
        <a
          href="/"
          className="w-full flex items-center justify-center gap-2 py-2 sm:py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs sm:text-sm font-bold transition-all shadow-lg shadow-emerald-500/30"
          target="_blank"
          rel="noreferrer"
        >
          <ArrowUpRight className="w-3 h-3 sm:w-4 sm:h-4" />
          <span className="hidden sm:inline">View Live Site</span>
          <span className="sm:hidden">Live Site</span>
        </a>
        <button
          type="button"
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 py-2 sm:py-3 bg-white/10 hover:bg-white/20 text-slate-200 rounded-xl text-xs sm:text-sm font-semibold transition-all"
        >
          <LogOut className="w-3 h-3 sm:w-4 sm:h-4" />
          <span className="hidden sm:inline">Logout</span>
          <span className="sm:hidden">Sign Out</span>
        </button>
      </div>
    </aside>
  );
}

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = sidebarOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [sidebarOpen]);

  return (
    <div className="flex min-h-screen bg-slate-950 text-white">
      <div className="hidden lg:flex lg:shrink-0">
        <Sidebar onClose={null} />
      </div>

      <div
        className={`lg:hidden fixed inset-0 z-40 bg-black/60 transition-opacity duration-300 ${
          sidebarOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setSidebarOpen(false)}
      />

      <div
        className={`lg:hidden fixed inset-y-0 left-0 z-50 flex transition-transform duration-300 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <Sidebar onClose={() => setSidebarOpen(false)} />
      </div>

      <div className="flex flex-1 flex-col">
        <div className="lg:hidden border-b border-white/10 bg-slate-950 px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-full bg-emerald-600 flex flex-shrink-0 items-center justify-center font-bold text-white text-xs">F</div>
            <div className="min-w-0">
              <p className="text-xs sm:text-sm font-semibold truncate">Favor Admin</p>
              <p className="text-[10px] text-slate-400 truncate">Portfolio Management</p>
            </div>
          </div>
          <button onClick={() => setSidebarOpen(true)} className="p-2 rounded-lg bg-white/10 hover:bg-white/20 flex-shrink-0">
            <Menu className="w-5 h-5 text-white" />
          </button>
        </div>

        <div className="flex-1 overflow-hidden">
          <div className="overflow-y-auto min-h-full">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
}
