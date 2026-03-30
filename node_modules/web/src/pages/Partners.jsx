import React, { useEffect, useMemo, useState } from 'react';
import { BadgeDollarSign, Building2, FileText, HeartHandshake, Link2 } from 'lucide-react';
import api from '../api';
import DataTable from '../components/DataTable';
import MetricCard from '../components/MetricCard';
import Modal from '../components/Modal';
import Skeleton from '../components/Skeleton';
import StatusBadge from '../components/StatusBadge';
import { useToast } from '../components/Toast';
import { formatCurrency, formatDate, safeArray } from '../utils/format';

const emptyPartnerForm = {
  name: '',
  type: 'dealer',
  email: '',
  phone: '',
  city: '',
  commissionRate: '3',
};

const emptyAgreementForm = {
  partnerId: '',
  title: '',
  terms: '',
  startDate: '',
  endDate: '',
};

const emptyCommissionForm = {
  partnerId: '',
  dealId: '',
  amount: '',
};

export default function Partners() {
  const toast = useToast();
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('partners');
  const [partners, setPartners] = useState([]);
  const [agreements, setAgreements] = useState([]);
  const [commissions, setCommissions] = useState([]);
  const [selectedPartnerId, setSelectedPartnerId] = useState('');
  const [partnerForm, setPartnerForm] = useState(emptyPartnerForm);
  const [agreementForm, setAgreementForm] = useState(emptyAgreementForm);
  const [commissionForm, setCommissionForm] = useState(emptyCommissionForm);
  const [activeModal, setActiveModal] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (selectedPartnerId) {
      loadCommissions(selectedPartnerId);
    }
  }, [selectedPartnerId]);

  async function loadData() {
    setLoading(true);
    try {
      const [partnerResponse, agreementResponse] = await Promise.all([
        api.get('/partners').catch(() => []),
        api.get('/partners/agreements/all').catch(() => []),
      ]);
      const partnerList = safeArray(partnerResponse);
      setPartners(partnerList);
      setAgreements(safeArray(agreementResponse));
      const initialPartnerId = selectedPartnerId || partnerList[0]?.id || '';
      setSelectedPartnerId(initialPartnerId);
      if (initialPartnerId) {
        await loadCommissions(initialPartnerId);
      }
    } finally {
      setLoading(false);
    }
  }

  async function loadCommissions(partnerId) {
    try {
      const commissionResponse = await api.get(`/partners/${partnerId}/commissions`).catch(() => []);
      setCommissions(safeArray(commissionResponse));
    } catch {
      setCommissions([]);
    }
  }

  async function handleCreatePartner(event) {
    event.preventDefault();
    try {
      await api.post('/partners', { ...partnerForm, commissionRate: Number(partnerForm.commissionRate) });
      toast.success('Partner registered');
      setPartnerForm(emptyPartnerForm);
      setActiveModal(null);
      await loadData();
    } catch (error) {
      toast.error(error.message || 'Failed to create partner');
    }
  }

  async function handleCreateAgreement(event) {
    event.preventDefault();
    try {
      await api.post('/partners/agreements', agreementForm);
      toast.success('Agreement created');
      setAgreementForm(emptyAgreementForm);
      setActiveModal(null);
      await loadData();
    } catch (error) {
      toast.error(error.message || 'Failed to create agreement');
    }
  }

  async function handleCreateCommission(event) {
    event.preventDefault();
    try {
      await api.post(`/partners/${commissionForm.partnerId}/commissions`, {
        dealId: commissionForm.dealId,
        amount: Number(commissionForm.amount),
      });
      toast.success('Commission recorded');
      setCommissionForm(emptyCommissionForm);
      setActiveModal(null);
      await loadData();
    } catch (error) {
      toast.error(error.message || 'Failed to record commission');
    }
  }

  async function handleDeletePartner(id) {
    if (!confirm('Remove this partner?')) return;
    try {
      await api.delete(`/partners/${id}`);
      toast.success('Partner removed');
      await loadData();
    } catch (error) {
      toast.error(error.message || 'Failed to remove partner');
    }
  }

  const partnerColumns = [
    { key: 'name', label: 'Partner', sortable: true },
    { key: 'type', label: 'Type', sortable: true, render: (value) => <StatusBadge value={value || 'dealer'} compact /> },
    { key: 'city', label: 'City', sortable: true },
    { key: 'commissionRate', label: 'Commission', render: (value) => `${value || 0}%` },
    { key: 'status', label: 'Status', render: (value) => <StatusBadge value={value || 'active'} compact /> },
    {
      key: 'actions',
      label: 'Actions',
      render: (_, partner) => (
        <div className="toolbar-cluster">
          <button className="btn btn-secondary btn-sm" type="button" onClick={() => setSelectedPartnerId(partner.id)}>Focus</button>
          <button className="btn btn-danger btn-sm" type="button" onClick={() => handleDeletePartner(partner.id)}>Remove</button>
        </div>
      ),
    },
  ];

  const agreementColumns = [
    {
      key: 'partnerId',
      label: 'Partner',
      render: (value, agreement) => agreement.partner?.name || partners.find((partner) => partner.id === value)?.name || 'Partner',
    },
    { key: 'title', label: 'Agreement', sortable: true },
    { key: 'startDate', label: 'Start', render: (value) => formatDate(value) },
    { key: 'endDate', label: 'End', render: (value) => formatDate(value) },
    { key: 'status', label: 'Status', render: (value) => <StatusBadge value={value || 'active'} compact /> },
  ];

  const commissionColumns = [
    { key: 'dealId', label: 'Deal reference', sortable: true },
    { key: 'amount', label: 'Amount', sortable: true, render: (value) => formatCurrency(value) },
    { key: 'status', label: 'Status', render: (value) => <StatusBadge value={value || 'pending'} compact /> },
    { key: 'createdAt', label: 'Recorded', render: (value) => formatDate(value) },
  ];

  const selectedPartner = useMemo(() => partners.find((partner) => partner.id === selectedPartnerId) || null, [partners, selectedPartnerId]);

  const primaryAction = {
    partners: {
      label: 'Add partner',
      icon: Link2,
      modal: 'partner',
    },
    agreements: {
      label: 'Create agreement',
      icon: FileText,
      modal: 'agreement',
    },
    commissions: {
      label: 'Record commission',
      icon: BadgeDollarSign,
      modal: 'commission',
    },
  }[tab];

  if (loading) {
    return (
      <div className="page-shell">
        <div className="page-header"><Skeleton type="title" style={{ width: '27%' }} /></div>
        <div className="stats-grid"><Skeleton type="stat" count={4} /></div>
        <div className="section-grid"><Skeleton type="card" style={{ height: '520px' }} /><Skeleton type="card" style={{ height: '520px' }} /></div>
      </div>
    );
  }

  const PrimaryActionIcon = primaryAction.icon;

  return (
    <div className="page-shell">
      <div className="page-header">
        <div>
          <h1>Partnership management system</h1>
          <p>Track suppliers, lenders, commission structures, and formal agreements that power the marketplace.</p>
        </div>
        <div className="pill-list">
          <span className="pill">Partner ecosystem</span>
          <span className="pill">Agreements</span>
          <span className="pill">Commission tracking</span>
        </div>
      </div>

      <div className="stats-grid">
        <MetricCard icon={HeartHandshake} label="Partners" value={partners.length} detail="Active organizations in the network" tone="accent" />
        <MetricCard icon={FileText} label="Agreements" value={agreements.length} detail="Commercial terms on record" tone="info" />
        <MetricCard icon={BadgeDollarSign} label="Focused commissions" value={commissions.length} detail="Entries for the selected partner" tone="warning" />
        <MetricCard icon={Building2} label="Institutions and suppliers" value={partners.filter((partner) => ['dealer', 'finance', 'insurance'].includes(partner.type)).length} detail="Channel partners contributing to transactions" tone="success" />
      </div>

      <div className="tabs">
        <button className={`tab ${tab === 'partners' ? 'active' : ''}`} type="button" onClick={() => setTab('partners')}>Partner registry</button>
        <button className={`tab ${tab === 'agreements' ? 'active' : ''}`} type="button" onClick={() => setTab('agreements')}>Agreement desk</button>
        <button className={`tab ${tab === 'commissions' ? 'active' : ''}`} type="button" onClick={() => setTab('commissions')}>Commission ledger</button>
      </div>

      <DataTable
        title={tab === 'partners' ? 'Partner registry' : tab === 'agreements' ? 'Agreement desk' : 'Commission ledger'}
        subtitle="Everything needed to manage the organizations participating in the marketplace."
        actions={(
          <button className="btn btn-primary" type="button" onClick={() => setActiveModal(primaryAction.modal)}>
            <PrimaryActionIcon size={16} /> {primaryAction.label}
          </button>
        )}
        columns={tab === 'partners' ? partnerColumns : tab === 'agreements' ? agreementColumns : commissionColumns}
        data={tab === 'partners' ? partners : tab === 'agreements' ? agreements : commissions}
        searchPlaceholder={tab === 'partners' ? 'Search partner, city, email, or type' : tab === 'agreements' ? 'Search agreement title, partner, or dates' : 'Search deal reference or commission status'}
      />

      <div className="section-grid">
        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title">Focused partner</div>
              <div className="card-subtitle">Operational context for the currently selected partner.</div>
            </div>
          </div>
          {selectedPartner ? (
            <div className="list-stack">
              <div className="list-row">
                <div className="list-row-head">
                  <div>
                    <div className="list-row-title">{selectedPartner.name}</div>
                    <div className="list-row-meta">{selectedPartner.type} · {selectedPartner.city}</div>
                  </div>
                  <StatusBadge value={selectedPartner.status || 'active'} compact />
                </div>
                <p>{selectedPartner.email} · {selectedPartner.phone}</p>
              </div>
              <div className="list-row">
                <div className="list-row-title">Commission picture</div>
                <p>{commissions.length ? `${commissions.length} commission entries currently linked to this partner.` : 'No commission entries have been recorded yet.'}</p>
              </div>
            </div>
          ) : (
            <div className="empty-state"><h3>No partner selected</h3><p>Select a partner from the registry to focus the commission ledger.</p></div>
          )}
        </div>

        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title">{tab === 'agreements' ? 'Agreement snapshot' : 'Network snapshot'}</div>
              <div className="card-subtitle">Quick operational visibility without exposing create forms on the page.</div>
            </div>
          </div>
          <div className="list-stack">
            {(tab === 'agreements' ? agreements : partners).slice(0, 5).map((item) => (
              <div key={item.id} className="list-row">
                <div className="list-row-head">
                  <div>
                    <div className="list-row-title">{tab === 'agreements' ? item.title : item.name}</div>
                    <div className="list-row-meta">
                      {tab === 'agreements'
                        ? `${item.partner?.name || partners.find((partner) => partner.id === item.partnerId)?.name || 'Partner'} · ${formatDate(item.startDate)}`
                        : `${item.type} · ${item.city}`}
                    </div>
                  </div>
                  <StatusBadge value={item.status || 'active'} compact />
                </div>
              </div>
            ))}
            {!(tab === 'agreements' ? agreements : partners).length ? (
              <div className="empty-state"><h3>No records yet</h3><p>Create a new record from the table action button to populate this area.</p></div>
            ) : null}
          </div>
        </div>
      </div>

      <Modal
        open={activeModal === 'partner'}
        onClose={() => setActiveModal(null)}
        title="Register a partner"
        subtitle="Partner intake now happens in a dedicated modal instead of occupying page space all day."
        size="large"
      >
        <form onSubmit={handleCreatePartner} className="list-stack">
          <div className="form-grid">
            <div className="form-group"><label>Name</label><input value={partnerForm.name} onChange={(event) => setPartnerForm({ ...partnerForm, name: event.target.value })} required /></div>
            <div className="form-group"><label>Type</label><select value={partnerForm.type} onChange={(event) => setPartnerForm({ ...partnerForm, type: event.target.value })}><option value="dealer">Dealer</option><option value="finance">Finance</option><option value="insurance">Insurance</option></select></div>
            <div className="form-group"><label>Email</label><input type="email" value={partnerForm.email} onChange={(event) => setPartnerForm({ ...partnerForm, email: event.target.value })} required /></div>
            <div className="form-group"><label>Phone</label><input value={partnerForm.phone} onChange={(event) => setPartnerForm({ ...partnerForm, phone: event.target.value })} required /></div>
            <div className="form-group"><label>City</label><input value={partnerForm.city} onChange={(event) => setPartnerForm({ ...partnerForm, city: event.target.value })} required /></div>
            <div className="form-group"><label>Commission rate</label><input type="number" step="0.1" value={partnerForm.commissionRate} onChange={(event) => setPartnerForm({ ...partnerForm, commissionRate: event.target.value })} required /></div>
          </div>
          <div className="modal-actions">
            <button className="btn btn-secondary" type="button" onClick={() => setActiveModal(null)}>Cancel</button>
            <button className="btn btn-primary" type="submit"><Link2 size={16} /> Add partner</button>
          </div>
        </form>
      </Modal>

      <Modal
        open={activeModal === 'agreement'}
        onClose={() => setActiveModal(null)}
        title="Create an agreement"
        subtitle="Agreements are now handled in a focused flow instead of sharing the main workspace with live tables."
        size="large"
      >
        <form onSubmit={handleCreateAgreement} className="list-stack">
          <div className="form-grid">
            <div className="form-group">
              <label>Partner</label>
              <select value={agreementForm.partnerId} onChange={(event) => setAgreementForm({ ...agreementForm, partnerId: event.target.value })} required>
                <option value="">Select partner</option>
                {partners.map((partner) => <option key={partner.id} value={partner.id}>{partner.name}</option>)}
              </select>
            </div>
            <div className="form-group"><label>Title</label><input value={agreementForm.title} onChange={(event) => setAgreementForm({ ...agreementForm, title: event.target.value })} required /></div>
            <div className="form-group"><label>Start date</label><input type="date" value={agreementForm.startDate} onChange={(event) => setAgreementForm({ ...agreementForm, startDate: event.target.value })} required /></div>
            <div className="form-group"><label>End date</label><input type="date" value={agreementForm.endDate} onChange={(event) => setAgreementForm({ ...agreementForm, endDate: event.target.value })} required /></div>
            <div className="form-group" style={{ gridColumn: '1 / -1' }}><label>Terms</label><textarea value={agreementForm.terms} onChange={(event) => setAgreementForm({ ...agreementForm, terms: event.target.value })} required /></div>
          </div>
          <div className="modal-actions">
            <button className="btn btn-secondary" type="button" onClick={() => setActiveModal(null)}>Cancel</button>
            <button className="btn btn-primary" type="submit"><FileText size={16} /> Save agreement</button>
          </div>
        </form>
      </Modal>

      <Modal
        open={activeModal === 'commission'}
        onClose={() => setActiveModal(null)}
        title="Record a commission"
        subtitle="Commission entry is now a modal action so the ledger remains the primary focus."
        size="large"
      >
        <form onSubmit={handleCreateCommission} className="list-stack">
          <div className="form-grid">
            <div className="form-group">
              <label>Partner</label>
              <select value={commissionForm.partnerId} onChange={(event) => setCommissionForm({ ...commissionForm, partnerId: event.target.value })} required>
                <option value="">Select partner</option>
                {partners.map((partner) => <option key={partner.id} value={partner.id}>{partner.name}</option>)}
              </select>
            </div>
            <div className="form-group"><label>Deal reference</label><input value={commissionForm.dealId} onChange={(event) => setCommissionForm({ ...commissionForm, dealId: event.target.value })} required /></div>
            <div className="form-group"><label>Amount</label><input type="number" value={commissionForm.amount} onChange={(event) => setCommissionForm({ ...commissionForm, amount: event.target.value })} required /></div>
          </div>
          <div className="modal-actions">
            <button className="btn btn-secondary" type="button" onClick={() => setActiveModal(null)}>Cancel</button>
            <button className="btn btn-primary" type="submit"><BadgeDollarSign size={16} /> Record commission</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
