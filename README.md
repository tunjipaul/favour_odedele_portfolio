# Favour Odedele Personal Brand Platform

End-to-end personal brand platform with a public site, admin panel, and Node/Express API backed by MongoDB and Cloudinary.

**Quick links**
- Frontend: `favour-odedele-portfolio/`
- Backend: `backend/`

**High-level stack**
- Frontend: Vite, React, Tailwind CSS, React Router, Zustand
- Backend: Node, Express, MongoDB (Mongoose), JWT auth, Multer + Cloudinary, optional Resend email

**Repository structure**
```text
.
|-- favour-odedele-portfolio/   # Public site + admin panel (Vite)
|-- backend/                    # API server
|-- README.md                   # You are here
```

**Current positioning**
The site is a personal brand, author, and community platform for Favour Odedele. It focuses on:
- Hero
- About Me
- Three Highlights
- My Book: Becoming the 1%
- Community
- Gallery
- Contact

Legacy career-portfolio surfaces have been removed in favor of a focused personal-brand experience.

**Prerequisites**
- Node.js 18+ recommended
- npm 9+ recommended
- MongoDB Atlas or local MongoDB
- Cloudinary account for image and PDF uploads

**Environment variables**

Backend: `backend/.env`
- `MONGODB_URI` (required)
- `JWT_SECRET` (required)
- `JWT_EXPIRES_IN` (optional, e.g. `7d`)
- `FRONTEND_URL` (optional, for CORS allowlist)
- `RESEND_API_KEY` (optional, enables community confirmation emails)
- `RESEND_FROM_EMAIL` (required when Resend is enabled)
- `CLOUDINARY_CLOUD_NAME` (required for uploads)
- `CLOUDINARY_API_KEY` (required for uploads)
- `CLOUDINARY_API_SECRET` (required for uploads)
- `ADMIN_EMAIL` (required for seed script)
- `ADMIN_PASSWORD` (required for seed script)
- `PORT` (optional, default `5000`)

Frontend: `favour-odedele-portfolio/.env`
- `VITE_API_BASE_URL` (optional, defaults to `http://localhost:5000/api`)

**Local development**

Start the backend:
```bash
cd backend
npm install
npm run dev
```

Seed the database:
```bash
cd backend
npm run seed
```

Start the frontend:
```bash
cd favour-odedele-portfolio
npm install
npm run dev
```

Open in browser:
- Public site: `http://localhost:5173`
- Admin login: `http://localhost:5173/admin/login`

**API overview**
- Health: `GET /api/health`
- Public: `GET /api/projects`, `GET /api/gallery`, `GET /api/settings`, `POST /api/waitlist`
- Auth: `POST /api/auth/login`
- Admin: CRUD for highlights, gallery, settings, community subscribers, and uploads

**Notes**
- Admin JWT is stored in `localStorage` as `adminToken`.
- `Project` documents are now used as homepage highlights with `category: "highlight"`.
- `WaitlistEntry` documents are now community subscribers.
- Uploads use the admin upload endpoint with multipart field name `image`.

