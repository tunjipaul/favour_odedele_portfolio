import cloudinary from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';

// In cloudinary v1, the modern API lives under cloudinary.v2
const cloudinaryV2 = cloudinary.v2;

// Configure Cloudinary with credentials from .env
cloudinaryV2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// CloudinaryStorage tells multer: instead of saving files to disk,
// stream them directly to Cloudinary and return the URL.
// PDFs need raw uploads; images keep the usual optimized transformation.
const storage = new CloudinaryStorage({
  cloudinary: cloudinaryV2,
  params: async (_req, file) => {
    const fileName = (file.originalname || '').toLowerCase();
    const isPdf = file.mimetype === 'application/pdf' || fileName.endsWith('.pdf');

    return {
      folder: 'favour-portfolio',
      resource_type: isPdf ? 'raw' : 'image',
      allowed_formats: isPdf ? ['pdf'] : ['jpg', 'jpeg', 'png', 'webp'],
      ...(isPdf
        ? {}
        : { transformation: [{ width: 1200, quality: 'auto', fetch_format: 'auto' }] }),
    };
  },
});

// multer is middleware that parses multipart/form-data (file uploads)
// Think of it like FastAPI's File() and UploadFile — it handles the raw binary
const upload = multer({ storage });

export { upload, cloudinaryV2 as cloudinary };

