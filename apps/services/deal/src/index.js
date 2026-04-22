const express = require('express');
const cors = require('cors');
const Database = require('better-sqlite3');
const { v4: uuid } = require('uuid');
const path = require('path');

const app = express();
const PORT = 3004;
app.use(cors());
app.use(express.json());

const db = new Database(path.join(__dirname, '..', 'deal.sqlite'));
db.pragma('journal_mode = WAL');

db.exec(`
  CREATE TABLE IF NOT EXISTS deals (
    id TEXT PRIMARY KEY,
    customerId TEXT,
    customerName TEXT,
    vehicleId TEXT,
    vehicleDescription TEXT,
    applicationId TEXT,
    reviewId TEXT,
    amount REAL DEFAULT 0,
    totalAmount REAL DEFAULT 0,
    downPayment REAL DEFAULT 0,
    financedAmount REAL DEFAULT 0,
    commissionRate REAL DEFAULT 5,
    stage TEXT DEFAULT 'inquiry',
    notes TEXT,
    createdAt TEXT DEFAULT (datetime('now')),
    updatedAt TEXT DEFAULT (datetime('now'))
  );
`);

app.get('/health', (req, res) => res.json({ status: 'healthy', service: 'deal' }));

app.get('/deals', (req, res) => {
  const q = req.query.q;
  let rows;
  if (q) {
    rows = db.prepare(`SELECT * FROM deals WHERE customerName LIKE ? OR vehicleDescription LIKE ? OR stage LIKE ? OR notes LIKE ? ORDER BY createdAt DESC`)
      .all(`%${q}%`, `%${q}%`, `%${q}%`, `%${q}%`);
  } else {
    rows = db.prepare('SELECT * FROM deals ORDER BY createdAt DESC').all();
  }
  res.json({ success: true, data: rows });
});

app.get('/deals/:id', (req, res) => {
  const row = db.prepare('SELECT * FROM deals WHERE id = ?').get(req.params.id);
  if (!row) return res.status(404).json({ success: false, message: 'Deal not found' });
  res.json({ success: true, data: row });
});

app.post('/deals', (req, res) => {
  const id = uuid();
  const b = req.body;
  db.prepare(`INSERT INTO deals (id, customerId, customerName, vehicleId, vehicleDescription, applicationId, reviewId, amount, totalAmount, downPayment, financedAmount, commissionRate, stage, notes)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`)
    .run(id, b.customerId || null, b.customerName || null, b.vehicleId || null, b.vehicleDescription || null, b.applicationId || null, b.reviewId || null, b.amount || 0, b.totalAmount || b.amount || 0, b.downPayment || 0, b.financedAmount || 0, b.commissionRate || 5, b.stage || 'inquiry', b.notes || null);
  res.status(201).json({ success: true, data: db.prepare('SELECT * FROM deals WHERE id = ?').get(id) });
});

app.put('/deals/:id', (req, res) => {
  const existing = db.prepare('SELECT * FROM deals WHERE id = ?').get(req.params.id);
  if (!existing) return res.status(404).json({ success: false, message: 'Deal not found' });
  const fields = { ...existing, ...req.body, updatedAt: new Date().toISOString() };
  db.prepare(`UPDATE deals SET customerName=?, vehicleDescription=?, amount=?, totalAmount=?, downPayment=?, financedAmount=?, commissionRate=?, stage=?, notes=?, updatedAt=? WHERE id=?`)
    .run(fields.customerName, fields.vehicleDescription, fields.amount, fields.totalAmount, fields.downPayment, fields.financedAmount, fields.commissionRate, fields.stage, fields.notes, fields.updatedAt, req.params.id);
  res.json({ success: true, data: db.prepare('SELECT * FROM deals WHERE id = ?').get(req.params.id) });
});

app.put('/deals/:id/stage', (req, res) => {
  const { stage } = req.body;
  db.prepare("UPDATE deals SET stage = ?, updatedAt = datetime('now') WHERE id = ?").run(stage, req.params.id);
  res.json({ success: true, data: db.prepare('SELECT * FROM deals WHERE id = ?').get(req.params.id) });
});

app.delete('/deals/:id', (req, res) => {
  db.prepare("UPDATE deals SET stage = 'cancelled', updatedAt = datetime('now') WHERE id = ?").run(req.params.id);
  res.json({ success: true, message: 'Deal cancelled' });
});

app.listen(PORT, () => console.log(`🤝 Deal Service running on http://localhost:${PORT}`));
