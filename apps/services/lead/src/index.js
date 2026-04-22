const express = require('express');
const cors = require('cors');
const Database = require('better-sqlite3');
const { v4: uuid } = require('uuid');
const path = require('path');

const app = express();
const PORT = 3006;
app.use(cors());
app.use(express.json());

const db = new Database(path.join(__dirname, '..', 'lead.sqlite'));
db.pragma('journal_mode = WAL');

db.exec(`
  CREATE TABLE IF NOT EXISTS leads (
    id TEXT PRIMARY KEY,
    name TEXT,
    firstName TEXT,
    lastName TEXT,
    email TEXT,
    phone TEXT,
    source TEXT DEFAULT 'website',
    vehicleInterest TEXT,
    campaignId TEXT,
    status TEXT DEFAULT 'new',
    notes TEXT,
    createdAt TEXT DEFAULT (datetime('now')),
    updatedAt TEXT DEFAULT (datetime('now'))
  );
  CREATE TABLE IF NOT EXISTS campaigns (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    type TEXT DEFAULT 'digital',
    budget REAL DEFAULT 0,
    startDate TEXT,
    endDate TEXT,
    description TEXT,
    status TEXT DEFAULT 'draft',
    leadsGenerated INTEGER DEFAULT 0,
    conversions INTEGER DEFAULT 0,
    createdAt TEXT DEFAULT (datetime('now')),
    updatedAt TEXT DEFAULT (datetime('now'))
  );
  CREATE TABLE IF NOT EXISTS referrals (
    id TEXT PRIMARY KEY,
    referrerName TEXT,
    referrerEmail TEXT,
    referredName TEXT,
    referredEmail TEXT,
    reward REAL DEFAULT 0,
    status TEXT DEFAULT 'pending',
    rewardStatus TEXT DEFAULT 'pending',
    createdAt TEXT DEFAULT (datetime('now'))
  );
`);

app.get('/health', (req, res) => res.json({ status: 'healthy', service: 'lead' }));

// ── Leads ──
app.get('/leads', (req, res) => {
  const q = req.query.q;
  let rows;
  if (q) {
    rows = db.prepare('SELECT * FROM leads WHERE name LIKE ? OR email LIKE ? OR vehicleInterest LIKE ? OR source LIKE ? OR status LIKE ? ORDER BY createdAt DESC')
      .all(`%${q}%`, `%${q}%`, `%${q}%`, `%${q}%`, `%${q}%`);
  } else {
    rows = db.prepare('SELECT * FROM leads ORDER BY createdAt DESC').all();
  }
  res.json({ success: true, data: rows });
});

app.post('/leads', (req, res) => {
  const id = uuid();
  const b = req.body;
  db.prepare('INSERT INTO leads (id, name, firstName, lastName, email, phone, source, vehicleInterest, campaignId, status, notes) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)')
    .run(id, b.name || null, b.firstName || null, b.lastName || null, b.email || null, b.phone || null, b.source || 'website', b.vehicleInterest || null, b.campaignId || null, b.status || 'new', b.notes || null);
  // Update campaign lead count if linked
  if (b.campaignId) {
    db.prepare('UPDATE campaigns SET leadsGenerated = leadsGenerated + 1 WHERE id = ?').run(b.campaignId);
  }
  res.status(201).json({ success: true, data: db.prepare('SELECT * FROM leads WHERE id = ?').get(id) });
});

app.put('/leads/:id', (req, res) => {
  const existing = db.prepare('SELECT * FROM leads WHERE id = ?').get(req.params.id);
  if (!existing) return res.status(404).json({ success: false, message: 'Lead not found' });
  const { status, notes } = req.body;
  if (status) {
    db.prepare('UPDATE leads SET status = ?, updatedAt = datetime("now") WHERE id = ?').run(status, req.params.id);
    // Track conversions
    if (status === 'converted' && existing.campaignId) {
      db.prepare('UPDATE campaigns SET conversions = conversions + 1 WHERE id = ?').run(existing.campaignId);
    }
  }
  if (notes) db.prepare('UPDATE leads SET notes = ?, updatedAt = datetime("now") WHERE id = ?').run(notes, req.params.id);
  res.json({ success: true, data: db.prepare('SELECT * FROM leads WHERE id = ?').get(req.params.id) });
});

app.delete('/leads/:id', (req, res) => {
  db.prepare('DELETE FROM leads WHERE id = ?').run(req.params.id);
  res.json({ success: true, message: 'Lead deleted' });
});

// ── Campaigns ──
app.get('/leads/campaigns/all', (req, res) => {
  res.json({ success: true, data: db.prepare('SELECT * FROM campaigns ORDER BY createdAt DESC').all() });
});

app.post('/leads/campaigns', (req, res) => {
  const id = uuid();
  const b = req.body;
  db.prepare('INSERT INTO campaigns (id, name, type, budget, startDate, endDate, description, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)')
    .run(id, b.name, b.type || 'digital', b.budget || 0, b.startDate || null, b.endDate || null, b.description || null, b.status || 'draft');
  res.status(201).json({ success: true, data: db.prepare('SELECT * FROM campaigns WHERE id = ?').get(id) });
});

app.put('/leads/campaigns/:id', (req, res) => {
  const { status } = req.body;
  if (status) db.prepare('UPDATE campaigns SET status = ?, updatedAt = datetime("now") WHERE id = ?').run(status, req.params.id);
  res.json({ success: true, data: db.prepare('SELECT * FROM campaigns WHERE id = ?').get(req.params.id) });
});

// ── Referrals ──
app.get('/leads/referrals/all', (req, res) => {
  res.json({ success: true, data: db.prepare('SELECT * FROM referrals ORDER BY createdAt DESC').all() });
});

app.post('/leads/referrals', (req, res) => {
  const id = uuid();
  const b = req.body;
  db.prepare('INSERT INTO referrals (id, referrerName, referrerEmail, referredName, referredEmail, reward) VALUES (?, ?, ?, ?, ?, ?)')
    .run(id, b.referrerName, b.referrerEmail || null, b.referredName, b.referredEmail || null, b.reward || 0);
  res.status(201).json({ success: true, data: db.prepare('SELECT * FROM referrals WHERE id = ?').get(id) });
});

app.listen(PORT, () => console.log(`📣 Lead Service running on http://localhost:${PORT}`));
