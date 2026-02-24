import { Star, Menu, X } from 'lucide-react';
import useStore from '../../store/useStore';

const navLinks = [
  { label: 'Expertise', sectionId: 'expertise' },
  { label: 'Impact', sectionId: 'impact' },
  { label: 'Case Studies', sectionId: 'case-studies' },
  { label: 'Book', sectionId: 'book' },
  { label: 'Gallery', sectionId: 'gallery' },
];

export default function Navbar() {
  const { isMobileMenuOpen, toggleMobileMenu, closeMobileMenu } = useStore();

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    closeMobileMenu();
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-primary/10 backdrop-blur-md bg-background-light/90">
      <div className="max-w-7xl mx-auto px-4 lg:px-6 h-16 lg:h-20 flex items-center justify-between gap-4">

        {/* Logo */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white shadow-lg shadow-primary/10">
            <Star className="w-4 h-4 fill-current" />
          </div>
          {/* Full name on md+, initials on small */}
          <h1 className="font-extrabold tracking-tight uppercase font-serif text-sm sm:text-base lg:text-lg">
            <span className="hidden sm:inline">Favor Odedele</span>
            <span className="sm:hidden">F. Odedele</span>
          </h1>
        </div>

        {/* Desktop Navigation — only on lg+ to avoid crowding */}
        <nav className="hidden lg:flex items-center gap-6 xl:gap-10 flex-1 justify-center">
          {navLinks.map((link) => (
            <button
              key={link.label}
              onClick={() => scrollToSection(link.sectionId)}
              className="text-sm font-semibold hover:text-primary transition-colors whitespace-nowrap"
            >
              {link.label}
            </button>
          ))}
        </nav>

        {/* Right side: Contact Me (desktop) + Hamburger (mobile/tablet) */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Contact Me — only on lg+ */}
          <button
            onClick={() => scrollToSection('contact')}
            className="hidden lg:inline-flex bg-primary hover:bg-primary-dark text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-all shadow-md active:scale-95 shadow-primary/10 whitespace-nowrap"
          >
            Contact Me
          </button>

          {/* Hamburger — visible below lg */}
          <button
            onClick={toggleMobileMenu}
            className="lg:hidden text-slate-700 hover:text-primary transition-colors p-2 -mr-1"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile / Tablet Dropdown Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden border-t border-primary/10 bg-background-light/98 backdrop-blur-md shadow-lg">
          <nav className="flex flex-col px-4 py-3 gap-1 max-w-7xl mx-auto">
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
              Contact Me
            </button>
          </nav>
        </div>
      )}
    </header>
  );
}
