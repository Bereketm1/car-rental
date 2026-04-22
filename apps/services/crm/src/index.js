const express = require('express');
const cors = require('cors');
const Database = require('better-sqlite3');
const { v4: uuid } = require('uuid');
const path = require('path');

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// ── Database ──
const db = new Database(path.join(__dirname, '..', 'crm.sqlite'));
db.pragma('journal_mode = WAL');

db.exec(`
  CREATE TABLE IF NOT EXISTS customers (
    id TEXT PRIMARY KEY,
    firstName TEXT NOT NULL,
    lastName TEXT NOT NULL,
    email TEXT UNIQUE,
    phone TEXT,
    nationalId TEXT,
    address TEXT,
    city TEXT,
    region TEXT,
    status TEXT DEFAULT 'active',
    createdAt TEXT DEFAULT (datetime('now')),
    updatedAt TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS vehicle_interests (
    id TEXT PRIMARY KEY,
    customerId TEXT NOT NULL,
    vehicleId TEXT,
    notes TEXT,
    createdAt TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (customerId) REFERENCES customers(id)
  );

  CREATE TABLE IF NOT EXISTS loan_applications (
    id TEXT PRIMARY KEY,
    customerId TEXT NOT NULL,
    vehicleId TEXT,
    requestedAmount REAL DEFAULT 0,
    termMonths INTEGER DEFAULT 48,
    monthlyIncome REAL DEFAULT 0,
    employmentStatus TEXT DEFAULT 'employed',
    status TEXT DEFAULT 'submitted',
    createdAt TEXT DEFAULT (datetime('now')),
    updatedAt TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (customerId) REFERENCES customers(id)
  );

  CREATE TABLE IF NOT EXISTS documents (
    id TEXT PRIMARY KEY,
    customerId TEXT NOT NULL,
    type TEXT DEFAULT 'other',
    filename TEXT,
    originalName TEXT,
    mimeType TEXT,
    size INTEGER DEFAULT 0,
    url TEXT,
    uploadedAt TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (customerId) REFERENCES customers(id)
  );
`);

// ── Health ──
app.get('/health', (req, res) => res.json({ status: 'healthy', service: 'crm' }));

// ── Customers ──
app.get('/customers', (req, res) => {
  const q = req.query.q;
  let rows;
  if (q) {
    rows = db.prepare(`SELECT * FROM customers WHERE firstName LIKE ? OR lastName LIKE ? OR email LIKE ? OR phone LIKE ? OR city LIKE ? ORDER BY createdAt DESC`)
      .all(`%${q}%`, `%${q}%`, `%${q}%`, `%${q}%`, `%${q}%`);
  } else {
    rows = db.prepare('SELECT * FROM customers ORDER BY createdAt DESC').all();
  }
  res.json({ success: true, data: rows });
});

app.get('/customers/:id', (req, res) => {
  const row = db.prepare('SELECT * FROM customers WHERE id = ?').get(req.params.id);
  if (!row) return res.status(404).json({ success: false, message: 'Customer not found' });
  res.json({ success: true, data: row });
});

app.post('/customers', (req, res) => {
  const id = uuid();
  const { firstName, lastName, email, phone, nationalId, address, city, region, status } = req.body;
  try {
    db.prepare(`INSERT INTO customers (id, firstName, lastName, email, phone, nationalId, address, city, region, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`)
      .run(id, firstName, lastName, email, phone || null, nationalId || null, address || null, city || null, region || null, status || 'active');
    const customer = db.prepare('SELECT * FROM customers WHERE id = ?').get(id);
    res.status(201).json({ success: true, data: customer });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

app.put('/customers/:id', (req, res) => {
  const existing = db.prepare('SELECT * FROM customers WHERE id = ?').get(req.params.id);
  if (!existing) return res.status(404).json({ success: false, message: 'Customer not found' });
  const fields = { ...existing, ...req.body, updatedAt: new Date().toISOString() };
  db.prepare(`UPDATE customers SET firstName=?, lastName=?, email=?, phone=?, nationalId=?, address=?, city=?, region=?, status=?, updatedAt=? WHERE id=?`)
    .run(fields.firstName, fields.lastName, fields.email, fields.phone, fields.nationalId, fields.address, fields.city, fields.region, fields.status, fields.updatedAt, req.params.id);
  res.json({ success: true, data: db.prepare('SELECT * FROM customers WHERE id = ?').get(req.params.id) });
});

app.delete('/customers/:id', (req, res) => {
  db.prepare('DELETE FROM customers WHERE id = ?').run(req.params.id);
  res.json({ success: true, message: 'Customer deleted' });
});

// ── Vehicle Interests ──
app.get('/customers/:customerId/interests', (req, res) => {
  const rows = db.prepare('SELECT * FROM vehicle_interests WHERE customerId = ? ORDER BY createdAt DESC').all(req.params.customerId);
  res.json({ success: true, data: rows });
});

app.post('/customers/:customerId/interests', (req, res) => {
  const id = uuid();
  const { vehicleId, notes } = req.body;
  db.prepare('INSERT INTO vehicle_interests (id, customerId, vehicleId, notes) VALUES (?, ?, ?, ?)')
    .run(id, req.params.customerId, vehicleId, notes || null);
  res.status(201).json({ success: true, data: db.prepare('SELECT * FROM vehicle_interests WHERE id = ?').get(id) });
});

// ── Documents ──
app.get('/customers/:customerId/documents', (req, res) => {
  const rows = db.prepare('SELECT * FROM documents WHERE customerId = ? ORDER BY uploadedAt DESC').all(req.params.customerId);
  res.json({ success: true, data: rows });
});

app.post('/customers/:customerId/documents', (req, res) => {
  const id = uuid();
  const { type, filename, originalName, mimeType, size, url } = req.body;
  db.prepare('INSERT INTO documents (id, customerId, type, filename, originalName, mimeType, size, url) VALUES (?, ?, ?, ?, ?, ?, ?, ?)')
    .run(id, req.params.customerId, type || 'other', filename, originalName, mimeType, size || 0, url);
  res.status(201).json({ success: true, data: db.prepare('SELECT * FROM documents WHERE id = ?').get(id) });
});

// ── Loan Applications ──
app.get('/customers/loan-applications/all', (req, res) => {
  const rows = db.prepare(`
    SELECT la.*, c.firstName, c.lastName, c.email
    FROM loan_applications la
    LEFT JOIN customers c ON la.customerId = c.id
    ORDER BY la.createdAt DESC
  `).all();
  // Nest customer data
  const data = rows.map(r => ({
    ...r,
    customer: r.firstName ? { firstName: r.firstName, lastName: r.lastName, email: r.email } : null,
  }));
  res.json({ success: true, data });
});

app.post('/customers/loan-applications', (req, res) => {
  const id = uuid();
  const { customerId, vehicleId, requestedAmount, termMonths, monthlyIncome, employmentStatus } = req.body;
  db.prepare(`INSERT INTO loan_applications (id, customerId, vehicleId, requestedAmount, termMonths, monthlyIncome, employmentStatus)
    VALUES (?, ?, ?, ?, ?, ?, ?)`)
    .run(id, customerId, vehicleId, requestedAmount || 0, termMonths || 48, monthlyIncome || 0, employmentStatus || 'employed');
  res.status(201).json({ success: true, data: db.prepare('SELECT * FROM loan_applications WHERE id = ?').get(id) });
});

app.put('/customers/loan-applications/:id', (req, res) => {
  const existing = db.prepare('SELECT * FROM loan_applications WHERE id = ?').get(req.params.id);
  if (!existing) return res.status(404).json({ success: false, message: 'Application not found' });
  const { status } = req.body;
  if (status) {
    db.prepare('UPDATE loan_applications SET status = ?, updatedAt = datetime("now") WHERE id = ?').run(status, req.params.id);
  }
  res.json({ success: true, data: db.prepare('SELECT * FROM loan_applications WHERE id = ?').get(req.params.id) });
});

// ── Start ──
app.listen(PORT, () => {
  console.log(`👥 CRM Service running on http://localhost:${PORT}`);
});
