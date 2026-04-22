const express = require('express');
const cors = require('cors');
const Database = require('better-sqlite3');
const { v4: uuid } = require('uuid');
const path = require('path');

const app = express();
const PORT = 3003;
app.use(cors());
app.use(express.json());

const db = new Database(path.join(__dirname, '..', 'finance.sqlite'));
db.pragma('journal_mode = WAL');

db.exec(`
  CREATE TABLE IF NOT EXISTS institutions (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    code TEXT,
    type TEXT DEFAULT 'bank',
    contactPerson TEXT,
    email TEXT,
    phone TEXT,
    maxLoanAmount REAL DEFAULT 0,
    interestRate REAL DEFAULT 12,
    maxTerm INTEGER DEFAULT 60,
    status TEXT DEFAULT 'active',
    createdAt TEXT DEFAULT (datetime('now'))
  );
  CREATE TABLE IF NOT EXISTS loan_reviews (
    id TEXT PRIMARY KEY,
    applicationId TEXT,
    dealId TEXT,
    institutionId TEXT,
    institution TEXT,
    customerName TEXT,
    vehicleDescription TEXT,
    requestedAmount REAL DEFAULT 0,
    approvedAmount REAL,
    termMonths INTEGER DEFAULT 48,
    term INTEGER DEFAULT 48,
    interestRate REAL DEFAULT 12.5,
    status TEXT DEFAULT 'pending',
    notes TEXT,
    rejectionReason TEXT,
    createdAt TEXT DEFAULT (datetime('now')),
    updatedAt TEXT DEFAULT (datetime('now'))
  );
  CREATE TABLE IF NOT EXISTS document_requests (
    id TEXT PRIMARY KEY,
    reviewId TEXT,
    documentType TEXT,
    description TEXT,
    status TEXT DEFAULT 'requested',
    createdAt TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (reviewId) REFERENCES loan_reviews(id)
  );
`);

app.get('/health', (req, res) => res.json({ status: 'healthy', service: 'finance' }));

// ── Reviews ──
app.get('/finance/reviews', (req, res) => {
  const rows = db.prepare('SELECT * FROM loan_reviews ORDER BY createdAt DESC').all();
  // Attach document requests
  const data = rows.map(r => {
    const docReqs = db.prepare('SELECT * FROM document_requests WHERE reviewId = ?').all(r.id);
    return { ...r, documentRequests: docReqs };
  });
  res.json({ success: true, data });
});

app.post('/finance/reviews', (req, res) => {
  const id = uuid();
  const b = req.body;
  db.prepare(`INSERT INTO loan_reviews (id, applicationId, dealId, institutionId, institution, customerName, vehicleDescription, requestedAmount, termMonths, term, interestRate, status, notes)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`)
    .run(id, b.applicationId || null, b.dealId || null, b.institutionId || null, b.institution || null, b.customerName, b.vehicleDescription, b.requestedAmount || 0, b.termMonths || 48, b.term || b.termMonths || 48, b.interestRate || 12.5, b.status || 'pending', b.notes || null);
  res.status(201).json({ success: true, data: db.prepare('SELECT * FROM loan_reviews WHERE id = ?').get(id) });
});

app.put('/finance/reviews/:id', (req, res) => {
  const existing = db.prepare('SELECT * FROM loan_reviews WHERE id = ?').get(req.params.id);
  if (!existing) return res.status(404).json({ success: false, message: 'Review not found' });
  const { status, notes } = req.body;
  if (status) db.prepare("UPDATE loan_reviews SET status = ?, updatedAt = datetime('now') WHERE id = ?").run(status, req.params.id);
  if (notes) db.prepare("UPDATE loan_reviews SET notes = ?, updatedAt = datetime('now') WHERE id = ?").run(notes, req.params.id);
  res.json({ success: true, data: db.prepare('SELECT * FROM loan_reviews WHERE id = ?').get(req.params.id) });
});

app.post('/finance/reviews/:id/approve', (req, res) => {
  const { approvedAmount, notes } = req.body;
  db.prepare(`UPDATE loan_reviews SET status = 'approved', approvedAmount = ?, notes = COALESCE(?, notes), updatedAt = datetime('now') WHERE id = ?`)
    .run(approvedAmount || 0, notes || null, req.params.id);
  res.json({ success: true, data: db.prepare('SELECT * FROM loan_reviews WHERE id = ?').get(req.params.id) });
});

app.post('/finance/reviews/:id/reject', (req, res) => {
  const { reason } = req.body;
  db.prepare(`UPDATE loan_reviews SET status = 'rejected', rejectionReason = ?, updatedAt = datetime('now') WHERE id = ?`)
    .run(reason || 'Rejected', req.params.id);
  res.json({ success: true, data: db.prepare('SELECT * FROM loan_reviews WHERE id = ?').get(req.params.id) });
});

// ── Institutions ──
app.get('/finance/institutions', (req, res) => {
  res.json({ success: true, data: db.prepare('SELECT * FROM institutions ORDER BY createdAt DESC').all() });
});

app.post('/finance/institutions', (req, res) => {
  const id = uuid();
  const b = req.body;
  db.prepare(`INSERT INTO institutions (id, name, code, type, contactPerson, email, phone, maxLoanAmount, interestRate, maxTerm, status)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`)
    .run(id, b.name, b.code || null, b.type || 'bank', b.contactPerson || null, b.email || null, b.phone || null, b.maxLoanAmount || 0, b.interestRate || 12, b.maxTerm || 60, b.status || 'active');
  res.status(201).json({ success: true, data: db.prepare('SELECT * FROM institutions WHERE id = ?').get(id) });
});

// ── Document Requests ──
app.post('/finance/document-requests', (req, res) => {
  const id = uuid();
  const { reviewId, documentType, description } = req.body;
  db.prepare('INSERT INTO document_requests (id, reviewId, documentType, description) VALUES (?, ?, ?, ?)')
    .run(id, reviewId, documentType, description || null);
  res.status(201).json({ success: true, data: db.prepare('SELECT * FROM document_requests WHERE id = ?').get(id) });
});

// ── Pipeline ──
app.get('/finance/pipeline', (req, res) => {
  const pending = db.prepare("SELECT COUNT(*) as c FROM loan_reviews WHERE status = 'pending'").get().c;
  const inReview = db.prepare("SELECT COUNT(*) as c FROM loan_reviews WHERE status = 'in_review'").get().c;
  const approved = db.prepare("SELECT COUNT(*) as c FROM loan_reviews WHERE status = 'approved'").get().c;
  const rejected = db.prepare("SELECT COUNT(*) as c FROM loan_reviews WHERE status = 'rejected'").get().c;
  const moreInfoNeeded = db.prepare("SELECT COUNT(*) as c FROM loan_reviews WHERE status = 'more_info_needed'").get().c;
  res.json({ success: true, data: { pending, inReview, approved, rejected, moreInfoNeeded } });
});

app.listen(PORT, () => console.log(`🏦 Finance Service running on http://localhost:${PORT}`));
