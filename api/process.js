const fs = require('fs');
const path = require('path');
const { createMessageVision, loadSystemPrompt } = require('./anthropic');

function detectType(filePath) {
  const ext = path.extname(filePath).toLowerCase();
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

function registerProcessRoutes(app, storageDir) {
  app.post('/api/process', async (req, res) => {
    console.log('🔄 Processing request received');
    console.log('📋 Request body:', req.body);
    
    const { filename } = req.body ?? {};
    if (!filename) {
      console.error('❌ No filename provided');
      return res.status(400).json({ error: 'filename required' });
    }
    
    console.log(`📁 Processing file: ${filename}`);
    const full = path.join(storageDir, filename);
    
    if (!fs.existsSync(full)) {
      console.error(`❌ File not found: ${full}`);
      return res.status(404).json({ error: 'File not found' });
    }
    
    console.log(`✅ File exists: ${full}`);
    const fileStats = fs.statSync(full);
    console.log(`📊 File size: ${fileStats.size} bytes`);

    let systemPrompt = '';
    try {
      systemPrompt = loadSystemPrompt();
      console.log(`📝 System prompt loaded: ${systemPrompt.length} characters`);
    } catch (error) {
      console.warn('⚠️  Failed to load system prompt:', error.message);
      systemPrompt = '';
    }
    
    const mode = detectType(full);
    console.log(`🔍 Detection mode: ${mode}`);
    
    try {
      let extraction;
      if (mode === 'vision') {
        console.log('📖 Reading file for vision processing...');
        const bytes = fs.readFileSync(full);
        const base64 = bytes.toString('base64');
        const ext = path.extname(full).toLowerCase();
        const mediaType = mediaTypeForExt(ext);
        
        console.log(`📄 File extension: ${ext}`);
        console.log(`🎭 Media type: ${mediaType}`);
        
        // If config missing, return demo
        if (!process.env.ANTHROPIC_API_KEY || !systemPrompt) {
          console.log('🎭 Using demo mode - API key or prompt not configured');
          extraction = {
            invoices: [
              {
                invoiceNumber: 'DEMO-001',
                date: '2025-01-17',
                partyName: 'ABC Traders',
                partyGSTIN: '27AAACR1234A1Z5',
                type: 'Purchase',
                items: [ 
                  { 
                    description: 'Sample Item', 
                    hsnCode: '1006',
                    quantity: 1, 
                    unit: 'Nos',
                    rate: 100, 
                    amount: 100, 
                    gstRate: 18 
                  } 
                ],
                totals: { 
                  taxable: 100, 
                  cgst: 9, 
                  sgst: 9, 
                  igst: 0,
                  grandTotal: 118 
                },
              },
            ],
            warnings: ['Demo mode: configure ANTHROPIC_API_KEY and SYSTEM_PROMPT_PATH for live extraction.'],
            confidence: 0.6,
          };
        } else {
          console.log('🤖 Using Claude AI for processing...');
          // Real Claude call - select tag
          const tag = ext === '.pdf' ? 'document' : 'image';
          console.log(`🏷️  Using tag: ${tag}`);
          
          const text = await createMessageVision({ system: systemPrompt, base64, mediaType, tag });
          console.log('📝 Raw Claude response received');
          
          const cleaned = extractJson(text);
          console.log('🧹 JSON extracted and cleaned');
          
          extraction = JSON.parse(cleaned);
          console.log('✅ JSON parsed successfully');
          console.log(`📊 Extracted ${extraction.invoices?.length || 0} invoices`);
        }
      } else {
        console.error('❌ Unsupported file type for vision processing');
        return res.status(415).json({ error: 'Only PDF and image inputs are supported in this build.' });
      }

      console.log('✅ Processing completed successfully');
      console.log('📤 Sending response to client');
      res.json({ extraction });
    } catch (err) {
      console.error('❌ Processing failed:', err);
      console.error('🔍 Error stack:', err.stack);
      return res.status(500).json({ error: 'Processing failed', details: err?.message || String(err) });
    }
  });
}

// Extract a valid JSON object from Claude text output (handles fences and pre/post text)
function extractJson(txt) {
  if (!txt) throw new Error('Empty Claude response');
  // Remove code fences if present
  txt = txt.replace(/```[a-zA-Z]*\n([\s\S]*?)```/g, '$1');
  const start = txt.indexOf('{');
  const end = txt.lastIndexOf('}');
  if (start === -1 || end === -1 || end <= start) throw new Error('No JSON object found in Claude response');
  const slice = txt.slice(start, end + 1);
  return slice;
}

module.exports = { registerProcessRoutes };
