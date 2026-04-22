const { spawn } = require('child_process');
const path = require('path');

const services = [
  'apps/api-gateway/src/index.js',
  'apps/services/crm/src/index.js',
  'apps/services/vehicle/src/index.js',
  'apps/services/finance/src/index.js',
  'apps/services/deal/src/index.js',
  'apps/services/partner/src/index.js',
  'apps/services/lead/src/index.js',
  'apps/services/analytics/src/index.js'
];

console.log('🚀 Initializing Zelalem Motors Production Environment...');

// 1. Run the seed script to ensure fresh databases (great for free tier ephemeral storage)
const seed = spawn('node', ['seed.js'], { stdio: 'inherit' });

seed.on('close', (code) => {
  if (code !== 0) {
    console.error('❌ Database seeding failed! Exiting...');
    process.exit(1);
  }
  
  console.log('✅ Database seeding complete. Starting microservices...');

  // 2. Start all microservices
  services.forEach(service => {
    const proc = spawn('node', [service], { stdio: 'inherit' });
    proc.on('close', (code) => {
      console.log(`⚠️ Service ${service} exited with code ${code}`);
    });
  });
});
