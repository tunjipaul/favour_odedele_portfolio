# Backend API

Node/Express API for Favour Odedele's personal brand platform. Uses MongoDB for editable homepage content, JWT for admin auth, Cloudinary for media uploads, and optional Resend email for community confirmations.

**Tech**
- Express
- MongoDB + Mongoose
- JWT auth
- Multer + Cloudinary
- Resend

**Environment variables**
Create `backend/.env` with:
- `MONGODB_URI` (required)
- `JWT_SECRET` (required)
- `JWT_EXPIRES_IN` (optional, e.g. `7d`)
- `FRONTEND_URL` (optional, adds to CORS allowlist)
- `RESEND_API_KEY` (optional, enables community confirmation emails)
- `RESEND_FROM_EMAIL` (required when Resend is enabled)
- `CLOUDINARY_CLOUD_NAME` (required for uploads)
- `CLOUDINARY_API_KEY` (required for uploads)
- `CLOUDINARY_API_SECRET` (required for uploads)
- `ADMIN_EMAIL` (required for seed script)
- `ADMIN_PASSWORD` (required for seed script)
- `PORT` (optional, default `5000`)

**Scripts**
- `npm run dev` starts the API with nodemon
- `npm start` starts the API with node
- `npm run seed` clears and seeds the database

**Routes**

Public:
- `GET /api/projects` - visible highlights only
- `GET /api/gallery`
- `GET /api/settings`
- `POST /api/waitlist` - community subscriber signup
- `GET /api/health`

Auth:
- `POST /api/auth/login`

Admin (JWT required):
- `GET /api/admin/projects`
- `POST /api/admin/projects`
- `PUT /api/admin/projects/:id`
- `DELETE /api/admin/projects/:id`
- `GET /api/admin/gallery`
- `POST /api/admin/gallery`
- `PUT /api/admin/gallery/:id`
- `DELETE /api/admin/gallery/:id`
- `GET /api/admin/settings`
- `PUT /api/admin/settings`
- `GET /api/admin/waitlist`
- `POST /api/admin/upload` (multipart form-data, field name `image`)

**Content model notes**
- Projects are now homepage highlights. Public results are filtered to `category: "highlight"`.
- Waitlist entries are used as community subscribers.
- Site settings store hero copy, book title/description/cover/PDF, and contact links.
