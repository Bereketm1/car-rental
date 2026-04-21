import React, { useEffect, useMemo, useState } from 'react';
import { Button } from '@mui/material';
import { ArrowLeft, ArrowRight, BadgeDollarSign, CarFront, CheckCircle2, PlusCircle, RefreshCw, Workflow } from 'lucide-react';
import api from '../api';
import DataTable from '../components/DataTable';
import MetricCard from '../components/MetricCard';
import Modal from '../components/Modal';
import StatusBadge from '../components/StatusBadge';
import { useToast } from '../components/Toast';
import { formatCurrency, safeArray } from '../utils/format';

const lifecycleStages = [
  { key: 'inquiry', label: 'Inquiry' },
  { key: 'vehicle_selected', label: 'Vehicle Selected' },
  { key: 'loan_applied', label: 'Loan Applied' },
  { key: 'under_review', label: 'Under Review' },
  { key: 'approved', label: 'Approved' },
  { key: 'contract_signed', label: 'Contract Signed' },
  { key: 'completed', label: 'Completed' },
  { key: 'cancelled', label: 'Cancelled' },
];

const emptyDeal = {
  customerId: '',
  customerName: '',
  vehicleId: '',
  vehicleDescription: '',
  applicationId: '',
  reviewId: '',
  amount: '',
  totalAmount: '',
  downPayment: '',
  financedAmount: '',
  commissionRate: '5',
  stage: 'inquiry',
  notes: '',
};

export default function Deals() {
  const toast = useToast();
  const [loading, setLoading] = useState(true);
  const [activeModal, setActiveModal] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [deals, setDeals] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [applications, setApplications] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [dealForm, setDealForm] = useState(emptyDeal);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    try {
      const [dealRes, customerRes, vehicleRes, applicationRes, reviewRes] = await Promise.all([
        api.get('/deals').catch(() => []),
        api.get('/customers').catch(() => []),
        api.get('/vehicles').catch(() => []),
        api.get('/customers/loan-applications/all').catch(() => []),
        api.get('/finance/reviews').catch(() => []),
      ]);

      setDeals(safeArray(dealRes));
      setCustomers(safeArray(customerRes));
      setVehicles(safeArray(vehicleRes));
      setApplications(safeArray(applicationRes));
      setReviews(safeArray(reviewRes));
    } finally {
      setLoading(false);
    }
  }

  async function createDeal(event) {
    event.preventDefault();
    try {
      await api.post('/deals', {
        ...dealForm,
        amount: Number(dealForm.amount || 0),
        totalAmount: Number(dealForm.totalAmount || dealForm.amount || 0),
        downPayment: Number(dealForm.downPayment || 0),
        financedAmount: Number(dealForm.financedAmount || 0),
        commissionRate: Number(dealForm.commissionRate || 5),
      });
      toast.success('Deal lifecycle record created');
      setDealForm(emptyDeal);
      setActiveModal(false);
      await loadData();
    } catch (error) {
      toast.error(error.message || 'Unable to create deal.');
    }
  }

  async function updateStage(deal, direction) {
    const index = lifecycleStages.findIndex((stage) => stage.key === deal.stage);
    const nextIndex = Math.max(0, Math.min(lifecycleStages.length - 1, index + direction));
    const targetStage = lifecycleStages[nextIndex]?.key;

    if (!targetStage || targetStage === deal.stage) {
      return;
    }

    try {
      await api.put(`/deals/${deal.id}/stage`, { stage: targetStage });
      toast.success(`Deal moved to ${targetStage}`);
      await loadData();
    } catch (error) {
      toast.error(error.message || 'Unable to move deal stage.');
    }
  }

  async function cancelDeal(dealId) {
    if (!window.confirm('Cancel this deal?')) {
      return;
    }

    try {
      await api.delete(`/deals/${dealId}`);
      toast.success('Deal moved to cancelled stage');
      await loadData();
    } catch (error) {
      toast.error(error.message || 'Unable to cancel deal.');
    }
  }

  const filteredDeals = useMemo(() => deals.filter((deal) => {
    if (!searchText.trim()) return true;
    const q = searchText.trim().toLowerCase();
    return [deal.customerName, deal.vehicleDescription, deal.stage, deal.notes]
      .some((value) => String(value || '').toLowerCase().includes(q));
  }), [deals, searchText]);

  const groupedDeals = useMemo(
    () => lifecycleStages.map((stage) => ({
      ...stage,
      deals: filteredDeals.filter((deal) => (deal.stage || 'inquiry') === stage.key),
    })),
    [filteredDeals],
  );

  const totals = useMemo(() => {
    const pipeline = deals
      .filter((deal) => !['completed', 'cancelled'].includes(deal.stage))
      .reduce((sum, deal) => sum + Number(deal.totalAmount || deal.amount || 0), 0);

    const closed = deals
      .filter((deal) => deal.stage === 'completed')
      .reduce((sum, deal) => sum + Number(deal.totalAmount || deal.amount || 0), 0);

    return { pipeline, closed };
  }, [deals]);

  const dealColumns = [
    {
      key: 'customerName',
      label: 'Customer',
      sortable: true,
      render: (value, deal) => (
        <div>
          <div className="list-row-title">{value || 'Customer pending'}</div>
          <div className="list-row-meta">{deal.vehicleDescription || 'Vehicle pending'}</div>
        </div>
      ),
    },
    { 
      key: 'stage', 
      label: 'Stage', 
      sortable: true, 
      render: (value, deal) => (
        <select
          value={value}
          onChange={(e) => updateStageToValue(deal, e.target.value)}
          style={{
            padding: '4px 8px',
            borderRadius: '6px',
            border: '1px solid var(--border-color)',
            backgroundColor: 'var(--bg-surface)',
            color: 'var(--text-primary)',
            fontSize: '0.85rem',
            cursor: 'pointer'
          }}
        >
          {lifecycleStages.map((stage) => (
            <option key={stage.key} value={stage.key}>{stage.label}</option>
          ))}
        </select>
      ) 
    },
    { key: 'totalAmount', label: 'Total amount', sortable: true, render: (value, deal) => formatCurrency(value || deal.amount || 0) },
    { key: 'downPayment', label: 'Down payment', sortable: true, render: (value) => formatCurrency(value || 0) },
    { key: 'financedAmount', label: 'Financed', sortable: true, render: (value) => formatCurrency(value || 0) },
    {
      key: 'actions',
      label: 'Actions',
      render: (_, deal) => (
        <div className="toolbar-cluster wrap">
          {deal.stage !== 'cancelled' && deal.stage !== 'completed' ? (
            <button className="btn btn-sm btn-outline-danger" type="button" onClick={() => cancelDeal(deal.id)}>Cancel</button>
          ) : null}
        </div>
      ),
    },
  ];

  async function updateStageToValue(deal, targetStage) {
    try {
      await api.put(`/deals/${deal.id}/stage`, { stage: targetStage });
      toast.success(`Deal moved to ${lifecycleStages.find(s => s.key === targetStage)?.label || targetStage}`);
      await loadData();
    } catch (error) {
      toast.error(error.message || 'Unable to update deal stage.');
    }
  }

  if (loading) {
    return <div className="page-shell"><div className="empty-state"><h3>Loading deal workspace...</h3></div></div>;
  }

  return (
    <div className="page-shell">
      <div className="page-header row-between">
        <div>
          <h1>Deal management lifecycle</h1>
          <p>Control the transaction chain from inquiry to completed purchase with stage-driven actions.</p>
        </div>
        <div className="toolbar-cluster wrap">
          <Button variant="outlined" size="small" startIcon={<RefreshCw size={16} />} onClick={loadData}>Refresh</Button>
          <Button variant="contained" size="small" startIcon={<PlusCircle size={16} />} onClick={() => setActiveModal(true)}>Create deal</Button>
        </div>
      </div>

      <div className="stats-grid">
        <MetricCard icon={Workflow} label="Open deals" value={deals.filter((deal) => !['completed', 'cancelled'].includes(deal.stage)).length} detail="Still in progress" tone="accent" />
        <MetricCard icon={BadgeDollarSign} label="Pipeline value" value={formatCurrency(totals.pipeline, { compact: true, maximumFractionDigits: 1 })} detail="Outstanding transaction value" tone="warning" />
        <MetricCard icon={CheckCircle2} label="Closed value" value={formatCurrency(totals.closed, { compact: true, maximumFractionDigits: 1 })} detail="Completed transactions" tone="success" />
        <MetricCard icon={CarFront} label="Vehicles in flow" value={new Set(deals.map((deal) => deal.vehicleId || deal.vehicleDescription)).size} detail="Unique deal vehicles" tone="info" />
      </div>

      <div className="card">
        <div className="card-header compact row-between">
          <div>
            <div className="card-title">Lifecycle board</div>
            <div className="card-subtitle">List-style visibility into each transaction stage.</div>
          </div>
          <input
            className="table-search-input"
            value={searchText}
            onChange={(event) => setSearchText(event.target.value)}
            placeholder="Search by customer, vehicle, stage, or notes"
          />
        </div>

        <div style={{ padding: '0 16px 16px' }}>
          <DataTable columns={dealColumns} data={filteredDeals} keyField="id" />
        </div>
      </div>

      <Modal open={activeModal} onClose={() => setActiveModal(false)} title="Create deal" subtitle="Start a transaction lifecycle record with linked customer and vehicle data." size="large">
        <form className="form-grid" onSubmit={createDeal}>
          <div className="form-group">
            <label>Customer</label>
            <select
              value={dealForm.customerId}
              onChange={(event) => {
                const customer = customers.find((row) => row.id === event.target.value);
                setDealForm({
                  ...dealForm,
                  customerId: event.target.value,
                  customerName: customer ? `${customer.firstName || ''} ${customer.lastName || ''}`.trim() : '',
                });
              }}
              required
            >
              <option value="">Select customer</option>
              {customers.map((customer) => (
                <option key={customer.id} value={customer.id}>{customer.firstName} {customer.lastName}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Vehicle</label>
            <select
              value={dealForm.vehicleId}
              onChange={(event) => {
                const vehicle = vehicles.find((row) => row.id === event.target.value);
                setDealForm({
                  ...dealForm,
                  vehicleId: event.target.value,
                  vehicleDescription: vehicle ? `${vehicle.make} ${vehicle.model} ${vehicle.year}` : '',
                  amount: vehicle?.price || dealForm.amount,
                  totalAmount: vehicle?.price || dealForm.totalAmount,
                });
              }}
              required
            >
              <option value="">Select vehicle</option>
              {vehicles.map((vehicle) => (
                <option key={vehicle.id} value={vehicle.id}>{vehicle.make} {vehicle.model} {vehicle.year}</option>
              ))}
            </select>
          </div>

          <div className="form-group"><label>Application (optional)</label>
            <select value={dealForm.applicationId} onChange={(event) => setDealForm({ ...dealForm, applicationId: event.target.value })}>
              <option value="">None</option>
              {applications.map((application) => (
                <option key={application.id} value={application.id}>{application.id.slice(0, 8)} • {formatCurrency(application.requestedAmount || 0)}</option>
              ))}
            </select>
          </div>

          <div className="form-group"><label>Review (optional)</label>
            <select value={dealForm.reviewId} onChange={(event) => setDealForm({ ...dealForm, reviewId: event.target.value })}>
              <option value="">None</option>
              {reviews.map((review) => (
                <option key={review.id} value={review.id}>{review.customerName || review.id.slice(0, 8)} • {review.status}</option>
              ))}
            </select>
          </div>

          <div className="form-group"><label>Stage</label><select value={dealForm.stage} onChange={(event) => setDealForm({ ...dealForm, stage: event.target.value })}>{lifecycleStages.map((stage) => <option key={stage.key} value={stage.key}>{stage.label}</option>)}</select></div>
          <div className="form-group"><label>Total amount</label><input type="number" value={dealForm.totalAmount} onChange={(event) => setDealForm({ ...dealForm, totalAmount: event.target.value })} required /></div>
          <div className="form-group"><label>Down payment</label><input type="number" value={dealForm.downPayment} onChange={(event) => setDealForm({ ...dealForm, downPayment: event.target.value })} /></div>
          <div className="form-group"><label>Financed amount</label><input type="number" value={dealForm.financedAmount} onChange={(event) => setDealForm({ ...dealForm, financedAmount: event.target.value })} /></div>
          <div className="form-group"><label>Commission rate (%)</label><input type="number" step="0.1" value={dealForm.commissionRate} onChange={(event) => setDealForm({ ...dealForm, commissionRate: event.target.value })} /></div>
          <div className="form-group" style={{ gridColumn: '1 / -1' }}><label>Notes</label><textarea value={dealForm.notes} onChange={(event) => setDealForm({ ...dealForm, notes: event.target.value })} placeholder="Context about negotiation, financing assumptions, and partner handoffs" /></div>

          <div className="modal-actions" style={{ gridColumn: '1 / -1' }}>
            <button className="btn btn-secondary" type="button" onClick={() => setActiveModal(false)}>Cancel</button>
            <button className="btn btn-primary" type="submit"><PlusCircle size={15} /> Create deal</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
