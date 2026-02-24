# Favor Odedele Portfolio — Code Explainer

This document explains the **thought process, architecture decisions, and code patterns** used in building this portfolio.

---

## 1. Architecture Overview

```
/src
  /assets             → Static assets (React logo, etc.)
  /components
    /Layout
      Navbar.jsx       → Sticky navigation with mobile menu
      Footer.jsx       → CTA section + copyright bar
    /Sections
      Hero.jsx         → Split-screen hero with portrait
      Expertise.jsx    → 4-column competency grid
      ImpactMetrics.jsx → Green stats bar
      CaseStudies.jsx  → Project cards with detail modal
      BookTeaser.jsx   → Book preview with waitlist modal
      Gallery.jsx      → Masonry photo gallery
    /UI
      Button.jsx       → Reusable button (primary/outline/accent)
      Modal.jsx        → Overlay modal with body scroll lock
      ProjectCard.jsx  → Case study card with problem/outcome
  /data
    projects.js        → Project + gallery data arrays
  /store
    useStore.js        → Zustand global state
  App.jsx              → Main composition
  main.jsx             → React entry point
  index.css            → Tailwind CSS 4 theme + custom utilities
```

---

## 2. Design Decisions

### Color System

Based on the client's brand identity from `to_do.md`:

- **Primary (Deep Olive Green `#556b2f`)** — Represents growth, stability, impact
- **Accent Magenta (`#d946ef`)** — Used for CTAs, "new" badges, energy
- **Accent Green (`#22c55e`)** — Used for success states, outcomes
- **Background Light (`#fdfdfb`)** and **Muted (`#f4f4f0`)** — Clean, premium feel

### Typography

- **Public Sans** — Primary font. Clean, modern, geometric sans-serif
- **Playfair Display** — Used for the "FAVOR" logo and book title. Adds editorial, premium weight

### Hero Section Design

Combined two templates:

1. **`code.html` template** — Split layout with headline left, portrait right, decorative blur accents
2. **`Personal Portfolio___.jfif`** — Inspiration for bold typography weight and portrait framing

The hero uses a `grayscale` → `grayscale-0` hover transition on the portrait for a premium, editorial feel.

---

## 3. State Management (Zustand)

```javascript
// useStore.js manages 3 concerns:
{
  activeProject / openProject / closeProject  → Case study detail modal
  isWaitlistOpen / toggleWaitlist             → Book waitlist modal
  isMobileMenuOpen / toggleMobileMenu / closeMobileMenu → Responsive nav
}
```

**Why Zustand over Context API?**

- Simpler API — no Provider wrapper needed
- Better performance — components only re-render when their subscribed state changes
- The portfolio has multiple modals that need global coordination

---

## 4. Tailwind CSS 4 Approach

Using the new `@theme` directive (Tailwind v4 syntax) instead of `tailwind.config.js`:

```css
@import "tailwindcss";

@theme {
  --color-primary: #556b2f;
  --font-display: "Public Sans", sans-serif;
  /* ... */
}
```

This works because the project uses `@tailwindcss/vite` plugin — Tailwind is compiled at build time with zero runtime cost.

### Custom Utilities

- **`.geometric-bg`** — Subtle dot pattern using `radial-gradient` (same as `code.html`)
- **`.masonry`** — CSS `column-count` for the gallery layout

---

## 5. Component Patterns

### ProjectCard → Modal Flow

1. User clicks a `ProjectCard`
2. Card calls `useStore.openProject(project)` with the project data
3. `CaseStudies.jsx` reads `activeProject` from the store
4. If `activeProject` is truthy, `Modal` renders with project details
5. Clicking backdrop or X button calls `closeProject()`

### BookTeaser → Waitlist Flow

1. User clicks "Join Waitlist" button
2. Zustand `toggleWaitlist()` opens the modal
3. User submits email form
4. Inline success message appears (green checkmark + "You're on the list!")
5. Auto-closes after 3 seconds

---

## 6. Replacing Placeholder Images

All images currently point to empty placeholder files in `/public/images/`. To replace them:

1. **Hero Portrait:** Replace `/public/images/placeholder-hero.jpg` with Favor's professional portrait
2. **Case Studies:** Replace `placeholder-embark.jpg`, `placeholder-thrive.jpg`, `placeholder-audacity.jpg`, `placeholder-jci.jpg`
3. **Gallery:** Replace `placeholder-gallery-1.jpg` through `placeholder-gallery-6.jpg`

The file paths are defined in `/src/data/projects.js` — you can also change the paths there if needed.

---

## 7. Key Terminology Constraint

Per client instructions, the site always uses **"Programs Manager"** — never "Project Manager." This is reflected in the hero subtitle, case study roles, and meta description.
