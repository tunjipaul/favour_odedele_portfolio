import 'dotenv/config';         // Load .env variables FIRST — everything else depends on them
import express from 'express';
import cors from 'cors';
import connectDB from './config/db.js';
import publicRoutes from './routes/publicRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import authRoutes from './routes/authRoutes.js';

// ─── Connect to MongoDB ─────────────────────────────────────────────────────
connectDB(); // Async — this runs in the background while Express sets up

// ─── Create Express App ─────────────────────────────────────────────────────
const app = express();

// ─── Middleware (runs on EVERY request before routes) ───────────────────────
// These are like FastAPI's app.add_middleware() calls

// CORS: Allows requests from the frontend origin
// Without this, browsers block cross-origin API calls (security feature)
app.use(cors({
  origin: [
    'http://localhost:5173',   // Vite frontend dev server
    'http://localhost:5174',   // Admin panel dev server
    process.env.FRONTEND_URL, // Production frontend URL (set in .env later)
  ],
  credentials: true,
}));

// express.json() parses incoming request bodies with JSON content
// Without this, req.body is always undefined
// FastAPI does this automatically; in Express you opt in explicitly
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // Parses form data too

// ─── Routes ─────────────────────────────────────────────────────────────────
// Mount each router at a base URL prefix
// Example: publicRoutes has GET /projects → becomes GET /api/projects
app.use('/api', publicRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);

// ─── Health Check ────────────────────────────────────────────────────────────
// Useful for checking if the server is running at all
app.get('/', (req, res) => {
  res.json({ message: '✅ Favour Portfolio API is running' });
});

// ─── 404 Handler ────────────────────────────────────────────────────────────
// Any request that doesn't match a route lands here
app.use((req, res) => {
  res.status(404).json({ message: `Route not found: ${req.method} ${req.url}` });
});

// ─── Global Error Handler ────────────────────────────────────────────────────
// If any route calls next(error), it lands here
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err.stack);
  res.status(500).json({ message: 'Internal Server Error', error: err.message });
});

// ─── Start Server ────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
