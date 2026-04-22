const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const http = require('http');

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = 'zelalem-motors-dev-secret-2024';

// ── Middleware ──
app.use(cors());

// ── Static uploads ──
const uploadsDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });
app.use('/uploads', express.static(uploadsDir));

// ── Auth routes ──
app.use('/api/auth', express.json());

const USERS = [
  { id: 'admin-001', email: 'admin@zelalem.com', password: 'admin123', name: 'Zelalem Admin', role: 'admin' },
  { id: 'sales-001', email: 'sales@zelalem.com', password: 'sales123', name: 'Sales Manager', role: 'sales' },
  { id: 'finance-001', email: 'finance@zelalem.com', password: 'finance123', name: 'Finance Officer', role: 'finance' },
  { id: 'marketing-001', email: 'marketing@zelalem.com', password: 'marketing123', name: 'Marketing Manager', role: 'marketing' },
];

app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  const user = USERS.find(u => u.email === email && u.password === password);
  if (user) {
    const { password: _, ...safeUser } = user;
    const token = jwt.sign({ sub: user.id, email }, JWT_SECRET, { expiresIn: '24h' });
    return res.json({ success: true, data: { token, user: safeUser } });
  }
  return res.status(401).json({ success: false, message: 'Invalid email or password' });
});

// ── File upload ──
const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadsDir),
    filename: (req, file, cb) => {
      const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
      // Sanitize filename — replace spaces and special chars
      const sanitized = file.originalname.replace(/[^a-zA-Z0-9._-]/g, '_');
      cb(null, `${unique}-${sanitized}`);
    },
  }),
  limits: { fileSize: 10 * 1024 * 1024 },
});

app.post('/api/documents/upload', upload.single('file'), (req, res) => {
  if (!req.file) return res.status(400).json({ success: false, message: 'No file uploaded' });
  res.json({
    success: true,
    data: {
      filename: req.file.filename,
      originalName: req.file.originalname,
      mimeType: req.file.mimetype,
      size: req.file.size,
      url: `/uploads/${req.file.filename}`,
    },
  });
});

// ── Document view endpoint (handles encoded filenames) ──
app.get('/api/documents/view/:filename', (req, res) => {
  const filename = decodeURIComponent(req.params.filename);
  const filePath = path.join(uploadsDir, filename);
  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ success: false, message: 'File not found' });
  }
  res.sendFile(filePath);
});

// ── In-Memory Stores for Notifications & Audit ──
let notifications = [
  { id: 'n1', message: 'New loan application submitted', time: new Date(Date.now() - 1000 * 60 * 2).toISOString(), read: false },
  { id: 'n2', message: 'Vehicle Hyundai Tucson reserved', time: new Date(Date.now() - 1000 * 60 * 15).toISOString(), read: false },
  { id: 'n3', message: 'Deal with Abebe Kebede moved to financing', time: new Date(Date.now() - 1000 * 60 * 60).toISOString(), read: true },
];

let auditLogs = [
  { id: 'a1', timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString(), resource: 'Deal', action: 'Created', userId: 'admin-001', resourceId: 'D-1004' },
  { id: 'a2', timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(), resource: 'Finance', action: 'Requested Review', userId: 'admin-001', resourceId: 'F-882' },
  { id: 'a3', timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(), resource: 'Vehicle', action: 'Status Update', userId: 'admin-001', resourceId: 'V-201' },
  { id: 'a4', timestamp: new Date(Date.now() - 1000 * 60 * 2).toISOString(), resource: 'Customer', action: 'Application Submitted', userId: 'admin-001', resourceId: 'C-012' },
];

function generateAuditAndNotification(req) {
  const url = req.url;
  let resource = 'System';
  let action = 'Updated';
  let message = 'System record updated';

  if (url.includes('/deals')) {
    resource = 'Deal';
    if (req.method === 'POST') { action = 'Created'; message = 'New deal created in pipeline'; }
    else if (req.method === 'PUT') { action = 'Stage Updated'; message = 'Deal stage was updated'; }
    else { action = 'Deleted'; message = 'Deal removed'; }
  } else if (url.includes('/finance')) {
    resource = 'Finance';
    if (req.method === 'POST') { action = 'Requested'; message = 'New finance application submitted'; }
    else if (req.method === 'PUT') { action = 'Reviewed'; message = 'Finance application reviewed'; }
  } else if (url.includes('/vehicles')) {
    resource = 'Vehicle';
    if (req.method === 'POST') { action = 'Registered'; message = 'New vehicle added to inventory'; }
    else if (req.method === 'PUT') { action = 'Updated'; message = 'Vehicle details updated'; }
    else { action = 'Deleted'; message = 'Vehicle removed from inventory'; }
  } else if (url.includes('/customers')) {
    resource = 'Customer';
    if (req.method === 'POST') { action = 'Onboarded'; message = 'New customer onboarded'; }
  } else if (url.includes('/partners')) {
    resource = 'Partner';
    if (req.method === 'POST') { action = 'Registered'; message = 'New partner registered'; }
    else { action = 'Removed'; message = 'Partner removed from network'; }
  }

  const timestamp = new Date().toISOString();
  
  auditLogs.unshift({
    id: 'a' + Date.now(),
    timestamp,
    resource,
    action,
    userId: 'admin-001',
    resourceId: 'SYS-' + Math.floor(Math.random() * 1000)
  });

  notifications.unshift({
    id: 'n' + Date.now(),
    message,
    time: timestamp,
    read: false
  });

  if (auditLogs.length > 100) auditLogs = auditLogs.slice(0, 100);
  if (notifications.length > 50) notifications = notifications.slice(0, 50);
}

app.get('/api/notifications', (req, res) => {
  res.json({ success: true, data: notifications });
});

app.post('/api/notifications/read', (req, res) => {
  notifications = notifications.map(n => ({ ...n, read: true }));
  res.json({ success: true, data: notifications });
});

app.get('/api/audit', (req, res) => {
  res.json({ success: true, data: auditLogs });
});

// ── Health ──
app.get('/api/health', async (req, res) => {
  const services = [
    { name: 'crm', port: 3001 },
    { name: 'vehicle', port: 3002 },
    { name: 'finance', port: 3003 },
    { name: 'deal', port: 3004 },
    { name: 'partner', port: 3005 },
    { name: 'lead', port: 3006 },
    { name: 'analytics', port: 3007 },
  ];

  const checks = await Promise.all(
    services.map(async (svc) => {
      try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 2000);
        const r = await fetch(`http://localhost:${svc.port}/health`, { signal: controller.signal });
        clearTimeout(timeout);
        return { name: svc.name, status: r.ok ? 'healthy' : 'degraded', port: svc.port };
      } catch {
        return { name: svc.name, status: 'down', port: svc.port };
      }
    })
  );

  const memory = process.memoryUsage();
  res.json({ 
    success: true, 
    data: { 
      gateway: 'healthy', 
      uptimeSeconds: Math.floor(process.uptime()),
      memory: {
        heapTotal: Math.round(memory.heapTotal / 1024 / 1024),
        heapUsed: Math.round(memory.heapUsed / 1024 / 1024)
      },
      services: checks, 
      timestamp: new Date().toISOString() 
    } 
  });
});

// ── Search (cross-service) ──
app.use('/api/search', express.json());
app.get('/api/search', async (req, res) => {
  const q = (req.query.q || '').trim();
  if (!q) return res.json({ success: true, data: [] });

  const results = [];
  const searches = [
    { url: `http://localhost:3001/customers?q=${encodeURIComponent(q)}`, type: 'customer' },
    { url: `http://localhost:3002/vehicles?q=${encodeURIComponent(q)}`, type: 'vehicle' },
    { url: `http://localhost:3004/deals?q=${encodeURIComponent(q)}`, type: 'deal' },
    { url: `http://localhost:3005/partners?q=${encodeURIComponent(q)}`, type: 'partner' },
    { url: `http://localhost:3006/leads?q=${encodeURIComponent(q)}`, type: 'lead' },
  ];

  await Promise.all(
    searches.map(async ({ url, type }) => {
      try {
        const r = await fetch(url);
        const body = await r.json();
        const items = Array.isArray(body.data) ? body.data : Array.isArray(body) ? body : [];
        for (const item of items.slice(0, 5)) {
          results.push({ ...item, _type: type });
        }
      } catch { /* service may be down */ }
    })
  );

  res.json({ success: true, data: results });
});

// ── Proxy Helper ──
// Simple reverse proxy using Node.js http module
const SERVICE_MAP = {
  '/api/customers': { port: 3001, prefix: '/customers' },
  '/api/vehicles': { port: 3002, prefix: '/vehicles' },
  '/api/finance': { port: 3003, prefix: '/finance' },
  '/api/deals': { port: 3004, prefix: '/deals' },
  '/api/partners': { port: 3005, prefix: '/partners' },
  '/api/leads': { port: 3006, prefix: '/leads' },
  '/api/analytics': { port: 3007, prefix: '/analytics' },
};

function proxyRequest(req, res, port, targetPath) {
  const options = {
    hostname: 'localhost',
    port,
    path: targetPath + (req.url.includes('?') ? req.url.slice(req.url.indexOf('?')) : ''),
    method: req.method,
    headers: { ...req.headers, host: `localhost:${port}` },
  };

  const proxyReq = http.request(options, (proxyRes) => {
    if (proxyRes.statusCode >= 200 && proxyRes.statusCode < 300) {
      if (['POST', 'PUT', 'DELETE'].includes(req.method)) {
        generateAuditAndNotification(req);
      }
    }
    res.writeHead(proxyRes.statusCode, proxyRes.headers);
    proxyRes.pipe(res, { end: true });
  });

  proxyReq.on('error', (err) => {
    console.error(`Proxy error → port ${port}:`, err.message);
    if (!res.headersSent) {
      res.status(503).json({ success: false, message: `Service unavailable: ${err.message}` });
    }
  });

  req.pipe(proxyReq, { end: true });
}

// Register proxy routes for each service
for (const [apiPath, config] of Object.entries(SERVICE_MAP)) {
  app.all(`${apiPath}`, (req, res) => {
    proxyRequest(req, res, config.port, config.prefix);
  });

  app.all(`${apiPath}/*`, (req, res) => {
    // Rewrite /api/customers/xyz => /customers/xyz
    const remaining = req.params[0] || '';
    const targetPath = `${config.prefix}/${remaining}`;
    proxyRequest(req, res, config.port, targetPath);
  });
}

// ── Start ──
app.listen(PORT, () => {
  console.log(`🚀 Zelalem Motors API Gateway running on http://localhost:${PORT}`);
  console.log('   Proxying to microservices on ports 3001–3007');
  console.log('   Demo accounts: admin@zelalem.com, sales@zelalem.com, finance@zelalem.com, marketing@zelalem.com');
});
