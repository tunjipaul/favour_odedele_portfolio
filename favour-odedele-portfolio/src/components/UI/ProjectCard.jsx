import { AlertTriangle, CheckCircle } from 'lucide-react';
import useStore from '../../store/useStore';

export default function ProjectCard({ project }) {
  const openProject = useStore((state) => state.openProject);

  const tagColorMap = {
    'accent-magenta': 'bg-accent-magenta',
    'primary': 'bg-primary',
    'accent-green': 'bg-accent-green',
  };

  return (
    <div
      className="flex flex-col bg-white rounded-xl sm:rounded-2xl overflow-hidden shadow-xl border border-slate-200 cursor-pointer group hover:shadow-2xl transition-all duration-300"
      onClick={() => openProject(project)}
    >
      {/* Image */}
      <div className="h-48 sm:h-56 md:h-64 relative overflow-hidden">
        <img
          src={project.image}
          alt={project.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent" />
        <div className="absolute bottom-4 sm:bottom-6 left-4 sm:left-6">
          <span
            className={`${tagColorMap[project.tagColor] || 'bg-primary'} text-white text-[10px] font-black uppercase px-2 py-1 rounded mb-2 inline-block`}
          >
            {project.tag}
          </span>
          <h4 className="text-xl sm:text-2xl font-bold text-white">{project.title}</h4>
        </div>
      </div>

      {/* Problem / Outcome */}
      <div className="p-4 sm:p-6 md:p-8 flex flex-col gap-6 sm:gap-8">
        <div className="flex-1">
          <div className="flex items-center gap-2 text-primary font-bold mb-2 sm:mb-3">
            <AlertTriangle className="w-4 h-4" />
            <span className="text-xs uppercase tracking-wider">The Problem</span>
          </div>
          <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">{project.problem}</p>
        </div>
        <div className="w-full h-px bg-slate-200" />
        <div className="flex-1">
          <div className="flex items-center gap-2 text-accent-green font-bold mb-2 sm:mb-3">
            <CheckCircle className="w-4 h-4" />
            <span className="text-xs uppercase tracking-wider">The Outcome</span>
          </div>
          <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">{project.outcome}</p>
        </div>
      </div>
    </div>
  );
}
