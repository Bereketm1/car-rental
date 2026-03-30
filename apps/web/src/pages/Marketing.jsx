import React, { useEffect, useState } from 'react';
import { BadgeDollarSign, Megaphone, Share2, TrendingUp, UserPlus, UsersRound } from 'lucide-react';
import api from '../api';
import DataTable from '../components/DataTable';
import MetricCard from '../components/MetricCard';
import Modal from '../components/Modal';
import Skeleton from '../components/Skeleton';
import StatusBadge from '../components/StatusBadge';
import { useToast } from '../components/Toast';
import { formatCurrency, formatPercent, safeArray } from '../utils/format';

const emptyLeadForm = {
  name: '',
  email: '',
  phone: '',
  source: 'website',
  vehicleInterest: '',
  notes: '',
};

const emptyCampaignForm = {
  name: '',
  type: 'digital',
  budget: '',
  startDate: '',
  endDate: '',
  description: '',
};

const emptyReferralForm = {
  referrerName: '',
  referrerEmail: '',
  referredName: '',
  referredEmail: '',
  reward: '',
};

export default function Marketing() {
  const toast = useToast();
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('leads');
  const [leads, setLeads] = useState([]);
  const [campaigns, setCampaigns] = useState([]);
  const [referrals, setReferrals] = useState([]);
  const [leadForm, setLeadForm] = useState(emptyLeadForm);
  const [campaignForm, setCampaignForm] = useState(emptyCampaignForm);
  const [referralForm, setReferralForm] = useState(emptyReferralForm);
  const [activeModal, setActiveModal] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    try {
      const [leadResponse, campaignResponse, referralResponse] = await Promise.all([
        api.get('/leads').catch(() => []),
        api.get('/leads/campaigns/all').catch(() => []),
        api.get('/leads/referrals/all').catch(() => []),
      ]);
      setLeads(safeArray(leadResponse));
      setCampaigns(safeArray(campaignResponse));
      setReferrals(safeArray(referralResponse));
    } finally {
      setLoading(false);
    }
  }

  async function handleCreateLead(event) {
    event.preventDefault();
    try {
      await api.post('/leads', leadForm);
      toast.success('Lead captured');
      setLeadForm(emptyLeadForm);
      setActiveModal(null);
      await loadData();
    } catch (error) {
      toast.error(error.message || 'Failed to capture lead');
    }
  }

  async function handleCreateCampaign(event) {
    event.preventDefault();
    try {
      await api.post('/leads/campaigns', { ...campaignForm, budget: Number(campaignForm.budget) });
      toast.success('Campaign created');
      setCampaignForm(emptyCampaignForm);
      setActiveModal(null);
      await loadData();
    } catch (error) {
      toast.error(error.message || 'Failed to create campaign');
    }
  }

  async function handleCreateReferral(event) {
    event.preventDefault();
    try {
      await api.post('/leads/referrals', { ...referralForm, reward: Number(referralForm.reward || 0) });
      toast.success('Referral program entry created');
      setReferralForm(emptyReferralForm);
      setActiveModal(null);
      await loadData();
    } catch (error) {
      toast.error(error.message || 'Failed to create referral');
    }
  }

  async function updateLeadStatus(lead, status) {
    try {
      await api.put(`/leads/${lead.id}`, { status });
      toast.success(`Lead moved to ${status}`);
      await loadData();
    } catch (error) {
      toast.error(error.message || 'Failed to update lead');
    }
  }

  async function deleteLead(id) {
    if (!confirm('Delete this lead?')) return;
    try {
      await api.delete(`/leads/${id}`);
      toast.success('Lead deleted');
      await loadData();
    } catch (error) {
      toast.error(error.message || 'Failed to delete lead');
    }
  }

  const conversionRate = leads.length ? (leads.filter((lead) => lead.status === 'converted').length / leads.length) * 100 : 0;
  const totalBudget = campaigns.reduce((sum, campaign) => sum + (Number(campaign.budget) || 0), 0);

  const leadColumns = [
    { key: 'name', label: 'Lead', sortable: true },
    { key: 'source', label: 'Source', sortable: true },
    { key: 'vehicleInterest', label: 'Vehicle interest' },
    { key: 'status', label: 'Status', render: (value) => <StatusBadge value={value || 'new'} compact /> },
    {
      key: 'actions',
      label: 'Actions',
      render: (_, lead) => (
        <div className="toolbar-cluster">
          <button className="btn btn-secondary btn-sm" type="button" onClick={() => updateLeadStatus(lead, 'contacted')}>Contacted</button>
          <button className="btn btn-secondary btn-sm" type="button" onClick={() => updateLeadStatus(lead, 'qualified')}>Qualified</button>
          <button className="btn btn-secondary btn-sm" type="button" onClick={() => updateLeadStatus(lead, 'converted')}>Converted</button>
          <button className="btn btn-danger btn-sm" type="button" onClick={() => deleteLead(lead.id)}>Delete</button>
        </div>
      ),
    },
  ];

  const campaignColumns = [
    { key: 'name', label: 'Campaign', sortable: true },
    { key: 'type', label: 'Type', sortable: true },
    { key: 'budget', label: 'Budget', render: (value) => formatCurrency(value) },
    { key: 'leadsGenerated', label: 'Leads', render: (value) => value || 0 },
    { key: 'conversions', label: 'Conversions', render: (value) => value || 0 },
    { key: 'status', label: 'Status', render: (value) => <StatusBadge value={value || 'draft'} compact /> },
  ];

  const referralColumns = [
    { key: 'referrerName', label: 'Referrer', sortable: true },
    { key: 'referredName', label: 'Referred lead', sortable: true },
    { key: 'reward', label: 'Reward', render: (value) => formatCurrency(value || 0) },
    { key: 'status', label: 'Status', render: (value) => <StatusBadge value={value || 'pending'} compact /> },
    { key: 'rewardStatus', label: 'Reward status', render: (value) => <StatusBadge value={value || 'pending'} compact /> },
  ];

  const primaryAction = {
    leads: {
      label: 'Capture lead',
      icon: UserPlus,
      modal: 'lead',
    },
    campaigns: {
      label: 'Create campaign',
      icon: Megaphone,
      modal: 'campaign',
    },
    referrals: {
      label: 'Create referral',
      icon: Share2,
      modal: 'referral',
    },
  }[tab];

  if (loading) {
    return (
      <div className="page-shell">
        <div className="page-header"><Skeleton type="title" style={{ width: '30%' }} /></div>
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
          <h1>Lead generation and marketing system</h1>
          <p>Capture demand, manage campaigns, and run referrals that feed the rest of the vehicle financing marketplace.</p>
        </div>
        <div className="pill-list">
          <span className="pill">Lead capture</span>
          <span className="pill">Campaign tracking</span>
          <span className="pill">Referral programs</span>
        </div>
      </div>

      <div className="stats-grid">
        <MetricCard icon={UsersRound} label="Leads" value={leads.length} detail="Current lead volume" tone="accent" />
        <MetricCard icon={TrendingUp} label="Conversion rate" value={formatPercent(conversionRate)} detail="Lead to customer progression" tone="success" />
        <MetricCard icon={Megaphone} label="Campaigns" value={campaigns.length} detail="Tracked acquisition initiatives" tone="info" />
        <MetricCard icon={BadgeDollarSign} label="Budget" value={formatCurrency(totalBudget, { compact: true, maximumFractionDigits: 1 })} detail="Allocated campaign spend" tone="warning" />
      </div>

      <div className="tabs">
        <button className={`tab ${tab === 'leads' ? 'active' : ''}`} type="button" onClick={() => setTab('leads')}>Lead pipeline</button>
        <button className={`tab ${tab === 'campaigns' ? 'active' : ''}`} type="button" onClick={() => setTab('campaigns')}>Campaign tracker</button>
        <button className={`tab ${tab === 'referrals' ? 'active' : ''}`} type="button" onClick={() => setTab('referrals')}>Referral program</button>
      </div>

      <DataTable
        title={tab === 'leads' ? 'Lead pipeline' : tab === 'campaigns' ? 'Campaign tracker' : 'Referral program'}
        subtitle="Keep marketing operations integrated with the rest of the platform."
        actions={(
          <button className="btn btn-primary" type="button" onClick={() => setActiveModal(primaryAction.modal)}>
            <PrimaryActionIcon size={16} /> {primaryAction.label}
          </button>
        )}
        columns={tab === 'leads' ? leadColumns : tab === 'campaigns' ? campaignColumns : referralColumns}
        data={tab === 'leads' ? leads : tab === 'campaigns' ? campaigns : referrals}
        searchPlaceholder={tab === 'leads' ? 'Search lead name, source, interest, or status' : tab === 'campaigns' ? 'Search campaigns by name, type, or status' : 'Search referrals by referrer or referred lead'}
      />

      <div className="section-grid">
        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title">Pipeline visibility</div>
              <div className="card-subtitle">A compact picture of where buyer demand is sitting right now.</div>
            </div>
          </div>
          <div className="list-stack">
            {[
              { label: 'New leads', value: leads.filter((lead) => lead.status === 'new').length, status: 'new' },
              { label: 'Contacted leads', value: leads.filter((lead) => lead.status === 'contacted').length, status: 'contacted' },
              { label: 'Qualified leads', value: leads.filter((lead) => lead.status === 'qualified').length, status: 'qualified' },
              { label: 'Converted leads', value: leads.filter((lead) => lead.status === 'converted').length, status: 'converted' },
            ].map((item) => (
              <div key={item.label} className="list-row">
                <div className="list-row-head">
                  <div className="list-row-title">{item.label}</div>
                  <StatusBadge value={item.status} compact />
                </div>
                <div className="list-row-meta">{item.value} records currently in this status.</div>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title">{tab === 'campaigns' ? 'Campaign spotlight' : tab === 'referrals' ? 'Referral spotlight' : 'Recent marketing activity'}</div>
              <div className="card-subtitle">Short operational summaries instead of another exposed input panel.</div>
            </div>
          </div>
          <div className="list-stack">
            {(tab === 'campaigns' ? campaigns : tab === 'referrals' ? referrals : leads).slice(0, 5).map((item) => (
              <div key={item.id} className="list-row">
                <div className="list-row-head">
                  <div>
                    <div className="list-row-title">
                      {tab === 'campaigns' ? item.name : tab === 'referrals' ? `${item.referrerName} → ${item.referredName}` : item.name}
                    </div>
                    <div className="list-row-meta">
                      {tab === 'campaigns'
                        ? `${item.type} · ${formatCurrency(item.budget || 0)}`
                        : tab === 'referrals'
                          ? `${item.referrerEmail} · reward ${formatCurrency(item.reward || 0)}`
                          : `${item.source} · ${item.vehicleInterest || 'Interest not captured'}`}
                    </div>
                  </div>
                  <StatusBadge value={item.status || (tab === 'campaigns' ? 'draft' : tab === 'referrals' ? 'pending' : 'new')} compact />
                </div>
              </div>
            ))}
            {!(tab === 'campaigns' ? campaigns : tab === 'referrals' ? referrals : leads).length ? (
              <div className="empty-state"><h3>No records yet</h3><p>Create a record from the table action button to populate this module.</p></div>
            ) : null}
          </div>
        </div>
      </div>

      <Modal
        open={activeModal === 'lead'}
        onClose={() => setActiveModal(null)}
        title="Capture a lead"
        subtitle="Lead intake is now a focused modal instead of a permanently exposed side form."
        size="large"
      >
        <form onSubmit={handleCreateLead} className="list-stack">
          <div className="form-grid">
            <div className="form-group"><label>Name</label><input value={leadForm.name} onChange={(event) => setLeadForm({ ...leadForm, name: event.target.value })} required /></div>
            <div className="form-group"><label>Email</label><input type="email" value={leadForm.email} onChange={(event) => setLeadForm({ ...leadForm, email: event.target.value })} required /></div>
            <div className="form-group"><label>Phone</label><input value={leadForm.phone} onChange={(event) => setLeadForm({ ...leadForm, phone: event.target.value })} required /></div>
            <div className="form-group"><label>Source</label><select value={leadForm.source} onChange={(event) => setLeadForm({ ...leadForm, source: event.target.value })}><option value="website">Website</option><option value="referral">Referral</option><option value="social">Social media</option><option value="campaign">Campaign</option></select></div>
            <div className="form-group"><label>Vehicle interest</label><input value={leadForm.vehicleInterest} onChange={(event) => setLeadForm({ ...leadForm, vehicleInterest: event.target.value })} /></div>
            <div className="form-group"><label>Notes</label><input value={leadForm.notes} onChange={(event) => setLeadForm({ ...leadForm, notes: event.target.value })} /></div>
          </div>
          <div className="modal-actions">
            <button className="btn btn-secondary" type="button" onClick={() => setActiveModal(null)}>Cancel</button>
            <button className="btn btn-primary" type="submit"><UserPlus size={16} /> Capture lead</button>
          </div>
        </form>
      </Modal>

      <Modal
        open={activeModal === 'campaign'}
        onClose={() => setActiveModal(null)}
        title="Create a campaign"
        subtitle="Campaign planning lives in a modal so the tracker stays focused on performance data."
        size="large"
      >
        <form onSubmit={handleCreateCampaign} className="list-stack">
          <div className="form-grid">
            <div className="form-group"><label>Name</label><input value={campaignForm.name} onChange={(event) => setCampaignForm({ ...campaignForm, name: event.target.value })} required /></div>
            <div className="form-group"><label>Type</label><select value={campaignForm.type} onChange={(event) => setCampaignForm({ ...campaignForm, type: event.target.value })}><option value="digital">Digital</option><option value="seasonal">Seasonal</option><option value="referral">Referral</option><option value="event">Event</option></select></div>
            <div className="form-group"><label>Budget</label><input type="number" value={campaignForm.budget} onChange={(event) => setCampaignForm({ ...campaignForm, budget: event.target.value })} required /></div>
            <div className="form-group"><label>Start date</label><input type="date" value={campaignForm.startDate} onChange={(event) => setCampaignForm({ ...campaignForm, startDate: event.target.value })} /></div>
            <div className="form-group"><label>End date</label><input type="date" value={campaignForm.endDate} onChange={(event) => setCampaignForm({ ...campaignForm, endDate: event.target.value })} /></div>
            <div className="form-group" style={{ gridColumn: '1 / -1' }}><label>Description</label><textarea value={campaignForm.description} onChange={(event) => setCampaignForm({ ...campaignForm, description: event.target.value })} /></div>
          </div>
          <div className="modal-actions">
            <button className="btn btn-secondary" type="button" onClick={() => setActiveModal(null)}>Cancel</button>
            <button className="btn btn-primary" type="submit"><Megaphone size={16} /> Create campaign</button>
          </div>
        </form>
      </Modal>

      <Modal
        open={activeModal === 'referral'}
        onClose={() => setActiveModal(null)}
        title="Create a referral record"
        subtitle="Referral intake is moved off the main page so the program ledger remains the primary surface."
        size="large"
      >
        <form onSubmit={handleCreateReferral} className="list-stack">
          <div className="form-grid">
            <div className="form-group"><label>Referrer name</label><input value={referralForm.referrerName} onChange={(event) => setReferralForm({ ...referralForm, referrerName: event.target.value })} required /></div>
            <div className="form-group"><label>Referrer email</label><input type="email" value={referralForm.referrerEmail} onChange={(event) => setReferralForm({ ...referralForm, referrerEmail: event.target.value })} required /></div>
            <div className="form-group"><label>Referred name</label><input value={referralForm.referredName} onChange={(event) => setReferralForm({ ...referralForm, referredName: event.target.value })} required /></div>
            <div className="form-group"><label>Referred email</label><input type="email" value={referralForm.referredEmail} onChange={(event) => setReferralForm({ ...referralForm, referredEmail: event.target.value })} required /></div>
            <div className="form-group"><label>Reward</label><input type="number" value={referralForm.reward} onChange={(event) => setReferralForm({ ...referralForm, reward: event.target.value })} /></div>
          </div>
          <div className="modal-actions">
            <button className="btn btn-secondary" type="button" onClick={() => setActiveModal(null)}>Cancel</button>
            <button className="btn btn-primary" type="submit"><Share2 size={16} /> Create referral</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
