import express from 'express';
import protect from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';
import {
  getAllProjects,
  createProject,
  updateProject,
  deleteProject,
} from '../controllers/projectController.js';
import {
  getAllGalleryItems,
  createGalleryItem,
  updateGalleryItem,
  deleteGalleryItem,
} from '../controllers/galleryController.js';
import {
  getMetrics,
  updateMetric,
  getAllExpertise,
  createExpertisePillar,
  updateExpertisePillar,
  deleteExpertisePillar,
  getSettings,
  updateSettings,
  getWaitlist,
} from '../controllers/contentController.js';

const router = express.Router();

// All routes in this file are protected by the `protect` middleware.
// You can either apply it per-route (as below) or use router.use(protect) once.
// Per-route is more explicit and easier to understand.

// ─── PROJECTS ──────────────────────────────────────────────────────────────
router.get('/projects', protect, getAllProjects);
router.post('/projects', protect, createProject);
router.put('/projects/:id', protect, updateProject);
router.delete('/projects/:id', protect, deleteProject);

// ─── GALLERY ───────────────────────────────────────────────────────────────
router.get('/gallery', protect, getAllGalleryItems);
router.post('/gallery', protect, createGalleryItem);
router.put('/gallery/:id', protect, updateGalleryItem);
router.delete('/gallery/:id', protect, deleteGalleryItem);

// ─── METRICS ───────────────────────────────────────────────────────────────
router.get('/metrics', protect, getMetrics);
router.put('/metrics/:id', protect, updateMetric);

// ─── EXPERTISE ─────────────────────────────────────────────────────────────
router.get('/expertise', protect, getAllExpertise);
router.post('/expertise', protect, createExpertisePillar);
router.put('/expertise/:id', protect, updateExpertisePillar);
router.delete('/expertise/:id', protect, deleteExpertisePillar);

// ─── SITE SETTINGS ─────────────────────────────────────────────────────────
router.get('/settings', protect, getSettings);
router.put('/settings', protect, updateSettings);

// ─── WAITLIST ──────────────────────────────────────────────────────────────
router.get('/waitlist', protect, getWaitlist);

// ─── IMAGE UPLOAD ──────────────────────────────────────────────────────────
// upload.single('image') is middleware that processes a single file
// named 'image' in the form data, then Cloudinary stores it
router.post('/upload', protect, upload.single('image'), (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
  res.json({ url: req.file.path }); // Cloudinary returns the URL as req.file.path
});

export default router;
