# 🚀 Vercel Deployment Guide for TallyBridge

## 📋 Prerequisites

1. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
2. **GitHub Repository**: Push your code to GitHub
3. **MongoDB Atlas**: Set up a cloud MongoDB database
4. **Anthropic API Key**: Get your Claude API key

## 🔧 Step-by-Step Deployment

### 1. **Prepare Your Repository**

```bash
# Push your code to GitHub
git add .
git commit -m "Prepare for Vercel deployment"
git push origin main
```

### 2. **Deploy to Vercel**

1. **Go to Vercel Dashboard**
   - Visit [vercel.com/dashboard](https://vercel.com/dashboard)
   - Click "New Project"

2. **Import from GitHub**
   - Select your TallyBridge repository
   - Click "Import"

3. **Configure Build Settings**
   - **Framework Preset**: Other
   - **Root Directory**: Leave empty (uses root)
   - **Build Command**: `npm run vercel-build`
   - **Output Directory**: `frontend/dist`

### 3. **Set Environment Variables**

In Vercel Dashboard → Project Settings → Environment Variables:

```env
# MongoDB Configuration
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/tallybridge

# Claude AI Configuration
ANTHROPIC_API_KEY=sk-ant-api03-your-actual-api-key-here
CLAUDE_MODEL=claude-sonnet-4-5-20250929
SYSTEM_PROMPT_PATH=./api/prompts/tallybridge_system_prompt.txt

# CORS Configuration
CORS_ORIGIN=https://your-project-name.vercel.app

# Storage Configuration
STORAGE_DIR=/tmp/uploads

# Environment
NODE_ENV=production
```

### 4. **Deploy**

1. Click "Deploy" in Vercel
2. Wait for deployment to complete
3. Your app will be available at `https://your-project-name.vercel.app`

## 🔍 **File Structure for Vercel**

```
tallybridge/
├── api/                          # Vercel API routes
│   ├── index.js                  # Main API handler
│   ├── upload.js                 # File upload routes
│   ├── process.js                # File processing routes
│   ├── voucher.js                # Tally XML generation
│   ├── anthropic.js              # Claude AI integration
│   ├── tallyXml.js               # XML generation logic
│   └── prompts/
│       └── tallybridge_system_prompt.txt
├── frontend/                     # React frontend
│   ├── src/
│   ├── package.json
│   └── vite.config.ts
├── vercel.json                   # Vercel configuration
├── package.json                  # Root package.json
└── README.md
```

## ⚙️ **Configuration Details**

### **vercel.json**
- Routes API calls to `/api/*` to serverless functions
- Serves frontend from `frontend/dist`
- Sets 30-second timeout for API functions

### **API Routes**
- `/api/health` - Health check
- `/api/upload` - File upload
- `/api/process` - AI processing
- `/api/voucher/preview` - XML preview
- `/api/voucher/push` - XML generation

### **Frontend**
- Automatically builds to `frontend/dist`
- Uses relative API paths in production
- CORS configured for Vercel domain

## 🧪 **Testing After Deployment**

1. **Health Check**
   ```bash
   curl https://your-project.vercel.app/api/health
   ```

2. **Upload Test**
   - Visit your Vercel URL
   - Upload a test invoice
   - Check Vercel function logs

3. **Monitor Logs**
   - Go to Vercel Dashboard → Functions
   - Check logs for any errors

## 🔧 **Troubleshooting**

### **Common Issues:**

1. **Build Failures**
   - Check Node.js version (18+ required)
   - Verify all dependencies in package.json

2. **API Errors**
   - Check environment variables
   - Verify MongoDB connection
   - Check Anthropic API key

3. **CORS Issues**
   - Update CORS_ORIGIN to your Vercel domain
   - Check frontend API base URL

4. **File Upload Issues**
   - Vercel has 4.5MB file size limit
   - Consider using external storage for larger files

### **Debug Steps:**

1. **Check Function Logs**
   - Vercel Dashboard → Functions → View Logs

2. **Test API Endpoints**
   ```bash
   # Health check
   curl https://your-project.vercel.app/api/health
   
   # Config status
   curl https://your-project.vercel.app/api/config/status
   ```

3. **Verify Environment Variables**
   - Check all variables are set correctly
   - Ensure no typos in variable names

## 📊 **Performance Optimization**

1. **MongoDB Connection**
   - Use connection pooling
   - Consider MongoDB Atlas for better performance

2. **File Storage**
   - For production, consider AWS S3 or similar
   - Vercel's `/tmp` is temporary

3. **Caching**
   - Add Redis for session management
   - Cache API responses where appropriate

## 🎉 **Success!**

Once deployed, your TallyBridge app will be available at:
- **Frontend**: `https://your-project.vercel.app`
- **API**: `https://your-project.vercel.app/api/*`

### **Features Available:**
- ✅ File upload (PDF, images)
- ✅ AI-powered data extraction
- ✅ Tally XML generation
- ✅ Real-time processing logs
- ✅ Responsive web interface

---

**Need Help?** Check Vercel documentation or create an issue in your repository.
