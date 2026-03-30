import React, { useEffect, useMemo, useState } from 'react';
import { Building2, CarFront, ClipboardList, PackagePlus, Trash2, UsersRound } from 'lucide-react';
import api from '../api';
import DataTable from '../components/DataTable';
import MetricCard from '../components/MetricCard';
import Modal from '../components/Modal';
import Skeleton from '../components/Skeleton';
import StatusBadge from '../components/StatusBadge';
import { useToast } from '../components/Toast';
import { formatCurrency, safeArray } from '../utils/format';

const emptyVehicleForm = {
  make: '',
  model: '',
  year: new Date().getFullYear(),
  color: 'White',
  price: '',
  condition: 'new',
  fuelType: 'Petrol',
  transmission: 'Automatic',
  mileage: 0,
  status: 'available',
  supplierName: '',
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

function normalizeValue(value) {
  return String(value || '').trim().toLowerCase();
}

export default function Vehicles() {
  const toast = useToast();
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('inventory');
  const [vehicles, setVehicles] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [leads, setLeads] = useState([]);
  const [inventory, setInventory] = useState({ total: 0, available: 0, reserved: 0, sold: 0, byMake: {} });
  const [vehicleForm, setVehicleForm] = useState(emptyVehicleForm);
  const [supplierForm, setSupplierForm] = useState(emptySupplierForm);
  const [activeModal, setActiveModal] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    try {
      const [vehicleResponse, supplierResponse, inventoryResponse, leadResponse] = await Promise.all([
        api.get('/vehicles').catch(() => []),
        api.get('/vehicles/suppliers/all').catch(() => []),
        api.get('/vehicles/inventory/summary').catch(() => ({})),
        api.get('/leads').catch(() => []),
      ]);

      setVehicles(safeArray(vehicleResponse));
      setSuppliers(safeArray(supplierResponse));
      setLeads(safeArray(leadResponse));
      setInventory(inventoryResponse || { total: 0, available: 0, reserved: 0, sold: 0, byMake: {} });
    } finally {
      setLoading(false);
    }
  }

  async function handleCreateVehicle(event) {
    event.preventDefault();
    try {
      await api.post('/vehicles', {
        ...vehicleForm,
        year: Number(vehicleForm.year),
        price: Number(vehicleForm.price),
        mileage: Number(vehicleForm.mileage),
      });
      toast.success('Vehicle added to supplier inventory');
      setVehicleForm(emptyVehicleForm);
      setActiveModal(null);
      await loadData();
    } catch (error) {
      toast.error(error.message || 'Failed to create vehicle');
    }
  }

  async function handleCreateSupplier(event) {
    event.preventDefault();
    try {
      await api.post('/vehicles/suppliers', supplierForm);
      toast.success('Supplier registered successfully');
      setSupplierForm(emptySupplierForm);
      setActiveModal(null);
      await loadData();
    } catch (error) {
      toast.error(error.message || 'Failed to register supplier');
    }
  }

  async function handleDeleteVehicle(id) {
    if (!confirm('Delete this vehicle from inventory?')) return;
    try {
      await api.delete(`/vehicles/${id}`);
      toast.success('Vehicle removed');
      await loadData();
    } catch (error) {
      toast.error(error.message || 'Failed to delete vehicle');
    }
  }

  async function updateLeadStatus(lead, status) {
    try {
      await api.put(`/leads/${lead.id}`, { status });
      toast.success(`Lead moved to ${status}`);
      await loadData();
    } catch (error) {
      toast.error(error.message || 'Failed to update supplier lead');
    }
  }

  const leadMatches = useMemo(() => (
    leads.map((lead) => {
      const interest = normalizeValue(lead.vehicleInterest);

      const matches = suppliers
        .map((supplier) => {
          const supplierInventory = vehicles.filter((vehicle) => normalizeValue(vehicle.supplierName) === normalizeValue(supplier.companyName));
          const score = supplierInventory.reduce((total, vehicle) => {
            const make = normalizeValue(vehicle.make);
            const model = normalizeValue(vehicle.model);
            const description = normalizeValue(`${vehicle.make} ${vehicle.model} ${vehicle.year}`);
            return total
              + (interest.includes(make) ? 2 : 0)
              + (interest.includes(model) ? 3 : 0)
              + (interest.includes(description) ? 4 : 0);
          }, 0);

          if (!score) return null;

          return {
            supplier,
            score,
            sampleVehicles: supplierInventory.slice(0, 2).map((vehicle) => `${vehicle.make} ${vehicle.model}`).join(', '),
          };
        })
        .filter(Boolean)
        .sort((left, right) => right.score - left.score);

      return { lead, matches };
    })
  ), [leads, suppliers, vehicles]);

  const leadMatchMap = useMemo(
    () => Object.fromEntries(leadMatches.map((entry) => [entry.lead.id, entry.matches])),
    [leadMatches],
  );

  const matchedLeadCount = leadMatches.filter((entry) => entry.matches.length).length;

  const vehicleColumns = [
    {
      key: 'vehicle',
      label: 'Vehicle',
      sortable: true,
      render: (_, vehicle) => (
        <div>
          <div className="list-row-title">{vehicle.make} {vehicle.model}</div>
          <div className="list-row-meta">{vehicle.year} · {vehicle.fuelType || 'Fuel not set'} · {vehicle.transmission || 'Transmission not set'}</div>
        </div>
      ),
    },
    { key: 'supplierName', label: 'Supplier', sortable: true, render: (value) => value || 'Unassigned' },
    { key: 'condition', label: 'Condition', render: (value) => <StatusBadge value={value || 'new'} compact /> },
    { key: 'status', label: 'Status', render: (value) => <StatusBadge value={value || 'available'} compact /> },
    { key: 'price', label: 'Price', sortable: true, render: (value) => formatCurrency(value) },
    {
      key: 'actions',
      label: 'Actions',
      render: (_, vehicle) => (
        <button className="btn btn-danger btn-sm" type="button" onClick={() => handleDeleteVehicle(vehicle.id)}>
          <Trash2 size={14} /> Delete
        </button>
      ),
    },
  ];

  const supplierColumns = [
    { key: 'companyName', label: 'Company', sortable: true },
    { key: 'contactPerson', label: 'Contact', sortable: true },
    { key: 'city', label: 'City', sortable: true },
    { key: 'email', label: 'Email' },
    { key: 'phone', label: 'Phone' },
    { key: 'status', label: 'Status', render: (value) => <StatusBadge value={value || 'active'} compact /> },
  ];

  const leadColumns = [
    {
      key: 'lead',
      label: 'Lead',
      sortable: true,
      render: (_, lead) => (
        <div>
          <div className="list-row-title">{lead.name}</div>
          <div className="list-row-meta">{lead.email} · {lead.phone}</div>
        </div>
      ),
    },
    { key: 'vehicleInterest', label: 'Vehicle interest', sortable: true, render: (value) => value || 'General inquiry' },
    {
      key: 'matchedSupplier',
      label: 'Matched supplier',
      render: (_, lead) => {
        const matches = leadMatchMap[lead.id] || [];
        if (!matches.length) return 'Open marketplace pool';
        const topMatch = matches[0];
        return matches.length > 1 ? `${topMatch.supplier.companyName} +${matches.length - 1} more` : topMatch.supplier.companyName;
      },
    },
    { key: 'status', label: 'Status', render: (value) => <StatusBadge value={value || 'new'} compact /> },
    {
      key: 'actions',
      label: 'Actions',
      render: (_, lead) => (
        <div className="toolbar-cluster">
          <button className="btn btn-secondary btn-sm" type="button" onClick={() => updateLeadStatus(lead, 'contacted')}>Contacted</button>
          <button className="btn btn-secondary btn-sm" type="button" onClick={() => updateLeadStatus(lead, 'qualified')}>Qualified</button>
        </div>
      ),
    },
  ];

  const supplierHighlights = useMemo(() => suppliers.slice(0, 3).map((supplier) => ({
    ...supplier,
    inventoryCount: vehicles.filter((vehicle) => normalizeValue(vehicle.supplierName) === normalizeValue(supplier.companyName)).length,
  })), [suppliers, vehicles]);

  const supplierLeadSummary = useMemo(() => (
    suppliers
      .map((supplier) => {
        const relatedLeads = leadMatches.filter((entry) =>
          entry.matches.some((match) => normalizeValue(match.supplier.companyName) === normalizeValue(supplier.companyName)));

        return {
          ...supplier,
          leadCount: relatedLeads.length,
          leadHighlights: relatedLeads.slice(0, 3).map((entry) => entry.lead.vehicleInterest || entry.lead.name).join(', '),
        };
      })
      .sort((left, right) => right.leadCount - left.leadCount)
      .slice(0, 5)
  ), [suppliers, leadMatches]);

  const topMakes = Object.entries(inventory.byMake || {}).sort((left, right) => right[1] - left[1]).slice(0, 4);

  if (loading) {
    return (
      <div className="page-shell">
        <div className="page-header"><Skeleton type="title" style={{ width: '32%' }} /></div>
        <div className="stats-grid"><Skeleton type="stat" count={4} /></div>
        <div className="section-grid"><Skeleton type="card" style={{ height: '520px' }} /><Skeleton type="card" style={{ height: '520px' }} /></div>
      </div>
    );
  }

  return (
    <div className="page-shell">
      <div className="page-header">
        <div>
          <h1>Vehicle supplier portal</h1>
          <p>Register suppliers, maintain inventory quality, route matched buyer demand, and keep the marketplace stocked with finance-ready vehicles.</p>
        </div>
        <div className="pill-list">
          <span className="pill">Supplier onboarding</span>
          <span className="pill">Inventory management</span>
          <span className="pill">Lead routing</span>
        </div>
      </div>

      <div className="stats-grid">
        <MetricCard icon={CarFront} label="Vehicles listed" value={inventory.total || vehicles.length} detail="Across all active suppliers" tone="accent" />
        <MetricCard icon={ClipboardList} label="Available stock" value={inventory.available || 0} detail="Units ready for customer matching" tone="success" />
        <MetricCard icon={UsersRound} label="Supplier leads" value={matchedLeadCount} detail="Customer inquiries matched to supplier inventory" tone="warning" />
        <MetricCard icon={Building2} label="Suppliers" value={suppliers.length} detail="Partner businesses registered in the portal" tone="info" />
      </div>

      <div className="tabs">
        <button className={`tab ${tab === 'inventory' ? 'active' : ''}`} type="button" onClick={() => setTab('inventory')}>Inventory command</button>
        <button className={`tab ${tab === 'suppliers' ? 'active' : ''}`} type="button" onClick={() => setTab('suppliers')}>Supplier network</button>
        <button className={`tab ${tab === 'leads' ? 'active' : ''}`} type="button" onClick={() => setTab('leads')}>Lead desk</button>
      </div>

      <DataTable
        title={tab === 'inventory' ? 'Vehicle inventory' : tab === 'suppliers' ? 'Supplier registry' : 'Supplier lead routing'}
        subtitle="Searchable operational tables for ongoing marketplace supply management."
        actions={(
          <div className="toolbar-cluster">
            <button className="btn btn-secondary" type="button" onClick={() => setActiveModal('supplier')}>
              <Building2 size={16} /> Register supplier
            </button>
            <button className="btn btn-primary" type="button" onClick={() => setActiveModal('vehicle')}>
              <PackagePlus size={16} /> Add vehicle
            </button>
          </div>
        )}
        columns={tab === 'inventory' ? vehicleColumns : tab === 'suppliers' ? supplierColumns : leadColumns}
        data={tab === 'inventory' ? vehicles : tab === 'suppliers' ? suppliers : leads}
        searchPlaceholder={tab === 'inventory' ? 'Search makes, models, suppliers, or statuses' : tab === 'suppliers' ? 'Search company, city, contact, or status' : 'Search leads by name, interest, source, or status'}
      />

      <div className="section-grid">
        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title">Inventory composition</div>
              <div className="card-subtitle">Top makes currently available in the catalog.</div>
            </div>
          </div>
          <div className="list-stack">
            {topMakes.map(([make, count]) => (
              <div key={make} className="list-row">
                <div className="list-row-head">
                  <div className="list-row-title">{make}</div>
                  <StatusBadge value="available" compact />
                </div>
                <div className="list-row-meta">{count} vehicles currently listed</div>
              </div>
            ))}
            {!topMakes.length ? <div className="empty-state"><h3>No inventory yet</h3><p>Add vehicles to establish marketplace supply.</p></div> : null}
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title">{tab === 'leads' ? 'Supplier lead inbox' : 'Supplier highlights'}</div>
              <div className="card-subtitle">{tab === 'leads' ? 'Customer demand that already has promising supplier matches.' : 'Quick read on the most visible partners in the portal.'}</div>
            </div>
          </div>
          <div className="list-stack">
            {(tab === 'leads' ? supplierLeadSummary : supplierHighlights).map((supplier) => (
              <div key={supplier.id} className="list-row">
                <div className="list-row-head">
                  <div>
                    <div className="list-row-title">{supplier.companyName}</div>
                    <div className="list-row-meta">{supplier.contactPerson} · {supplier.city}</div>
                  </div>
                  <StatusBadge value={supplier.status || (supplier.leadCount ? 'active' : 'pending')} compact />
                </div>
                <div className="list-row-meta">
                  {tab === 'leads'
                    ? supplier.leadCount
                      ? `${supplier.leadCount} matched lead(s) ready for follow-up${supplier.leadHighlights ? ` · ${supplier.leadHighlights}` : ''}`
                      : 'No matched leads in the current queue.'
                    : `Inventory mapped: ${supplier.inventoryCount} vehicle(s)`}
                </div>
              </div>
            ))}
            {!(tab === 'leads' ? supplierLeadSummary : supplierHighlights).length ? (
              <div className="empty-state"><h3>No suppliers yet</h3><p>Onboard suppliers to activate the marketplace supply side.</p></div>
            ) : null}
          </div>
        </div>
      </div>

      <Modal
        open={activeModal === 'vehicle'}
        onClose={() => setActiveModal(null)}
        title="Register a new vehicle"
        subtitle="Add inventory in a controlled flow instead of exposing the full intake form on the page."
        size="large"
      >
        <form onSubmit={handleCreateVehicle} className="list-stack">
          <div className="form-grid">
            <div className="form-group"><label>Make</label><input value={vehicleForm.make} onChange={(event) => setVehicleForm({ ...vehicleForm, make: event.target.value })} required /></div>
            <div className="form-group"><label>Model</label><input value={vehicleForm.model} onChange={(event) => setVehicleForm({ ...vehicleForm, model: event.target.value })} required /></div>
            <div className="form-group"><label>Year</label><input type="number" value={vehicleForm.year} onChange={(event) => setVehicleForm({ ...vehicleForm, year: event.target.value })} required /></div>
            <div className="form-group"><label>Price</label><input type="number" value={vehicleForm.price} onChange={(event) => setVehicleForm({ ...vehicleForm, price: event.target.value })} required /></div>
            <div className="form-group"><label>Condition</label><select value={vehicleForm.condition} onChange={(event) => setVehicleForm({ ...vehicleForm, condition: event.target.value })}><option value="new">New</option><option value="used">Used</option><option value="certified">Certified</option></select></div>
            <div className="form-group"><label>Status</label><select value={vehicleForm.status} onChange={(event) => setVehicleForm({ ...vehicleForm, status: event.target.value })}><option value="available">Available</option><option value="reserved">Reserved</option><option value="sold">Sold</option></select></div>
            <div className="form-group"><label>Fuel type</label><input value={vehicleForm.fuelType} onChange={(event) => setVehicleForm({ ...vehicleForm, fuelType: event.target.value })} /></div>
            <div className="form-group"><label>Transmission</label><input value={vehicleForm.transmission} onChange={(event) => setVehicleForm({ ...vehicleForm, transmission: event.target.value })} /></div>
            <div className="form-group"><label>Mileage</label><input type="number" value={vehicleForm.mileage} onChange={(event) => setVehicleForm({ ...vehicleForm, mileage: event.target.value })} /></div>
            <div className="form-group"><label>Supplier name</label><input value={vehicleForm.supplierName} onChange={(event) => setVehicleForm({ ...vehicleForm, supplierName: event.target.value })} placeholder="Match the supplier company name" /></div>
            <div className="form-group"><label>Color</label><input value={vehicleForm.color} onChange={(event) => setVehicleForm({ ...vehicleForm, color: event.target.value })} /></div>
            <div className="form-group"><label>Description</label><input value={vehicleForm.description} onChange={(event) => setVehicleForm({ ...vehicleForm, description: event.target.value })} /></div>
          </div>
          <div className="modal-actions">
            <button className="btn btn-secondary" type="button" onClick={() => setActiveModal(null)}>Cancel</button>
            <button className="btn btn-primary" type="submit"><PackagePlus size={16} /> Add vehicle to inventory</button>
          </div>
        </form>
      </Modal>

      <Modal
        open={activeModal === 'supplier'}
        onClose={() => setActiveModal(null)}
        title="Onboard a new supplier"
        subtitle="Keep supplier intake tucked into a focused modal instead of leaving the registry form open at all times."
        size="large"
      >
        <form onSubmit={handleCreateSupplier} className="list-stack">
          <div className="form-grid">
            <div className="form-group"><label>Company name</label><input value={supplierForm.companyName} onChange={(event) => setSupplierForm({ ...supplierForm, companyName: event.target.value })} required /></div>
            <div className="form-group"><label>Contact person</label><input value={supplierForm.contactPerson} onChange={(event) => setSupplierForm({ ...supplierForm, contactPerson: event.target.value })} required /></div>
            <div className="form-group"><label>Email</label><input type="email" value={supplierForm.email} onChange={(event) => setSupplierForm({ ...supplierForm, email: event.target.value })} required /></div>
            <div className="form-group"><label>Phone</label><input value={supplierForm.phone} onChange={(event) => setSupplierForm({ ...supplierForm, phone: event.target.value })} required /></div>
            <div className="form-group"><label>City</label><input value={supplierForm.city} onChange={(event) => setSupplierForm({ ...supplierForm, city: event.target.value })} required /></div>
            <div className="form-group"><label>License number</label><input value={supplierForm.licenseNumber} onChange={(event) => setSupplierForm({ ...supplierForm, licenseNumber: event.target.value })} required /></div>
            <div className="form-group" style={{ gridColumn: '1 / -1' }}><label>Address</label><input value={supplierForm.address} onChange={(event) => setSupplierForm({ ...supplierForm, address: event.target.value })} required /></div>
          </div>
          <div className="modal-actions">
            <button className="btn btn-secondary" type="button" onClick={() => setActiveModal(null)}>Cancel</button>
            <button className="btn btn-primary" type="submit"><Building2 size={16} /> Register supplier</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
