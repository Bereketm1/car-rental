import React, { useEffect, useMemo, useState } from 'react';
import {
  Activity,
  CarFront,
  BarChart3,
  HeartHandshake,
  Megaphone,
  UsersRound,
  WalletCards,
} from 'lucide-react';
import { Area, AreaChart, Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import api from '../api';
import MetricCard from '../components/MetricCard';
import Skeleton from '../components/Skeleton';
import StatusBadge from '../components/StatusBadge';
import { formatCompactNumber, formatCurrency, formatDateTime, formatPercent, safeArray, sumBy, toTitleCase } from '../utils/format';

const moduleBlueprint = [
  { key: 'crm', label: 'CRM', description: 'Customer intake, documents, and loan files', icon: UsersRound },
  { key: 'supplier', label: 'Supplier portal', description: 'Vehicle intake and supplier inventory', icon: CarFront },
  { key: 'finance', label: 'Finance portal', description: 'Reviews, requested documents, and approvals', icon: WalletCards },
  { key: 'deal', label: 'Deal flow', description: 'Progress from selection to completed purchase', icon: Activity },
  { key: 'partner', label: 'Partnerships', description: 'Agreements, commissions, and partner records', icon: HeartHandshake },
  { key: 'marketing', label: 'Lead generation', description: 'Campaigns, referrals, and conversion flow', icon: Megaphone },
  { key: 'analytics', label: 'Reporting', description: 'Revenue, volume, and management visibility', icon: BarChart3 },
];

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({
    customers: [],
    vehicles: [],
    deals: [],
    leads: [],
    partners: [],
    reviews: [],
    trends: [],
    activity: [],
  });

  useEffect(() => {
    loadData();
  }, []);

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
    () => sumBy(data.deals.filter((deal) => deal.stage === 'completed'), (deal) => deal.amount || deal.totalAmount),
    [data.deals],
  );
  const openPipeline = useMemo(
    () => sumBy(data.deals.filter((deal) => deal.stage !== 'completed' && deal.stage !== 'cancelled'), (deal) => deal.amount || deal.totalAmount),
    [data.deals],
  );
  const approvalRate = data.reviews.length ? (data.reviews.filter((review) => review.status === 'approved').length / data.reviews.length) * 100 : 0;
  const conversionRate = data.leads.length ? (data.leads.filter((lead) => lead.status === 'converted').length / data.leads.length) * 100 : 0;
  const availableVehicles = data.vehicles.filter((vehicle) => vehicle.status === 'available').length;

  const overviewMetrics = [
    {
      label: 'Closed revenue',
      value: formatCurrency(totalRevenue, { compact: true, maximumFractionDigits: 1 }),
      note: 'Completed marketplace transactions',
    },
    {
      label: 'Open pipeline',
      value: formatCurrency(openPipeline, { compact: true, maximumFractionDigits: 1 }),
      note: 'Value still moving through the workflow',
    },
    {
      label: 'Approval rate',
      value: formatPercent(approvalRate),
      note: `${data.reviews.length} finance reviews on record`,
    },
  ];

  const stageSummary = [
    { stage: 'vehicle_selected', count: data.deals.filter((deal) => ['inquiry', 'vehicle_selected'].includes(deal.stage)).length },
    { stage: 'loan_applied', count: data.deals.filter((deal) => ['negotiation', 'documentation', 'loan_applied'].includes(deal.stage)).length },
    { stage: 'under_review', count: data.deals.filter((deal) => ['financing', 'under_review'].includes(deal.stage)).length },
    { stage: 'approved', count: data.deals.filter((deal) => ['approval', 'approved'].includes(deal.stage)).length },
    { stage: 'completed', count: data.deals.filter((deal) => deal.stage === 'completed').length },
  ];

  const attentionItems = [
    {
      label: 'Pending finance reviews',
      value: data.reviews.filter((review) => ['pending', 'under_review', 'in_review'].includes(review.status)).length,
      tone: 'warning',
      note: 'Finance teams should clear these files first.',
    },
    {
      label: 'Reserved vehicles',
      value: data.vehicles.filter((vehicle) => vehicle.status === 'reserved').length,
      tone: 'info',
      note: 'Vehicles currently tied to active deals.',
    },
    {
      label: 'New lead follow-up',
      value: data.leads.filter((lead) => lead.status === 'new').length,
      tone: 'danger',
      note: 'Leads waiting for first contact.',
    },
  ];

  const moduleCoverage = [
    { key: 'crm', count: data.customers.length, health: 'active' },
    { key: 'supplier', count: availableVehicles, health: availableVehicles ? 'active' : 'pending' },
    { key: 'finance', count: data.reviews.length, health: data.reviews.length ? 'active' : 'pending' },
    { key: 'deal', count: data.deals.length, health: data.deals.length ? 'active' : 'pending' },
    { key: 'partner', count: data.partners.length, health: data.partners.length ? 'active' : 'pending' },
    { key: 'marketing', count: data.leads.length, health: data.leads.length ? 'active' : 'pending' },
    { key: 'analytics', count: data.trends.length, health: data.trends.length ? 'active' : 'pending' },
  ];

  if (loading) {
    return (
      <div className="page-shell">
        <div className="page-header"><Skeleton type="title" style={{ width: '30%' }} /></div>
        <div className="split-layout"><Skeleton type="card" style={{ height: '280px' }} /><Skeleton type="card" style={{ height: '280px' }} /></div>
        <div className="stats-grid"><Skeleton type="stat" count={4} /></div>
        <div className="section-grid"><Skeleton type="card" style={{ height: '360px' }} /><Skeleton type="card" style={{ height: '360px' }} /></div>
      </div>
    );
  }

  return (
    <div className="page-shell">
      <div className="page-header">
        <div>
          <h1>Operations dashboard</h1>
          <p>Monitor customer intake, inventory, financing progress, deal execution, partner activity, and lead flow from one clear workspace.</p>
        </div>
        <button className="btn btn-secondary" type="button" onClick={loadData}>Refresh data</button>
      </div>

      <div className="split-layout dashboard-overview">
        <div className="card dashboard-summary-card">
          <div className="card-header">
            <div>
              <div className="card-title">Executive summary</div>
              <div className="card-subtitle">The core commercial picture, without extra decoration.</div>
            </div>
          </div>
          <div className="summary-kpi-grid">
            {overviewMetrics.map((item) => (
              <div key={item.label} className="summary-kpi">
                <span className="summary-kpi-label">{item.label}</span>
                <strong>{item.value}</strong>
                <p>{item.note}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title">Priority items</div>
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
                  <StatusBadge value={item.tone === 'warning' ? 'pending' : item.tone === 'danger' ? 'new' : 'qualified'} compact />
                </div>
                <div className="summary-inline-value">{formatCompactNumber(item.value)}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="stats-grid">
        <MetricCard icon={UsersRound} label="Customers" value={formatCompactNumber(data.customers.length)} detail="Registered customer records" tone="accent" />
        <MetricCard icon={CarFront} label="Vehicles available" value={formatCompactNumber(availableVehicles)} detail={`${data.vehicles.length} total listed vehicles`} tone="success" />
        <MetricCard icon={WalletCards} label="Finance approval" value={formatPercent(approvalRate)} detail={`${data.reviews.length} total financing reviews`} tone="warning" />
        <MetricCard icon={Megaphone} label="Lead conversion" value={formatPercent(conversionRate)} detail={`${data.leads.length} captured marketing leads`} tone="info" />
      </div>

      <div className="section-grid">
        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title">Marketplace trend</div>
              <div className="card-subtitle">Monthly movement across revenue and lead generation.</div>
            </div>
          </div>
          <div className="chart-shell">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.trends}>
                <defs>
                  <linearGradient id="dashboardRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--accent-primary)" stopOpacity={0.24} />
                    <stop offset="95%" stopColor="var(--accent-primary)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(28, 24, 20, 0.08)" vertical={false} />
                <XAxis dataKey="month" tickLine={false} axisLine={false} stroke="var(--text-muted)" />
                <YAxis tickLine={false} axisLine={false} stroke="var(--text-muted)" />
                <Tooltip contentStyle={{ background: 'var(--bg-surface-strong)', border: '1px solid var(--border-color)', borderRadius: '16px' }} />
                <Area type="monotone" dataKey="revenue" stroke="var(--accent-primary)" fill="url(#dashboardRevenue)" strokeWidth={2.1} />
                <Area type="monotone" dataKey="leads" stroke="var(--accent-secondary)" fill="transparent" strokeWidth={2.1} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title">Module coverage</div>
              <div className="card-subtitle">Each business function is live in the product surface.</div>
            </div>
          </div>
          <div className="list-stack">
            {moduleBlueprint.map((module) => {
              const coverage = moduleCoverage.find((item) => item.key === module.key);
              const Icon = module.icon;
              return (
                <div key={module.key} className="list-row compact-row">
                  <div className="list-row-head">
                    <div style={{ display: 'flex', gap: '12px' }}>
                      <div className="metric-icon-wrap"><Icon size={18} strokeWidth={2.2} /></div>
                      <div>
                        <div className="list-row-title">{module.label}</div>
                        <div className="list-row-meta">{module.description}</div>
                      </div>
                    </div>
                    <StatusBadge value={coverage?.health || 'pending'} compact />
                  </div>
                  <div className="helper-copy">Live records: {formatCompactNumber(coverage?.count || 0)}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="section-grid">
        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title">Transaction stages</div>
              <div className="card-subtitle">Deal distribution from vehicle selection to completion.</div>
            </div>
          </div>
          <div className="chart-shell">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stageSummary}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(28, 24, 20, 0.08)" vertical={false} />
                <XAxis dataKey="stage" tickFormatter={toTitleCase} tickLine={false} axisLine={false} stroke="var(--text-muted)" />
                <YAxis tickLine={false} axisLine={false} stroke="var(--text-muted)" />
                <Tooltip formatter={(value) => [value, 'Deals']} contentStyle={{ background: 'var(--bg-surface-strong)', border: '1px solid var(--border-color)', borderRadius: '16px' }} />
                <Bar dataKey="count" fill="var(--accent-secondary)" radius={[10, 10, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title">Recent activity</div>
              <div className="card-subtitle">Latest API-backed operational events from the audit feed.</div>
            </div>
          </div>
          <div className="timeline">
            {data.activity.length ? (
              data.activity.slice(0, 5).map((log) => (
                <div key={log.id} className="timeline-item">
                  <div className="timeline-marker"><span /></div>
                  <div>
                    <div className="timeline-item-head">
                      <div className="list-row-title">{toTitleCase(log.resource)} · {log.action}</div>
                      <StatusBadge value="active" compact />
                    </div>
                    <div className="timeline-copy">{formatDateTime(log.timestamp)}</div>
                  </div>
                </div>
              ))
            ) : (
              <div className="empty-state" style={{ minHeight: '220px' }}>
                <h3>No activity yet</h3>
                <p>Once operators start using the modules, the audit trail will appear here.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="section-grid">
        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title">Recent deals</div>
              <div className="card-subtitle">Commercial movement across the sales and financing workflow.</div>
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
                {data.deals.slice(0, 5).map((deal) => (
                  <tr key={deal.id}>
                    <td>{deal.customerName}</td>
                    <td>{deal.vehicleDescription}</td>
                    <td>{formatCurrency(deal.amount || deal.totalAmount)}</td>
                    <td><StatusBadge value={deal.stage} compact /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title">Lead queue</div>
              <div className="card-subtitle">Current acquisition pulse and buyer intent.</div>
            </div>
          </div>
          <div className="list-stack">
            {data.leads.slice(0, 5).map((lead) => (
              <div key={lead.id} className="list-row compact-row">
                <div className="list-row-head">
                  <div>
                    <div className="list-row-title">{lead.name}</div>
                    <div className="list-row-meta">{lead.source} · {lead.vehicleInterest || 'Vehicle interest pending'}</div>
                  </div>
                  <StatusBadge value={lead.status} compact />
                </div>
                <div className="list-row-meta">{lead.email || lead.phone}</div>
              </div>
            ))}
            {!data.leads.length ? (
              <div className="empty-state" style={{ minHeight: '220px' }}>
                <h3>No leads yet</h3>
                <p>Capture new demand from marketing campaigns and referral channels.</p>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
