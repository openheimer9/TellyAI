import 'dotenv/config';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import morgan from 'morgan';
import { join } from 'path';

import routes from './routes/index.js';

const app = express();
const port = process.env.PORT || 4000;
const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/tallybridge';
const storageDir = process.env.STORAGE_DIR || join(process.cwd(), 'uploads');

console.log('🚀 Starting TallyBridge Backend...');
console.log('📋 Environment Configuration:');
console.log(`🌐 Port: ${port}`);
console.log(`🗄️  MongoDB URI: ${mongoUri}`);
console.log(`📁 Storage Directory: ${storageDir}`);

// Configure MongoDB connection options
const mongooseOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 10000, // Reduce timeout to 10 seconds
  heartbeatFrequencyMS: 5000, // More frequent heartbeats
  retryWrites: true,
  w: 'majority',
  retryReads: true,
};

// Connect to MongoDB with retry logic
async function connectWithRetry(retries = 3, delay = 5000) {
  for (let i = 0; i < retries; i++) {
    try {
      await mongoose.connect(mongoUri, mongooseOptions);
      console.log('✅ MongoDB connected successfully');
      return true;
    } catch (err) {
      console.error(`❌ MongoDB connection attempt ${i + 1}/${retries} failed:`, err.message);
      if (i < retries - 1) {
        console.log(`⏳ Retrying in ${delay/1000} seconds...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }
  return false;
}

// Configure Express middleware
const corsOptions = {
  origin: [process.env.CORS_ORIGIN, process.env.CORS_ORIGIN_PROD].filter(Boolean),
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(morgan('dev'));
app.use(express.json());

// Register routes
app.use('/api', routes);
app.get('/health', (req, res) => res.json({ status: 'ok' }));

// Start server even if MongoDB connection fails
app.listen(port, async () => {
  console.log(`🎉 Backend listening on http://localhost:${port}`);
  console.log('📊 Available endpoints:');
  console.log('  - GET  /health - Health check');
  console.log('  - POST /api/upload - File upload');
  console.log('  - POST /api/process - Process uploaded file');
  console.log('  - POST /api/voucher/preview - Preview Tally XML');
  console.log('  - POST /api/voucher/push - Push to Tally');
  
  // Try to connect to MongoDB in the background
  const connected = await connectWithRetry();
  if (!connected) {
    console.warn('⚠️ MongoDB connection failed after retries - some features may be limited');
  }
});


