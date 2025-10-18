const multer = require('multer');
const path = require('path');
const fs = require('fs');

const allowed = new Set(['.pdf', '.jpg', '.jpeg', '.png', '.heic']);

function registerUploadRoutes(app, storageDir) {
  const upload = multer({
    storage: multer.diskStorage({
      destination: (_req, _file, cb) => cb(null, storageDir),
      filename: (_req, file, cb) => {
        const ext = path.extname(file.originalname).toLowerCase();
        const base = path.basename(file.originalname, ext);
        const name = `${base}-${Date.now()}${ext}`;
        cb(null, name);
      },
    }),
    fileFilter: (_req, file, cb) => {
      const ext = path.extname(file.originalname).toLowerCase();
      if (!allowed.has(ext)) return cb(new Error('Unsupported file type'));
      cb(null, true);
    },
    limits: { fileSize: 25 * 1024 * 1024 },
  });

  app.post('/api/upload', upload.single('file'), (req, res) => {
    console.log('📤 File upload request received');
    
    if (!req.file) {
      console.error('❌ No file uploaded');
      return res.status(400).json({ error: 'No file uploaded' });
    }
    
    console.log(`📁 File uploaded: ${req.file.originalname}`);
    console.log(`💾 Saved as: ${req.file.filename}`);
    console.log(`📊 File size: ${req.file.size} bytes`);
    console.log(`🎭 MIME type: ${req.file.mimetype}`);
    
    const meta = {
      filename: req.file.filename,
      path: req.file.path,
      mimetype: req.file.mimetype,
      size: req.file.size,
    };
    
    console.log('✅ File upload successful');
    res.json({ upload: meta });
  });

  app.delete('/api/upload/:filename', (req, res) => {
    const { filename } = req.params;
    const full = path.join(storageDir, filename);
    if (fs.existsSync(full)) fs.unlinkSync(full);
    res.json({ deleted: true });
  });
}

module.exports = { registerUploadRoutes };
