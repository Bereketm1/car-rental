const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

// Try to load ts-node/register with fallbacks
try {
  require('ts-node/register');
} catch (e) {
  console.error('⚠️ Direct require(ts-node/register) failed. Trying local path...');
  try {
    const localTsNode = path.join(__dirname, 'node_modules', 'ts-node', 'register.js');
    if (fs.existsSync(localTsNode)) {
      require(localTsNode);
      console.log('✅ Loaded ts-node from local node_modules');
    } else {
      throw new Error('Local ts-node not found at ' + localTsNode);
    }
  } catch (e2) {
    console.error('❌ ALL ts-node loading attempts failed:', e2.message);
    console.log('📂 node_modules content:', fs.readdirSync(path.join(__dirname, 'node_modules')).slice(0, 10));
  }
}

console.log('🚀 Zelalem Motors: Bootstrapping for cPanel (TS Mode)...');
console.log('📍 __dirname:', __dirname);

// Deep log helper
function logDir(dir) {
  try {
    const files = fs.readdirSync(dir);
    return files;
  } catch (e) {
    return [];
  }
}

// Helper to find file regardless of case
function findCorrectPath(base, targetPath) {
  const parts = targetPath.split('/');
  let current = base;
  
  for (const part of parts) {
    if (part === '.' || part === '') continue;
    const files = logDir(current);
    const match = files.find(f => f.toLowerCase() === part.toLowerCase());
    if (match) {
      current = path.join(current, match);
    } else {
      return null;
    }
  }
  return current;
}

// 1. Start the 7 Microservices
const services = [
  'apps/services/crm/src/app.module.ts',
  'apps/services/vehicle/src/app.module.ts',
  'apps/services/finance/src/app.module.ts',
  'apps/services/deal/src/app.module.ts',
  'apps/services/partner/src/app.module.ts',
  'apps/services/lead/src/app.module.ts',
  'apps/services/analytics/src/app.module.ts'
];

console.log('📦 Starting microservices (TS)...');
services.forEach(s => {
  const fullPath = findCorrectPath(__dirname, s);
  if (fullPath && fs.existsSync(fullPath)) {
    // Use npx ts-node to run .ts files directly
    const child = spawn('npx', ['ts-node', fullPath], { 
      stdio: 'inherit',
      detached: true,
      env: { ...process.env, PORT: undefined }
    });
    child.unref();
    console.log(`✅ Started: ${fullPath}`);
  }
});

// 2. API Gateway
// We use the index.js entry point if it exists, or the main ts file
const gatewayPath = findCorrectPath(__dirname, 'apps/api-gateway/src/index.ts');
if (gatewayPath && fs.existsSync(gatewayPath)) {
  console.log(`✅ Gateway found: ${gatewayPath}`);
  require(gatewayPath);
} else {
  // Fallback to searching for any suitable entry point
  console.error('❌ Could not find gateway entry point. Please ensure apps/api-gateway/src/index.ts exists.');
}

// 3. Seed
setTimeout(() => {
  const seedPath = findCorrectPath(__dirname, 'seed.js');
  if (seedPath) spawn('node', [seedPath], { stdio: 'inherit', detached: true }).unref();
}, 30000);







