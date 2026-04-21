import React, { useEffect, useMemo, useState } from 'react';
import { Button } from '@mui/material';
import {
  Briefcase,
  Car,
  CircleDollarSign,
  RefreshCw,
  TrendingUp,
  Users,
} from 'lucide-react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
  XAxis,
  YAxis,
} from 'recharts';
import {
  CategoryScale,
  Chart as ChartJS,
  Filler,
  Legend,
  LineElement,
  LinearScale,
  PointElement,
  Tooltip,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import api from '../api';
import MetricCard from '../components/MetricCard';
import StatusBadge from '../components/StatusBadge';
import { formatCompactNumber, formatCurrency, formatPercent, safeArray } from '../utils/format';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend, Filler);

const stageLabels = {
  inquiry: 'Inquiry',
  vehicle_selected: 'Vehicle Selected',
  loan_applied: 'Loan Applied',
  under_review: 'Under Review',
  approved: 'Approved',
  contract_signed: 'Contract Signed',
  completed: 'Completed',
  cancelled: 'Cancelled',
};

const pieColors = ['#2F8E75', '#CA8B18', '#2F73C9', '#CF3B35', '#5D7A86'];

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [state, setState] = useState({
    customers: [],
    vehicles: [],
    deals: [],
    leads: [],
    reviews: [],
    partners: [],
    trends: [],
  });

  useEffect(() => {
    load();
  }, []);

  async function load() {
    setLoading(true);
    try {
      const [customers, vehicles, deals, leads, reviews, partners, trends] = await Promise.all([
        api.get('/customers').catch(() => []),
        api.get('/vehicles').catch(() => []),
        api.get('/deals').catch(() => []),
        api.get('/leads').catch(() => []),
        api.get('/finance/reviews').catch(() => []),
        api.get('/partners').catch(() => []),
        api.get('/analytics/trends').catch(() => []),
      ]);

      setState({
        customers: safeArray(customers),
        vehicles: safeArray(vehicles),
        deals: safeArray(deals),
        leads: safeArray(leads),
        reviews: safeArray(reviews),
        partners: safeArray(partners),
        trends: safeArray(trends),
      });
    } finally {
      setLoading(false);
    }
  }

  const kpis = useMemo(() => {
    const closedRevenue = state.deals
      .filter((deal) => deal.stage === 'completed')
      .reduce((sum, deal) => sum + Number(deal.amount || deal.totalAmount || 0), 0);

    const openPipeline = state.deals
      .filter((deal) => !['completed', 'cancelled'].includes(deal.stage))
      .reduce((sum, deal) => sum + Number(deal.amount || deal.totalAmount || 0), 0);

    const approvals = state.reviews.filter((review) => review.status === 'approved').length;
    const approvalRate = state.reviews.length ? (approvals / state.reviews.length) * 100 : 0;

    return {
      closedRevenue,
      openPipeline,
      approvalRate,
      activeDeals: state.deals.filter((deal) => !['completed', 'cancelled'].includes(deal.stage)).length,
    };
  }, [state.deals, state.reviews]);

  const trendChartData = useMemo(() => ({
    labels: state.trends.map((row) => row.month || 'N/A'),
    datasets: [
      {
        label: 'Revenue',
        data: state.trends.map((row) => Number(row.revenue || 0)),
        borderColor: '#0E5F4B',
        backgroundColor: 'rgba(14, 95, 75, 0.12)',
        fill: true,
        borderWidth: 2,
        tension: 0.36,
      },
      {
        label: 'Leads',
        data: state.trends.map((row) => Number(row.leads || 0)),
        borderColor: '#C88211',
        backgroundColor: 'rgba(200, 130, 17, 0.08)',
        fill: true,
        borderWidth: 2,
        tension: 0.36,
      },
    ],
  }), [state.trends]);

  const stageData = useMemo(() => {
    const map = {};
    for (const deal of state.deals) {
      const key = deal.stage || 'inquiry';
      map[key] = (map[key] || 0) + 1;
    }

    return Object.entries(map).map(([stage, count]) => ({
      stage,
      label: stageLabels[stage] || stage,
      count,
    }));
  }, [state.deals]);

  const leadSourceData = useMemo(() => {
    const map = {};
    for (const lead of state.leads) {
      const source = lead.source || 'unspecified';
      map[source] = (map[source] || 0) + 1;
    }
    return Object.entries(map)
      .map(([source, value]) => ({ name: source, value }))
      .sort((left, right) => right.value - left.value);
  }, [state.leads]);

  return (
    <div className="page-shell">
      <div className="page-header row-between">
        <div>
          <h1>Executive command center</h1>
          <p>Single-pane operations for customer funnel, inventory movement, financing flow, and revenue momentum.</p>
        </div>
        <Button variant="outlined" onClick={load} startIcon={<RefreshCw size={16} />} disabled={loading}>
          Refresh snapshot
        </Button>
      </div>

      <div className="stats-grid">
        <MetricCard icon={Users} label="Customers" value={formatCompactNumber(state.customers.length)} detail="Registered in CRM" tone="accent" />
        <MetricCard icon={Car} label="Available vehicles" value={formatCompactNumber(state.vehicles.filter((vehicle) => vehicle.status === 'available').length)} detail={`${state.vehicles.length} total inventory`} tone="success" />
        <MetricCard icon={TrendingUp} label="Approval rate" value={formatPercent(kpis.approvalRate)} detail={`${state.reviews.length} financing reviews`} tone="warning" />
        <MetricCard icon={Briefcase} label="Active deals" value={kpis.activeDeals} detail="Transactions in progress" tone="info" />
        <MetricCard icon={CircleDollarSign} label="Closed revenue" value={formatCurrency(kpis.closedRevenue, { compact: true, maximumFractionDigits: 1 })} detail={`Pipeline ${formatCurrency(kpis.openPipeline, { compact: true, maximumFractionDigits: 1 })}`} tone="accent" />
      </div>

      <div className="section-grid two-up">
        <div className="card chart-card">
          <div className="card-header compact">
            <div>
              <div className="card-title">Revenue and lead momentum</div>
              <div className="card-subtitle">Chart.js trendline for month-over-month throughput.</div>
            </div>
          </div>
          <div className="chart-shell">
            <Line
              data={trendChartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { position: 'top' } },
                scales: { y: { beginAtZero: true } },
              }}
            />
          </div>
        </div>

        <div className="card chart-card">
          <div className="card-header compact">
            <div>
              <div className="card-title">Lead source mix</div>
              <div className="card-subtitle">Recharts distribution of inbound marketing channels.</div>
            </div>
          </div>
          <div className="chart-shell">
            {leadSourceData.length ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={leadSourceData} dataKey="value" nameKey="name" innerRadius={58} outerRadius={92} paddingAngle={2}>
                    {leadSourceData.map((entry, index) => (
                      <Cell key={`${entry.name}-${index}`} fill={pieColors[index % pieColors.length]} />
                    ))}
                  </Pie>
                  <RechartsTooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="empty-state compact"><h3>No lead data</h3><p>Capture leads to generate channel mix analytics.</p></div>
            )}
          </div>
        </div>
      </div>

      <div className="section-grid two-up">
        <div className="card chart-card">
          <div className="card-header compact">
            <div>
              <div className="card-title">Deal stage distribution</div>
              <div className="card-subtitle">Pipeline load by lifecycle stage.</div>
            </div>
          </div>
          <div className="chart-shell">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stageData} margin={{ top: 10, right: 10, left: 0, bottom: 8 }}>
                <CartesianGrid strokeDasharray="4 4" stroke="#D6E3E8" />
                <XAxis dataKey="label" tick={{ fontSize: 12 }} interval={0} angle={-16} textAnchor="end" height={56} />
                <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
                <RechartsTooltip />
                <Bar dataKey="count" fill="#2F8E75" radius={[7, 7, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card">
          <div className="card-header compact">
            <div>
              <div className="card-title">Recent deals</div>
              <div className="card-subtitle">Latest transactions moving through the platform.</div>
            </div>
          </div>
          <div className="table-container table-responsive">
            <table className="table table-sm align-middle mb-0">
              <thead>
                <tr>
                  <th>Customer</th>
                  <th>Vehicle</th>
                  <th>Amount</th>
                  <th>Stage</th>
                </tr>
              </thead>
              <tbody>
                {safeArray(state.deals).slice(0, 6).map((deal) => (
                  <tr key={deal.id}>
                    <td>{deal.customerName || 'Unknown customer'}</td>
                    <td>{deal.vehicleDescription || 'Vehicle not linked'}</td>
                    <td>{formatCurrency(deal.amount || deal.totalAmount || 0)}</td>
                    <td><StatusBadge value={deal.stage || 'inquiry'} compact /></td>
                  </tr>
                ))}
                {!state.deals.length ? (
                  <tr>
                    <td colSpan={4}><div className="empty-state compact"><h3>No deals yet</h3><p>Create a deal record to start transaction tracking.</p></div></td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-header compact">
          <div>
            <div className="card-title">Marketplace readiness pulse</div>
            <div className="card-subtitle">Partners and institutions ready to process demand.</div>
          </div>
        </div>
        <div className="row metric-row">
          <div className="metric-inline">
            <span className="metric-inline-label">Partners onboarded</span>
            <span className="metric-inline-value">{state.partners.length}</span>
          </div>
          <div className="metric-inline">
            <span className="metric-inline-label">Leads captured</span>
            <span className="metric-inline-value">{state.leads.length}</span>
          </div>
          <div className="metric-inline">
            <span className="metric-inline-label">Reviews awaiting action</span>
            <span className="metric-inline-value">{state.reviews.filter((review) => ['pending', 'in_review'].includes(review.status)).length}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
