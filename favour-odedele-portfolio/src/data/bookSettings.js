export const DEFAULT_BOOK_SETTINGS = {
  title: 'Becoming the 1%',
  teaser:
    'A personal book on discipline, identity, excellence, and the quiet decisions that shape who we become.',
  coverUrl: '/images/placeholder-audacity.jpg',
  pdfUrl: '',
  purchaseUrl: '',
  progress: 0,
  stats: [
    { label: 'Book Notes', target: 1 },
    { label: 'Reader Updates', target: 1 },
    { label: 'Community', target: 1 },
  ],
};

export const normalizeBookSettings = (book = {}) => ({
  ...DEFAULT_BOOK_SETTINGS,
  ...book,
});
