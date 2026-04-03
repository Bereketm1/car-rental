import React, { useEffect, useMemo, useState } from 'react';
import {
  Activity,
  BarChart3,
  CarFront,
  HeartHandshake,
  Megaphone,
  RefreshCw,
  TrendingUp,
  UsersRound,
  WalletCards,
} from 'lucide-react';
import {
  Area, AreaChart, Bar, BarChart, CartesianGrid,
  ResponsiveContainer, Tooltip, XAxis, YAxis,
} from 'recharts';
import api from '../api';
import MetricCard from '../components/MetricCard';
import Skeleton from '../components/Skeleton';
import StatusBadge from '../components/StatusBadge';
import { formatCompactNumber, formatCurrency, formatDateTime, formatPercent, safeArray, sumBy, toTitleCase } from '../utils/format';

const moduleBlueprint = [
  { key: 'crm',       label: 'Customer CRM',    description: 'Customer intake, documents & loans', icon: UsersRound },
  { key: 'supplier',  label: 'Supplier Portal',  description: 'Vehicle inventory & supplier records', icon: CarFront },
  { key: 'finance',   label: 'Finance Portal',   description: 'Reviews, documents & approvals', icon: WalletCards },
  { key: 'deal',      label: 'Deal Flow',        description: 'Selection through completed purchase', icon: Activity },
  { key: 'partner',   label: 'Partnerships',     description: 'Agreements, commissions & partners', icon: HeartHandshake },
  { key: 'marketing', label: 'Lead Generation',  description: 'Campaigns, referrals & conversion', icon: Megaphone },
  { key: 'analytics', label: 'Reporting',        description: 'Revenue, volume & performance', icon: BarChart3 },
];

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({
    customers: [], vehicles: [], deals: [], leads: [],
    partners: [], reviews: [], trends: [], activity: [],
  });

  useEffect(() => { loadData(); }, []);

  async function loadData() {
    setLoading(true);
    try {
      const [customers, vehicles, deals, leads, partners, reviews, trends, activity] = await Promise.all([
        api.get('/customers').catch(() => []),
        api.get('/vehicles').catch(() => []),
        api.get('/deals').catch(() => []),
        api.get('/leads').catch(() => []),
        api.get('/partners').catch(() => []),
        api.get('/finance/reviews').catch(() => []),
        api.get('/analytics/trends').catch(() => []),
        api.get('/audit').catch(() => []),
      ]);
      setData({
        customers: safeArray(customers),
        vehicles: safeArray(vehicles),
        deals: safeArray(deals),
        leads: safeArray(leads),
        partners: safeArray(partners),
        reviews: safeArray(reviews),
        trends: safeArray(trends),
        activity: safeArray(activity),
      });
    } finally {
      setLoading(false);
    }
  }

  const totalRevenue = useMemo(
    () => sumBy(data.deals.filter((d) => d.stage === 'completed'), (d) => d.amount || d.totalAmount),
    [data.deals],
  );
  const openPipeline = useMemo(
    () => sumBy(data.deals.filter((d) => d.stage !== 'completed' && d.stage !== 'cancelled'), (d) => d.amount || d.totalAmount),
    [data.deals],
  );
  const approvalRate = data.reviews.length
    ? (data.reviews.filter((r) => r.status === 'approved').length / data.reviews.length) * 100
    : 0;
  const conversionRate = data.leads.length
    ? (data.leads.filter((l) => l.status === 'converted').length / data.leads.length) * 100
    : 0;
  const availableVehicles = data.vehicles.filter((v) => v.status === 'available').length;

  const stageSummary = [
    { stage: 'Selected',    count: data.deals.filter((d) => ['inquiry', 'vehicle_selected'].includes(d.stage)).length },
    { stage: 'Applied',     count: data.deals.filter((d) => ['loan_applied', 'documentation'].includes(d.stage)).length },
    { stage: 'Under Review',count: data.deals.filter((d) => ['under_review', 'financing'].includes(d.stage)).length },
    { stage: 'Approved',    count: data.deals.filter((d) => ['approved', 'approval'].includes(d.stage)).length },
    { stage: 'Completed',   count: data.deals.filter((d) => d.stage === 'completed').length },
  ];

  const attentionItems = [
    {
      label: 'Pending finance reviews',
      value: data.reviews.filter((r) => ['pending', 'under_review', 'in_review'].includes(r.status)).length,
      tone: 'warning',
      note: 'Finance teams should process these first.',
    },
    {
      label: 'Reserved vehicles',
      value: data.vehicles.filter((v) => v.status === 'reserved').length,
      tone: 'info',
      note: 'Vehicles tied to active deals.',
    },
    {
      label: 'New leads awaiting contact',
      value: data.leads.filter((l) => l.status === 'new').length,
      tone: 'danger',
      note: 'Leads waiting for first follow-up.',
    },
  ];

  const moduleCoverage = [
    { key: 'crm',       count: data.customers.length,      health: data.customers.length ? 'active' : 'pending' },
    { key: 'supplier',  count: availableVehicles,           health: availableVehicles ? 'active' : 'pending' },
    { key: 'finance',   count: data.reviews.length,         health: data.reviews.length ? 'active' : 'pending' },
    { key: 'deal',      count: data.deals.length,           health: data.deals.length ? 'active' : 'pending' },
    { key: 'partner',   count: data.partners.length,        health: data.partners.length ? 'active' : 'pending' },
    { key: 'marketing', count: data.leads.length,           health: data.leads.length ? 'active' : 'pending' },
    { key: 'analytics', count: data.trends.length,          health: data.trends.length ? 'active' : 'pending' },
  ];

  if (loading) {
    return (
      <div className="page-shell">
        <div className="page-header">
          <Skeleton style={{ width: '240px', height: '28px' }} />
        </div>
        <div className="stats-grid">
          {[1, 2, 3, 4].map((i) => <Skeleton key={i} style={{ height: '110px', borderRadius: '12px' }} />)}
        </div>
        <div className="split-layout">
          {[1, 2].map((i) => <Skeleton key={i} style={{ height: '260px', borderRadius: '12px' }} />)}
        </div>
        <div className="section-grid">
          {[1, 2].map((i) => <Skeleton key={i} style={{ height: '320px', borderRadius: '12px' }} />)}
        </div>
      </div>
    );
  }

  return (
    <div className="page-shell">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1>Operations Dashboard</h1>
          <p>Monitor customer intake, inventory, financing, deal progress, and lead generation from one workspace.</p>
        </div>
        <button className="btn btn-secondary" type="button" onClick={loadData}>
          <RefreshCw size={14} strokeWidth={2.2} /> Refresh
        </button>
      </div>

      {/* KPI cards */}
      <div className="stats-grid">
        <MetricCard
          icon={UsersRound}
          label="Customers"
          value={formatCompactNumber(data.customers.length)}
          detail="Registered records"
          tone="accent"
        />
        <MetricCard
          icon={CarFront}
          label="Available Vehicles"
          value={formatCompactNumber(availableVehicles)}
          detail={`${data.vehicles.length} total listed`}
          tone="success"
        />
        <MetricCard
          icon={WalletCards}
          label="Loan Approval Rate"
          value={formatPercent(approvalRate)}
          detail={`${data.reviews.length} finance reviews`}
          tone="warning"
        />
        <MetricCard
          icon={Megaphone}
          label="Lead Conversion"
          value={formatPercent(conversionRate)}
          detail={`${data.leads.length} captured leads`}
          tone="info"
        />
      </div>

      {/* Revenue summary + Priority items */}
      <div className="split-layout dashboard-overview">
        <div className="card dashboard-summary-card">
          <div className="card-header">
            <div>
              <div className="card-title">Revenue Summary</div>
              <div className="card-subtitle">Core commercial metrics across all transactions.</div>
            </div>
            <TrendingUp size={16} color="var(--text-muted)" strokeWidth={2} />
          </div>
          <div className="summary-kpi-grid">
            <div className="summary-kpi">
              <span className="summary-kpi-label">Closed Revenue</span>
              <strong>{formatCurrency(totalRevenue, { compact: true, maximumFractionDigits: 1 })}</strong>
              <p>Completed transactions</p>
            </div>
            <div className="summary-kpi">
              <span className="summary-kpi-label">Open Pipeline</span>
              <strong>{formatCurrency(openPipeline, { compact: true, maximumFractionDigits: 1 })}</strong>
              <p>Deals in progress</p>
            </div>
            <div className="summary-kpi">
              <span className="summary-kpi-label">Approval Rate</span>
              <strong>{formatPercent(approvalRate)}</strong>
              <p>{data.reviews.length} reviews on record</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title">Priority Items</div>
              <div className="card-subtitle">Queues that need attention to keep transactions moving.</div>
            </div>
          </div>
          <div className="list-stack">
            {attentionItems.map((item) => (
              <div key={item.label} className="list-row compact-row">
                <div className="list-row-head">
                  <div>
                    <div className="list-row-title">{item.label}</div>
                    <div className="list-row-meta">{item.note}</div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text-primary)' }}>
                      {formatCompactNumber(item.value)}
                    </span>
                    <StatusBadge value={item.tone === 'warning' ? 'pending' : item.tone === 'danger' ? 'new' : 'active'} compact />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="section-grid">
        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title">Marketplace Trend</div>
              <div className="card-subtitle">Monthly revenue and lead generation movement.</div>
            </div>
          </div>
          <div className="chart-shell">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.trends} margin={{ top: 4, right: 4, left: -16, bottom: 0 }}>
                <defs>
                  <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#1B5631" stopOpacity={0.18} />
                    <stop offset="95%" stopColor="#1B5631" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="leadsGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#C49820" stopOpacity={0.18} />
                    <stop offset="95%" stopColor="#C49820" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" vertical={false} />
                <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: 'var(--text-faint)' }} />
                <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: 'var(--text-faint)' }} />
                <Tooltip
                  contentStyle={{
                    background: 'var(--bg-surface)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '10px',
                    fontSize: '12px',
                  }}
                />
                <Area type="monotone" dataKey="revenue" stroke="#1B5631" fill="url(#revenueGrad)" strokeWidth={2} name="Revenue" />
                <Area type="monotone" dataKey="leads" stroke="#C49820" fill="url(#leadsGrad)" strokeWidth={2} name="Leads" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title">Transaction Stages</div>
              <div className="card-subtitle">Deal distribution from selection to completion.</div>
            </div>
          </div>
          <div className="chart-shell">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stageSummary} margin={{ top: 4, right: 4, left: -16, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" vertical={false} />
                <XAxis dataKey="stage" tickLine={false} axisLine={false} tick={{ fontSize: 10, fill: 'var(--text-faint)' }} />
                <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: 'var(--text-faint)' }} allowDecimals={false} />
                <Tooltip
                  formatter={(v) => [v, 'Deals']}
                  contentStyle={{
                    background: 'var(--bg-surface)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '10px',
                    fontSize: '12px',
                  }}
                />
                <Bar dataKey="count" fill="#1B5631" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Module coverage + Activity */}
      <div className="section-grid">
        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title">Module Coverage</div>
              <div className="card-subtitle">All 7 business functions are live and connected.</div>
            </div>
          </div>
          <div className="list-stack">
            {moduleBlueprint.map((module) => {
              const coverage = moduleCoverage.find((c) => c.key === module.key);
              const Icon = module.icon;
              return (
                <div key={module.key} className="list-row compact-row">
                  <div className="list-row-head">
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                      <div className="metric-icon-wrap tone-accent" style={{ width: '30px', height: '30px' }}>
                        <Icon size={14} strokeWidth={2.2} />
                      </div>
                      <div>
                        <div className="list-row-title">{module.label}</div>
                        <div className="list-row-meta">{module.description}</div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-muted)' }}>
                        {formatCompactNumber(coverage?.count || 0)}
                      </span>
                      <StatusBadge value={coverage?.health || 'pending'} compact />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title">Recent Activity</div>
              <div className="card-subtitle">Latest operational events from the audit trail.</div>
            </div>
          </div>
          <div className="timeline">
            {data.activity.length ? (
              data.activity.slice(0, 6).map((log) => (
                <div key={log.id} className="timeline-item">
                  <div className="timeline-marker"><span /></div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div className="timeline-item-head">
                      <div className="list-row-title" style={{ fontSize: '13px' }}>
                        {toTitleCase(log.resource)} · {log.action}
                      </div>
                    </div>
                    <div className="timeline-copy">{formatDateTime(log.timestamp)}</div>
                  </div>
                </div>
              ))
            ) : (
              <div className="empty-state" style={{ minHeight: '200px' }}>
                <h3>No activity yet</h3>
                <p>Events will appear here as operators use the platform.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Recent deals + Lead queue */}
      <div className="section-grid">
        <div className="table-shell">
          <div className="card-header table-shell-header">
            <div>
              <div className="card-title">Recent Deals</div>
              <div className="card-subtitle">Latest transactions across the sales workflow.</div>
            </div>
          </div>
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Customer</th>
                  <th>Vehicle</th>
                  <th>Amount</th>
                  <th>Stage</th>
                </tr>
              </thead>
              <tbody>
                {data.deals.slice(0, 6).map((deal) => (
                  <tr key={deal.id}>
                    <td style={{ fontWeight: 500, color: 'var(--text-primary)' }}>{deal.customerName || '—'}</td>
                    <td>{deal.vehicleDescription || '—'}</td>
                    <td style={{ fontWeight: 600 }}>{formatCurrency(deal.amount || deal.totalAmount)}</td>
                    <td><StatusBadge value={deal.stage} compact /></td>
                  </tr>
                ))}
                {!data.deals.length && (
                  <tr>
                    <td colSpan={4}>
                      <div className="empty-state" style={{ minHeight: '160px' }}>
                        <h3>No deals yet</h3>
                        <p>Start by creating a customer and selecting a vehicle.</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title">Lead Queue</div>
              <div className="card-subtitle">Latest captured leads and buyer intent signals.</div>
            </div>
          </div>
          <div className="list-stack">
            {data.leads.slice(0, 6).map((lead) => (
              <div key={lead.id} className="list-row compact-row">
                <div className="list-row-head">
                  <div>
                    <div className="list-row-title">{lead.name || `${lead.firstName || ''} ${lead.lastName || ''}`.trim() || 'Unknown'}</div>
                    <div className="list-row-meta">
                      {lead.source} · {lead.vehicleInterest || 'No vehicle specified'}
                    </div>
                  </div>
                  <StatusBadge value={lead.status} compact />
                </div>
                <div className="list-row-meta">{lead.email || lead.phone}</div>
              </div>
            ))}
            {!data.leads.length && (
              <div className="empty-state" style={{ minHeight: '160px' }}>
                <h3>No leads yet</h3>
                <p>Capture leads from marketing campaigns and referrals.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
