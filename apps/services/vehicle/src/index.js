const express = require('express');
const cors = require('cors');
const Database = require('better-sqlite3');
const { v4: uuid } = require('uuid');
const path = require('path');

const app = express();
const PORT = 3002;
app.use(cors());
app.use(express.json());

const db = new Database(path.join(__dirname, '..', 'vehicle.sqlite'));
db.pragma('journal_mode = WAL');

db.exec(`
  CREATE TABLE IF NOT EXISTS suppliers (
    id TEXT PRIMARY KEY,
    companyName TEXT NOT NULL,
    contactPerson TEXT,
    email TEXT,
    phone TEXT,
    city TEXT,
    address TEXT,
    licenseNumber TEXT,
    status TEXT DEFAULT 'active',
    createdAt TEXT DEFAULT (datetime('now')),
    updatedAt TEXT DEFAULT (datetime('now'))
  );
  CREATE TABLE IF NOT EXISTS vehicles (
    id TEXT PRIMARY KEY,
    make TEXT NOT NULL,
    model TEXT NOT NULL,
    year INTEGER DEFAULT 2024,
    color TEXT,
    mileage INTEGER DEFAULT 0,
    price REAL DEFAULT 0,
    condition TEXT DEFAULT 'new',
    fuelType TEXT DEFAULT 'Petrol',
    transmission TEXT DEFAULT 'Automatic',
    status TEXT DEFAULT 'available',
    description TEXT,
    imageUrl TEXT,
    supplierId TEXT,
    supplierName TEXT,
    createdAt TEXT DEFAULT (datetime('now')),
    updatedAt TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (supplierId) REFERENCES suppliers(id)
  );
`);

app.get('/health', (req, res) => res.json({ status: 'healthy', service: 'vehicle' }));

// ── Vehicles ──
app.get('/vehicles', (req, res) => {
  const q = req.query.q;
  let rows;
  if (q) {
    rows = db.prepare(`SELECT * FROM vehicles WHERE make LIKE ? OR model LIKE ? OR supplierName LIKE ? OR color LIKE ? OR status LIKE ? ORDER BY createdAt DESC`)
      .all(`%${q}%`, `%${q}%`, `%${q}%`, `%${q}%`, `%${q}%`);
  } else {
    rows = db.prepare('SELECT * FROM vehicles ORDER BY createdAt DESC').all();
  }
  res.json({ success: true, data: rows });
});

app.get('/vehicles/:id', (req, res) => {
  const row = db.prepare('SELECT * FROM vehicles WHERE id = ?').get(req.params.id);
  if (!row) return res.status(404).json({ success: false, message: 'Vehicle not found' });
  res.json({ success: true, data: row });
});

app.post('/vehicles', (req, res) => {
  const id = uuid();
  const b = req.body;
  let supplierName = b.supplierName || '';
  if (b.supplierId) {
    const sup = db.prepare('SELECT companyName FROM suppliers WHERE id = ?').get(b.supplierId);
    if (sup) supplierName = sup.companyName;
  }
  db.prepare(`INSERT INTO vehicles (id, make, model, year, color, mileage, price, condition, fuelType, transmission, status, description, imageUrl, supplierId, supplierName)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`)
    .run(id, b.make, b.model, b.year || 2024, b.color || null, b.mileage || 0, b.price || 0, b.condition || 'new', b.fuelType || 'Petrol', b.transmission || 'Automatic', b.status || 'available', b.description || null, b.imageUrl || null, b.supplierId || null, supplierName);
  res.status(201).json({ success: true, data: db.prepare('SELECT * FROM vehicles WHERE id = ?').get(id) });
});

app.put('/vehicles/:id', (req, res) => {
  const existing = db.prepare('SELECT * FROM vehicles WHERE id = ?').get(req.params.id);
  if (!existing) return res.status(404).json({ success: false, message: 'Vehicle not found' });
  const fields = { ...existing, ...req.body, updatedAt: new Date().toISOString() };
  db.prepare(`UPDATE vehicles SET make=?, model=?, year=?, color=?, mileage=?, price=?, condition=?, fuelType=?, transmission=?, status=?, description=?, imageUrl=?, supplierId=?, supplierName=?, updatedAt=? WHERE id=?`)
    .run(fields.make, fields.model, fields.year, fields.color, fields.mileage, fields.price, fields.condition, fields.fuelType, fields.transmission, fields.status, fields.description, fields.imageUrl, fields.supplierId, fields.supplierName, fields.updatedAt, req.params.id);
  res.json({ success: true, data: db.prepare('SELECT * FROM vehicles WHERE id = ?').get(req.params.id) });
});

app.delete('/vehicles/:id', (req, res) => {
  const result = db.prepare('DELETE FROM vehicles WHERE id = ?').run(req.params.id);
  if (result.changes === 0) return res.status(404).json({ success: false, message: 'Vehicle not found' });
  res.json({ success: true, message: 'Vehicle deleted' });
});

// ── Suppliers ──
app.get('/vehicles/suppliers/all', (req, res) => {
  res.json({ success: true, data: db.prepare('SELECT * FROM suppliers ORDER BY createdAt DESC').all() });
});

app.post('/vehicles/suppliers', (req, res) => {
  const id = uuid();
  const b = req.body;
  db.prepare(`INSERT INTO suppliers (id, companyName, contactPerson, email, phone, city, address, licenseNumber, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`)
    .run(id, b.companyName, b.contactPerson || null, b.email || null, b.phone || null, b.city || null, b.address || null, b.licenseNumber || null, 'active');
  res.status(201).json({ success: true, data: db.prepare('SELECT * FROM suppliers WHERE id = ?').get(id) });
});

// ── Inventory Summary ──
app.get('/vehicles/inventory/summary', (req, res) => {
  const total = db.prepare('SELECT COUNT(*) as c FROM vehicles').get().c;
  const available = db.prepare("SELECT COUNT(*) as c FROM vehicles WHERE status = 'available'").get().c;
  const reserved = db.prepare("SELECT COUNT(*) as c FROM vehicles WHERE status = 'reserved'").get().c;
  const sold = db.prepare("SELECT COUNT(*) as c FROM vehicles WHERE status = 'sold'").get().c;
  const makes = db.prepare('SELECT make, COUNT(*) as count FROM vehicles GROUP BY make').all();
  const byMake = Object.fromEntries(makes.map(r => [r.make, r.count]));
  res.json({ success: true, data: { total, available, reserved, sold, byMake } });
});

app.listen(PORT, () => console.log(`🚗 Vehicle Service running on http://localhost:${PORT}`));
