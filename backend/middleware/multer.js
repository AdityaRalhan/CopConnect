// backend/middleware/multer.js
import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from '../utils/cloudinary.js';

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'copconnect_evidence',
    resource_type: 'auto', // ✅ IMPORTANT: lets Cloudinary handle both image/video uploads
    allowed_formats: ['jpg', 'png', 'mp4', 'mov'],
  },
});

const parser = multer({ storage });

export default parser;
