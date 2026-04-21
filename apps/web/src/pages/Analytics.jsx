import React, { useEffect, useMemo, useState } from "react";
import { Activity, BadgeDollarSign, CarFront, WalletCards } from "lucide-react";
import {
  ArcElement,
  CategoryScale,
  Chart as ChartJS,
  Filler,
  Legend,
  LineElement,
  LinearScale,
  PointElement,
  Tooltip,
} from "chart.js";
import { Doughnut, Line } from "react-chartjs-2";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
  XAxis,
  YAxis,
} from "recharts";
import api from "../api";
import MetricCard from "../components/MetricCard";
import StatusBadge from "../components/StatusBadge";
import { formatCurrency, formatPercent, safeArray } from "../utils/format";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Tooltip,
  Legend,
  Filler,
);

const periodOptions = [
  { value: "week", label: "Last week" },
  { value: "month", label: "Last month" },
  { value: "quarter", label: "Last quarter" },
  { value: "year", label: "Last year" },
];

const financePalette = ["#2F8E75", "#2F73C9", "#C88211", "#CF3B35"];

export default function Analytics() {
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState("month");
  const [data, setData] = useState({
    summary: {},
    sales: {},
    financing: {},
    partners: {},
    revenue: {},
  });

  useEffect(() => {
    loadData(period);
  }, [period]);

  async function loadData(selectedPeriod) {
    setLoading(true);
    try {
      const [summary, sales, financing, partners, revenue] = await Promise.all([
        api.get("/analytics/summary").catch(() => ({})),
        api.get(`/analytics/sales?period=${selectedPeriod}`).catch(() => ({})),
        api.get("/analytics/financing").catch(() => ({})),
        api.get("/analytics/partners").catch(() => ({})),
        api.get("/analytics/revenue").catch(() => ({})),
      ]);

      setData({
        summary: summary || {},
        sales: sales || {},
        financing: financing || {},
        partners: partners || {},
        revenue: revenue || {},
      });
    } finally {
      setLoading(false);
    }
  }

  const revenueLineData = useMemo(() => {
    const rows = safeArray(data.revenue.monthlyRevenue);
    return {
      labels: rows.map((row) => row.month || "N/A"),
      datasets: [
        {
          label: "Revenue",
          data: rows.map((row) => Number(row.revenue || 0)),
          borderColor: "#0E5F4B",
          backgroundColor: "rgba(14, 95, 75, 0.12)",
          fill: true,
          tension: 0.35,
          borderWidth: 2,
        },
        {
          label: "Commission",
          data: rows.map((row) => Number(row.commission || 0)),
          borderColor: "#C88211",
          backgroundColor: "rgba(200, 130, 17, 0.08)",
          fill: true,
          tension: 0.35,
          borderWidth: 2,
        },
      ],
    };
  }, [data.revenue.monthlyRevenue]);

  const financingBreakdown = useMemo(
    () => [
      { label: "Approved", value: Number(data.financing.approved || 0) },
      { label: "Pending", value: Number(data.financing.pending || 0) },
      { label: "Rejected", value: Number(data.financing.rejected || 0) },
    ],
    [data.financing],
  );

  const financingPieData = useMemo(
    () => ({
      labels: financingBreakdown.map((item) => item.label),
      datasets: [
        {
          data: financingBreakdown.map((item) => item.value),
          backgroundColor: financePalette,
          borderWidth: 0,
        },
      ],
    }),
    [financingBreakdown],
  );

  const salesByMake = useMemo(
    () => safeArray(data.sales.byMake),
    [data.sales.byMake],
  );
  const topPartners = useMemo(
    () => safeArray(data.partners.topPartners),
    [data.partners.topPartners],
  );

  if (loading) {
    return (
      <div className="page-shell">
        <div className="empty-state">
          <h3>Loading analytics dashboard...</h3>
        </div>
      </div>
    );
  }

  return (
    <div className="page-shell">
      <div className="page-header row-between">
        <div>
          <h1>Reporting and analytics dashboard</h1>
          <p>
            Management view of vehicle sales, financing outcomes, partner
            contribution, and marketplace revenue.
          </p>
        </div>
        <div className="tabs inline">
          {periodOptions.map((option) => (
            <button
              key={option.value}
              className={`tab ${period === option.value ? "active" : ""}`}
              type="button"
              onClick={() => setPeriod(option.value)}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      <div className="stats-grid">
        <MetricCard
          icon={BadgeDollarSign}
          label="Revenue"
          value={formatCurrency(data.revenue.totalRevenue, {
            compact: true,
            maximumFractionDigits: 1,
          })}
          detail="Total transaction revenue"
          tone="accent"
        />
        <MetricCard
          icon={CarFront}
          label="Vehicles sold"
          value={data.summary.totalVehiclesSold || 0}
          detail="Sales volume"
          tone="success"
        />
        <MetricCard
          icon={WalletCards}
          label="Loans approved"
          value={data.summary.totalLoansApproved || 0}
          detail={`Approval rate ${formatPercent(data.financing.approvalRate || 0)}`}
          tone="warning"
        />
        <MetricCard
          icon={Activity}
          label="Active deals"
          value={data.summary.totalActiveDeals || 0}
          detail={`${data.summary.totalLeads || 0} leads in funnel`}
          tone="info"
        />
      </div>

      <div className="section-grid two-up">
        <div className="card chart-card">
          <div className="card-header compact">
            <div>
              <div className="card-title">Revenue trajectory</div>
              <div className="card-subtitle">
                Chart.js trend for revenue and commissions by month.
              </div>
            </div>
          </div>
          <div className="chart-shell">
            <Line
              data={revenueLineData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { position: "top" } },
                scales: { y: { beginAtZero: true } },
              }}
            />
          </div>
        </div>

        <div className="card chart-card">
          <div className="card-header compact">
            <div>
              <div className="card-title">Financing outcomes</div>
              <div className="card-subtitle">
                Chart.js distribution of approvals, pending files, and
                rejections.
              </div>
            </div>
          </div>
          <div className="chart-shell">
            <Doughnut
              data={financingPieData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { position: "bottom" } },
              }}
            />
          </div>
          <div className="pill-list">
            {financingBreakdown.map((item, index) => (
              <span
                key={item.label}
                className="pill"
                style={{ color: financePalette[index % financePalette.length] }}
              >
                {item.label}: {item.value}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="section-grid two-up">
        <div className="card chart-card">
          <div className="card-header compact">
            <div>
              <div className="card-title">Vehicle sales by make</div>
              <div className="card-subtitle">
                Recharts bar chart of sold units by manufacturer.
              </div>
            </div>
          </div>
          <div className="chart-shell">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={salesByMake}
                margin={{ top: 8, right: 8, left: 0, bottom: 8 }}
              >
                <CartesianGrid
                  strokeDasharray="4 4"
                  stroke="var(--border-color)"
                />
                <XAxis
                  dataKey="make"
                  tick={{ fontSize: 12, fill: "var(--text-muted)" }}
                />
                <YAxis
                  allowDecimals={false}
                  tick={{ fontSize: 12, fill: "var(--text-muted)" }}
                />
                <RechartsTooltip />
                <Bar dataKey="count" fill="#2F73C9" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card">
          <div className="card-header compact">
            <div>
              <div className="card-title">Partner performance</div>
              <div className="card-subtitle">
                Top partners by deal throughput and commissions.
              </div>
            </div>
          </div>
          <div className="list-stack">
            {topPartners.map((partner) => (
              <div key={`${partner.name}-${partner.type}`} className="list-row">
                <div className="list-row-head">
                  <div>
                    <div className="list-row-title">{partner.name}</div>
                    <div className="list-row-meta">
                      {partner.type} • {partner.deals} deals
                    </div>
                  </div>
                  <StatusBadge value={partner.status || "active"} compact />
                </div>
                <div className="list-row-meta">
                  Commission{" "}
                  {formatCurrency(partner.commission || 0, {
                    compact: true,
                    maximumFractionDigits: 1,
                  })}{" "}
                  • Rate {formatPercent(partner.commissionRate || 0)} •
                  Agreements {partner.agreements || 0}
                </div>
              </div>
            ))}
            {!topPartners.length ? (
              <div className="empty-state compact">
                <h3>No partner analytics yet</h3>
                <p>
                  Partner statistics will appear when analytics data is
                  available.
                </p>
              </div>
            ) : null}
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-header compact">
          <div>
            <div className="card-title">Strategic outlook</div>
            <div className="card-subtitle">
              Indicators aligned with marketplace maturity objectives.
            </div>
          </div>
        </div>
        <div className="list-stack">
          <div className="list-row">
            <div className="list-row-title">Average deal value</div>
            <p>{formatCurrency(data.summary.averageDealValue || 0)}</p>
          </div>
          <div className="list-row">
            <div className="list-row-title">Partner network depth</div>
            <p>
              {data.summary.totalPartners || 0} active partners participating in
              supply and financing.
            </p>
          </div>
          <div className="list-row">
            <div className="list-row-title">Conversion efficiency</div>
            <p>
              {formatPercent(data.summary.conversionRate || 0)} lead-to-sale
              conversion in the current analytics model.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
