import React, { useEffect, useMemo, useState } from 'react';
import { Button } from '@mui/material';
import { BadgeDollarSign, Building2, Coins, FileText, HeartHandshake, PlusCircle } from 'lucide-react';
import api from '../api';
import DataTable from '../components/DataTable';
import MetricCard from '../components/MetricCard';
import Modal from '../components/Modal';
import ConfirmModal from '../components/ConfirmModal';
import StatusBadge from '../components/StatusBadge';
import { useToast } from '../components/Toast';
import { formatCurrency, formatDate, safeArray } from '../utils/format';

const emptyPartnerForm = {
  name: '',
  type: 'supplier',
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
  const [activeModal, setActiveModal] = useState(null);
  const [selectedPartnerId, setSelectedPartnerId] = useState('');
  const [partnerToDelete, setPartnerToDelete] = useState(null);

  const [partners, setPartners] = useState([]);
  const [agreements, setAgreements] = useState([]);
  const [commissions, setCommissions] = useState([]);

  const [partnerForm, setPartnerForm] = useState(emptyPartnerForm);
  const [agreementForm, setAgreementForm] = useState(emptyAgreementForm);
  const [commissionForm, setCommissionForm] = useState(emptyCommissionForm);

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
      const [partnerRes, agreementRes] = await Promise.all([
        api.get('/partners').catch(() => []),
        api.get('/partners/agreements/all').catch(() => []),
      ]);

      const partnerRows = safeArray(partnerRes);
      setPartners(partnerRows);
      setAgreements(safeArray(agreementRes));

      const initial = selectedPartnerId || partnerRows[0]?.id || '';
      setSelectedPartnerId(initial);
      if (initial) {
        await loadCommissions(initial);
      } else {
        setCommissions([]);
      }
    } finally {
      setLoading(false);
    }
  }

  async function loadCommissions(partnerId) {
    const data = await api.get(`/partners/${partnerId}/commissions`).catch(() => []);
    setCommissions(safeArray(data));
  }

  async function createPartner(event) {
    event.preventDefault();
    try {
      await api.post('/partners', { ...partnerForm, commissionRate: Number(partnerForm.commissionRate) });
      toast.success('Partner registered');
      setPartnerForm(emptyPartnerForm);
      setActiveModal(null);
      await loadData();
    } catch (error) {
      toast.error(error.message || 'Unable to create partner.');
    }
  }

  async function createAgreement(event) {
    event.preventDefault();
    try {
      await api.post('/partners/agreements', agreementForm);
      toast.success('Partnership agreement created');
      setAgreementForm(emptyAgreementForm);
      setActiveModal(null);
      await loadData();
    } catch (error) {
      toast.error(error.message || 'Unable to create agreement.');
    }
  }

  async function createCommission(event) {
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
      toast.error(error.message || 'Unable to record commission.');
    }
  }

  async function confirmDeletePartner() {
    if (!partnerToDelete) return;
    try {
      await api.delete(`/partners/${partnerToDelete.id}`);
      toast.success('Partner removed');
      if (selectedPartnerId === partnerToDelete.id) {
        setSelectedPartnerId('');
      }
      setPartnerToDelete(null);
      await loadData();
    } catch (error) {
      toast.error(error.message || 'Unable to remove partner.');
    }
  }

  const partnerMap = useMemo(() => Object.fromEntries(partners.map((partner) => [partner.id, partner])), [partners]);
  const selectedPartner = partnerMap[selectedPartnerId] || null;

  const partnerColumns = [
    { key: 'name', label: 'Partner', sortable: true },
    { key: 'type', label: 'Type', sortable: true, render: (value) => <StatusBadge value={value || 'supplier'} compact /> },
    { key: 'city', label: 'City', sortable: true, render: (value) => value || 'Not set' },
    { key: 'email', label: 'Email', render: (value) => value || 'Not set' },
    { key: 'commissionRate', label: 'Commission', sortable: true, render: (value) => `${value || 0}%` },
    { key: 'status', label: 'Status', sortable: true, render: (value) => <StatusBadge value={value || 'active'} compact /> },
    {
      key: 'actions',
      label: 'Actions',
      render: (_, partner) => (
        <div className="toolbar-cluster wrap">
          <button className="btn btn-sm btn-outline-primary" type="button" onClick={() => setSelectedPartnerId(partner.id)}>Focus</button>
          <button className="btn btn-sm btn-outline-danger" type="button" onClick={() => setPartnerToDelete(partner)}>Remove</button>
        </div>
      ),
    },
  ];

  const agreementColumns = [
    { key: 'partnerId', label: 'Partner', sortable: true, render: (value, agreement) => agreement.partner?.name || partnerMap[value]?.name || 'Partner' },
    { key: 'title', label: 'Agreement title', sortable: true },
    { key: 'startDate', label: 'Start date', sortable: true, render: (value) => formatDate(value) },
    { key: 'endDate', label: 'End date', sortable: true, render: (value) => formatDate(value) },
    { key: 'status', label: 'Status', sortable: true, render: (value) => <StatusBadge value={value || 'active'} compact /> },
  ];

  const commissionColumns = [
    { key: 'dealId', label: 'Deal reference', sortable: true },
    { key: 'amount', label: 'Amount', sortable: true, render: (value) => formatCurrency(value || 0) },
    { key: 'status', label: 'Status', sortable: true, render: (value) => <StatusBadge value={value || 'pending'} compact /> },
    { key: 'createdAt', label: 'Recorded', sortable: true, render: (value) => formatDate(value) },
  ];

  if (loading) {
    return <div className="page-shell"><div className="empty-state"><h3>Loading partnership module...</h3></div></div>;
  }

  return (
    <div className="page-shell">
      <div className="page-header row-between">
        <div>
          <h1>Partnership management system</h1>
          <p>Track suppliers, financial institutions, commission flows, and formal agreements that power marketplace growth.</p>
        </div>
        <div className="toolbar-cluster wrap">
          <Button variant="outlined" size="small" startIcon={<FileText size={16} />} onClick={() => setActiveModal('agreement')}>Create agreement</Button>
          <Button variant="outlined" size="small" startIcon={<BadgeDollarSign size={16} />} onClick={() => setActiveModal('commission')}>Record commission</Button>
          <Button variant="contained" size="small" startIcon={<PlusCircle size={16} />} onClick={() => setActiveModal('partner')}>Add partner</Button>
        </div>
      </div>

      <div className="stats-grid">
        <MetricCard icon={HeartHandshake} label="Partners" value={partners.length} detail="Organizations onboarded" tone="accent" />
        <MetricCard icon={FileText} label="Agreements" value={agreements.length} detail="Active and historical contracts" tone="info" />
        <MetricCard icon={Coins} label="Commissions" value={commissions.length} detail="Entries for focused partner" tone="warning" />
        <MetricCard icon={Building2} label="Financial institutions" value={partners.filter((partner) => normalizeType(partner.type) === 'financial_institution').length} detail="Partnerized lenders" tone="success" />
      </div>

      <div className="tabs">
        <button className={`tab ${tab === 'partners' ? 'active' : ''}`} type="button" onClick={() => setTab('partners')}>Partner registry</button>
        <button className={`tab ${tab === 'agreements' ? 'active' : ''}`} type="button" onClick={() => setTab('agreements')}>Agreements</button>
        <button className={`tab ${tab === 'commissions' ? 'active' : ''}`} type="button" onClick={() => setTab('commissions')}>Commissions</button>
      </div>

      <DataTable
        title={tab === 'partners' ? 'Partner registry' : tab === 'agreements' ? 'Partnership agreements' : 'Commission ledger'}
        subtitle="Filterable, sortable operational records for ecosystem management."
        columns={tab === 'partners' ? partnerColumns : tab === 'agreements' ? agreementColumns : commissionColumns}
        data={tab === 'partners' ? partners : tab === 'agreements' ? agreements : commissions}
        filters={
          tab === 'partners'
            ? [{ key: 'type', label: 'Partner type', options: [{ label: 'Supplier', value: 'supplier' }, { label: 'Financial institution', value: 'financial_institution' }, { label: 'Service provider', value: 'service_provider' }] }]
            : tab === 'agreements'
              ? [{ key: 'status', label: 'Agreement status', options: [{ label: 'Active', value: 'active' }, { label: 'Inactive', value: 'inactive' }] }]
              : [{ key: 'status', label: 'Commission status', options: [{ label: 'Pending', value: 'pending' }, { label: 'Approved', value: 'approved' }, { label: 'Paid', value: 'paid' }] }]
        }
        searchPlaceholder={tab === 'partners' ? 'Search by partner name, city, email, or type' : tab === 'agreements' ? 'Search title, terms, date, or partner' : 'Search deal reference, amount, or status'}
      />

      <div className="section-grid two-up">
        <div className="card">
          <div className="card-header compact">
            <div>
              <div className="card-title">Focused partner context</div>
              <div className="card-subtitle">Selected partner details for commission and agreement activity.</div>
            </div>
          </div>
          {selectedPartner ? (
            <div className="list-stack">
              <div className="list-row">
                <div className="list-row-head">
                  <div>
                    <div className="list-row-title">{selectedPartner.name}</div>
                    <div className="list-row-meta">{selectedPartner.email || 'No email'} • {selectedPartner.phone || 'No phone'}</div>
                  </div>
                  <StatusBadge value={selectedPartner.status || 'active'} compact />
                </div>
                <div className="list-row-meta">Type: {selectedPartner.type || 'not set'} • City: {selectedPartner.city || 'n/a'} • Commission rate: {selectedPartner.commissionRate || 0}%</div>
              </div>
              <div className="list-row">
                <div className="list-row-title">Commission records</div>
                <p>{commissions.length ? `${commissions.length} entries loaded for this partner.` : 'No commission entries recorded yet.'}</p>
              </div>
            </div>
          ) : <div className="empty-state compact"><h3>No partner selected</h3><p>Select a partner from the table to see focused context.</p></div>}
        </div>

        <div className="card">
          <div className="card-header compact">
            <div>
              <div className="card-title">Latest agreements</div>
              <div className="card-subtitle">Most recent contracts across all partner types.</div>
            </div>
          </div>
          <div className="list-stack">
            {agreements.slice(0, 6).map((agreement) => (
              <div key={agreement.id} className="list-row">
                <div className="list-row-head">
                  <div>
                    <div className="list-row-title">{agreement.title}</div>
                    <div className="list-row-meta">{agreement.partner?.name || partnerMap[agreement.partnerId]?.name || 'Partner'} • {formatDate(agreement.startDate)} to {formatDate(agreement.endDate)}</div>
                  </div>
                  <StatusBadge value={agreement.status || 'active'} compact />
                </div>
              </div>
            ))}
            {!agreements.length ? <div className="empty-state compact"><h3>No agreements yet</h3><p>Create an agreement to formalize partnership terms.</p></div> : null}
          </div>
        </div>
      </div>

      <Modal open={activeModal === 'partner'} onClose={() => setActiveModal(null)} title="Add partner" subtitle="Register an organization that participates in supply, finance, or service delivery." size="large">
        <form className="form-grid" onSubmit={createPartner}>
          <div className="form-group"><label>Name</label><input value={partnerForm.name} onChange={(event) => setPartnerForm({ ...partnerForm, name: event.target.value })} required /></div>
          <div className="form-group"><label>Type</label><select value={partnerForm.type} onChange={(event) => setPartnerForm({ ...partnerForm, type: event.target.value })}><option value="supplier">Supplier</option><option value="financial_institution">Financial institution</option><option value="service_provider">Service provider</option></select></div>
          <div className="form-group"><label>Email</label><input type="email" value={partnerForm.email} onChange={(event) => setPartnerForm({ ...partnerForm, email: event.target.value })} /></div>
          <div className="form-group"><label>Phone</label><input value={partnerForm.phone} onChange={(event) => setPartnerForm({ ...partnerForm, phone: event.target.value })} /></div>
          <div className="form-group"><label>City</label><input value={partnerForm.city} onChange={(event) => setPartnerForm({ ...partnerForm, city: event.target.value })} /></div>
          <div className="form-group"><label>Commission rate (%)</label><input type="number" step="0.1" value={partnerForm.commissionRate} onChange={(event) => setPartnerForm({ ...partnerForm, commissionRate: event.target.value })} /></div>
          <div className="modal-actions" style={{ gridColumn: '1 / -1' }}>
            <button className="btn btn-secondary" type="button" onClick={() => setActiveModal(null)}>Cancel</button>
            <button className="btn btn-primary" type="submit"><PlusCircle size={15} /> Add partner</button>
          </div>
        </form>
      </Modal>

      <Modal open={activeModal === 'agreement'} onClose={() => setActiveModal(null)} title="Create agreement" subtitle="Formalize commercial terms and active period with a partner." size="large">
        <form className="form-grid" onSubmit={createAgreement}>
          <div className="form-group"><label>Partner</label><select value={agreementForm.partnerId} onChange={(event) => setAgreementForm({ ...agreementForm, partnerId: event.target.value })} required><option value="">Select partner</option>{partners.map((partner) => <option key={partner.id} value={partner.id}>{partner.name}</option>)}</select></div>
          <div className="form-group"><label>Title</label><input value={agreementForm.title} onChange={(event) => setAgreementForm({ ...agreementForm, title: event.target.value })} required /></div>
          <div className="form-group"><label>Start date</label><input type="date" value={agreementForm.startDate} onChange={(event) => setAgreementForm({ ...agreementForm, startDate: event.target.value })} required /></div>
          <div className="form-group"><label>End date</label><input type="date" value={agreementForm.endDate} onChange={(event) => setAgreementForm({ ...agreementForm, endDate: event.target.value })} required /></div>
          <div className="form-group" style={{ gridColumn: '1 / -1' }}><label>Terms</label><textarea value={agreementForm.terms} onChange={(event) => setAgreementForm({ ...agreementForm, terms: event.target.value })} required /></div>
          <div className="modal-actions" style={{ gridColumn: '1 / -1' }}>
            <button className="btn btn-secondary" type="button" onClick={() => setActiveModal(null)}>Cancel</button>
            <button className="btn btn-primary" type="submit"><FileText size={15} /> Create agreement</button>
          </div>
        </form>
      </Modal>

      <Modal open={activeModal === 'commission'} onClose={() => setActiveModal(null)} title="Record commission" subtitle="Capture commission due for a transaction and partner." size="large">
        <form className="form-grid" onSubmit={createCommission}>
          <div className="form-group"><label>Partner</label><select value={commissionForm.partnerId} onChange={(event) => setCommissionForm({ ...commissionForm, partnerId: event.target.value })} required><option value="">Select partner</option>{partners.map((partner) => <option key={partner.id} value={partner.id}>{partner.name}</option>)}</select></div>
          <div className="form-group"><label>Deal reference</label><input value={commissionForm.dealId} onChange={(event) => setCommissionForm({ ...commissionForm, dealId: event.target.value })} required /></div>
          <div className="form-group"><label>Commission amount</label><input type="number" value={commissionForm.amount} onChange={(event) => setCommissionForm({ ...commissionForm, amount: event.target.value })} required /></div>
          <div className="modal-actions" style={{ gridColumn: '1 / -1' }}>
            <button className="btn btn-secondary" type="button" onClick={() => setActiveModal(null)}>Cancel</button>
            <button className="btn btn-primary" type="submit"><BadgeDollarSign size={15} /> Record commission</button>
          </div>
        </form>
      </Modal>

      <ConfirmModal
        open={!!partnerToDelete}
        onClose={() => setPartnerToDelete(null)}
        onConfirm={confirmDeletePartner}
        title="Remove Partner"
        message={`Are you sure you want to remove ${partnerToDelete?.name}? This action will permanently sever the active relationship and may affect historical commission reports.`}
        confirmText="Remove Partner"
        isDestructive={true}
      />
    </div>
  );
}

function normalizeType(type) {
  return String(type || '').toLowerCase().replace(/\s+/g, '_');
}
