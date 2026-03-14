# Frontend (Public Site + Admin Panel)

Vite + React frontend for the public portfolio and the admin dashboard.

**Tech**
- Vite
- React 19
- React Router
- Tailwind CSS
- Zustand

**Project structure**
```
favour-odedele-portfolio/
|-- public/
|-- src/
|   |-- admin/              # Admin pages and layout
|   |-- components/         # Public site components
|   |-- config.js           # API base URL
|   |-- App.jsx             # Routes
|-- index.html
|-- vite.config.js
```

**Environment variables**
Create `favour-odedele-portfolio/.env`:
- `VITE_API_BASE_URL` (optional, defaults to `http://localhost:5000/api`)

**Scripts**
- `npm run dev` starts Vite dev server
- `npm run build` builds for production
- `npm run preview` previews the build
- `npm run lint` runs ESLint

**Local run**
```
cd favour-odedele-portfolio
npm install
npm run dev
```

**Routes**
- Public site: `/`
- Admin login: `/admin/login`
- Admin dashboard: `/admin/dashboard`

**API base**
The API base is defined in `src/config.js`. You can override it with `VITE_API_BASE_URL`.

**Auth storage**
Admin JWT is stored in `localStorage` under `adminToken`.
