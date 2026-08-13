import { Menu, X } from 'lucide-react';
import useStore from '../../store/useStore';

const navLinks = [
  { label: 'About', sectionId: 'about' },
  { label: 'Highlights', sectionId: 'highlights' },
  { label: 'Book', sectionId: 'book' },
  { label: 'Community', sectionId: 'community' },
  { label: 'Gallery', sectionId: 'gallery' },
];

export default function Navbar() {
  const { isMobileMenuOpen, toggleMobileMenu, closeMobileMenu } = useStore();

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const header = document.querySelector('header');
      const offset = header ? header.offsetHeight : 0;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
    closeMobileMenu();
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-primary/10 backdrop-blur-md bg-background-light/90">
      <div className="max-w-7xl mx-auto px-4 lg:px-6 h-16 lg:h-20 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2 shrink-0">
          <span className="font-name text-2xl sm:text-3xl lg:text-4xl leading-none select-none">
            <span className="hidden sm:inline">Favour Odedele</span>
            <span className="sm:hidden">F. Odedele</span>
          </span>
        </div>

        <nav className="hidden lg:flex items-center gap-6 xl:gap-10 flex-1 justify-center" aria-label="Main Navigation">
          {navLinks.map((link) => (
            <button
              key={link.label}
              onClick={() => scrollToSection(link.sectionId)}
              className="text-sm font-semibold hover:text-primary transition-colors whitespace-nowrap cursor-pointer"
            >
              {link.label}
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => scrollToSection('contact')}
            className="hidden lg:inline-flex bg-primary hover:bg-primary-dark text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-all active:scale-95 whitespace-nowrap cursor-pointer"
          >
            Contact
          </button>

          <button
            onClick={toggleMobileMenu}
            className="lg:hidden text-slate-700 hover:text-primary transition-colors p-2 -mr-1"
            aria-label={isMobileMenuOpen ? 'Close mobile menu' : 'Open mobile menu'}
            aria-expanded={isMobileMenuOpen}
            aria-controls="mobile-navigation"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="lg:hidden border-t border-primary/10 bg-background-light/98 backdrop-blur-md">
          <nav id="mobile-navigation" aria-label="Mobile Navigation" className="flex flex-col px-4 py-3 gap-1 max-w-7xl mx-auto">
            {navLinks.map((link) => (
              <button
                key={link.label}
                onClick={() => scrollToSection(link.sectionId)}
                className="text-sm font-semibold py-3 px-4 rounded-lg hover:bg-primary/5 hover:text-primary transition-colors text-left"
              >
                {link.label}
              </button>
            ))}
            <div className="h-px bg-slate-100 my-2" />
            <button
              onClick={() => scrollToSection('contact')}
              className="bg-primary text-white text-center py-3 px-4 rounded-lg font-bold hover:bg-primary-dark transition-colors active:scale-95"
            >
              Contact
            </button>
          </nav>
        </div>
      )}
    </header>
  );
}


