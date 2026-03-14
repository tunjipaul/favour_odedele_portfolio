# Favor Odedele Portfolio (Frontend + Admin + API)

End-to-end portfolio platform with a public site, an admin panel, and a Node/Express API backed by MongoDB and Cloudinary.

**Quick links**
- Frontend: `favour-odedele-portfolio/`
- Backend: `backend/`

**High-level stack**
- Frontend: Vite, React, Tailwind CSS, React Router, Zustand
- Backend: Node, Express, MongoDB (Mongoose), JWT auth, Multer + Cloudinary

**Repository structure**
```
.
|-- favour-odedele-portfolio/   # Frontend + admin panel (Vite)
|-- backend/                    # API server
|-- README.md                   # You are here
```

**Prerequisites**
- Node.js 18+ recommended
- npm 9+ recommended
- MongoDB Atlas (or a local MongoDB instance)
- Cloudinary account (for image uploads)

**Environment variables**

Backend: `backend/.env`
- `MONGODB_URI` (required)
- `JWT_SECRET` (required)
- `JWT_EXPIRES_IN` (optional, e.g. `7d`)
- `FRONTEND_URL` (optional, for CORS allowlist)
- `CLOUDINARY_CLOUD_NAME` (required for uploads)
- `CLOUDINARY_API_KEY` (required for uploads)
- `CLOUDINARY_API_SECRET` (required for uploads)
- `ADMIN_EMAIL` (required for seed script)
- `ADMIN_PASSWORD` (required for seed script)
- `PORT` (optional, default `5000`)

Frontend: `favour-odedele-portfolio/.env`
- `VITE_API_BASE_URL` (optional, defaults to `http://localhost:5000/api`)

**Local development**

1. Start the backend
```
cd backend
npm install
npm run dev
```

2. (Optional) Seed the database
```
cd backend
npm run seed
```

3. Start the frontend
```
cd favour-odedele-portfolio
npm install
npm run dev
```

4. Open in browser
- Public site: `http://localhost:5173`
- Admin login: `http://localhost:5173/admin/login`

**API overview**
- Health: `GET /api/health`
- Public: `GET /api/projects`, `GET /api/gallery`, `GET /api/metrics`, `GET /api/expertise`, `GET /api/settings`, `POST /api/waitlist`
- Auth: `POST /api/auth/login`
- Admin (JWT): `/api/admin/*` CRUD for projects, gallery, metrics, expertise, settings, waitlist, and uploads

**Deployment**
- Backend
1. Deploy `backend/` to your Node host.
2. Set all backend env vars in the hosting dashboard.
3. Set `FRONTEND_URL` to your production frontend origin.

- Frontend
1. Set `VITE_API_BASE_URL` to your deployed API base.
2. Build and deploy.
```
cd favour-odedele-portfolio
npm run build
```

**Notes**
- The admin panel uses JWT stored in `localStorage`.
- Image uploads go directly to Cloudinary from the API server.

**More docs**
- Frontend README: `favour-odedele-portfolio/README.md`
- Backend README: `backend/README.md`
