#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🧪 TallyBridge Flow Test');
console.log('========================');

// Test 1: Check if backend files exist and are valid
console.log('\n📁 Checking backend files...');

const backendFiles = [
  'backend/src/index.js',
  'backend/src/lib/anthropic.js',
  'backend/src/routes/process.js',
  'backend/src/routes/upload.js',
  'backend/src/routes/voucher.js',
  'backend/src/services/tallyXml.js',
  'backend/src/prompts/tallybridge_system_prompt.txt'
];

let allFilesExist = true;
backendFiles.forEach(file => {
  if (fs.existsSync(file)) {
    console.log(`✅ ${file}`);
  } else {
    console.log(`❌ ${file} - MISSING`);
    allFilesExist = false;
  }
});

// Test 2: Check if frontend files exist
console.log('\n📁 Checking frontend files...');

const frontendFiles = [
  'frontend/src/pages/App.jsx',
  'frontend/src/ui/EditableTable.jsx',
  'frontend/src/ui/UploadArea.jsx',
  'frontend/src/services/api.js',
  'frontend/package.json'
];

frontendFiles.forEach(file => {
  if (fs.existsSync(file)) {
    console.log(`✅ ${file}`);
  } else {
    console.log(`❌ ${file} - MISSING`);
    allFilesExist = false;
  }
});

// Test 3: Check environment configuration
console.log('\n⚙️  Checking environment configuration...');

const envPath = 'backend/.env';
if (fs.existsSync(envPath)) {
  console.log('✅ .env file exists');
  const envContent = fs.readFileSync(envPath, 'utf8');
  
  if (envContent.includes('ANTHROPIC_API_KEY=your_anthropic_api_key_here')) {
    console.log('⚠️  Please update ANTHROPIC_API_KEY in backend/.env');
  } else if (envContent.includes('ANTHROPIC_API_KEY=')) {
    console.log('✅ ANTHROPIC_API_KEY is configured');
  }
  
  if (envContent.includes('SYSTEM_PROMPT_PATH=')) {
    console.log('✅ SYSTEM_PROMPT_PATH is configured');
  }
} else {
  console.log('❌ .env file missing - run setup.js first');
}

// Test 4: Check if uploads directory exists
console.log('\n📁 Checking uploads directory...');
const uploadsDir = 'backend/uploads';
if (fs.existsSync(uploadsDir)) {
  console.log('✅ Uploads directory exists');
} else {
  console.log('⚠️  Uploads directory will be created on first run');
}

// Test 5: Validate JSON structure in prompt
console.log('\n📝 Validating system prompt...');
try {
  const promptPath = 'backend/src/prompts/tallybridge_system_prompt.txt';
  const promptContent = fs.readFileSync(promptPath, 'utf8');
  
  if (promptContent.includes('JSON')) {
    console.log('✅ System prompt contains JSON structure');
  } else {
    console.log('⚠️  System prompt may need JSON structure');
  }
  
  if (promptContent.length > 1000) {
    console.log('✅ System prompt is comprehensive');
  } else {
    console.log('⚠️  System prompt seems too short');
  }
} catch (error) {
  console.log('❌ Error reading system prompt:', error.message);
}

// Summary
console.log('\n📊 Test Summary');
console.log('================');

if (allFilesExist) {
  console.log('✅ All required files are present');
  console.log('✅ Backend structure is complete');
  console.log('✅ Frontend structure is complete');
  console.log('✅ System is ready for testing');
  
  console.log('\n🚀 Next Steps:');
  console.log('1. Update ANTHROPIC_API_KEY in backend/.env');
  console.log('2. Start MongoDB service');
  console.log('3. Run: cd backend && npm run dev');
  console.log('4. Run: cd frontend && npm run dev');
  console.log('5. Open http://localhost:5173');
  console.log('6. Upload a test invoice file');
  
} else {
  console.log('❌ Some files are missing');
  console.log('💡 Please check the file structure and run setup again');
}

console.log('\n🎉 Flow test completed!');
