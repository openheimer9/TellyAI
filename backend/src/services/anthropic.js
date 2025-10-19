import fs from 'fs/promises';
import { join } from 'path';
import Anthropic from '@anthropic-ai/sdk';

async function loadSystemPrompt() {
  try {
    const path = process.env.SYSTEM_PROMPT_PATH;
    if (!path) {
      console.log('⚠️ SYSTEM_PROMPT_PATH not configured, using default prompt');
      return `You are an expert at extracting structured data from documents. Extract all transactions from the document into JSON format. Each transaction should have:
- reference: Document reference number (e.g. invoice number)
- date: Transaction date in YYYY-MM-DD format
- account: Account/party name
- type: "debit" or "credit"
- description: Transaction description/narration
- amount: Transaction amount as number

Return ONLY valid JSON in this format:
{
  "transactions": [
    {
      "reference": "string",
      "date": "YYYY-MM-DD",
      "account": "string", 
      "type": "debit|credit",
      "description": "string",
      "amount": number
    }
  ],
  "warnings": ["string"],
  "confidence": number
}`;
    }
    
    try {
      return await fs.readFile(join(process.cwd(), path), 'utf8');
    } catch (readErr) {
      console.error('❌ Failed to read system prompt file:', readErr);
      throw new Error(`Failed to read system prompt file: ${readErr.message}`);
    }
  } catch (err) {
    console.warn('⚠️ Error loading system prompt:', err);
    throw new Error(`Failed to load system prompt: ${err.message}`);
  }
}

export async function processDocument({ base64, mediaType, tag }) {
  console.log('🚀 Starting Claude API call...');
  
  if (!process.env.ANTHROPIC_API_KEY) {
    const error = new Error('Anthropic API key not configured');
    error.status = 503;
    error.details = 'Please configure ANTHROPIC_API_KEY environment variable';
    throw error;
  }

  try {
    console.log('📊 Model: claude-3-7-sonnet-20250219');
    console.log('📁 Media Type:', mediaType);
    console.log('🏷️  Tag:', tag);
    console.log('📏 Base64 length:', base64.length, 'characters');

    const anthropic = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    });

    const systemPrompt = await loadSystemPrompt();
    
    console.log('📡 Sending request to Claude API...');
    
    // For PDF files, we need to use document type instead of image
    const contentItems = [
      { type: 'text', text: `Extract data from this ${tag}:` }
    ];
    
    if (mediaType === 'application/pdf') {
      contentItems.push({ 
        type: 'document', 
        source: { 
          type: 'base64', 
          media_type: mediaType, 
          data: base64 
        } 
      });
    } else {
      // For images, use image type
      contentItems.push({ 
        type: 'image', 
        source: { 
          type: 'base64', 
          media_type: mediaType, 
          data: base64 
        } 
      });
    }
    
    const message = await anthropic.messages.create({
      model: 'claude-3-7-sonnet-20250219',
      max_tokens: 4096,
      system: systemPrompt,
      messages: [{
        role: 'user',
        content: contentItems
      }],
    });

    console.log('📈 Response status: 200');
    console.log('✅ Claude API response received');
    
    if (!message?.content?.[0]?.text) {
      const error = new Error('Invalid response from Anthropic API');
      error.status = 502;
      error.details = 'The API response did not contain expected content';
      throw error;
    }
    
    const text = message.content[0].text;
    console.log('📝 Extracted text length:', text.length, 'characters');
    console.log('📋 First 200 characters of response:', text.slice(0, 200));
    
    return text;
  } catch (err) {
    console.error('❌ Error in processDocument:', err);
    console.error('🔍 Error details:', err);
    
    // Determine appropriate error status and message
    let status = 500;
    let message = 'Internal server error during document processing';
    
    if (err.status === 401 || err.status === 403) {
      status = 401;
      message = 'API authentication failed - please check API key configuration';
    } else if (err.status === 429) {
      status = 429;
      message = 'API rate limit exceeded - please try again later';
    } else if (err.cause?.code === 'UND_ERR_SOCKET') {
      status = 503;
      message = 'Network error while connecting to API - please try again';
    }
    
    // If error already has status and details, use those
    if (err.status && err.details) {
      throw err;
    }
    
    const error = new Error(message);
    error.status = status;
    error.details = err.message || String(err);
    throw error;
  }
}
