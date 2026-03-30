import React, { useEffect, useMemo, useState } from 'react';
import { Activity, BadgeDollarSign, CarFront, WalletCards } from 'lucide-react';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import api from '../api';
import MetricCard from '../components/MetricCard';
import Skeleton from '../components/Skeleton';
import StatusBadge from '../components/StatusBadge';
import { formatCurrency, formatPercent } from '../utils/format';

const financePalette = ['var(--accent-primary)', 'var(--accent-secondary)', 'var(--accent-blue)', 'var(--accent-danger)'];
const periodOptions = [
  { value: 'week', label: 'Last week' },
  { value: 'month', label: 'Last month' },
  { value: 'quarter', label: 'Last quarter' },
  { value: 'year', label: 'Last year' },
];

export default function Analytics() {
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState('month');
  const [data, setData] = useState({ summary: {}, sales: {}, financing: {}, partners: {}, revenue: {} });

  useEffect(() => {
    loadData(period);
  }, [period]);

  async function loadData(selectedPeriod) {
    setLoading(true);
    try {
      const [summary, sales, financing, partners, revenue] = await Promise.all([
        api.get('/analytics/summary').catch(() => ({})),
        api.get(`/analytics/sales?period=${selectedPeriod}`).catch(() => ({})),
        api.get('/analytics/financing').catch(() => ({})),
        api.get('/analytics/partners').catch(() => ({})),
        api.get('/analytics/revenue').catch(() => ({})),
      ]);
      setData({ summary: summary || {}, sales: sales || {}, financing: financing || {}, partners: partners || {}, revenue: revenue || {} });
    } finally {
      setLoading(false);
    }
  }

  const financeStatusData = useMemo(
    () => [
      { name: 'Approved', value: data.financing.approved || 0 },
      { name: 'Pending', value: data.financing.pending || 0 },
      { name: 'Rejected', value: data.financing.rejected || 0 },
    ].filter((item) => item.value > 0),
    [data.financing],
  );

  if (loading) {
    return (
      <div className="page-shell">
        <div className="page-header"><Skeleton type="title" style={{ width: '26%' }} /></div>
        <div className="stats-grid"><Skeleton type="stat" count={4} /></div>
        <div className="section-grid"><Skeleton type="card" style={{ height: '360px' }} /><Skeleton type="card" style={{ height: '360px' }} /></div>
      </div>
    );
  }

  return (
    <div className="page-shell">
      <div className="page-header">
        <div>
          <h1>Reporting and analytics dashboard</h1>
          <p>Executive visibility across revenue, sales mix, financing outcomes, and partner contribution.</p>
        </div>
        <div className="tabs">
          {periodOptions.map((option) => (
            <button key={option.value} className={`tab ${period === option.value ? 'active' : ''}`} type="button" onClick={() => setPeriod(option.value)}>
              {option.label}
            </button>
          ))}
        </div>
      </div>

      <div className="stats-grid">
        <MetricCard icon={BadgeDollarSign} label="Revenue" value={formatCurrency(data.revenue.totalRevenue, { compact: true, maximumFractionDigits: 1 })} detail="Total marketplace transaction revenue" tone="accent" />
        <MetricCard icon={CarFront} label="Vehicles sold" value={data.summary.totalVehiclesSold || 0} detail="Sales volume in the selected reporting model" tone="success" />
        <MetricCard icon={WalletCards} label="Loans approved" value={data.summary.totalLoansApproved || 0} detail={`Approval rate ${formatPercent(data.financing.approvalRate || 0)}`} tone="warning" />
        <MetricCard icon={Activity} label="Leads" value={data.summary.totalLeads || 0} detail={`${data.summary.totalActiveDeals || 0} active deals on platform`} tone="info" />
      </div>

      <div className="section-grid">
        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title">Revenue progression</div>
              <div className="card-subtitle">Monthly revenue and commission generation.</div>
            </div>
          </div>
          <div className="chart-shell">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.revenue.monthlyRevenue || []}>
                <defs>
                  <linearGradient id="analyticsRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--accent-primary)" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="var(--accent-primary)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="month" tickLine={false} axisLine={false} stroke="var(--text-muted)" />
                <YAxis tickLine={false} axisLine={false} stroke="var(--text-muted)" />
                <Tooltip contentStyle={{ background: 'var(--bg-surface-strong)', border: '1px solid var(--border-color)', borderRadius: '18px' }} />
                <Area type="monotone" dataKey="revenue" stroke="var(--accent-primary)" fill="url(#analyticsRevenue)" strokeWidth={2.2} />
                <Area type="monotone" dataKey="commission" stroke="var(--accent-secondary)" fill="transparent" strokeWidth={2.2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title">Financing pipeline</div>
              <div className="card-subtitle">Distribution of review outcomes across institutions.</div>
            </div>
          </div>
          <div className="chart-shell">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={financeStatusData} dataKey="value" nameKey="name" innerRadius={70} outerRadius={104} paddingAngle={4}>
                  {financeStatusData.map((entry, index) => <Cell key={entry.name} fill={financePalette[index % financePalette.length]} />)}
                </Pie>
                <Tooltip contentStyle={{ background: 'var(--bg-surface-strong)', border: '1px solid var(--border-color)', borderRadius: '18px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="pill-list">
            {financeStatusData.map((item, index) => (
              <span key={item.name} className="pill" style={{ color: financePalette[index % financePalette.length] }}>{item.name}: {item.value}</span>
            ))}
          </div>
        </div>
      </div>

      <div className="section-grid">
        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title">Sales by make</div>
              <div className="card-subtitle">Vehicle sales distribution across brands.</div>
            </div>
          </div>
          <div className="chart-shell">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.sales.byMake || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="make" tickLine={false} axisLine={false} stroke="var(--text-muted)" />
                <YAxis tickLine={false} axisLine={false} stroke="var(--text-muted)" />
                <Tooltip contentStyle={{ background: 'var(--bg-surface-strong)', border: '1px solid var(--border-color)', borderRadius: '18px' }} />
                <Bar dataKey="count" fill="var(--accent-secondary)" radius={[12, 12, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title">Vehicle condition mix</div>
              <div className="card-subtitle">How new, used, and certified inventory contribute to volume.</div>
            </div>
          </div>
          <div className="list-stack">
            {(data.sales.byCondition || []).map((item) => (
              <div key={item.condition} className="list-row">
                <div className="list-row-head">
                  <div>
                    <div className="list-row-title">{item.condition}</div>
                    <div className="list-row-meta">{item.count} vehicles sold</div>
                  </div>
                  <StatusBadge value={item.condition} compact />
                </div>
                <div className="list-row-meta">Revenue contribution {formatCurrency(item.revenue, { compact: true, maximumFractionDigits: 1 })}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="section-grid">
        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title">Top partners</div>
              <div className="card-subtitle">Organizations contributing the strongest marketplace outcomes.</div>
            </div>
          </div>
          <div className="list-stack">
            {(data.partners.topPartners || []).map((partner) => (
              <div key={partner.name} className="list-row">
                <div className="list-row-head">
                  <div>
                    <div className="list-row-title">{partner.name}</div>
                    <div className="list-row-meta">{partner.type} · {partner.deals} deals</div>
                  </div>
                  <StatusBadge value="active" compact />
                </div>
                <div className="list-row-meta">Commission {formatCurrency(partner.commission, { compact: true, maximumFractionDigits: 1 })} · Rating {partner.rating}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title">Summary outlook</div>
              <div className="card-subtitle">High-level interpretation for management.</div>
            </div>
          </div>
          <div className="list-stack">
            <div className="list-row">
              <div className="list-row-title">Average deal value</div>
              <p>{formatCurrency(data.summary.averageDealValue)}</p>
            </div>
            <div className="list-row">
              <div className="list-row-title">Partner count</div>
              <p>{data.summary.totalPartners || 0} active partners across supply and financing.</p>
            </div>
            <div className="list-row">
              <div className="list-row-title">Conversion rate</div>
              <p>{formatPercent(data.summary.conversionRate || 0)} lead-to-sale conversion in the analytics service model.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
