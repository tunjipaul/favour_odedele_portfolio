import express from 'express';
import { getProjects } from '../controllers/projectController.js';
import { getGalleryItems } from '../controllers/galleryController.js';
import {
  getMetrics,
  getExpertise,
  getSettings,
  joinWaitlist,
} from '../controllers/contentController.js';

const router = express.Router();

// These routes are accessible by anyone — no auth required
// The public portfolio reads from these endpoints
router.get('/projects', getProjects);
router.get('/gallery', getGalleryItems);
router.get('/metrics', getMetrics);
router.get('/expertise', getExpertise);
router.get('/settings', getSettings);
router.post('/waitlist', joinWaitlist); // Book waitlist form submission

export default router;
