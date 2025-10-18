require('dotenv').config();
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
const rateLimit = require('express-rate-limit');
const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs');

const { registerUploadRoutes } = require('./routes/upload');
const { registerProcessRoutes } = require('./routes/process');
const { registerVoucherRoutes } = require('./routes/voucher');

console.log('🚀 Starting TallyBridge Backend...');
console.log('📋 Environment Configuration:');

const app = express();

// CORS configuration
const corsOptions = {
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  methods: ['GET', 'POST'],
  credentials: true,
  optionsSuccessStatus: 204
};

app.use(cors(corsOptions));
app.use(helmet());
app.use(express.json());

// Routes
app.use('/api', require('./routes'));

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/tallybridge';
const CORS_ORIGIN = process.env.CORS_ORIGIN || 'http://localhost:5173';
const STORAGE_DIR = process.env.STORAGE_DIR || path.join(process.cwd(), 'uploads');

console.log(`🌐 Port: ${PORT}`);
console.log(`🗄️  MongoDB URI: ${MONGO_URI}`);
console.log(`🔗 CORS Origin: ${CORS_ORIGIN}`);
console.log(`📁 Storage Directory: ${STORAGE_DIR}`);
console.log(`🤖 Anthropic API Key: ${process.env.ANTHROPIC_API_KEY ? '✅ Configured' : '❌ Missing'}`);
console.log(`📝 System Prompt Path: ${process.env.SYSTEM_PROMPT_PATH || '❌ Not set'}`);
console.log(`🎯 Claude Model: ${process.env.CLAUDE_MODEL || 'claude-sonnet-4-5-20250929'}`);

// Create storage directory
try {
  fs.mkdirSync(STORAGE_DIR, { recursive: true });
  console.log(`✅ Storage directory created/verified: ${STORAGE_DIR}`);
} catch (error) {
  console.error(`❌ Failed to create storage directory: ${error.message}`);
}

// In local/dev, do not trust proxy to satisfy express-rate-limit safety requirements
app.set('trust proxy', false);
app.use(helmet());
app.use(cors({ origin: CORS_ORIGIN, credentials: true }));
app.use(express.json({ limit: '25mb' }));
app.use(express.urlencoded({ extended: true }));

const limiter = rateLimit({ windowMs: 60 * 1000, max: 120, standardHeaders: true, legacyHeaders: false, trustProxy: false });
app.use(limiter);

// Add request logging middleware
app.use((req, res, next) => {
  console.log(`📥 ${req.method} ${req.path} - ${new Date().toISOString()}`);
  next();
});

app.get('/health', (_req, res) => {
  console.log('🏥 Health check requested');
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.get('/config/status', (_req, res) => {
  console.log('⚙️  Config status requested');
  res.json({
    anthropicConfigured: Boolean(process.env.ANTHROPIC_API_KEY),
    model: process.env.CLAUDE_MODEL || 'claude-sonnet-4-5-20250929',
    promptConfigured: Boolean(process.env.SYSTEM_PROMPT_PATH),
    storageDir: STORAGE_DIR,
    corsOrigin: CORS_ORIGIN,
  });
});

// Also expose under /api for convenience
app.get('/api/config/status', (_req, res) => {
  console.log('⚙️  API Config status requested');
  res.json({
    anthropicConfigured: Boolean(process.env.ANTHROPIC_API_KEY),
    model: process.env.CLAUDE_MODEL || 'claude-sonnet-4-5-20250929',
    promptConfigured: Boolean(process.env.SYSTEM_PROMPT_PATH),
    storageDir: STORAGE_DIR,
    corsOrigin: CORS_ORIGIN,
  });
});

console.log('🔧 Registering routes...');
registerUploadRoutes(app, STORAGE_DIR);
registerProcessRoutes(app, STORAGE_DIR);
registerVoucherRoutes(app);
console.log('✅ Routes registered');

console.log('🔌 Connecting to MongoDB...');
mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB connected successfully');
    app.listen(PORT, () => {
      console.log(`🎉 Backend listening on http://localhost:${PORT}`);
      console.log('📊 Available endpoints:');
      console.log('  - GET  /health - Health check');
      console.log('  - GET  /config/status - Configuration status');
      console.log('  - POST /api/upload - File upload');
      console.log('  - POST /api/process - Process uploaded file');
      console.log('  - POST /api/voucher/preview - Preview Tally XML');
      console.log('  - POST /api/voucher/push - Push to Tally');
      console.log('🚀 Server ready to accept requests!');
    });
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err);
    console.error('💡 Make sure MongoDB is running and accessible');
    process.exit(1);
  });


