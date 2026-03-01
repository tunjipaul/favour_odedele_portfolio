import { useState, useEffect } from 'react';
import { projects as fallbackProjects } from '../../data/projects';
import ProjectCard from '../UI/ProjectCard';
import Modal from '../UI/Modal';
import useStore from '../../store/useStore';
import { MapPin, Briefcase, Target, Trophy } from 'lucide-react';

const API = 'http://localhost:5000/api';

export default function CaseStudies() {
  const { activeProject, closeProject } = useStore();
  const [projects, setProjects] = useState(fallbackProjects); // hardcoded fallback

  useEffect(() => {
    fetch(`${API}/projects`)
      .then((res) => res.json())
      .then((data) => { if (Array.isArray(data) && data.length) setProjects(data); })
      .catch(() => {}); // silently keep fallback data if API fails
  }, []);

  return (
    <section className="py-12 sm:py-16 md:py-20 lg:py-24 bg-background-muted" id="case-studies">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-black mb-8 sm:mb-12 md:mb-16 text-center">
          Case Studies: Problems Solved
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 md:gap-10">
          {projects.map((project, index) => (
            <ProjectCard key={project._id || project.id || `${project.title}-${index}`} project={project} />
          ))}
        </div>
      </div>

      {/* Project Detail Modal */}
      <Modal
        isOpen={!!activeProject}
        onClose={closeProject}
        title={activeProject?.title || ''}
      >
        {activeProject && (
          <div className="space-y-6">
            {/* Image */}
            <div className="rounded-xl overflow-hidden h-48">
              <img
                src={activeProject.image}
                alt={activeProject.title}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Role & Region */}
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-2 text-sm text-slate-600 bg-slate-50 px-3 py-1.5 rounded-full">
                <Briefcase className="w-4 h-4 text-primary" />
                {activeProject.role}
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-600 bg-slate-50 px-3 py-1.5 rounded-full">
                <MapPin className="w-4 h-4 text-accent-magenta" />
                {activeProject.region}
              </div>
            </div>

            {/* Description */}
            <p className="text-slate-700 leading-relaxed">
              {activeProject.description}
            </p>

            {/* Problem */}
            <div className="bg-red-50 border border-red-100 rounded-xl p-4">
              <div className="flex items-center gap-2 text-red-700 font-bold mb-2">
                <Target className="w-4 h-4" />
                <span className="text-xs uppercase tracking-wider">The Problem</span>
              </div>
              <p className="text-red-800 text-sm leading-relaxed">
                {activeProject.problem}
              </p>
            </div>

            {/* Outcome */}
            <div className="bg-green-50 border border-green-100 rounded-xl p-4">
              <div className="flex items-center gap-2 text-green-700 font-bold mb-2">
                <Trophy className="w-4 h-4" />
                <span className="text-xs uppercase tracking-wider">The Outcome</span>
              </div>
              <p className="text-green-800 text-sm leading-relaxed">
                {activeProject.outcome}
              </p>
            </div>

            {/* Key Output */}
            <div className="bg-primary/5 border border-primary/10 rounded-xl p-4">
              <h4 className="font-bold text-sm mb-2 text-primary">Key Output</h4>
              <p className="text-slate-700 text-sm leading-relaxed">
                {activeProject.keyOutput}
              </p>
            </div>
          </div>
        )}
      </Modal>
    </section>
  );
}
