# TallyBridge - AI-Powered Invoice Processing

A modern web application that uses Claude AI to extract data from uploaded invoices and automatically generate Tally ERP vouchers. Upload any invoice (PDF, image, or document) and get structured data ready for Tally import.

## 🚀 Features

- **AI-Powered Extraction**: Uses Claude AI to extract invoice data from any format
- **Multiple File Support**: PDF, JPG, PNG, JPEG, HEIC files
- **Smart Data Validation**: Validates GSTIN, tax calculations, and other critical fields
- **Tally XML Generation**: Creates ready-to-import Tally ERP vouchers
- **Interactive Editing**: Edit extracted data before generating vouchers
- **Real-time Processing**: Fast and accurate data extraction
- **Comprehensive Logging**: Detailed console logs for debugging

## 📋 Prerequisites

- Node.js (v16 or higher)
- MongoDB (running locally or remotely)
- Anthropic API key (for Claude AI)

## 🛠️ Quick Setup

### 1. Clone and Install Dependencies

```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 2. Configure Environment

```bash
# Run the setup script
node setup.js

# Edit backend/.env and add your Anthropic API key
# Get your API key from: https://console.anthropic.com/
```

### 3. Start Services

```bash
# Terminal 1: Start MongoDB (if not already running)
mongod

# Terminal 2: Start Backend
cd backend
npm run dev

# Terminal 3: Start Frontend
cd frontend
npm run dev
```

### 4. Access the Application

- Frontend: http://localhost:5173
- Backend API: http://localhost:4000
- Health Check: http://localhost:4000/health

## 🔧 Configuration

### Environment Variables (backend/.env)

```env
# Server Configuration
PORT=4000
MONGO_URI=mongodb://localhost:27017/tallybridge
CORS_ORIGIN=http://localhost:5173
STORAGE_DIR=./uploads

# Claude AI Configuration
ANTHROPIC_API_KEY=your_anthropic_api_key_here
CLAUDE_MODEL=claude-3-5-sonnet-20240620
SYSTEM_PROMPT_PATH=./src/prompts/tallybridge_system_prompt.txt

# Development
NODE_ENV=development
```

## 📊 How It Works

1. **Upload**: User uploads an invoice file (PDF, image, etc.)
2. **AI Processing**: Claude AI analyzes the file and extracts structured data
3. **Validation**: System validates GSTIN, tax calculations, and other fields
4. **Review**: User can edit and verify the extracted data
5. **Export**: Generate Tally XML for direct import into Tally ERP

## 🎯 Supported Invoice Types

- **GST Invoices**: Complete with CGST, SGST, IGST
- **Purchase Orders**: Supplier invoices and bills
- **Sales Invoices**: Customer invoices and receipts
- **Credit/Debit Notes**: Returns and adjustments
- **Multi-page Documents**: Batch processing of multiple invoices

## 📝 Data Extraction

The AI extracts the following data:

- **Party Details**: Name, GSTIN, Address
- **Invoice Info**: Number, Date, Type
- **Line Items**: Description, HSN Code, Quantity, Rate, Amount
- **Tax Details**: CGST, SGST, IGST with proper calculations
- **Totals**: Taxable amount, tax amount, grand total

## 🔍 Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Ensure MongoDB is running: `mongod`
   - Check connection string in `.env`

2. **Claude API Error**
   - Verify API key is correct
   - Check API key has sufficient credits
   - Ensure internet connection is stable

3. **File Upload Issues**
   - Check file size (max 25MB)
   - Verify file format is supported
   - Check storage directory permissions

### Debug Mode

The backend includes comprehensive logging. Check console output for:
- 🔄 Request processing steps
- 📊 File analysis details
- 🤖 AI response data
- ❌ Error details and stack traces

## 🚀 Production Deployment

### Backend Deployment

1. Set production environment variables
2. Use PM2 for process management
3. Configure reverse proxy (Nginx)
4. Set up MongoDB cluster
5. Configure SSL certificates

### Frontend Deployment

1. Build production bundle: `npm run build`
2. Serve static files with Nginx
3. Configure API endpoints
4. Set up CDN for assets

## 📈 Performance

- **Processing Speed**: 5-25 seconds per file
- **Accuracy**: 90%+ field extraction accuracy
- **File Size Limit**: 25MB per file
- **Concurrent Users**: 120 requests per minute

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For issues and questions:
1. Check the troubleshooting section
2. Review console logs for errors
3. Create an issue on GitHub
4. Contact the development team

---

**Made with ❤️ for the Tally ERP community**