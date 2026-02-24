import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../utils/api';
import { FolderOpen, Image, BarChart3, Star, Mail, Settings } from 'lucide-react';

const cards = [
  { label: 'Projects', icon: FolderOpen, to: '/admin/projects', color: 'bg-emerald-50 text-emerald-700' },
  { label: 'Gallery', icon: Image, to: '/admin/gallery', color: 'bg-pink-50 text-pink-700' },
  { label: 'Metrics', icon: BarChart3, to: '/admin/metrics', color: 'bg-blue-50 text-blue-700' },
  { label: 'Expertise', icon: Star, to: '/admin/expertise', color: 'bg-yellow-50 text-yellow-700' },
  { label: 'Settings', icon: Settings, to: '/admin/settings', color: 'bg-purple-50 text-purple-700' },
  { label: 'Waitlist', icon: Mail, to: '/admin/waitlist', color: 'bg-orange-50 text-orange-700' },
];

export default function Dashboard() {
  const [counts, setCounts] = useState({ projects: 0, gallery: 0, waitlist: 0 });

  useEffect(() => {
    const load = async () => {
      try {
        const [projects, gallery, waitlist] = await Promise.all([
          api.get('/admin/projects'),
          api.get('/admin/gallery'),
          api.get('/admin/waitlist'),
        ]);
        setCounts({ projects: projects.length, gallery: gallery.length, waitlist: waitlist.length });
      } catch {}
    };
    load();
  }, []);

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <h2 className="text-2xl font-extrabold text-gray-800 mb-1">Dashboard</h2>
      <p className="text-gray-500 text-sm mb-8">Welcome back, Favour 👋</p>

      {/* Quick stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {[
          { label: 'Projects', value: counts.projects },
          { label: 'Gallery Items', value: counts.gallery },
          { label: 'Waitlist Emails', value: counts.waitlist },
        ].map((stat) => (
          <div key={stat.label} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <p className="text-3xl font-black text-[#064E3B]">{stat.value}</p>
            <p className="text-sm text-gray-500 mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Navigation cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {cards.map(({ label, icon: Icon, to, color }) => (
          <Link
            key={to}
            to={to}
            className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md hover:-translate-y-0.5 transition-all flex items-center gap-4"
          >
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${color}`}>
              <Icon className="w-5 h-5" />
            </div>
            <span className="font-semibold text-gray-700">{label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
