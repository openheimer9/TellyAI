const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs');

// Import routes
const { registerUploadRoutes } = require('./upload');
const { registerProcessRoutes } = require('./process');
const { registerVoucherRoutes } = require('./voucher');

const app = express();

// Environment variables
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/tallybridge';
const CORS_ORIGIN = process.env.CORS_ORIGIN || 'https://tallybridge.vercel.app';
const STORAGE_DIR = process.env.STORAGE_DIR || '/tmp/uploads';

console.log('🚀 Starting TallyBridge Backend on Vercel...');
console.log('📋 Environment Configuration:');
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

// Middleware
app.set('trust proxy', true);
app.use(helmet());
app.use(cors({ origin: CORS_ORIGIN, credentials: true }));
app.use(express.json({ limit: '25mb' }));
app.use(express.urlencoded({ extended: true }));

const limiter = rateLimit({ 
  windowMs: 60 * 1000, 
  max: 120, 
  standardHeaders: true, 
  legacyHeaders: false, 
  trustProxy: true 
});
app.use(limiter);

// Request logging middleware
app.use((req, res, next) => {
  console.log(`📥 ${req.method} ${req.path} - ${new Date().toISOString()}`);
  next();
});

// Health check
app.get('/api/health', (_req, res) => {
  console.log('🏥 Health check requested');
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Config status
app.get('/api/config/status', (_req, res) => {
  console.log('⚙️  Config status requested');
  res.json({
    anthropicConfigured: Boolean(process.env.ANTHROPIC_API_KEY),
    model: process.env.CLAUDE_MODEL || 'claude-sonnet-4-5-20250929',
    promptConfigured: Boolean(process.env.SYSTEM_PROMPT_PATH),
    storageDir: STORAGE_DIR,
    corsOrigin: CORS_ORIGIN,
  });
});

// Register routes
console.log('🔧 Registering routes...');
registerUploadRoutes(app, STORAGE_DIR);
registerProcessRoutes(app, STORAGE_DIR);
registerVoucherRoutes(app);
console.log('✅ Routes registered');

// Connect to MongoDB
console.log('🔌 Connecting to MongoDB...');
mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB connected successfully');
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err);
  });

// Export for Vercel
module.exports = app;
