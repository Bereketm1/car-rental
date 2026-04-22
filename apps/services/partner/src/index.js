const express = require('express');
const cors = require('cors');
const Database = require('better-sqlite3');
const { v4: uuid } = require('uuid');
const path = require('path');

const app = express();
const PORT = 3005;
app.use(cors());
app.use(express.json());

const db = new Database(path.join(__dirname, '..', 'partner.sqlite'));
db.pragma('journal_mode = WAL');

db.exec(`
  CREATE TABLE IF NOT EXISTS partners (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    type TEXT DEFAULT 'supplier',
    email TEXT,
    phone TEXT,
    city TEXT,
    status TEXT DEFAULT 'active',
    commissionRate REAL DEFAULT 3,
    createdAt TEXT DEFAULT (datetime('now')),
    updatedAt TEXT DEFAULT (datetime('now'))
  );
  CREATE TABLE IF NOT EXISTS agreements (
    id TEXT PRIMARY KEY,
    partnerId TEXT NOT NULL,
    title TEXT NOT NULL,
    terms TEXT,
    startDate TEXT,
    endDate TEXT,
    status TEXT DEFAULT 'active',
    createdAt TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (partnerId) REFERENCES partners(id)
  );
  CREATE TABLE IF NOT EXISTS commissions (
    id TEXT PRIMARY KEY,
    partnerId TEXT NOT NULL,
    dealId TEXT,
    amount REAL DEFAULT 0,
    status TEXT DEFAULT 'pending',
    createdAt TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (partnerId) REFERENCES partners(id)
  );
`);

app.get('/health', (req, res) => res.json({ status: 'healthy', service: 'partner' }));

// ── Partners ──
app.get('/partners', (req, res) => {
  const q = req.query.q;
  let rows;
  if (q) {
    rows = db.prepare('SELECT * FROM partners WHERE name LIKE ? OR email LIKE ? OR city LIKE ? OR type LIKE ? ORDER BY createdAt DESC')
      .all(`%${q}%`, `%${q}%`, `%${q}%`, `%${q}%`);
  } else {
    rows = db.prepare('SELECT * FROM partners ORDER BY createdAt DESC').all();
  }
  res.json({ success: true, data: rows });
});

app.post('/partners', (req, res) => {
  const id = uuid();
  const b = req.body;
  db.prepare('INSERT INTO partners (id, name, type, email, phone, city, status, commissionRate) VALUES (?, ?, ?, ?, ?, ?, ?, ?)')
    .run(id, b.name, b.type || 'supplier', b.email || null, b.phone || null, b.city || null, b.status || 'active', b.commissionRate || 3);
  res.status(201).json({ success: true, data: db.prepare('SELECT * FROM partners WHERE id = ?').get(id) });
});

app.put('/partners/:id', (req, res) => {
  const existing = db.prepare('SELECT * FROM partners WHERE id = ?').get(req.params.id);
  if (!existing) return res.status(404).json({ success: false, message: 'Partner not found' });
  const fields = { ...existing, ...req.body, updatedAt: new Date().toISOString() };
  db.prepare('UPDATE partners SET name=?, type=?, email=?, phone=?, city=?, status=?, commissionRate=?, updatedAt=? WHERE id=?')
    .run(fields.name, fields.type, fields.email, fields.phone, fields.city, fields.status, fields.commissionRate, fields.updatedAt, req.params.id);
  res.json({ success: true, data: db.prepare('SELECT * FROM partners WHERE id = ?').get(req.params.id) });
});

app.delete('/partners/:id', (req, res) => {
  db.prepare('DELETE FROM partners WHERE id = ?').run(req.params.id);
  res.json({ success: true, message: 'Partner removed' });
});

// ── Agreements ──
app.get('/partners/agreements/all', (req, res) => {
  const rows = db.prepare(`SELECT a.*, p.name as partnerName FROM agreements a LEFT JOIN partners p ON a.partnerId = p.id ORDER BY a.createdAt DESC`).all();
  const data = rows.map(r => ({ ...r, partner: { name: r.partnerName } }));
  res.json({ success: true, data });
});

app.post('/partners/agreements', (req, res) => {
  const id = uuid();
  const b = req.body;
  db.prepare('INSERT INTO agreements (id, partnerId, title, terms, startDate, endDate, status) VALUES (?, ?, ?, ?, ?, ?, ?)')
    .run(id, b.partnerId, b.title, b.terms || null, b.startDate || null, b.endDate || null, b.status || 'active');
  res.status(201).json({ success: true, data: db.prepare('SELECT * FROM agreements WHERE id = ?').get(id) });
});

// ── Commissions ──
app.get('/partners/:partnerId/commissions', (req, res) => {
  res.json({ success: true, data: db.prepare('SELECT * FROM commissions WHERE partnerId = ? ORDER BY createdAt DESC').all(req.params.partnerId) });
});

app.post('/partners/:partnerId/commissions', (req, res) => {
  const id = uuid();
  const { dealId, amount } = req.body;
  db.prepare('INSERT INTO commissions (id, partnerId, dealId, amount) VALUES (?, ?, ?, ?)')
    .run(id, req.params.partnerId, dealId, amount || 0);
  res.status(201).json({ success: true, data: db.prepare('SELECT * FROM commissions WHERE id = ?').get(id) });
});

app.listen(PORT, () => console.log(`🔗 Partner Service running on http://localhost:${PORT}`));
