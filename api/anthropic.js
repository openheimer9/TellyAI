const fs = require('fs');

const apiKey = process.env.ANTHROPIC_API_KEY || '';
if (!apiKey) {
  console.warn('⚠️  ANTHROPIC_API_KEY is not set – backend will use demo fallback for processing.');
} else {
  console.log(`🔑 API Key configured: ${apiKey.substring(0, 20)}...`);
}

const DEFAULT_MODEL = process.env.CLAUDE_MODEL || 'claude-sonnet-4-5-20250929';

async function createMessageVision({ system, base64, mediaType, tag }) {
  console.log('🚀 Starting Claude API call...');
  console.log(`📊 Model: ${DEFAULT_MODEL}`);
  console.log(`📁 Media Type: ${mediaType}`);
  console.log(`🏷️  Tag: ${tag}`);
  console.log(`📏 Base64 length: ${base64.length} characters`);
  
  if (!apiKey) {
    console.error('❌ ANTHROPIC_API_KEY missing');
    throw new Error('ANTHROPIC_API_KEY missing');
  }

  try {
    console.log('📡 Sending request to Claude API...');
    const resp = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        model: DEFAULT_MODEL,
        max_tokens: 4000,
        temperature: 0,
        system,
        messages: [
          {
            role: 'user',
            content: [
              { type: 'text', text: 'Extract and validate as per system instructions. Return strict JSON only.' },
              { type: tag, source: { type: 'base64', media_type: mediaType, data: base64 } },
            ],
          },
        ],
      }),
    });
    
    console.log(`📈 Response status: ${resp.status}`);
    
    if (!resp.ok) {
      const txt = await resp.text();
      console.error(`❌ Claude API error: ${resp.status} ${txt}`);
      throw new Error(`Claude API error: ${resp.status} ${txt}`);
    }
    
    const data = await resp.json();
    console.log('✅ Claude API response received');
    
    // Concatenate any text blocks to make robust
    const blocks = Array.isArray(data.content) ? data.content : [];
    const text = blocks.filter(b => b?.type === 'text').map(b => b.text).join('\n');
    
    console.log(`📝 Extracted text length: ${text.length} characters`);
    console.log('📋 First 200 characters of response:', text.substring(0, 200));
    
    return text || '';
  } catch (error) {
    console.error('❌ Error in createMessageVision:', error.message);
    console.error('🔍 Error details:', error);
    throw error;
  }
}

function loadSystemPrompt() {
  const promptPath = process.env.SYSTEM_PROMPT_PATH;
  if (!promptPath) throw new Error('SYSTEM_PROMPT_PATH not configured');
  return fs.readFileSync(promptPath, 'utf8');
}

module.exports = { createMessageVision, loadSystemPrompt };
