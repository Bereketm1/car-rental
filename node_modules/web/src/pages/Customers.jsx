import React, { useEffect, useMemo, useState } from 'react';
import { FileStack, FolderKanban, Trash2, Upload, UserPlus, UsersRound, WalletCards } from 'lucide-react';
import api, { API_ORIGIN } from '../api';
import DataTable from '../components/DataTable';
import MetricCard from '../components/MetricCard';
import Modal from '../components/Modal';
import Skeleton from '../components/Skeleton';
import StatusBadge from '../components/StatusBadge';
import { useToast } from '../components/Toast';
import { formatCurrency, formatDateTime, getInitials, safeArray } from '../utils/format';

const emptyCustomerForm = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  city: '',
  address: '',
  vehicleId: '',
  interestNotes: '',
  requestedAmount: '',
  termMonths: '48',
  monthlyIncome: '',
  employmentStatus: 'employed',
};

export default function Customers() {
  const toast = useToast();
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('customers');
  const [customers, setCustomers] = useState([]);
  const [loanApps, setLoanApps] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [selectedCustomerId, setSelectedCustomerId] = useState(null);
  const [showDocsFor, setShowDocsFor] = useState(null);
  const [customerDocs, setCustomerDocs] = useState([]);
  const [uploadingDoc, setUploadingDoc] = useState(false);
  const [form, setForm] = useState(emptyCustomerForm);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    try {
      const [customerResponse, loanResponse, vehicleResponse] = await Promise.all([
        api.get('/customers').catch(() => []),
        api.get('/customers/loan-applications/all').catch(() => []),
        api.get('/vehicles').catch(() => []),
      ]);

      const customerList = safeArray(customerResponse);
      setCustomers(customerList);
      setLoanApps(safeArray(loanResponse));
      setVehicles(safeArray(vehicleResponse));
      if (!selectedCustomerId && customerList.length) {
        setSelectedCustomerId(customerList[0].id);
      }
    } finally {
      setLoading(false);
    }
  }

  async function handleCreate(event) {
    event.preventDefault();
    try {
      const customer = await api.post('/customers', {
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        phone: form.phone,
        city: form.city,
        address: form.address,
      });

      if (form.vehicleId) {
        await api.post(`/customers/${customer.id}/interests`, {
          vehicleId: form.vehicleId,
          notes: form.interestNotes,
        });
      }

      if (form.vehicleId && form.requestedAmount) {
        await api.post('/customers/loan-applications', {
          customerId: customer.id,
          vehicleId: form.vehicleId,
          requestedAmount: Number(form.requestedAmount),
          termMonths: Number(form.termMonths),
          monthlyIncome: Number(form.monthlyIncome || 0),
          employmentStatus: form.employmentStatus,
        });
      }

      toast.success('Customer workflow created. Registration, interest, and financing data have been saved.');
      setForm(emptyCustomerForm);
      setIsCreateModalOpen(false);
      await loadData();
      setSelectedCustomerId(customer.id);
    } catch (error) {
      toast.error(error.message || 'Failed to create customer workflow');
    }
  }

  async function handleDelete(id) {
    if (!confirm('Delete this customer record?')) return;
    try {
      await api.delete(`/customers/${id}`);
      toast.success('Customer deleted');
      if (selectedCustomerId === id) setSelectedCustomerId(null);
      await loadData();
    } catch (error) {
      toast.error(error.message || 'Failed to delete customer');
    }
  }

  async function openDocs(customer) {
    setShowDocsFor(customer);
    try {
      const documents = await api.get(`/customers/${customer.id}/documents`);
      setCustomerDocs(safeArray(documents));
    } catch (error) {
      setCustomerDocs([]);
      toast.error(error.message || 'Failed to load documents');
    }
  }

  async function handleUploadDoc(event) {
    event.preventDefault();
    const file = event.target.file.files[0];
    const docName = event.target.docName.value;
    if (!file || !docName || !showDocsFor) return;

    setUploadingDoc(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const uploaded = await api.upload('/documents/upload', formData);

      await api.post(`/customers/${showDocsFor.id}/documents`, {
        name: docName,
        url: uploaded.url,
        fileName: uploaded.filename,
        size: uploaded.size,
        type: uploaded.mimeType,
      });

      toast.success('Document uploaded');
      event.target.reset();
      const documents = await api.get(`/customers/${showDocsFor.id}/documents`);
      setCustomerDocs(safeArray(documents));
    } catch (error) {
      toast.error(error.message || 'Failed to upload document');
    } finally {
      setUploadingDoc(false);
    }
  }

  const vehicleMap = useMemo(() => Object.fromEntries(vehicles.map((vehicle) => [vehicle.id, vehicle])), [vehicles]);
  const selectedCustomer = customers.find((customer) => customer.id === selectedCustomerId) || customers[0] || null;
  const customerApplications = loanApps.filter((application) => application.customerId === selectedCustomer?.id);

  const customerColumns = [
    {
      key: 'customer',
      label: 'Customer',
      sortable: true,
      render: (_, customer) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div className="header-avatar" style={{ width: '38px', height: '38px', fontSize: '12px' }}>
            {getInitials(`${customer.firstName} ${customer.lastName}`)}
          </div>
          <div>
            <div className="list-row-title">{customer.firstName} {customer.lastName}</div>
            <div className="list-row-meta">{customer.email}</div>
          </div>
        </div>
      ),
    },
    { key: 'phone', label: 'Phone', sortable: true },
    { key: 'city', label: 'City', sortable: true },
    {
      key: 'status',
      label: 'Status',
      render: (value) => <StatusBadge value={value || 'active'} compact />,
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (_, customer) => (
        <div className="toolbar-cluster">
          <button className="btn btn-ghost btn-sm" type="button" onClick={() => setSelectedCustomerId(customer.id)}>
            Focus
          </button>
          <button className="btn btn-ghost btn-sm" type="button" onClick={() => openDocs(customer)}>
            Documents
          </button>
          <button className="btn btn-danger btn-sm" type="button" onClick={() => handleDelete(customer.id)}>
            <Trash2 size={14} /> Delete
          </button>
        </div>
      ),
    },
  ];

  const applicationColumns = [
    {
      key: 'customerId',
      label: 'Applicant',
      render: (value, application) => {
        const customer = application.customer || customers.find((item) => item.id === value);
        return customer ? `${customer.firstName} ${customer.lastName}` : 'Customer record';
      },
    },
    {
      key: 'vehicleId',
      label: 'Vehicle',
      render: (value) => {
        const vehicle = vehicleMap[value];
        return vehicle ? `${vehicle.make} ${vehicle.model} ${vehicle.year}` : 'Vehicle record';
      },
    },
    {
      key: 'requestedAmount',
      label: 'Amount',
      sortable: true,
      render: (value) => formatCurrency(value),
    },
    { key: 'termMonths', label: 'Term', render: (value) => `${value} months` },
    { key: 'employmentStatus', label: 'Employment' },
    { key: 'status', label: 'Status', render: (value) => <StatusBadge value={value || 'submitted'} compact /> },
  ];

  if (loading) {
    return (
      <div className="page-shell">
        <div className="page-header"><Skeleton type="title" style={{ width: '34%' }} /></div>
        <div className="stats-grid"><Skeleton type="stat" count={4} /></div>
        <div className="section-grid"><Skeleton type="card" style={{ height: '520px' }} /><Skeleton type="card" style={{ height: '520px' }} /></div>
      </div>
    );
  }

  return (
    <div className="page-shell">
      <div className="page-header">
        <div>
          <h1>Customer management system</h1>
          <p>Register customers, capture vehicle intent, submit financing requests, upload documents, and track application progress.</p>
        </div>
        <div className="pill-list">
          <span className="pill">CRM</span>
          <span className="pill">Loan onboarding</span>
          <span className="pill">Document vault</span>
        </div>
      </div>

      <div className="stats-grid">
        <MetricCard icon={UsersRound} label="Customer records" value={customers.length} detail="Registered active buyers" tone="accent" />
        <MetricCard icon={WalletCards} label="Loan applications" value={loanApps.length} detail="Submitted financing requests" tone="warning" />
        <MetricCard icon={FolderKanban} label="Focused customer" value={selectedCustomer ? `${selectedCustomer.firstName} ${selectedCustomer.lastName}` : 'None'} detail="Current document and application context" tone="info" />
        <MetricCard icon={FileStack} label="Documents uploaded" value={customerDocs.length} detail="For the currently open document workspace" tone="success" />
      </div>

      <div className="tabs">
        <button className={`tab ${tab === 'customers' ? 'active' : ''}`} type="button" onClick={() => setTab('customers')}>Customer portfolio</button>
        <button className={`tab ${tab === 'applications' ? 'active' : ''}`} type="button" onClick={() => setTab('applications')}>Application tracker</button>
      </div>

      <DataTable
        title={tab === 'customers' ? 'Customer portfolio' : 'Application tracker'}
        subtitle="Operational tables with search, filtering, and direct actions."
        actions={(
          <button className="btn btn-primary" type="button" onClick={() => setIsCreateModalOpen(true)}>
            <UserPlus size={16} /> New customer workflow
          </button>
        )}
        columns={tab === 'customers' ? customerColumns : applicationColumns}
        data={tab === 'customers' ? customers : loanApps}
        searchPlaceholder={tab === 'customers' ? 'Search by customer name, email, phone, or city' : 'Search applicants, vehicles, or statuses'}
      />

      <div className="section-grid">
        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title">Focused customer</div>
              <div className="card-subtitle">Use this panel to quickly understand the current customer relationship and associated financing activity.</div>
            </div>
          </div>
          {selectedCustomer ? (
            <div className="list-stack">
              <div className="list-row">
                <div className="list-row-head">
                  <div>
                    <div className="list-row-title">{selectedCustomer.firstName} {selectedCustomer.lastName}</div>
                    <div className="list-row-meta">{selectedCustomer.email} · {selectedCustomer.phone}</div>
                  </div>
                  <StatusBadge value={selectedCustomer.status || 'active'} compact />
                </div>
                <div className="list-row-meta">{selectedCustomer.city || 'City not recorded'} · {selectedCustomer.address || 'Address not recorded'}</div>
              </div>
              <div className="list-row">
                <div className="list-row-title">Loan applications linked</div>
                <p>{customerApplications.length ? `${customerApplications.length} financing file(s) currently associated with this customer.` : 'No financing file has been submitted yet.'}</p>
              </div>
              <button className="btn btn-secondary" type="button" onClick={() => openDocs(selectedCustomer)}>
                Open document workspace
              </button>
            </div>
          ) : (
            <div className="empty-state"><h3>No customer selected</h3><p>Choose a customer from the portfolio to inspect their working set.</p></div>
          )}
        </div>

        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title">Recent application flow</div>
              <div className="card-subtitle">A compact tracker for underwriting movement and status updates.</div>
            </div>
          </div>
          <div className="timeline">
            {loanApps.slice(0, 5).map((application) => {
              const customer = application.customer || customers.find((item) => item.id === application.customerId);
              const vehicle = vehicleMap[application.vehicleId];
              return (
                <div key={application.id} className="timeline-item">
                  <div className="timeline-marker"><span /></div>
                  <div>
                    <div className="timeline-item-head">
                      <div className="list-row-title">{customer ? `${customer.firstName} ${customer.lastName}` : 'Customer'} · {vehicle ? `${vehicle.make} ${vehicle.model}` : 'Vehicle'}</div>
                      <StatusBadge value={application.status || 'submitted'} compact />
                    </div>
                    <div className="timeline-copy">{formatCurrency(application.requestedAmount)} · {application.termMonths} months · {application.employmentStatus}</div>
                    <div className="timeline-copy">Created {formatDateTime(application.createdAt)}</div>
                  </div>
                </div>
              );
            })}
            {!loanApps.length ? (
              <div className="empty-state"><h3>No applications yet</h3><p>Create one from the onboarding flow to start the financing pipeline.</p></div>
            ) : null}
          </div>
        </div>
      </div>

      <Modal
        open={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Customer onboarding workflow"
        subtitle="Capture the customer record first, then optionally attach a vehicle interest and financing request in the same flow."
        size="large"
      >
        <form onSubmit={handleCreate} className="list-stack">
          <div className="form-grid">
            <div className="form-group"><label>First name</label><input value={form.firstName} onChange={(event) => setForm({ ...form, firstName: event.target.value })} required /></div>
            <div className="form-group"><label>Last name</label><input value={form.lastName} onChange={(event) => setForm({ ...form, lastName: event.target.value })} required /></div>
            <div className="form-group"><label>Email</label><input type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} required /></div>
            <div className="form-group"><label>Phone</label><input value={form.phone} onChange={(event) => setForm({ ...form, phone: event.target.value })} required /></div>
            <div className="form-group"><label>City</label><input value={form.city} onChange={(event) => setForm({ ...form, city: event.target.value })} /></div>
            <div className="form-group"><label>Address</label><input value={form.address} onChange={(event) => setForm({ ...form, address: event.target.value })} /></div>
          </div>

          <div className="list-row">
            <div className="list-row-head">
              <div>
                <div className="list-row-title">Vehicle interest selection</div>
                <div className="list-row-meta">Optional, but recommended for proper deal routing.</div>
              </div>
              <StatusBadge value={form.vehicleId ? 'active' : 'pending'} compact />
            </div>
            <div className="form-grid">
              <div className="form-group">
                <label>Preferred vehicle</label>
                <select value={form.vehicleId} onChange={(event) => setForm({ ...form, vehicleId: event.target.value })}>
                  <option value="">Select a vehicle</option>
                  {vehicles.map((vehicle) => (
                    <option key={vehicle.id} value={vehicle.id}>{vehicle.make} {vehicle.model} {vehicle.year}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Interest notes</label>
                <input value={form.interestNotes} onChange={(event) => setForm({ ...form, interestNotes: event.target.value })} placeholder="Trim, color, urgency, or financing preference" />
              </div>
            </div>
          </div>

          <div className="list-row">
            <div className="list-row-head">
              <div>
                <div className="list-row-title">Loan application submission</div>
                <div className="list-row-meta">Completes the customer-to-bank handoff when vehicle preference is already known.</div>
              </div>
              <StatusBadge value={form.requestedAmount ? 'submitted' : 'draft'} compact />
            </div>
            <div className="form-grid">
              <div className="form-group"><label>Requested amount</label><input type="number" value={form.requestedAmount} onChange={(event) => setForm({ ...form, requestedAmount: event.target.value })} placeholder="1500000" /></div>
              <div className="form-group"><label>Term months</label><input type="number" value={form.termMonths} onChange={(event) => setForm({ ...form, termMonths: event.target.value })} /></div>
              <div className="form-group"><label>Monthly income</label><input type="number" value={form.monthlyIncome} onChange={(event) => setForm({ ...form, monthlyIncome: event.target.value })} placeholder="45000" /></div>
              <div className="form-group">
                <label>Employment status</label>
                <select value={form.employmentStatus} onChange={(event) => setForm({ ...form, employmentStatus: event.target.value })}>
                  <option value="employed">Employed</option>
                  <option value="self_employed">Self employed</option>
                  <option value="business_owner">Business owner</option>
                  <option value="contract">Contract</option>
                </select>
              </div>
            </div>
          </div>

          <div className="modal-actions">
            <button className="btn btn-secondary" type="button" onClick={() => setIsCreateModalOpen(false)}>Cancel</button>
            <button className="btn btn-primary" type="submit"><UserPlus size={16} /> Save customer workflow</button>
          </div>
        </form>
      </Modal>

      <Modal
        open={Boolean(showDocsFor)}
        onClose={() => setShowDocsFor(null)}
        title="Document workspace"
        subtitle={showDocsFor ? `${showDocsFor.firstName} ${showDocsFor.lastName}` : ''}
        size="large"
      >
        <form onSubmit={handleUploadDoc} className="list-stack" style={{ marginBottom: '18px' }}>
          <div className="form-grid">
            <div className="form-group"><label>Document name</label><input name="docName" placeholder="National ID, payslip, bank statement" required /></div>
            <div className="form-group"><label>File</label><input type="file" name="file" required style={{ paddingTop: '12px' }} /></div>
          </div>
          <div className="modal-actions">
            <button className="btn btn-primary" type="submit" disabled={uploadingDoc}>
              <Upload size={16} /> {uploadingDoc ? 'Uploading...' : 'Upload document'}
            </button>
          </div>
        </form>

        <div className="list-stack">
          {customerDocs.length ? (
            customerDocs.map((document, index) => (
              <div key={`${document.fileName}-${index}`} className="list-row">
                <div className="list-row-head">
                  <div>
                    <div className="list-row-title">{document.name}</div>
                    <div className="list-row-meta">{document.fileName} · {(document.size / 1024).toFixed(1)} KB</div>
                  </div>
                  <StatusBadge value="active" compact />
                </div>
                <div className="modal-actions" style={{ justifyContent: 'space-between' }}>
                  <div className="list-row-meta">Uploaded {formatDateTime(document.uploadedAt)}</div>
                  <a className="btn btn-secondary btn-sm" href={`${API_ORIGIN}${document.url}`} target="_blank" rel="noreferrer">Open file</a>
                </div>
              </div>
            ))
          ) : (
            <div className="empty-state"><h3>No documents uploaded</h3><p>Add identity, income, or compliance files here.</p></div>
          )}
        </div>
      </Modal>
    </div>
  );
}
