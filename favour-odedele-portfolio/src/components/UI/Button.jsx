export default function Button({ children, variant = 'primary', href, onClick, className = '' }) {
  const baseClasses = 'px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-bold transition-all inline-flex items-center justify-center gap-2 text-sm sm:text-base';

  const variants = {
    primary: 'bg-primary hover:bg-primary-dark text-white shadow-lg shadow-primary/20 active:scale-95',
    outline: 'bg-white border-2 border-slate-200 hover:bg-slate-50 active:scale-95',
    accent: 'bg-accent-magenta hover:bg-accent-magenta/90 text-white shadow-lg shadow-accent-magenta/20 active:scale-95',
  };

  const classes = `${baseClasses} ${variants[variant] || variants.primary} ${className}`;

  // If onClick is provided, render as button (for scroll functions)
  if (onClick) {
    return (
      <button onClick={onClick} className={classes}>
        {children}
      </button>
    );
  }

  // If href is provided, render as anchor (for external links)
  if (href) {
    return (
      <a href={href} className={classes}>
        {children}
      </a>
    );
  }

  // Default to button
  return (
    <button className={classes}>
      {children}
    </button>
  );
}
