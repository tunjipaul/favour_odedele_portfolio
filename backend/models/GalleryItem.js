import mongoose from 'mongoose';

const galleryItemSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    image: { type: String, default: '' }, // Cloudinary URL
    accentColor: {
      type: String,
      enum: ['primary', 'accent-magenta', 'accent-green'], // Only valid values
      default: 'primary',
    },
    order: { type: Number, default: 0 },
    isVisible: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const GalleryItem = mongoose.model('GalleryItem', galleryItemSchema);
export default GalleryItem;
