import { Router } from 'express';
import multer from 'multer';
import { extname, basename } from 'path';
import cache from '../services/cache.js';

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

router.post('/', upload.single('file'), (req, res) => {
  console.log('📤 File upload request received');
  
  if (!req.file) {
    console.error('❌ No file uploaded');
    return res.status(400).json({ error: 'No file uploaded' });
  }
  
  const ext = extname(req.file.originalname).toLowerCase();
  const base = basename(req.file.originalname, ext);
  const filename = `${base}-${Date.now()}${ext}`;

  const fileData = {
    buffer: req.file.buffer,
    mimetype: req.file.mimetype,
    originalname: req.file.originalname,
    size: req.file.size,
  };

  cache.set(filename, fileData);

  console.log(`📁 File uploaded: ${req.file.originalname}`);
  console.log(`💾 Saved as: ${filename}`);
  console.log(`📊 File size: ${req.file.size} bytes`);
  console.log(`🎭 MIME type: ${req.file.mimetype}`);
  
  const meta = {
    filename: filename,
    mimetype: req.file.mimetype,
    size: req.file.size,
  };
  
  console.log('✅ File upload successful');
  res.json(meta);
});

export default router;


