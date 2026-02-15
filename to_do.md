
# Favor: Portfolio Website - Project Documentation

## 1. Project Overview
**Client:** Favor
**Role Title:** Programs Manager (Strictly *not* "Project Manager")
**Niche:** Education, Entrepreneurship, & Human Capacity Development
**Goal:** Create a high-fidelity, premium portfolio website that highlights strategic impact, "deep work," and excellence. The site must distinguish between generic project management and niche-specific *Program Management*.

## 2. Technical Stack
*   **Framework:** React (Vite)
*   **Styling:** Tailwind CSS
*   **State Management:** Zustand
*   **Icons:** Lucide-React or HeroIcons
*   **Fonts:** 
    *   *Primary:* Inter, Plus Jakarta Sans, or DM Sans (Clean, Modern).
    *   *Secondary (Headers):* Playfair Display or Lora (Optional, for an editorial/premium feel).

---

## 3. Brand Identity & Design System

### Color Palette
*   **Primary (Growth/Impact):** `Deep Forest Green` (e.g., `#064E3B` or similar). Used for backgrounds, text, and primary structure.
*   **Accent (Creativity/Energy):** `Magenta` (e.g., `#DB2777` or similar). Used for CTAs, hover states, and "New" badges.
*   **Background:** Clean White or Off-White (`#F9FAFB`) to maintain a "Curated" look.

### visual Philosophy
*   **"Excellence":** The client explicitly stated, "I dot my i's and cross my t's." The UI must be pixel-perfect. No clutter.
*   **"No Nonsense":** Avoid generic templates. The design should look high-end.
*   **Imagery:** 
    *   Use high-quality portraits (Professional).
    *   Use "Action Shots" (Moderating panels, speaking).
    *   *Constraint:* **DO NOT** use internal presentation slides from previous jobs (NDA). Use abstract representations or icons for "Presentation Design."

---

## 4. State Management (Zustand)

Create a store (`useStore.js`) to manage the following:

```javascript
import create from 'zustand'

const useStore = create((set) => ({
  // Modal State for Project Details
  activeProject: null,
  openProject: (project) => set({ activeProject: project }),
  closeProject: () => set({ activeProject: null }),

  // Book Waitlist Modal
  isWaitlistOpen: false,
  toggleWaitlist: () => set((state) => ({ isWaitlistOpen: !state.isWaitlistOpen })),
}))

export default useStore;
```

---

## 5. Site Architecture & Content Script

### A. Navbar
*   **Logo:** Text-based "FAVOR" (Bold, Serif).
*   **Links:** Work, Philosophy, The Book, Media.
*   **CTA:** "Let's Talk" (Green Background, White Text).

### B. Hero Section
*   **Headline:** "Designing Impactful Learning Pathways & Human Capacity Programs."
*   **Sub-headline:** "Managing the intersection of education and entrepreneurship with depth, curation, and excellence."
*   **Layout:** Split screen. Text on left, High-quality Portrait on right (with Magenta accent shape).

### C. The "Philosophy" Section (The Why)
*   *Layout:* 3-Column Grid of cards.
*   **Card 1: Excellence**
    *   "I dot my i's and cross my t's. From the application flyer to the presentation slide, I ensure creative precision. If it's not excellent, I don't ship it."
*   **Card 2: Depth & Curation**
    *   "I don't select speakers based on popularity. I research for 'deep work' to ensure beneficiaries get substance and value exchange, not just noise."
*   **Card 3: Crisis Management**
    *   "I anticipate problems. I turn chaos into feedback loops—building programs based on what beneficiaries *need*, not just what organizers *want*."

### D. Portfolio Section (Dynamic Data)
*   *Dev Note:* Map through this data array. Clicking a card opens the Modal.

**Project Data Structure:**

1.  **Embark Entrepreneurship Academy (PPA)**
    *   *Role:* Program Manager
    *   *Tags:* Virtual Academy, West Africa (NG, GH, CI)
    *   *Description:* Managed a 6-month virtual entrepreneurship academy. Oversaw rigorous selection, live sessions, spotlight shows, and mentorship.
    *   *Key Output:* Managed the "Capstone Project" (Business Ideation) and Pitch Competitions.

2.  **Thrive (Employability & Social Impact)**
    *   *Role:* Cafe Session Manager
    *   *Tags:* Social Impact, Scholarships
    *   *Description:* Curated intimate "Cafe Sessions" (30-50 people) for high-quality career development.
    *   *Impact:* Managed a scholarship program receiving **5,000+ applications**, selecting 50 beneficiaries for 50k Naira grants.

3.  **The Audacity Challenge**
    *   *Role:* Programs Lead
    *   *Tags:* Community, Accountability
    *   *Description:* Lead for a 50-day community challenge.
    *   *Key Story (Crisis Mgmt):* Successfully pivoted a speaker cancellation mid-program into a "Presentation Day," turning a scheduling conflict into a valuable beneficiary feedback loop.

4.  **Junior Chamber International (JCI)**
    *   *Role:* Director of Skills Development
    *   *Tags:* Leadership, Civic Engagement
    *   *Description:* Organized the maiden edition of **"Pound Sapa"** (Business of Skills).
    *   *Legacy:* The model is currently in its 3rd edition. Awarded "Most Outstanding Board Director." Published "Journeys in Development" newsletter.

### E. Featured Project: "The Book"
*   **Status:** "Coming Soon" (70% Complete).
*   **Title:** "Success Leaves Cues"
*   **Teaser:** "A curated guide for fresh graduates moving beyond generic advice (like 'fix your CV'). Featuring interviews with peers from Dangote, LBS, Chevron, and the creative industry."
*   **Interaction:** Button "Join Waitlist" triggers the Zustand store.

### F. Footer
*   **Quote:** "Program management is not about you... It is more about your beneficiaries."
*   **Socials:** LinkedIn, Email.

---

## 6. Implementation Guidelines (Client Constraints)

1.  **Terminology:** Always use **Programs Manager**. Never use "Project Manager."
2.  **Visuals:** 
    *   Ensure high contrast.
    *   Do not use generic stock photos of people shaking hands.
    *   Use abstract shapes or icons if real photos are unavailable for specific projects.
3.  **NDA Compliance:**
    *   **Do not** display actual internal slides from previous companies.
    *   Instead, use a "Locked" icon or a redacted thumbnail to represent "High-Quality Presentation Design."

## 7. Folder Structure Suggestion

```
/src
  /assets
    /images (portraits, book_mockup.png)
  /components
    /Layout (Navbar, Footer)
    /Sections (Hero, Philosophy, PortfolioGrid, BookTeaser)
    /UI (Button, Modal, ProjectCard)
  /store
    useStore.js
  /data
    projects.js
  App.jsx
  main.jsx
```
```