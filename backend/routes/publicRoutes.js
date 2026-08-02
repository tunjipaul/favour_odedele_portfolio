import express from 'express';
import { getProjects } from '../controllers/projectController.js';
import { getGalleryItems } from '../controllers/galleryController.js';
import {
  getSettings,
  joinWaitlist,
} from '../controllers/contentController.js';

const router = express.Router();

router.get('/projects', getProjects);
router.get('/gallery', getGalleryItems);
router.get('/settings', getSettings);
router.post('/waitlist', joinWaitlist);

export default router;
