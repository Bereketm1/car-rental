const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

console.log('🚀 Zelalem Motors: Bootstrapping for cPanel...');
console.log('📍 __dirname:', __dirname);

// Helper to find file regardless of case
function findCorrectPath(base, targetPath) {
  const parts = targetPath.split('/');
  let current = base;
  
  for (const part of parts) {
    if (part === '.' || part === '') continue;
    try {
      const files = fs.readdirSync(current);
      const match = files.find(f => f.toLowerCase() === part.toLowerCase());
      if (match) {
        current = path.join(current, match);
      } else {
        return null;
      }
    } catch (e) {
      return null;
    }
  }
  return current;
}

// 1. Start the 7 Microservices
const services = [
  'apps/services/crm/src/index.js',
  'apps/services/vehicle/src/index.js',
  'apps/services/finance/src/index.js',
  'apps/services/deal/src/index.js',
  'apps/services/partner/src/index.js',
  'apps/services/lead/src/index.js',
  'apps/services/analytics/src/index.js'
];

console.log('📦 Starting microservices...');
services.forEach(s => {
  const fullPath = findCorrectPath(__dirname, s);
  if (fullPath && fs.existsSync(fullPath)) {
    const child = spawn('node', [fullPath], { 
      stdio: 'inherit',
      detached: true,
      env: { ...process.env, PORT: undefined }
    });
    child.unref();
    console.log(`✅ Started: ${fullPath}`);
  } else {
    console.error(`❌ NOT FOUND (checked case-insensitive): ${s}`);
  }
});

// 2. API Gateway
const gatewayPath = findCorrectPath(__dirname, 'apps/api-gateway/src/index.js');
if (gatewayPath && fs.existsSync(gatewayPath)) {
  console.log(`✅ Gateway found: ${gatewayPath}`);
  require(gatewayPath);
} else {
  console.error('❌ Gateway NOT FOUND. Printing root content:');
  console.error(fs.readdirSync(__dirname));
}

// 3. Seed
setTimeout(() => {
  const seedPath = findCorrectPath(__dirname, 'seed.js');
  if (seedPath) spawn('node', [seedPath], { stdio: 'inherit', detached: true }).unref();
}, 20000);





