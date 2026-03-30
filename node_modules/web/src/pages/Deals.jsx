import React, { useEffect, useMemo, useState } from 'react';
import { ArrowRight, BadgeDollarSign, CarFront, CheckCircle2, Sparkles } from 'lucide-react';
import api from '../api';
import MetricCard from '../components/MetricCard';
import Modal from '../components/Modal';
import Skeleton from '../components/Skeleton';
import StatusBadge from '../components/StatusBadge';
import { useToast } from '../components/Toast';
import { formatCurrency, safeArray, toTitleCase } from '../utils/format';

const lifecycleStages = [
  { key: 'vehicle_selected', label: 'Vehicle selected', legacy: ['inquiry', 'negotiation', 'vehicle_selected'] },
  { key: 'loan_applied', label: 'Loan applied', legacy: ['documentation', 'loan_applied'] },
  { key: 'under_review', label: 'Under review', legacy: ['financing', 'under_review'] },
  { key: 'approved', label: 'Approved', legacy: ['approval', 'approved'] },
  { key: 'contract_signed', label: 'Contract signed', legacy: ['contract_signed'] },
  { key: 'completed', label: 'Completed', legacy: ['completed'] },
];

function normalizeStage(stage) {
  const match = lifecycleStages.find((item) => item.legacy.includes(stage));
  return match?.key || stage || 'vehicle_selected';
}

const emptyDealForm = {
  customerName: '',
  vehicleId: '',
  vehicleDescription: '',
  amount: '',
  stage: 'vehicle_selected',
  notes: '',
};

export default function Deals() {
  const toast = useToast();
  const [loading, setLoading] = useState(true);
  const [deals, setDeals] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [form, setForm] = useState(emptyDealForm);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    try {
      const [dealResponse, customerResponse, vehicleResponse] = await Promise.all([
        api.get('/deals').catch(() => []),
        api.get('/customers').catch(() => []),
        api.get('/vehicles').catch(() => []),
      ]);
      setDeals(safeArray(dealResponse));
      setCustomers(safeArray(customerResponse));
      setVehicles(safeArray(vehicleResponse));
    } finally {
      setLoading(false);
    }
  }

  async function handleCreate(event) {
    event.preventDefault();
    try {
      await api.post('/deals', {
        customerName: form.customerName,
        vehicleDescription: form.vehicleDescription,
        amount: Number(form.amount),
        stage: form.stage,
        notes: form.notes,
      });
      toast.success('Deal created');
      setForm(emptyDealForm);
      setIsCreateModalOpen(false);
      await loadData();
    } catch (error) {
      toast.error(error.message || 'Failed to create deal');
    }
  }

  async function moveDeal(deal, direction) {
    const currentStage = normalizeStage(deal.stage);
    const currentIndex = lifecycleStages.findIndex((stage) => stage.key === currentStage);
    const nextIndex = Math.max(0, Math.min(lifecycleStages.length - 1, currentIndex + direction));
    const targetStage = lifecycleStages[nextIndex]?.key;

    if (!targetStage || targetStage === currentStage) return;

    try {
      await api.put(`/deals/${deal.id}/stage`, { stage: targetStage });
      toast.success(`Deal moved to ${toTitleCase(targetStage)}`);
      await loadData();
    } catch (error) {
      toast.error(error.message || 'Failed to update deal stage');
    }
  }

  const filteredDeals = deals.filter((deal) => {
    if (!searchQuery.trim()) return true;
    const query = searchQuery.trim().toLowerCase();
    return [deal.customerName, deal.vehicleDescription, deal.stage].some((value) => String(value || '').toLowerCase().includes(query));
  });

  const groupedDeals = lifecycleStages.map((stage) => ({
    ...stage,
    deals: filteredDeals.filter((deal) => normalizeStage(deal.stage) === stage.key),
  }));

  const totalPipeline = deals.reduce((sum, deal) => sum + (Number(deal.amount || deal.totalAmount) || 0), 0);
  const completedValue = deals.filter((deal) => normalizeStage(deal.stage) === 'completed').reduce((sum, deal) => sum + (Number(deal.amount || deal.totalAmount) || 0), 0);

  if (loading) {
    return (
      <div className="page-shell">
        <div className="page-header"><Skeleton type="title" style={{ width: '28%' }} /></div>
        <div className="stats-grid"><Skeleton type="stat" count={4} /></div>
        <div className="section-grid"><Skeleton type="card" style={{ height: '520px' }} /><Skeleton type="card" style={{ height: '520px' }} /></div>
      </div>
    );
  }

  return (
    <div className="page-shell">
      <div className="page-header">
        <div>
          <h1>Deal management system</h1>
          <p>Drive the transaction lifecycle from vehicle selection to financing approval and completed purchase.</p>
        </div>
        <div className="pill-list">
          <span className="pill">Customer to purchase</span>
          <span className="pill">Lifecycle board</span>
          <span className="pill">Transaction visibility</span>
        </div>
      </div>

      <div className="stats-grid">
        <MetricCard icon={Sparkles} label="Active deals" value={deals.filter((deal) => normalizeStage(deal.stage) !== 'completed').length} detail="Transactions still moving through the funnel" tone="accent" />
        <MetricCard icon={BadgeDollarSign} label="Pipeline value" value={formatCurrency(totalPipeline, { compact: true, maximumFractionDigits: 1 })} detail="Total deal value across all stages" tone="warning" />
        <MetricCard icon={CheckCircle2} label="Closed value" value={formatCurrency(completedValue, { compact: true, maximumFractionDigits: 1 })} detail="Completed transactions only" tone="success" />
        <MetricCard icon={CarFront} label="Vehicles in motion" value={new Set(deals.map((deal) => deal.vehicleDescription)).size} detail="Unique vehicles currently involved in deals" tone="info" />
      </div>

      <div className="card">
        <div className="card-header">
          <div>
            <div className="card-title">Lifecycle board</div>
            <div className="card-subtitle">A transaction view aligned with the marketplace process in your business workflow.</div>
          </div>
          <div className="toolbar-cluster">
            <div className="header-search" style={{ maxWidth: '320px' }}>
              <input value={searchQuery} onChange={(event) => setSearchQuery(event.target.value)} placeholder="Search deals, customers, vehicles" />
            </div>
            <button className="btn btn-primary" type="button" onClick={() => setIsCreateModalOpen(true)}>
              <Sparkles size={16} /> Create transaction
            </button>
          </div>
        </div>

        <div className="kanban">
          {groupedDeals.map((stage) => (
            <div key={stage.key} className="kanban-column">
              <div className="kanban-column-head">
                <h3>{stage.label}</h3>
                <StatusBadge value={stage.deals.length ? 'active' : 'pending'} compact className="tone-neutral" />
              </div>
              <div className="list-stack">
                {stage.deals.map((deal) => {
                  const currentIndex = lifecycleStages.findIndex((item) => item.key === stage.key);
                  return (
                    <div key={deal.id} className="kanban-card">
                      <div className="list-row-head">
                        <div>
                          <div className="list-row-title">{deal.customerName}</div>
                          <div className="list-row-meta">{deal.vehicleDescription}</div>
                        </div>
                        <StatusBadge value={stage.key} compact />
                      </div>
                      <div className="list-row-meta" style={{ marginBottom: '12px' }}>{formatCurrency(deal.amount || deal.totalAmount)}</div>
                      <div className="toolbar-cluster">
                        <button className="btn btn-ghost btn-sm" type="button" onClick={() => moveDeal(deal, -1)} disabled={currentIndex === 0}>Back</button>
                        <button className="btn btn-secondary btn-sm" type="button" onClick={() => moveDeal(deal, 1)} disabled={currentIndex === lifecycleStages.length - 1}>
                          Advance <ArrowRight size={14} />
                        </button>
                      </div>
                    </div>
                  );
                })}
                {!stage.deals.length ? <div className="empty-state" style={{ minHeight: '160px' }}><h3>No deals</h3><p>No transactions currently mapped to this stage.</p></div> : null}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="section-grid">
        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title">Stage distribution</div>
              <div className="card-subtitle">Quick counts for each commercial handoff point.</div>
            </div>
          </div>
          <div className="list-stack">
            {groupedDeals.map((stage) => (
              <div key={stage.key} className="list-row">
                <div className="list-row-head">
                  <div className="list-row-title">{stage.label}</div>
                  <StatusBadge value={stage.deals.length ? 'active' : 'pending'} compact />
                </div>
                <div className="list-row-meta">{stage.deals.length} deal(s) currently in this stage.</div>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title">Recent transactions</div>
              <div className="card-subtitle">A compact summary for the latest deals created in the system.</div>
            </div>
          </div>
          <div className="list-stack">
            {deals.slice(0, 5).map((deal) => (
              <div key={deal.id} className="list-row">
                <div className="list-row-head">
                  <div>
                    <div className="list-row-title">{deal.customerName}</div>
                    <div className="list-row-meta">{deal.vehicleDescription}</div>
                  </div>
                  <StatusBadge value={normalizeStage(deal.stage)} compact />
                </div>
                <div className="list-row-meta">{formatCurrency(deal.amount || deal.totalAmount)}</div>
              </div>
            ))}
            {!deals.length ? <div className="empty-state"><h3>No transactions yet</h3><p>Create a new deal to populate the lifecycle board.</p></div> : null}
          </div>
        </div>
      </div>

      <Modal
        open={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Create a deal"
        subtitle="Start the transaction record in a modal so the board remains the primary operating surface."
        size="large"
      >
        <form onSubmit={handleCreate} className="list-stack">
          <div className="form-grid">
            <div className="form-group">
              <label>Customer</label>
              <select
                value={form.customerName}
                onChange={(event) => setForm({ ...form, customerName: event.target.value })}
                required
              >
                <option value="">Select customer</option>
                {customers.map((customer) => (
                  <option key={customer.id} value={`${customer.firstName} ${customer.lastName}`}>{customer.firstName} {customer.lastName}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Vehicle</label>
              <select
                value={form.vehicleId}
                onChange={(event) => {
                  const vehicle = vehicles.find((item) => item.id === event.target.value);
                  setForm({
                    ...form,
                    vehicleId: event.target.value,
                    vehicleDescription: vehicle ? `${vehicle.make} ${vehicle.model} ${vehicle.year}` : '',
                    amount: vehicle ? vehicle.price : form.amount,
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
            <div className="form-group"><label>Amount</label><input type="number" value={form.amount} onChange={(event) => setForm({ ...form, amount: event.target.value })} required /></div>
            <div className="form-group"><label>Stage</label><select value={form.stage} onChange={(event) => setForm({ ...form, stage: event.target.value })}>{lifecycleStages.map((stage) => <option key={stage.key} value={stage.key}>{stage.label}</option>)}</select></div>
            <div className="form-group" style={{ gridColumn: '1 / -1' }}><label>Notes</label><textarea value={form.notes} onChange={(event) => setForm({ ...form, notes: event.target.value })} placeholder="Deal assumptions, customer preference, funding context" /></div>
          </div>
          <div className="modal-actions">
            <button className="btn btn-secondary" type="button" onClick={() => setIsCreateModalOpen(false)}>Cancel</button>
            <button className="btn btn-primary" type="submit"><Sparkles size={16} /> Create transaction</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
