import { Router } from 'express';
import multer from 'multer';
import { extname } from 'path';
import { uploadToCloudinary } from '../services/cloudinary.js';

const router = Router();
const allowed = new Set(['.pdf', '.jpg', '.jpeg', '.png', '.heic']);

const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter: (_req, file, cb) => {
    const ext = extname(file.originalname).toLowerCase();
    if (!allowed.has(ext)) return cb(new Error('Unsupported file type'));
    cb(null, true);
  },
  limits: { fileSize: 25 * 1024 * 1024 },
});

router.post('/', upload.single('file'), async (req, res) => {
  console.log('📤 File upload request received');

  if (!req.file) {
    console.error('❌ No file uploaded');
    return res.status(400).json({ error: 'No file uploaded' });
  }

  try {
    const result = await uploadToCloudinary(req.file.buffer, {
      resource_type: 'auto',
      public_id: req.file.originalname,
    });

    console.log(`☁️  File uploaded to Cloudinary: ${result.secure_url}`);

    const meta = {
      filename: result.secure_url, // Use the Cloudinary URL as the filename
      mimetype: req.file.mimetype,
      size: req.file.size,
    };

    console.log('✅ File upload successful');
    res.json(meta);
  } catch (error) {
    console.error('❌ Cloudinary upload failed:', error);
    res.status(500).json({ error: 'Failed to upload file to Cloudinary' });
  }
});

export default router;


