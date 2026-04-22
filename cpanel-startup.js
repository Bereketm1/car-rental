const { spawn } = require('child_process');
const path = require('path');

console.log('🚀 Zelalem Motors: Bootstrapping for cPanel...');

// 1. Run the seed script
const seed = spawn('node', ['seed.js'], { stdio: 'inherit' });

seed.on('close', (code) => {
  if (code !== 0) {
    console.error('❌ Seeding failed.');
  }

  // 2. Start the 7 Microservices in the background
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
    const fullPath = path.resolve(__dirname, servicePath);
    spawn('node', [fullPath], { 
      stdio: 'inherit',
      detached: true,
      env: { ...process.env, PORT: undefined } // Ensure children use their default ports, not the cPanel PORT
    });
  });

  // 3. START THE API GATEWAY IN THIS PROCESS
  // This is the key: this process must bind to the port cPanel provides
  console.log('🌐 Starting API Gateway (Master Process)...');
  require('./apps/api-gateway/src/index.js');
});
