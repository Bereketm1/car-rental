const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

console.log('🚀 Zelalem Motors: Bootstrapping for cPanel...');
console.log('📍 Current Working Directory:', process.cwd());

// 1. Start the 7 Microservices in the background immediately
const services = [
  './apps/services/crm/src/index.js',
  './apps/services/vehicle/src/index.js',
  './apps/services/finance/src/index.js',
  './apps/services/deal/src/index.js',
  './apps/services/partner/src/index.js',
  './apps/services/lead/src/index.js',
  './apps/services/analytics/src/index.js'
];

console.log('📦 Starting microservices in background...');
services.forEach(servicePath => {
  if (fs.existsSync(servicePath)) {
    const child = spawn('node', [servicePath], { 
      stdio: 'inherit',
      detached: true,
      env: { ...process.env, PORT: undefined }
    });
    child.unref();
    console.log(`✅ Started: ${servicePath}`);
  } else {
    console.error(`❌ Microservice NOT FOUND at: ${servicePath}`);
  }
});

// 2. Start the API Gateway in the SAME process
console.log('🌐 Locating API Gateway...');
const gatewayPath = './apps/api-gateway/src/index.js';

if (fs.existsSync(gatewayPath)) {
  console.log(`✅ Gateway found! Starting: ${gatewayPath}`);
  require(gatewayPath);
} else {
  console.error(`❌ Gateway NOT FOUND at: ${gatewayPath}`);
  console.log('📂 Root Directory content:');
  try {
    console.log(fs.readdirSync('.'));
  } catch (e) {
    console.error('Failed to read directory:', e.message);
  }
}

// 3. Run the seed script after a 20-second delay
setTimeout(() => {
  console.log('🌱 Attempting to seed database...');
  const seedPath = './seed.js';
  if (fs.existsSync(seedPath)) {
    const seed = spawn('node', [seedPath], { stdio: 'inherit', detached: true });
    seed.unref();
  }
}, 20000);



