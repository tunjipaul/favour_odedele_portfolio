import { BookOpen, GraduationCap, Lightbulb, Users } from 'lucide-react';

const focusAreas = [
  {
    icon: GraduationCap,
    title: 'Education and growth',
    description: 'I care about learning as a personal discipline and as a tool for helping people see wider possibilities for their lives.',
  },
  {
    icon: Lightbulb,
    title: 'Ideas in public',
    description: 'I write, reflect, and build around leadership, entrepreneurship, identity, discipline, and becoming a more intentional person.',
  },
  {
    icon: Users,
    title: 'Community building',
    description: 'I am interested in rooms, circles, and initiatives that help people find clarity, accountability, and courage to move forward.',
  },
];

export default function AboutMe() {
  return (
    <section className="py-16 sm:py-20 lg:py-28 bg-white" id="about">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-[0.9fr_1.1fr] gap-10 lg:gap-16 items-start">
          <div>
            <p className="text-accent-magenta font-bold tracking-widest uppercase text-xs sm:text-sm mb-4">
              About Me
            </p>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight text-slate-950">
              I am building a life around ideas, people, and personal becoming.
            </h2>
          </div>

          <div className="space-y-6 text-slate-600 text-base sm:text-lg leading-relaxed">
            <p>
              My work sits at the intersection of education, leadership, writing, and community. I am drawn to the question of how people grow: what shapes discipline, what gives people courage, and what kind of environments help them become more than they once imagined.
            </p>
            <p>
              This site is a home for my personal reflections, independent initiatives, book updates, community experiments, and the work I am gradually building as a future social entrepreneur.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
              {focusAreas.map((item) => (
                <div key={item.title} className="border border-slate-200 bg-background-muted p-5 rounded-xl">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center mb-4">
                    <item.icon className="w-5 h-5" />
                  </div>
                  <h3 className="font-black text-slate-950 mb-2">{item.title}</h3>
                  <p className="text-sm leading-relaxed text-slate-500">{item.description}</p>
                </div>
              ))}
            </div>
            <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700">
              <BookOpen className="w-4 h-4 text-accent-magenta" />
              Author of Becoming the 1%
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
