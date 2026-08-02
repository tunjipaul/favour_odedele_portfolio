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
  getSettings,
  updateSettings,
  getWaitlist,
} from '../controllers/contentController.js';

const router = express.Router();

router.get('/projects', protect, getAllProjects);
router.post('/projects', protect, createProject);
router.put('/projects/:id', protect, updateProject);
router.delete('/projects/:id', protect, deleteProject);

router.get('/gallery', protect, getAllGalleryItems);
router.post('/gallery', protect, createGalleryItem);
router.put('/gallery/:id', protect, updateGalleryItem);
router.delete('/gallery/:id', protect, deleteGalleryItem);

router.get('/settings', protect, getSettings);
router.put('/settings', protect, updateSettings);

router.get('/waitlist', protect, getWaitlist);

router.post('/upload', protect, upload.single('image'), (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
  res.json({ url: req.file.path });
});

export default router;
