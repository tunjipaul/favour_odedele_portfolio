export const DEFAULT_BOOK_SETTINGS = {
  title: 'Success Leaves Cues',
  teaser:
    'An executive playbook on scaling operational excellence and building sustainable impact in developing markets. Pre-order details coming soon.',
  progress: 70,
  stats: [
    { label: 'Days Left', target: 45 },
    { label: 'Chapters Done', target: 7 },
    { label: 'Key Pillars', target: 4 },
  ],
};

export const normalizeBookSettings = (book = {}) => {
  const stats = Array.isArray(book.stats) && book.stats.length
    ? book.stats.slice(0, 3).map((stat, index) => ({
        ...DEFAULT_BOOK_SETTINGS.stats[index],
        ...stat,
      }))
    : DEFAULT_BOOK_SETTINGS.stats;

  return {
    ...DEFAULT_BOOK_SETTINGS,
    ...book,
    stats,
  };
};
