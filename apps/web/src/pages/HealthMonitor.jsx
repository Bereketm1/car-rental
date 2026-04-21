import React, { useEffect, useMemo, useState } from "react";
import { Database, ShieldCheck, TimerReset, Wifi } from "lucide-react";
import api from "../api";
import DataTable from "../components/DataTable";
import MetricCard from "../components/MetricCard";
import Skeleton from "../components/Skeleton";
import StatusBadge from "../components/StatusBadge";
import { formatDateTime, safeArray } from "../utils/format";

const serviceTargets = [
  {
    name: "API gateway",
    path: "/notifications",
    detail: "Auth, routing, and notification reachability.",
  },
  {
    name: "CRM service",
    path: "/customers",
    detail: "Customer records, documents, and loan applications.",
  },
  {
    name: "Vehicle service",
    path: "/vehicles",
    detail: "Inventory, suppliers, and routing signals.",
  },
  {
    name: "Deal service",
    path: "/deals",
    detail: "Lifecycle orchestration and revenue records.",
  },
  {
    name: "Finance service",
    path: "/finance/reviews",
    detail: "Loan underwriting and document requests.",
  },
  {
    name: "Partner service",
    path: "/partners",
    detail: "Partner registry, agreements, and commissions.",
  },
  {
    name: "Lead service",
    path: "/leads",
    detail: "Lead capture, campaigns, and referrals.",
  },
  {
    name: "Analytics service",
    path: "/analytics/summary",
    detail: "Cross-service reporting and KPI aggregation.",
  },
];

export default function HealthMonitor() {
  const [loading, setLoading] = useState(true);
  const [logs, setLogs] = useState([]);
  const [services, setServices] = useState([]);
  const [lastRefresh, setLastRefresh] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    try {
      const [auditResponse, healthChecks] = await Promise.all([
        api.get("/audit").catch(() => []),
        Promise.all(
          serviceTargets.map(async (service) => {
            const startedAt = performance.now();
            try {
              await api.get(service.path);
              return {
                ...service,
                status: "online",
                latencyMs: Math.round(performance.now() - startedAt),
              };
            } catch (error) {
              return {
                ...service,
                status: "offline",
                latencyMs: Math.round(performance.now() - startedAt),
                error: error.message || "Request failed",
              };
            }
          }),
        ),
      ]);

      setLogs(safeArray(auditResponse));
      setServices(healthChecks);
      setLastRefresh(new Date());
    } finally {
      setLoading(false);
    }
  }

  const onlineCount = useMemo(
    () => services.filter((service) => service.status === "online").length,
    [services],
  );
  const degradedCount = services.length - onlineCount;

  const logColumns = [
    {
      key: "timestamp",
      label: "Timestamp",
      render: (value) => formatDateTime(value),
      sortable: true,
    },
    { key: "resource", label: "Resource", sortable: true },
    { key: "action", label: "Action", sortable: true },
    { key: "userId", label: "User" },
    { key: "resourceId", label: "Record" },
  ];

  if (loading) {
    return (
      <div className="page-shell">
        <div className="page-header">
          <Skeleton type="title" style={{ width: "25%" }} />
        </div>
        <div className="stats-grid">
          <Skeleton type="stat" count={4} />
        </div>
        <div className="section-grid">
          <Skeleton type="card" style={{ height: "320px" }} />
          <Skeleton type="card" style={{ height: "320px" }} />
        </div>
      </div>
    );
  }

  return (
    <div className="page-shell">
      <div className="page-header row-between">
        <div>
          <h1>System health and audit monitor</h1>
          <p>
            Operational confidence for the gateway, every backend service, and
            the audit trail behind the marketplace.
          </p>
        </div>
        <div className="toolbar-cluster wrap">
          <span className="pill">Gateway posture</span>
          <span className="pill">Live service checks</span>
          <button
            className="btn btn-secondary btn-sm"
            type="button"
            onClick={loadData}
          >
            Refresh checks
          </button>
        </div>
      </div>

      <div className="stats-grid">
        <MetricCard
          icon={Wifi}
          label="Services online"
          value={`${onlineCount}/${services.length}`}
          detail="Current reachability from the frontend workspace"
          tone="accent"
        />
        <MetricCard
          icon={ShieldCheck}
          label="Audit entries"
          value={logs.length}
          detail="Tracked operational events available for review"
          tone="success"
        />
        <MetricCard
          icon={Database}
          label="Gateway posture"
          value={degradedCount === 0 ? "Healthy" : "Degraded"}
          detail={
            degradedCount === 0
              ? "All platform modules are responding."
              : `${degradedCount} module(s) need attention.`
          }
          tone={degradedCount === 0 ? "success" : "warning"}
        />
        <MetricCard
          icon={TimerReset}
          label="Last refresh"
          value={lastRefresh ? lastRefresh.toLocaleTimeString() : "Pending"}
          detail="Snapshot time for this operational view"
          tone="info"
        />
      </div>

      <div className="section-grid">
        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title">Service status</div>
              <div className="card-subtitle">
                Reachability of the gateway and each business capability behind
                the platform.
              </div>
            </div>
          </div>
          <div className="list-stack">
            {services.map((service) => (
              <div key={service.name} className="list-row">
                <div className="list-row-head">
                  <div>
                    <div className="list-row-title">{service.name}</div>
                    <div className="list-row-meta">{service.detail}</div>
                  </div>
                  <StatusBadge value={service.status} compact />
                </div>
                <div className="list-row-meta">
                  Latency {service.latencyMs} ms
                  {service.error ? ` • ${service.error}` : ""}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title">Audit summary</div>
              <div className="card-subtitle">
                Recent event density from the live platform activity stream.
              </div>
            </div>
          </div>
          <div className="list-stack">
            {logs.slice(0, 5).map((log) => (
              <div key={log.id} className="list-row">
                <div className="list-row-head">
                  <div>
                    <div className="list-row-title">
                      {log.resource} · {log.action}
                    </div>
                    <div className="list-row-meta">
                      {formatDateTime(log.timestamp)}
                    </div>
                  </div>
                  <StatusBadge value="active" compact />
                </div>
              </div>
            ))}
            {!logs.length ? (
              <div className="empty-state">
                <h3>No audit activity</h3>
                <p>
                  Audit logs will appear as operators start using the platform.
                </p>
              </div>
            ) : null}
          </div>
        </div>
      </div>

      <DataTable
        title="Audit log explorer"
        subtitle="Search and sort operational records without leaving the monitoring surface."
        columns={logColumns}
        data={logs}
        searchPlaceholder="Search audit logs by action, resource, or user"
      />
    </div>
  );
}
