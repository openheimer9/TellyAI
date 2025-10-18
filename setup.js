#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🚀 TallyBridge Setup Script');
console.log('============================');

// Create .env file if it doesn't exist
const envPath = path.join(__dirname, 'backend', '.env');
if (!fs.existsSync(envPath)) {
  console.log('📝 Creating .env file...');
  const envContent = `# TallyBridge Backend Configuration
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
`;
  fs.writeFileSync(envPath, envContent);
  console.log('✅ .env file created');
} else {
  console.log('✅ .env file already exists');
}

// Check if MongoDB is running
console.log('\n🔍 Checking system requirements...');

// Check Node.js version
const nodeVersion = process.version;
console.log(`📦 Node.js version: ${nodeVersion}`);

// Check if MongoDB is accessible (basic check)
const { exec } = require('child_process');
exec('mongod --version', (error, stdout, stderr) => {
  if (error) {
    console.log('⚠️  MongoDB not found or not running');
    console.log('💡 Please install and start MongoDB:');
    console.log('   - Windows: Download from https://www.mongodb.com/try/download/community');
    console.log('   - macOS: brew install mongodb-community');
    console.log('   - Linux: sudo apt-get install mongodb');
  } else {
    console.log('✅ MongoDB is available');
  }
});

console.log('\n📋 Next Steps:');
console.log('1. Get your Anthropic API key from: https://console.anthropic.com/');
console.log('2. Edit backend/.env and add your API key');
console.log('3. Start MongoDB service');
console.log('4. Run: cd backend && npm install && npm run dev');
console.log('5. Run: cd frontend && npm install && npm run dev');
console.log('\n🎉 Setup complete!');
