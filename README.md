## 🌿 Favor Odedele — Portfolio & Admin API

An end‑to‑end portfolio experience for **Favor Odedele**, combining a premium React frontend with a secure Node/Express + MongoDB Atlas backend and content admin panel.

---

### ✨ Tech Stack Overview

- **Frontend (Vite + React 19)**  
  - Tailwind CSS 4 (`@tailwindcss/vite`) with custom theme tokens  
  - React Router (public site + `/admin` panel)  
  - Zustand for global UI state (modals, mobile nav)  
  - Lucide + React Icons for crisp iconography

- **Backend (Node + Express)**  
  - MongoDB Atlas via **Mongoose**  
  - JWT‑based admin auth  
  - Multer + Cloudinary for image uploads  
  - CORS + dotenv for secure configuration

---

### 🧭 Repository Structure

```text
Favour's Portfolio/
├─ favour-odedele-portfolio/      # React + Vite frontend
│  ├─ src/
│  │  ├─ components/
│  │  │  ├─ Layout/               # Navbar, Footer
│  │  │  ├─ Sections/             # Hero, Expertise, Metrics, CaseStudies, BookTeaser, Gallery
│  │  │  └─ UI/                   # Button, Modal, ProjectCard
│  │  ├─ store/useStore.js        # Zustand store (modals, mobile menu)
│  │  ├─ data/projects.js         # Seed project & gallery data (fallback)
│  │  └─ App.jsx                  # Routes (public + /admin)
│  ├─ index.html
│  └─ EXPLAINER.md                # Design & architecture notes
│
├─ backend/                       # Express API + Admin backend
│  ├─ server.js                   # App entry, CORS, routes
│  ├─ config/db.js                # MongoDB connection
│  ├─ models/                     # Project, GalleryItem, Metric, ExpertisePillar, Admin, SiteSettings, WaitlistEntry
│  ├─ controllers/                # Public + admin controllers
│  ├─ routes/                     # /api, /api/auth, /api/admin
│  ├─ middleware/                 # auth (JWT), upload (Multer + Cloudinary)
│  └─ seed/seed.js                # Seed initial DB content
│
├─ code.html                      # Static Tailwind hero prototype
└─ README.md                      # You are here 💫
```

---

### 🌐 How Frontend & Backend Talk

- **Base API URL (frontend)**  
  - Public sections (`CaseStudies`, `Gallery`, `BookTeaser`) call:  
    `http://localhost:5000/api/...` during local development.
  - Admin utilities (`src/admin/utils/api.js`) use the same base.

- **Public endpoints (no auth)**  
  - `GET /api/projects` → visible case studies  
  - `GET /api/gallery` → gallery images  
  - `GET /api/metrics` → impact metrics bar  
  - `GET /api/expertise` → expertise pillars  
  - `GET /api/settings` → global site copy/settings  
  - `POST /api/waitlist` → book waitlist from **BookTeaser**

- **Admin endpoints (JWT auth)**  
  - `/api/auth/login` → email/password login, returns JWT  
  - `/api/admin/projects` → CRUD for projects  
  - `/api/admin/gallery` → CRUD for gallery items (with image upload)  
  - `/api/admin/metrics`, `/api/admin/expertise`, `/api/admin/settings`, `/api/admin/waitlist`

The frontend will **gracefully fall back** to local mock data if the API is down, so the portfolio still renders while you debug.

---

### 🧪 Local Development

#### 1️⃣ Backend (API + MongoDB)

1. Create `backend/.env` (already present in this repo) with:

   ```env
   MONGODB_URI=<your Atlas connection string>
   JWT_SECRET=<strong-random-secret>
   FRONTEND_URL=http://localhost:5173
   CLOUDINARY_CLOUD_NAME=<cloudinary-name>
   CLOUDINARY_API_KEY=<cloudinary-key>
   CLOUDINARY_API_SECRET=<cloudinary-secret>
   ```

2. In **MongoDB Atlas**, whitelist your IP in **Security → Network Access**.  
3. From `backend/`:

   ```bash
   npm install
   npm run seed     # optional: seed initial content
   npm run dev      # nodemon server on http://localhost:5000
   ```

#### 2️⃣ Frontend (Vite + React)

From `favour-odedele-portfolio/`:

```bash
npm install
npm run dev        # Vite dev server on http://localhost:5173
```

Then open `http://localhost:5173` in your browser:

- Public site at `/`  
- Admin login at `/admin/login`

---

### 📦 Deployment Notes

- **Backend**  
  - Deploy `backend/` to a Node host (Render, Railway, VPS, etc.).  
  - Set the same `.env` vars in the hosting dashboard.  
  - Update **CORS**: `FRONTEND_URL=https://your-portfolio-domain.com`.

- **Frontend**  
  - Configure a single API base (e.g. via `VITE_API_URL`) and point it at your deployed backend.  
  - Build & deploy the static site:

    ```bash
    cd favour-odedele-portfolio
    npm run build
    ```

---

### 💡 Key Design Highlights

- Hero inspired by the custom `code.html` layout with animated name + grayscale‑to‑color portrait.
- Strong visual hierarchy for impact metrics, case studies, and gallery.
- Admin‑driven content so future updates don’t require code changes.

---

### 🙋‍♀️ For Future You (or Collaborators)

- Start by reading `favour-odedele-portfolio/EXPLAINER.md` for deeper design rationale.  
- Use the **admin panel** to tweak content; only touch seed data when bootstrapping a new environment.  
- Always keep “**Programs Manager**” terminology consistent with client requirements.

