const { spawn } = require('child_process');
const path = require('path');

console.log('🚀 Zelalem Motors: Bootstrapping for cPanel...');
console.log('📍 Current Directory (__dirname):', __dirname);
console.log('📂 Working Directory (process.cwd()):', process.cwd());

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
  const child = spawn('node', [fullPath], { 
    stdio: 'inherit',
    detached: true,
    env: { ...process.env, PORT: undefined }
  });
  child.unref();
});

// 2. Start the API Gateway in the SAME process
// Use absolute path for require to avoid MODULE_NOT_FOUND
console.log('🌐 Starting API Gateway (Master Process)...');
const gatewayPath = path.join(__dirname, 'apps/api-gateway/src/index.js');
require(gatewayPath);

// 3. Run the seed script after a 10-second delay (once services are up)
setTimeout(() => {
  console.log('🌱 Attempting to seed database...');
  const seedPath = path.join(__dirname, 'seed.js');
  const seed = spawn('node', [seedPath], { stdio: 'inherit', detached: true });
  seed.unref();
}, 10000);

