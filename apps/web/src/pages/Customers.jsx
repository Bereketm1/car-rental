import React, { useEffect, useMemo, useState } from 'react';
import { Button, MenuItem, TextField } from '@mui/material';
import { FilePlus2, HelpingHand, PlusCircle, SendHorizontal, UserRoundPlus } from 'lucide-react';
import api from '../api';
import DataTable from '../components/DataTable';
import MetricCard from '../components/MetricCard';
import Modal from '../components/Modal';
import StatusBadge from '../components/StatusBadge';
import { useToast } from '../components/Toast';
import { formatCurrency, formatDateTime, safeArray } from '../utils/format';

const emptyCustomer = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  nationalId: '',
  address: '',
  city: '',
};

const emptyInterest = {
  customerId: '',
  vehicleId: '',
  notes: '',
};

const emptyLoan = {
  customerId: '',
  vehicleId: '',
  requestedAmount: '',
  termMonths: '48',
  monthlyIncome: '',
  employmentStatus: 'employed',
};

const emptyDocument = {
  customerId: '',
  type: 'national_id',
  file: null,
};

export default function Customers() {
  const toast = useToast();
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('customers');
  const [activeModal, setActiveModal] = useState(null);

  const [customers, setCustomers] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [applications, setApplications] = useState([]);

  const [selectedCustomerId, setSelectedCustomerId] = useState('');
  const [customerInterests, setCustomerInterests] = useState([]);
  const [customerDocuments, setCustomerDocuments] = useState([]);

  const [customerForm, setCustomerForm] = useState(emptyCustomer);
  const [interestForm, setInterestForm] = useState(emptyInterest);
  const [loanForm, setLoanForm] = useState(emptyLoan);
  const [documentForm, setDocumentForm] = useState(emptyDocument);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (!selectedCustomerId) {
      setCustomerInterests([]);
      setCustomerDocuments([]);
      return;
    }
    loadCustomerContext(selectedCustomerId);
  }, [selectedCustomerId]);

  async function loadData() {
    setLoading(true);
    try {
      const [customerRes, vehicleRes, applicationRes] = await Promise.all([
        api.get('/customers').catch(() => []),
        api.get('/vehicles').catch(() => []),
        api.get('/customers/loan-applications/all').catch(() => []),
      ]);

      const customerRows = safeArray(customerRes);
      setCustomers(customerRows);
      setVehicles(safeArray(vehicleRes));
      setApplications(safeArray(applicationRes));

      const seedCustomerId = selectedCustomerId || customerRows[0]?.id || '';
      setSelectedCustomerId(seedCustomerId);
      if (seedCustomerId) {
        await loadCustomerContext(seedCustomerId);
      }
    } finally {
      setLoading(false);
    }
  }

  async function loadCustomerContext(customerId) {
    const [interestRes, documentRes] = await Promise.all([
      api.get(`/customers/${customerId}/interests`).catch(() => []),
      api.get(`/customers/${customerId}/documents`).catch(() => []),
    ]);

    setCustomerInterests(safeArray(interestRes));
    setCustomerDocuments(safeArray(documentRes));
  }

  async function submitCustomer(event) {
    event.preventDefault();
    try {
      await api.post('/customers', customerForm);
      toast.success('Customer registered in CRM');
      setCustomerForm(emptyCustomer);
      setActiveModal(null);
      await loadData();
    } catch (error) {
      toast.error(error.message || 'Unable to create customer.');
    }
  }

  async function submitInterest(event) {
    event.preventDefault();
    try {
      await api.post(`/customers/${interestForm.customerId}/interests`, {
        vehicleId: interestForm.vehicleId,
        notes: interestForm.notes,
      });
      toast.success('Vehicle interest saved');
      setInterestForm(emptyInterest);
      setActiveModal(null);
      if (interestForm.customerId) {
        setSelectedCustomerId(interestForm.customerId);
      }
      await loadData();
    } catch (error) {
      toast.error(error.message || 'Unable to save interest.');
    }
  }

  async function submitLoan(event) {
    event.preventDefault();
    try {
      await api.post('/customers/loan-applications', {
        customerId: loanForm.customerId,
        vehicleId: loanForm.vehicleId,
        requestedAmount: Number(loanForm.requestedAmount),
        termMonths: Number(loanForm.termMonths),
        monthlyIncome: Number(loanForm.monthlyIncome),
        employmentStatus: loanForm.employmentStatus,
      });
      toast.success('Loan application submitted');
      setLoanForm(emptyLoan);
      setActiveModal(null);
      await loadData();
    } catch (error) {
      toast.error(error.message || 'Unable to submit loan application.');
    }
  }

  async function submitDocument(event) {
    event.preventDefault();
    if (!documentForm.file) {
      toast.error('Please select a file before uploading.');
      return;
    }

    try {
      const payload = new FormData();
      payload.append('file', documentForm.file);
      const uploaded = await api.upload('/documents/upload', payload);

      await api.post(`/customers/${documentForm.customerId}/documents`, {
        type: documentForm.type,
        filename: uploaded.filename,
        originalName: uploaded.originalName,
        mimeType: uploaded.mimeType,
        size: uploaded.size,
        url: uploaded.url,
      });

      toast.success('Document uploaded and attached to customer');
      setDocumentForm(emptyDocument);
      setActiveModal(null);
      setSelectedCustomerId(documentForm.customerId);
      await loadData();
    } catch (error) {
      toast.error(error.message || 'Unable to upload document.');
    }
  }

  const cityFilters = useMemo(() => {
    const values = [...new Set(customers.map((customer) => customer.city).filter(Boolean))];
    return values.map((city) => ({ label: city, value: city }));
  }, [customers]);

  const customerMap = useMemo(() => Object.fromEntries(customers.map((customer) => [customer.id, customer])), [customers]);
  const vehicleMap = useMemo(() => Object.fromEntries(vehicles.map((vehicle) => [vehicle.id, vehicle])), [vehicles]);

  const selectedCustomer = customerMap[selectedCustomerId] || null;

  const customerColumns = [
    {
      key: 'name',
      label: 'Customer',
      sortable: true,
      render: (_, customer) => (
        <div>
          <div className="list-row-title">{customer.firstName} {customer.lastName}</div>
          <div className="list-row-meta">{customer.email}</div>
        </div>
      ),
    },
    { key: 'phone', label: 'Phone', sortable: true },
    { key: 'city', label: 'City', sortable: true, render: (value) => value || 'Not set' },
    { key: 'nationalId', label: 'National ID', render: (value) => value || 'Not provided' },
    {
      key: 'actions',
      label: 'Actions',
      render: (_, customer) => (
        <button className="btn btn-secondary btn-sm" type="button" onClick={() => setSelectedCustomerId(customer.id)}>
          Focus
        </button>
      ),
    },
  ];

  const applicationColumns = [
    {
      key: 'customerId',
      label: 'Customer',
      sortable: true,
      render: (value) => {
        const customer = customerMap[value];
        return customer ? `${customer.firstName} ${customer.lastName}` : value;
      },
    },
    {
      key: 'vehicleId',
      label: 'Vehicle',
      render: (value) => {
        const vehicle = vehicleMap[value];
        return vehicle ? `${vehicle.make} ${vehicle.model} ${vehicle.year}` : value;
      },
    },
    { key: 'requestedAmount', label: 'Amount', sortable: true, render: (value) => formatCurrency(value) },
    { key: 'termMonths', label: 'Term', sortable: true, render: (value) => `${value} months` },
    { key: 'status', label: 'Status', sortable: true, render: (value) => <StatusBadge value={value || 'submitted'} compact /> },
    { key: 'createdAt', label: 'Submitted', sortable: true, render: (value) => formatDateTime(value) },
  ];

  const documentColumns = [
    { key: 'type', label: 'Type', sortable: true, render: (value) => <StatusBadge value={value || 'uploaded'} compact /> },
    { key: 'originalName', label: 'File name', sortable: true, render: (value, row) => value || row.filename || 'Document' },
    { key: 'mimeType', label: 'Format', render: (value) => value || 'Unknown' },
    { key: 'uploadedAt', label: 'Uploaded', sortable: true, render: (value) => formatDateTime(value) },
    {
      key: 'url',
      label: 'Open',
      render: (value) => (
        value
          ? <a href={value} target="_blank" rel="noreferrer" className="btn btn-sm btn-outline-primary">View</a>
          : 'Unavailable'
      ),
    },
  ];

  if (loading) {
    return <div className="page-shell"><div className="empty-state"><h3>Loading CRM workspace...</h3></div></div>;
  }

  return (
    <div className="page-shell">
      <div className="page-header row-between">
        <div>
          <h1>Customer management system (CRM)</h1>
          <p>Run customer onboarding, vehicle preferences, loan intake, document capture, and application tracking from one place.</p>
        </div>
        <div className="toolbar-cluster wrap">
          <Button variant="outlined" size="small" startIcon={<HelpingHand size={16} />} onClick={() => setActiveModal('interest')}>Record interest</Button>
          <Button variant="outlined" size="small" startIcon={<SendHorizontal size={16} />} onClick={() => setActiveModal('loan')}>Submit loan</Button>
          <Button variant="outlined" size="small" startIcon={<FilePlus2 size={16} />} onClick={() => setActiveModal('document')}>Upload doc</Button>
          <Button variant="contained" size="small" startIcon={<UserRoundPlus size={16} />} onClick={() => setActiveModal('customer')}>Add customer</Button>
        </div>
      </div>

      <div className="stats-grid">
        <MetricCard icon={UserRoundPlus} label="Customers" value={customers.length} detail="Registered buyer profiles" tone="accent" />
        <MetricCard icon={SendHorizontal} label="Loan applications" value={applications.length} detail="Submitted in CRM" tone="warning" />
        <MetricCard icon={HelpingHand} label="Vehicle interests" value={customerInterests.length} detail="For selected customer" tone="info" />
        <MetricCard icon={FilePlus2} label="Attached documents" value={customerDocuments.length} detail="For selected customer" tone="success" />
      </div>

      <div className="tabs">
        <button className={`tab ${tab === 'customers' ? 'active' : ''}`} type="button" onClick={() => setTab('customers')}>Customer registry</button>
        <button className={`tab ${tab === 'applications' ? 'active' : ''}`} type="button" onClick={() => setTab('applications')}>Loan application tracking</button>
        <button className={`tab ${tab === 'documents' ? 'active' : ''}`} type="button" onClick={() => setTab('documents')}>Customer documents</button>
      </div>

      {tab === 'customers' ? (
        <DataTable
          title="CRM customer registry"
          subtitle="Sortable, filterable customer records with profile context."
          columns={customerColumns}
          data={customers}
          filters={[{ key: 'city', label: 'City', options: cityFilters }]}
          searchKeys={['firstName', 'lastName', 'email', 'phone', 'city']}
          searchPlaceholder="Search by name, email, phone, or city"
        />
      ) : null}

      {tab === 'applications' ? (
        <DataTable
          title="Loan application tracking"
          subtitle="Track status, amount, term, and customer context for submitted applications."
          columns={applicationColumns}
          data={applications}
          filters={[
            {
              key: 'status',
              label: 'Status',
              options: [
                { label: 'Draft', value: 'draft' },
                { label: 'Submitted', value: 'submitted' },
                { label: 'Approved', value: 'approved' },
                { label: 'Rejected', value: 'rejected' },
              ],
            },
          ]}
          searchPlaceholder="Search by customer, vehicle, status, or amount"
        />
      ) : null}

      {tab === 'documents' ? (
        <div className="section-grid two-up">
          <div className="card">
            <div className="card-header compact row-between">
              <div>
                <div className="card-title">Customer documents</div>
                <div className="card-subtitle">
                  {selectedCustomer
                    ? `Showing uploaded files for ${selectedCustomer.firstName} ${selectedCustomer.lastName}`
                    : 'Select a customer to inspect attached files.'}
                </div>
              </div>
              <TextField
                select
                size="small"
                sx={{ minWidth: 220 }}
                value={selectedCustomerId}
                onChange={(event) => setSelectedCustomerId(event.target.value)}
              >
                {customers.map((customer) => (
                  <MenuItem key={customer.id} value={customer.id}>{customer.firstName} {customer.lastName}</MenuItem>
                ))}
              </TextField>
            </div>
            <DataTable
              columns={documentColumns}
              data={customerDocuments}
              searchPlaceholder="Search document type, filename, or format"
              emptyTitle="No documents"
              emptyMessage="Upload a file from the action bar to attach documents to this customer."
            />
          </div>

          <div className="card">
            <div className="card-header compact">
              <div>
                <div className="card-title">Vehicle interests for selected customer</div>
                <div className="card-subtitle">Customer preferences used by supplier and sales teams.</div>
              </div>
            </div>
            <div className="list-stack">
              {customerInterests.map((interest) => {
                const vehicle = vehicleMap[interest.vehicleId];
                return (
                  <div key={interest.id} className="list-row">
                    <div className="list-row-head">
                      <div>
                        <div className="list-row-title">{vehicle ? `${vehicle.make} ${vehicle.model} ${vehicle.year}` : interest.vehicleId}</div>
                        <div className="list-row-meta">{interest.notes || 'No additional notes'}</div>
                      </div>
                      <StatusBadge value="interested" compact />
                    </div>
                    <div className="list-row-meta">{formatDateTime(interest.createdAt)}</div>
                  </div>
                );
              })}
              {!customerInterests.length ? <div className="empty-state compact"><h3>No interests</h3><p>Add vehicle interests to improve lead routing and supplier matching.</p></div> : null}
            </div>
          </div>
        </div>
      ) : null}

      <Modal open={activeModal === 'customer'} onClose={() => setActiveModal(null)} title="Register customer" subtitle="Create a CRM profile that can move into loan and deal workflows." size="large">
        <form className="form-grid" onSubmit={submitCustomer}>
          <div className="form-group"><label>First name</label><input value={customerForm.firstName} onChange={(event) => setCustomerForm({ ...customerForm, firstName: event.target.value })} required /></div>
          <div className="form-group"><label>Last name</label><input value={customerForm.lastName} onChange={(event) => setCustomerForm({ ...customerForm, lastName: event.target.value })} required /></div>
          <div className="form-group"><label>Email</label><input type="email" value={customerForm.email} onChange={(event) => setCustomerForm({ ...customerForm, email: event.target.value })} required /></div>
          <div className="form-group"><label>Phone</label><input value={customerForm.phone} onChange={(event) => setCustomerForm({ ...customerForm, phone: event.target.value })} required /></div>
          <div className="form-group"><label>National ID</label><input value={customerForm.nationalId} onChange={(event) => setCustomerForm({ ...customerForm, nationalId: event.target.value })} /></div>
          <div className="form-group"><label>City</label><input value={customerForm.city} onChange={(event) => setCustomerForm({ ...customerForm, city: event.target.value })} /></div>
          <div className="form-group" style={{ gridColumn: '1 / -1' }}><label>Address</label><textarea value={customerForm.address} onChange={(event) => setCustomerForm({ ...customerForm, address: event.target.value })} /></div>
          <div className="modal-actions" style={{ gridColumn: '1 / -1' }}>
            <button className="btn btn-secondary" type="button" onClick={() => setActiveModal(null)}>Cancel</button>
            <button className="btn btn-primary" type="submit"><PlusCircle size={15} /> Register customer</button>
          </div>
        </form>
      </Modal>

      <Modal open={activeModal === 'interest'} onClose={() => setActiveModal(null)} title="Record vehicle interest" subtitle="Capture preferred vehicle options for the customer." size="large">
        <form className="form-grid" onSubmit={submitInterest}>
          <div className="form-group">
            <label>Customer</label>
            <select value={interestForm.customerId} onChange={(event) => setInterestForm({ ...interestForm, customerId: event.target.value })} required>
              <option value="">Select customer</option>
              {customers.map((customer) => <option key={customer.id} value={customer.id}>{customer.firstName} {customer.lastName}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label>Vehicle</label>
            <select value={interestForm.vehicleId} onChange={(event) => setInterestForm({ ...interestForm, vehicleId: event.target.value })} required>
              <option value="">Select vehicle</option>
              {vehicles.map((vehicle) => <option key={vehicle.id} value={vehicle.id}>{vehicle.make} {vehicle.model} {vehicle.year}</option>)}
            </select>
          </div>
          <div className="form-group" style={{ gridColumn: '1 / -1' }}><label>Notes</label><textarea value={interestForm.notes} onChange={(event) => setInterestForm({ ...interestForm, notes: event.target.value })} placeholder="Preferred color, budget, or model package" /></div>
          <div className="modal-actions" style={{ gridColumn: '1 / -1' }}>
            <button className="btn btn-secondary" type="button" onClick={() => setActiveModal(null)}>Cancel</button>
            <button className="btn btn-primary" type="submit"><HelpingHand size={15} /> Save interest</button>
          </div>
        </form>
      </Modal>

      <Modal open={activeModal === 'loan'} onClose={() => setActiveModal(null)} title="Submit loan application" subtitle="Create a financing request directly from the CRM." size="large">
        <form className="form-grid" onSubmit={submitLoan}>
          <div className="form-group">
            <label>Customer</label>
            <select value={loanForm.customerId} onChange={(event) => setLoanForm({ ...loanForm, customerId: event.target.value })} required>
              <option value="">Select customer</option>
              {customers.map((customer) => <option key={customer.id} value={customer.id}>{customer.firstName} {customer.lastName}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label>Vehicle</label>
            <select value={loanForm.vehicleId} onChange={(event) => setLoanForm({ ...loanForm, vehicleId: event.target.value })} required>
              <option value="">Select vehicle</option>
              {vehicles.map((vehicle) => <option key={vehicle.id} value={vehicle.id}>{vehicle.make} {vehicle.model} {vehicle.year}</option>)}
            </select>
          </div>
          <div className="form-group"><label>Requested amount</label><input type="number" value={loanForm.requestedAmount} onChange={(event) => setLoanForm({ ...loanForm, requestedAmount: event.target.value })} required /></div>
          <div className="form-group"><label>Term (months)</label><input type="number" value={loanForm.termMonths} onChange={(event) => setLoanForm({ ...loanForm, termMonths: event.target.value })} required /></div>
          <div className="form-group"><label>Monthly income</label><input type="number" value={loanForm.monthlyIncome} onChange={(event) => setLoanForm({ ...loanForm, monthlyIncome: event.target.value })} required /></div>
          <div className="form-group"><label>Employment status</label><select value={loanForm.employmentStatus} onChange={(event) => setLoanForm({ ...loanForm, employmentStatus: event.target.value })}><option value="employed">Employed</option><option value="self-employed">Self-employed</option><option value="business-owner">Business owner</option><option value="contract">Contract</option></select></div>
          <div className="modal-actions" style={{ gridColumn: '1 / -1' }}>
            <button className="btn btn-secondary" type="button" onClick={() => setActiveModal(null)}>Cancel</button>
            <button className="btn btn-primary" type="submit"><SendHorizontal size={15} /> Submit application</button>
          </div>
        </form>
      </Modal>

      <Modal open={activeModal === 'document'} onClose={() => setActiveModal(null)} title="Upload and attach customer document" subtitle="Uploads to the document service and immediately links to the customer profile." size="large">
        <form className="form-grid" onSubmit={submitDocument}>
          <div className="form-group">
            <label>Customer</label>
            <select value={documentForm.customerId} onChange={(event) => setDocumentForm({ ...documentForm, customerId: event.target.value })} required>
              <option value="">Select customer</option>
              {customers.map((customer) => <option key={customer.id} value={customer.id}>{customer.firstName} {customer.lastName}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label>Document type</label>
            <select value={documentForm.type} onChange={(event) => setDocumentForm({ ...documentForm, type: event.target.value })}>
              <option value="national_id">National ID</option>
              <option value="salary_letter">Salary letter</option>
              <option value="bank_statement">Bank statement</option>
              <option value="utility_bill">Utility bill</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div className="form-group" style={{ gridColumn: '1 / -1' }}>
            <label>File</label>
            <input type="file" onChange={(event) => setDocumentForm({ ...documentForm, file: event.target.files?.[0] || null })} required />
          </div>
          <div className="modal-actions" style={{ gridColumn: '1 / -1' }}>
            <button className="btn btn-secondary" type="button" onClick={() => setActiveModal(null)}>Cancel</button>
            <button className="btn btn-primary" type="submit"><FilePlus2 size={15} /> Upload and attach</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
