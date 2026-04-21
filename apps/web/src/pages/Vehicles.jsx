import React, { useEffect, useMemo, useState } from 'react';
import { Button } from '@mui/material';
import { Building2, CarFront, PlusCircle, Truck, Users2 } from 'lucide-react';
import api from '../api';
import DataTable from '../components/DataTable';
import MetricCard from '../components/MetricCard';
import Modal from '../components/Modal';
import StatusBadge from '../components/StatusBadge';
import { useToast } from '../components/Toast';
import { formatCurrency, formatDateTime, safeArray } from '../utils/format';

const emptyVehicleForm = {
  supplierId: '',
  supplierName: '',
  make: '',
  model: '',
  year: new Date().getFullYear(),
  color: 'White',
  mileage: '0',
  price: '',
  condition: 'new',
  fuelType: 'Petrol',
  transmission: 'Automatic',
  status: 'available',
  description: '',
};

const emptySupplierForm = {
  companyName: '',
  contactPerson: '',
  email: '',
  phone: '',
  city: '',
  address: '',
  licenseNumber: '',
};

function normalize(value) {
  return String(value || '').trim().toLowerCase();
}

export default function Vehicles() {
  const toast = useToast();
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('inventory');
  const [activeModal, setActiveModal] = useState(null);

  const [vehicles, setVehicles] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [leads, setLeads] = useState([]);
  const [inventory, setInventory] = useState({ total: 0, available: 0, reserved: 0, sold: 0, byMake: {} });

  const [vehicleForm, setVehicleForm] = useState(emptyVehicleForm);
  const [supplierForm, setSupplierForm] = useState(emptySupplierForm);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    try {
      const [vehicleRes, supplierRes, leadRes, inventoryRes] = await Promise.all([
        api.get('/vehicles').catch(() => []),
        api.get('/vehicles/suppliers/all').catch(() => []),
        api.get('/leads').catch(() => []),
        api.get('/vehicles/inventory/summary').catch(() => ({})),
      ]);

      setVehicles(safeArray(vehicleRes));
      setSuppliers(safeArray(supplierRes));
      setLeads(safeArray(leadRes));
      setInventory(inventoryRes || { total: 0, available: 0, reserved: 0, sold: 0, byMake: {} });
    } finally {
      setLoading(false);
    }
  }

  async function submitSupplier(event) {
    event.preventDefault();
    try {
      await api.post('/vehicles/suppliers', supplierForm);
      toast.success('Supplier registered in portal');
      setSupplierForm(emptySupplierForm);
      setActiveModal(null);
      await loadData();
    } catch (error) {
      toast.error(error.message || 'Unable to register supplier.');
    }
  }

  async function submitVehicle(event) {
    event.preventDefault();
    try {
      await api.post('/vehicles', {
        ...vehicleForm,
        year: Number(vehicleForm.year),
        mileage: Number(vehicleForm.mileage),
        price: Number(vehicleForm.price),
      });
      toast.success('Vehicle added to inventory');
      setVehicleForm(emptyVehicleForm);
      setActiveModal(null);
      await loadData();
    } catch (error) {
      toast.error(error.message || 'Unable to create vehicle.');
    }
  }

  async function updateVehicleStatus(vehicle, status) {
    try {
      await api.put(`/vehicles/${vehicle.id}`, { status });
      toast.success(`Vehicle moved to ${status}`);
      await loadData();
    } catch (error) {
      toast.error(error.message || 'Unable to update inventory status.');
    }
  }

  async function deleteVehicle(vehicleId) {
    if (!window.confirm('Delete this vehicle from inventory?')) {
      return;
    }

    try {
      await api.delete(`/vehicles/${vehicleId}`);
      toast.success('Vehicle removed from inventory');
      await loadData();
    } catch (error) {
      toast.error(error.message || 'Unable to delete vehicle.');
    }
  }

  async function updateLeadStatus(leadId, status) {
    try {
      await api.put(`/leads/${leadId}`, { status });
      toast.success(`Lead marked as ${status}`);
      await loadData();
    } catch (error) {
      toast.error(error.message || 'Unable to update lead status.');
    }
  }

  const supplierMatchesByLeadId = useMemo(() => {
    const map = {};

    for (const lead of leads) {
      const interest = normalize(lead.vehicleInterest);
      const ranked = suppliers
        .map((supplier) => {
          const inventoryList = vehicles.filter((vehicle) => normalize(vehicle.supplierName || vehicle.supplier?.companyName) === normalize(supplier.companyName));
          const score = inventoryList.reduce((sum, vehicle) => {
            const make = normalize(vehicle.make);
            const model = normalize(vehicle.model);
            return sum + (interest.includes(make) ? 2 : 0) + (interest.includes(model) ? 3 : 0);
          }, 0);
          if (!score) return null;
          return {
            supplier,
            score,
          };
        })
        .filter(Boolean)
        .sort((left, right) => right.score - left.score)
        .slice(0, 3);

      map[lead.id] = ranked;
    }

    return map;
  }, [leads, suppliers, vehicles]);

  const matchedLeads = useMemo(() => leads.filter((lead) => (supplierMatchesByLeadId[lead.id] || []).length > 0).length, [leads, supplierMatchesByLeadId]);

  const vehicleColumns = [
    {
      key: 'vehicle',
      label: 'Vehicle',
      sortable: true,
      render: (_, vehicle) => (
        <div>
          <div className="list-row-title">{vehicle.make} {vehicle.model}</div>
          <div className="list-row-meta">{vehicle.year} • {vehicle.color || 'Color n/a'} • {vehicle.mileage || 0} km</div>
        </div>
      ),
    },
    { key: 'supplierName', label: 'Supplier', sortable: true, render: (value, vehicle) => value || vehicle.supplier?.companyName || 'Unassigned' },
    { key: 'condition', label: 'Condition', sortable: true, render: (value) => <StatusBadge value={value || 'new'} compact /> },
    { key: 'status', label: 'Status', sortable: true, render: (value) => <StatusBadge value={value || 'available'} compact /> },
    { key: 'price', label: 'Price', sortable: true, render: (value) => formatCurrency(value) },
    {
      key: 'actions',
      label: 'Actions',
      render: (_, vehicle) => (
        <div className="toolbar-cluster wrap">
          <button className="btn btn-sm btn-outline-primary" type="button" onClick={() => updateVehicleStatus(vehicle, 'available')}>Available</button>
          <button className="btn btn-sm btn-outline-warning" type="button" onClick={() => updateVehicleStatus(vehicle, 'reserved')}>Reserve</button>
          <button className="btn btn-sm btn-outline-success" type="button" onClick={() => updateVehicleStatus(vehicle, 'sold')}>Sold</button>
          <button className="btn btn-sm btn-outline-danger" type="button" onClick={() => deleteVehicle(vehicle.id)}>Delete</button>
        </div>
      ),
    },
  ];

  const supplierColumns = [
    { key: 'companyName', label: 'Supplier company', sortable: true },
    { key: 'contactPerson', label: 'Contact', sortable: true },
    { key: 'city', label: 'City', sortable: true },
    { key: 'email', label: 'Email' },
    { key: 'phone', label: 'Phone' },
    { key: 'status', label: 'Status', render: (value) => <StatusBadge value={value || 'pending'} compact /> },
  ];

  const leadColumns = [
    {
      key: 'lead',
      label: 'Lead',
      sortable: true,
      render: (_, lead) => (
        <div>
          <div className="list-row-title">{lead.name || `${lead.firstName || ''} ${lead.lastName || ''}`.trim() || 'Unnamed lead'}</div>
          <div className="list-row-meta">{lead.email || 'No email'} • {lead.phone || 'No phone'}</div>
        </div>
      ),
    },
    { key: 'source', label: 'Source', sortable: true, render: (value) => value || 'unknown' },
    { key: 'vehicleInterest', label: 'Vehicle interest', sortable: true, render: (value) => value || 'General inquiry' },
    {
      key: 'match',
      label: 'Best supplier match',
      render: (_, lead) => {
        const matches = supplierMatchesByLeadId[lead.id] || [];
        return matches.length ? matches.map((entry) => entry.supplier.companyName).join(', ') : 'Open pool';
      },
    },
    { key: 'status', label: 'Status', render: (value) => <StatusBadge value={value || 'new'} compact /> },
    {
      key: 'actions',
      label: 'Actions',
      render: (_, lead) => (
        <div className="toolbar-cluster wrap">
          <button className="btn btn-secondary btn-sm" type="button" onClick={() => updateLeadStatus(lead.id, 'contacted')}>Contacted</button>
          <button className="btn btn-secondary btn-sm" type="button" onClick={() => updateLeadStatus(lead.id, 'qualified')}>Qualified</button>
          <button className="btn btn-secondary btn-sm" type="button" onClick={() => updateLeadStatus(lead.id, 'converted')}>Converted</button>
        </div>
      ),
    },
  ];

  const topMakes = Object.entries(inventory.byMake || {})
    .map(([make, count]) => ({ make, count }))
    .sort((left, right) => right.count - left.count)
    .slice(0, 5);

  if (loading) {
    return <div className="page-shell"><div className="empty-state"><h3>Loading supplier portal...</h3></div></div>;
  }

  return (
    <div className="page-shell">
      <div className="page-header row-between">
        <div>
          <h1>Vehicle supplier portal</h1>
          <p>Register suppliers, list vehicles, manage inventory status, and route customer demand to matching partners.</p>
        </div>
        <div className="toolbar-cluster wrap">
          <Button variant="outlined" size="small" startIcon={<Building2 size={16} />} onClick={() => setActiveModal('supplier')}>Register supplier</Button>
          <Button variant="contained" size="small" startIcon={<PlusCircle size={16} />} onClick={() => setActiveModal('vehicle')}>Add vehicle</Button>
        </div>
      </div>

      <div className="stats-grid">
        <MetricCard icon={Truck} label="Vehicles listed" value={inventory.total || vehicles.length} detail="Total inventory units" tone="accent" />
        <MetricCard icon={CarFront} label="Available" value={inventory.available || 0} detail={`${inventory.reserved || 0} reserved, ${inventory.sold || 0} sold`} tone="success" />
        <MetricCard icon={Building2} label="Suppliers" value={suppliers.length} detail="Registered partner dealers" tone="info" />
        <MetricCard icon={Users2} label="Matched leads" value={matchedLeads} detail={`${leads.length} total lead records`} tone="warning" />
      </div>

      <div className="tabs">
        <button className={`tab ${tab === 'inventory' ? 'active' : ''}`} type="button" onClick={() => setTab('inventory')}>Inventory</button>
        <button className={`tab ${tab === 'suppliers' ? 'active' : ''}`} type="button" onClick={() => setTab('suppliers')}>Suppliers</button>
        <button className={`tab ${tab === 'leads' ? 'active' : ''}`} type="button" onClick={() => setTab('leads')}>Lead routing</button>
      </div>

      <DataTable
        title={tab === 'inventory' ? 'Vehicle inventory management' : tab === 'suppliers' ? 'Supplier registry' : 'Customer lead routing'}
        subtitle="Bootstrap table shell with filters, sorting, and direct CRUD actions."
        columns={tab === 'inventory' ? vehicleColumns : tab === 'suppliers' ? supplierColumns : leadColumns}
        data={tab === 'inventory' ? vehicles : tab === 'suppliers' ? suppliers : leads}
        filters={
          tab === 'inventory'
            ? [
                {
                  key: 'status',
                  label: 'Status',
                  options: [
                    { label: 'Available', value: 'available' },
                    { label: 'Reserved', value: 'reserved' },
                    { label: 'Sold', value: 'sold' },
                  ],
                },
                {
                  key: 'condition',
                  label: 'Condition',
                  options: [
                    { label: 'New', value: 'new' },
                    { label: 'Used', value: 'used' },
                    { label: 'Certified', value: 'certified' },
                  ],
                },
              ]
            : tab === 'suppliers'
              ? [{ key: 'status', label: 'Status', options: [{ label: 'Active', value: 'active' }, { label: 'Pending', value: 'pending' }] }]
              : [{ key: 'status', label: 'Lead status', options: [{ label: 'New', value: 'new' }, { label: 'Contacted', value: 'contacted' }, { label: 'Qualified', value: 'qualified' }, { label: 'Converted', value: 'converted' }] }]
        }
        searchPlaceholder={tab === 'inventory' ? 'Search make, model, supplier, color, status' : tab === 'suppliers' ? 'Search company, contact, city, or email' : 'Search lead name, source, interest, or status'}
      />

      <div className="section-grid two-up">
        <div className="card">
          <div className="card-header compact">
            <div>
              <div className="card-title">Inventory composition by make</div>
              <div className="card-subtitle">Top brands currently available in supplier stock.</div>
            </div>
          </div>
          <div className="list-stack">
            {topMakes.map((item) => (
              <div key={item.make} className="list-row">
                <div className="list-row-head">
                  <div className="list-row-title">{item.make}</div>
                  <StatusBadge value="available" compact />
                </div>
                <div className="list-row-meta">{item.count} vehicles listed</div>
              </div>
            ))}
            {!topMakes.length ? <div className="empty-state compact"><h3>No inventory by make</h3><p>Add vehicles to populate the composition view.</p></div> : null}
          </div>
        </div>

        <div className="card">
          <div className="card-header compact">
            <div>
              <div className="card-title">Recent supplier leads</div>
              <div className="card-subtitle">Leads mapped to supplier inventory with strongest confidence.</div>
            </div>
          </div>
          <div className="list-stack">
            {leads.slice(0, 6).map((lead) => {
              const matches = supplierMatchesByLeadId[lead.id] || [];
              return (
                <div key={lead.id} className="list-row">
                  <div className="list-row-head">
                    <div>
                      <div className="list-row-title">{lead.name || `${lead.firstName || ''} ${lead.lastName || ''}`.trim() || 'Unnamed lead'}</div>
                      <div className="list-row-meta">{lead.vehicleInterest || 'No preference provided'}</div>
                    </div>
                    <StatusBadge value={lead.status || 'new'} compact />
                  </div>
                  <div className="list-row-meta">{matches.length ? `Matched: ${matches.map((item) => item.supplier.companyName).join(', ')}` : 'No supplier match yet'} • {formatDateTime(lead.createdAt)}</div>
                </div>
              );
            })}
            {!leads.length ? <div className="empty-state compact"><h3>No leads in queue</h3><p>Incoming customer leads will appear here for supplier routing.</p></div> : null}
          </div>
        </div>
      </div>

      <Modal open={activeModal === 'supplier'} onClose={() => setActiveModal(null)} title="Register supplier" subtitle="Onboard a vehicle provider into the marketplace." size="large">
        <form className="form-grid" onSubmit={submitSupplier}>
          <div className="form-group"><label>Company name</label><input value={supplierForm.companyName} onChange={(event) => setSupplierForm({ ...supplierForm, companyName: event.target.value })} required /></div>
          <div className="form-group"><label>Contact person</label><input value={supplierForm.contactPerson} onChange={(event) => setSupplierForm({ ...supplierForm, contactPerson: event.target.value })} required /></div>
          <div className="form-group"><label>Email</label><input type="email" value={supplierForm.email} onChange={(event) => setSupplierForm({ ...supplierForm, email: event.target.value })} required /></div>
          <div className="form-group"><label>Phone</label><input value={supplierForm.phone} onChange={(event) => setSupplierForm({ ...supplierForm, phone: event.target.value })} required /></div>
          <div className="form-group"><label>City</label><input value={supplierForm.city} onChange={(event) => setSupplierForm({ ...supplierForm, city: event.target.value })} required /></div>
          <div className="form-group"><label>License number</label><input value={supplierForm.licenseNumber} onChange={(event) => setSupplierForm({ ...supplierForm, licenseNumber: event.target.value })} required /></div>
          <div className="form-group" style={{ gridColumn: '1 / -1' }}><label>Address</label><textarea value={supplierForm.address} onChange={(event) => setSupplierForm({ ...supplierForm, address: event.target.value })} required /></div>
          <div className="modal-actions" style={{ gridColumn: '1 / -1' }}>
            <button className="btn btn-secondary" type="button" onClick={() => setActiveModal(null)}>Cancel</button>
            <button className="btn btn-primary" type="submit"><Building2 size={15} /> Register supplier</button>
          </div>
        </form>
      </Modal>

      <Modal open={activeModal === 'vehicle'} onClose={() => setActiveModal(null)} title="Register vehicle" subtitle="Add supply inventory for customer matching and financing workflows." size="large">
        <form className="form-grid" onSubmit={submitVehicle}>
          <div className="form-group"><label>Make</label><input value={vehicleForm.make} onChange={(event) => setVehicleForm({ ...vehicleForm, make: event.target.value })} required /></div>
          <div className="form-group"><label>Model</label><input value={vehicleForm.model} onChange={(event) => setVehicleForm({ ...vehicleForm, model: event.target.value })} required /></div>
          <div className="form-group"><label>Year</label><input type="number" value={vehicleForm.year} onChange={(event) => setVehicleForm({ ...vehicleForm, year: event.target.value })} required /></div>
          <div className="form-group"><label>Price</label><input type="number" value={vehicleForm.price} onChange={(event) => setVehicleForm({ ...vehicleForm, price: event.target.value })} required /></div>
          <div className="form-group"><label>Condition</label><select value={vehicleForm.condition} onChange={(event) => setVehicleForm({ ...vehicleForm, condition: event.target.value })}><option value="new">New</option><option value="used">Used</option><option value="certified">Certified</option></select></div>
          <div className="form-group"><label>Status</label><select value={vehicleForm.status} onChange={(event) => setVehicleForm({ ...vehicleForm, status: event.target.value })}><option value="available">Available</option><option value="reserved">Reserved</option><option value="sold">Sold</option></select></div>
          <div className="form-group"><label>Supplier</label>
            <select
              value={vehicleForm.supplierId}
              onChange={(event) => {
                const supplier = suppliers.find((row) => row.id === event.target.value);
                setVehicleForm({
                  ...vehicleForm,
                  supplierId: event.target.value,
                  supplierName: supplier?.companyName || '',
                });
              }}
            >
              <option value="">No supplier assigned</option>
              {suppliers.map((supplier) => <option key={supplier.id} value={supplier.id}>{supplier.companyName}</option>)}
            </select>
          </div>
          <div className="form-group"><label>Transmission</label><input value={vehicleForm.transmission} onChange={(event) => setVehicleForm({ ...vehicleForm, transmission: event.target.value })} /></div>
          <div className="form-group"><label>Fuel type</label><input value={vehicleForm.fuelType} onChange={(event) => setVehicleForm({ ...vehicleForm, fuelType: event.target.value })} /></div>
          <div className="form-group"><label>Mileage</label><input type="number" value={vehicleForm.mileage} onChange={(event) => setVehicleForm({ ...vehicleForm, mileage: event.target.value })} /></div>
          <div className="form-group"><label>Color</label><input value={vehicleForm.color} onChange={(event) => setVehicleForm({ ...vehicleForm, color: event.target.value })} /></div>
          <div className="form-group" style={{ gridColumn: '1 / -1' }}><label>Description</label><textarea value={vehicleForm.description} onChange={(event) => setVehicleForm({ ...vehicleForm, description: event.target.value })} /></div>
          <div className="modal-actions" style={{ gridColumn: '1 / -1' }}>
            <button className="btn btn-secondary" type="button" onClick={() => setActiveModal(null)}>Cancel</button>
            <button className="btn btn-primary" type="submit"><CarFront size={15} /> Add vehicle</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
