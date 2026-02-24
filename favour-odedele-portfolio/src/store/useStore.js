import { create } from 'zustand';

const useStore = create((set) => ({
  // Modal State for Project Details
  activeProject: null,
  openProject: (project) => set({ activeProject: project }),
  closeProject: () => set({ activeProject: null }),

  // Book Waitlist Modal
  isWaitlistOpen: false,
  toggleWaitlist: () => set((state) => ({ isWaitlistOpen: !state.isWaitlistOpen })),

  // Mobile Menu
  isMobileMenuOpen: false,
  toggleMobileMenu: () => set((state) => ({ isMobileMenuOpen: !state.isMobileMenuOpen })),
  closeMobileMenu: () => set({ isMobileMenuOpen: false }),
}));

export default useStore;
