import { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Plus, CloudUpload, ListChecks, Bell, Users, FolderOpen, Image as ImageIcon } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { api } from '../utils/api';

const quickActions = [
  {
    title: 'New Case Study',
    description: 'Publish a new leadership project',
    Icon: Plus,
    accent: 'bg-emerald-500 text-white',
    iconBg: 'bg-emerald-600/80',
    to: '/admin/projects',
  },
  {
    title: 'Upload Gallery Media',
    description: 'Add photos or videos to Gallery of Impact',
    Icon: CloudUpload,
    accent: 'bg-lime-500 text-slate-950',
    iconBg: 'bg-lime-500/80',
    to: '/admin/gallery',
  },
  {
    title: 'Manage Waitlist',
    description: 'View and export all signups',
    Icon: ListChecks,
    accent: 'bg-slate-800 text-slate-100',
    iconBg: 'bg-slate-800/70',
    to: '/admin/waitlist',
  },
];

const fallbackProjects = [
  {
    title: 'Fintech Leadership Strategy 2024',
    status: 'Published',
    statusTone: 'bg-emerald-600/20 text-emerald-200',
    lastModified: '2 hours ago',
    author: 'Favor Odedele',
  },
  {
    title: 'Product Innovation Workshop',
    status: 'In Review',
    statusTone: 'bg-amber-600/20 text-amber-200',
    lastModified: 'Yesterday, 4:45 PM',
    author: 'John D.',
  },
  {
    title: 'Enterprise Scalability Report',
    status: 'Draft',
    statusTone: 'bg-slate-800/30 text-slate-400',
    lastModified: '3 days ago',
    author: 'Favor Odedele',
  },
];

const formatDateTime = (value) => {
  if (!value) return 'N/A';
  return new Date(value).toLocaleString('en-NG', {
    day: 'numeric',
    month: 'short',
    hour: 'numeric',
    minute: '2-digit',
  });
};

const getInitials = (value) => {
  if (!value) return 'FO';
  return value
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
};

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-900 border border-white/10 p-3 rounded-lg shadow-xl">
        <p className="text-[10px] uppercase tracking-widest text-slate-400 mb-1">{label}</p>
        <p className="text-sm font-bold text-emerald-400">{payload[0].value} New Signups</p>
      </div>
    );
  }
  return null;
};

export default function Dashboard() {
  const [counts, setCounts] = useState({ projects: 0, gallery: 0, waitlist: 0 });
  const [projects, setProjects] = useState([]);
  const [waitlist, setWaitlist] = useState([]);

  useEffect(() => {
    const load = async () => {
      try {
        const [projectData, galleryData, waitlistData] = await Promise.all([
          api.get('/admin/projects'),
          api.get('/admin/gallery'),
          api.get('/admin/waitlist'),
        ]);
        setProjects(projectData || []);
        setWaitlist(waitlistData || []);
        setCounts({
          projects: projectData?.length ?? 0,
          gallery: galleryData?.length ?? 0,
          waitlist: waitlistData?.length ?? 0,
        });
      } catch (error) {
        console.error('Dashboard load failed', error);
      }
    };
    load();
  }, []);

  const displayProjects = projects.length ? projects.slice(0, 3) : fallbackProjects;
  const recentSignups = waitlist.slice(0, 3);

  const chartData = useMemo(() => {
    const days = 30;
    const now = new Date();
    const data = [];
    
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(now.getDate() - i);
      const dayStr = date.toISOString().split('T')[0];
      
      const count = waitlist.filter(e => 
        new Date(e.createdAt).toISOString().split('T')[0] === dayStr
      ).length;

      data.push({
        name: date.toLocaleDateString('en-NG', { day: 'numeric', month: 'short' }),
        signups: count,
      });
    }
    return data;
  }, [waitlist]);

  const calculateGrowth = () => {
    if (!waitlist || waitlist.length === 0) return '0%';
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const sixtyDaysAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);

    const thisPeriod = waitlist.filter(e => new Date(e.createdAt) > thirtyDaysAgo).length;
    const lastPeriod = waitlist.filter(e => {
      const date = new Date(e.createdAt);
      return date <= thirtyDaysAgo && date > sixtyDaysAgo;
    }).length;

    if (lastPeriod === 0) return thisPeriod > 0 ? '+100%' : '0%';
    const growth = ((thisPeriod - lastPeriod) / lastPeriod) * 100;
    return `${growth >= 0 ? '+' : ''}${growth.toFixed(1)}%`;
  };

  const statsCards = [
    { label: 'Total Signups', value: counts.waitlist, Icon: Users, tone: 'text-emerald-400 bg-emerald-600/10' },
    { label: 'Active Projects', value: counts.projects, Icon: FolderOpen, tone: 'text-slate-100 bg-slate-800/40' },
    { label: 'Gallery of Impact', value: counts.gallery, Icon: ImageIcon, tone: 'text-slate-100 bg-slate-800/40' },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="max-w-[1400px] mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
        <header className="flex flex-col-reverse gap-4 sm:gap-6 border-b border-white/5 pb-6 sm:pb-8">
          <div>
            <p className="text-[10px] sm:text-[11px] uppercase tracking-[0.3em] sm:tracking-[0.4em] text-emerald-400 mb-2">Executive Overview</p>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black leading-tight">
              Welcome back, <span className="text-white">Favor Odedele.</span>
            </h1>
            <p className="text-slate-400 text-xs sm:text-sm mt-2">Managing your leadership portfolio.</p>
          </div>
          <div className="flex items-center gap-3 sm:gap-4 self-end sm:self-auto">
            {/* Notification and Profile removed per user request */}
          </div>
        </header>

        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {quickActions.map((action) => (
            <Link 
              key={action.title} 
              to={action.to}
              className={`rounded-2xl border border-white/10 p-6 bg-gradient-to-br from-slate-900/80 to-slate-900/90 transition-all hover:scale-[1.02] hover:shadow-xl active:scale-[0.98] ${action.accent}`}
            >
              <div className={`inline-flex items-center justify-center w-12 h-12 rounded-2xl mb-4 ${action.iconBg}`}>
                <action.Icon className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-semibold">{action.title}</h3>
              <p className="text-sm text-slate-200 mt-1 leading-relaxed">{action.description}</p>
            </Link>
          ))}
        </section>

        <section className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          <div className="xl:col-span-2 bg-slate-900/80 border border-white/10 rounded-2xl p-6 shadow-inner shadow-black/40">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
              <div>
                <p className="text-sm text-slate-400 uppercase tracking-[0.4em]">Waitlist Growth</p>
                <p className="text-xs text-slate-500">Daily signups over the last 30 days</p>
              </div>
              <span className="self-start px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold">{calculateGrowth()} this month</span>
            </div>
            
            <div className="h-64 mt-4 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorSignups" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <Tooltip content={<CustomTooltip />} />
                  <Area 
                    type="monotone" 
                    dataKey="signups" 
                    stroke="#10b981" 
                    strokeWidth={3}
                    fillOpacity={1} 
                    fill="url(#colorSignups)" 
                    animationDuration={1500}
                  />
                </AreaChart>
              </ResponsiveContainer>
              <div className="flex justify-between text-[10px] uppercase tracking-[0.2em] sm:tracking-[0.4em] text-slate-500 mt-4 px-2">
                <span>30 Days Ago</span>
                <span>Today</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-6">
            {statsCards.map((card) => (
              <div
                key={card.label}
                className={`bg-slate-900/80 border border-white/10 rounded-2xl p-5 flex items-center justify-between gap-4 ${card.tone}`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 grid place-items-center rounded-2xl bg-white/5">
                    <card.Icon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 uppercase tracking-[0.3em]">{card.label}</p>
                    <p className="text-3xl font-black">{card.value ?? 0}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Projects Activity */}
          <div className="bg-slate-900/80 border border-white/10 rounded-2xl overflow-hidden">
            <div className="px-4 sm:px-6 py-4 sm:py-5 border-b border-white/5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Case Studies</p>
                <h2 className="text-base sm:text-lg font-bold">Editorial Activity</h2>
              </div>
              <Link to="/admin/projects" className="text-emerald-300 text-xs font-semibold hover:text-emerald-200">
                View All
              </Link>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead className="text-slate-500 text-[11px] uppercase tracking-[0.3em] bg-slate-950/40">
                  <tr>
                    <th className="px-4 py-3 whitespace-nowrap">Title</th>
                    <th className="px-4 py-3 whitespace-nowrap">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {displayProjects.map((project, index) => {
                    const status = project.status || (project.isVisible ? 'Published' : 'Draft');
                    const tone = project.statusTone || (project.isVisible ? 'bg-emerald-600/20 text-emerald-200' : 'bg-slate-800/40 text-slate-400');
                    return (
                      <tr key={index} className="hover:bg-slate-900/40 transition-colors">
                        <td className="px-4 py-4 truncate max-w-[200px] font-semibold">{project.title}</td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${tone}`}>
                            {status}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Waitlist Activity */}
          <div className="bg-slate-900/80 border border-white/10 rounded-2xl overflow-hidden">
            <div className="px-4 sm:px-6 py-4 sm:py-5 border-b border-white/5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Book Waitlist</p>
                <h2 className="text-base sm:text-lg font-bold">Recent Signups</h2>
              </div>
              <Link to="/admin/waitlist" className="text-emerald-300 text-xs font-semibold hover:text-emerald-200">
                View All
              </Link>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead className="text-slate-500 text-[11px] uppercase tracking-[0.3em] bg-slate-950/40">
                  <tr>
                    <th className="px-4 py-3 whitespace-nowrap">Name</th>
                    <th className="px-4 py-3 whitespace-nowrap">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {recentSignups.length > 0 ? (
                    recentSignups.map((entry, index) => (
                      <tr key={index} className="hover:bg-slate-900/40 transition-colors">
                        <td className="px-4 py-4 truncate max-w-[200px] font-semibold">{entry.name || entry.email}</td>
                        <td className="px-4 py-4 text-slate-400 whitespace-nowrap">
                          {formatDateTime(entry.createdAt)}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="2" className="px-4 py-8 text-center text-slate-500">No signups yet</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
