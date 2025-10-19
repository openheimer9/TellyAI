import { Router } from 'express';
import { extname } from 'path';
import { processDocument } from '../services/anthropic.js';
import axios from 'axios';

const router = Router();

function detectType(filePath) {
  const ext = extname(filePath).toLowerCase();
  if (['.pdf', '.jpg', '.jpeg', '.png', '.heic'].includes(ext)) return 'vision';
  return 'text';
}

function mediaTypeForExt(ext) {
  switch (ext) {
    case '.pdf':
      return 'application/pdf';
    case '.jpg':
    case '.jpeg':
      return 'image/jpeg';
    case '.png':
      return 'image/png';
    case '.heic':
      return 'image/heic';
    default:
      return 'application/octet-stream';
  }
}

function parseExtraction(text) {
  try {
    // Find JSON in the text
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.warn('⚠️ No JSON found in response');
      const error = new Error('Failed to extract data from document - invalid response format');
      error.status = 422;
      throw error;
    }
    
    const json = JSON.parse(jsonMatch[0]);
    
    // Ensure the JSON has the expected structure
    if (!json.invoices || !Array.isArray(json.invoices)) {
      console.warn('⚠️ Invalid JSON structure');
      const error = new Error('Failed to extract data from document - missing invoice data');
      error.status = 422;
      throw error;
    }
    
    return {
      invoices: json.invoices,
      warnings: json.warnings || [],
      confidence: json.confidence || 0.8
    };
  } catch (error) {
    console.error('❌ Error parsing extraction:', error);
    if (!error.status) {
      error.status = 500;
      error.message = 'Failed to parse extracted data';
    }
    throw error;
  }
}

router.post('/', async (req, res) => {
  console.log('🔄 Processing request received');
  console.log('📋 Request body:', req.body);
  
  const { filename } = req.body ?? {};
  if (!filename) {
    console.error('❌ No filename provided');
    return res.status(400).json({ 
      error: 'Filename is required',
      details: 'Please provide a filename in the request body'
    });
  }
  
  console.log(`📁 Processing file: ${filename}`);
  
  try {
    const response = await axios.get(filename, { responseType: 'arraybuffer' });
    const buffer = Buffer.from(response.data, 'binary');

    console.log(`✅ File downloaded from Cloudinary: ${filename}`);
    console.log(`📊 File size: ${buffer.length} bytes`);

    const mode = detectType(filename);
    console.log(`🔍 Detection mode: ${mode}`);
    
    if (mode !== 'vision') {
      console.error('❌ Unsupported file type for vision processing');
      return res.status(415).json({ 
        error: 'Unsupported file type',
        details: 'Only PDF and image files are supported in this build'
      });
    }

    console.log('📖 Reading file for vision processing...');
    const base64 = buffer.toString('base64');
    const ext = extname(filename).toLowerCase();
    const mediaType = mediaTypeForExt(ext);
    
    console.log(`📄 File extension: ${ext}`);
    console.log(`🎭 Media type: ${mediaType}`);
    
    const result = await processDocument({ base64, mediaType, tag: 'document' });
    console.log('✅ Processing completed successfully');
    
    const extraction = parseExtraction(result);

    console.log('📤 Sending response to client');
    res.json({ extraction });
  } catch (err) {
    console.error('❌ Processing failed:', err);
    console.error('🔍 Error stack:', err.stack);
    
    const status = err.status || 500;
    const error = {
      error: err.message || 'Processing failed',
      details: err.details || err.message || String(err)
    };
    
    return res.status(status).json(error);
  }
});

export default router;


