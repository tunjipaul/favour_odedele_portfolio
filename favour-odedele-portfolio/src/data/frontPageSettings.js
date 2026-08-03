export const DEFAULT_ABOUT_SETTINGS = {
  eyebrow: 'About Me',
  heading: 'I am building a life around ideas, people, and personal becoming.',
  paragraph1:
    'My work sits at the intersection of education, leadership, writing, and community. I am drawn to the question of how people grow: what shapes discipline, what gives people courage, and what kind of environments help them become more than they once imagined.',
  paragraph2:
    'This site is a home for my personal reflections, independent initiatives, book updates, community experiments, and the work I am gradually building as a future social entrepreneur.',
  bookBadge: 'Author of Becoming the 1%',
  focusAreas: [
    {
      title: 'Education and growth',
      description:
        'I care about learning as a personal discipline and as a tool for helping people see wider possibilities for their lives.',
    },
    {
      title: 'Ideas in public',
      description:
        'I write, reflect, and build around leadership, entrepreneurship, identity, discipline, and becoming a more intentional person.',
    },
    {
      title: 'Community building',
      description:
        'I am interested in rooms, circles, and initiatives that help people find clarity, accountability, and courage to move forward.',
    },
  ],
};

export const DEFAULT_HIGHLIGHTS_SECTION = {
  eyebrow: 'Major Highlights',
  heading: 'A few personal milestones from the work I am building.',
};

export function normalizeAboutSettings(data) {
  const focusAreas = Array.isArray(data?.focusAreas) && data.focusAreas.length
    ? data.focusAreas.map((item, index) => ({
        title: item?.title?.trim() || DEFAULT_ABOUT_SETTINGS.focusAreas[index]?.title || '',
        description: item?.description?.trim() || DEFAULT_ABOUT_SETTINGS.focusAreas[index]?.description || '',
      }))
    : DEFAULT_ABOUT_SETTINGS.focusAreas;

  return {
    eyebrow: data?.eyebrow?.trim() || DEFAULT_ABOUT_SETTINGS.eyebrow,
    heading: data?.heading?.trim() || DEFAULT_ABOUT_SETTINGS.heading,
    paragraph1: data?.paragraph1?.trim() || DEFAULT_ABOUT_SETTINGS.paragraph1,
    paragraph2: data?.paragraph2?.trim() || DEFAULT_ABOUT_SETTINGS.paragraph2,
    bookBadge: data?.bookBadge?.trim() || DEFAULT_ABOUT_SETTINGS.bookBadge,
    focusAreas,
  };
}

export function normalizeHighlightsSection(data) {
  return {
    eyebrow: data?.eyebrow?.trim() || DEFAULT_HIGHLIGHTS_SECTION.eyebrow,
    heading: data?.heading?.trim() || DEFAULT_HIGHLIGHTS_SECTION.heading,
  };
}
