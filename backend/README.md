# Backend API

Node/Express API for the portfolio public site and admin panel. Uses MongoDB for content, JWT for admin auth, and Cloudinary for media uploads.

**Tech**
- Express
- MongoDB + Mongoose
- JWT auth
- Multer + Cloudinary

**Project structure**
```
backend/
|-- config/        # Database connection
|-- controllers/   # Request handlers
|-- middleware/    # Auth and upload
|-- models/        # Mongoose schemas
|-- routes/        # /api, /api/auth, /api/admin
|-- seed/          # Seed script
|-- server.js      # App entrypoint
```

**Environment variables**
Create `backend/.env` with:
- `MONGODB_URI` (required)
- `JWT_SECRET` (required)
- `JWT_EXPIRES_IN` (optional, e.g. `7d`)
- `FRONTEND_URL` (optional, adds to CORS allowlist)
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

**Local run**
```
cd backend
npm install
npm run dev
```

**Seed the database**
```
cd backend
npm run seed
```
Warning: seeding deletes existing data and recreates it.

**Routes**

Public (no auth):
- `GET /api/projects`
- `GET /api/gallery`
- `GET /api/metrics`
- `GET /api/expertise`
- `GET /api/settings`
- `POST /api/waitlist`

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
- `GET /api/admin/metrics`
- `PUT /api/admin/metrics/:id`
- `GET /api/admin/expertise`
- `POST /api/admin/expertise`
- `PUT /api/admin/expertise/:id`
- `DELETE /api/admin/expertise/:id`
- `GET /api/admin/settings`
- `PUT /api/admin/settings`
- `GET /api/admin/waitlist`
- `POST /api/admin/upload` (multipart form-data, field name `image`)

Health:
- `GET /api/health`

**CORS**
Allowed origins include:
- `http://localhost:5173`
- `http://localhost:5174`
- `FRONTEND_URL` from the environment

**Auth flow**
- Admin logs in with email and password.
- API returns a JWT.
- Frontend stores the token and sends it as `Authorization: Bearer <token>`.

**Uploads**
- Upload endpoint accepts a single file field named `image`.
- Files are stored in Cloudinary under the `favour-portfolio` folder.
