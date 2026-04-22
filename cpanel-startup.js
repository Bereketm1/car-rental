const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

console.log('🚀 Zelalem Motors: Bootstrapping for cPanel...');
console.log('📍 Current Directory (__dirname):', __dirname);

// 1. Start the 7 Microservices in the background immediately
const services = [
  'apps/services/crm/src/index.js',
  'apps/services/vehicle/src/index.js',
  'apps/services/finance/src/index.js',
  'apps/services/deal/src/index.js',
  'apps/services/partner/src/index.js',
  'apps/services/lead/src/index.js',
  'apps/services/analytics/src/index.js'
];

console.log('📦 Starting microservices in background...');
services.forEach(servicePath => {
  const fullPath = path.join(__dirname, servicePath);
  if (fs.existsSync(fullPath)) {
    const child = spawn('node', [fullPath], { 
      stdio: 'inherit',
      detached: true,
      env: { ...process.env, PORT: undefined }
    });
    child.unref();
  } else {
    console.error(`❌ Microservice NOT FOUND at: ${fullPath}`);
  }
});

// 2. Start the API Gateway in the SAME process
console.log('🌐 Locating API Gateway...');
const gatewayPath = path.join(__dirname, 'apps/api-gateway/src/index.js');

if (fs.existsSync(gatewayPath)) {
  console.log(`✅ Gateway found! Starting: ${gatewayPath}`);
  require(gatewayPath);
} else {
  console.error(`❌ Gateway NOT FOUND at: ${gatewayPath}`);
  console.log('📂 Directory content of apps/api-gateway/src:');
  try {
    console.log(fs.readdirSync(path.join(__dirname, 'apps/api-gateway/src')));
  } catch (e) {
    console.error('Failed to read directory:', e.message);
  }
}

// 3. Run the seed script after a 15-second delay
setTimeout(() => {
  console.log('🌱 Attempting to seed database...');
  const seedPath = path.join(__dirname, 'seed.js');
  if (fs.existsSync(seedPath)) {
    const seed = spawn('node', [seedPath], { stdio: 'inherit', detached: true });
    seed.unref();
  }
}, 15000);


