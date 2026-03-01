import GalleryItem from '../models/GalleryItem.js';

// ─── PUBLIC ────────────────────────────────────────────────────────────────
export const getGalleryItems = async (req, res) => {
  try {
    const items = await GalleryItem.find({ isVisible: true }).sort({ order: 1 });
    res.json(items);
  } catch (error) {
    console.error('GalleryController.getGalleryItems error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// ─── ADMIN ─────────────────────────────────────────────────────────────────
export const getAllGalleryItems = async (req, res) => {
  try {
    const items = await GalleryItem.find().sort({ order: 1 });
    res.json(items);
  } catch (error) {
    console.error('GalleryController.getAllGalleryItems error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const createGalleryItem = async (req, res) => {
  try {
    const item = await GalleryItem.create(req.body);
    res.status(201).json(item);
  } catch (error) {
    console.error('GalleryController.createGalleryItem error:', error);
    res.status(400).json({ message: 'Validation error', error: error.message });
  }
};

export const updateGalleryItem = async (req, res) => {
  try {
    const item = await GalleryItem.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!item) return res.status(404).json({ message: 'Gallery item not found' });
    res.json(item);
  } catch (error) {
    console.error('GalleryController.updateGalleryItem error:', error);
    res.status(400).json({ message: 'Update error', error: error.message });
  }
};

export const deleteGalleryItem = async (req, res) => {
  try {
    const item = await GalleryItem.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ message: 'Gallery item not found' });
    res.json({ message: 'Gallery item deleted successfully' });
  } catch (error) {
    console.error('GalleryController.deleteGalleryItem error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
