import React, { useEffect, useMemo, useState } from 'react';
import { Database, ShieldCheck, TimerReset, Wifi } from 'lucide-react';
import api from '../api';
import DataTable from '../components/DataTable';
import MetricCard from '../components/MetricCard';
import Skeleton from '../components/Skeleton';
import StatusBadge from '../components/StatusBadge';
import { formatDateTime, safeArray } from '../utils/format';

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
        api.get('/audit').catch(() => []),
        Promise.allSettled([
          api.get('/customers'),
          api.get('/vehicles'),
          api.get('/finance/reviews'),
          api.get('/analytics/summary'),
        ]),
      ]);

      setLogs(safeArray(auditResponse));
      setServices([
        { name: 'CRM service', status: healthChecks[0].status === 'fulfilled' ? 'online' : 'offline' },
        { name: 'Vehicle service', status: healthChecks[1].status === 'fulfilled' ? 'online' : 'offline' },
        { name: 'Finance service', status: healthChecks[2].status === 'fulfilled' ? 'online' : 'offline' },
        { name: 'Analytics service', status: healthChecks[3].status === 'fulfilled' ? 'online' : 'offline' },
      ]);
      setLastRefresh(new Date());
    } finally {
      setLoading(false);
    }
  }

  const onlineCount = useMemo(() => services.filter((service) => service.status === 'online').length, [services]);

  const logColumns = [
    { key: 'timestamp', label: 'Timestamp', render: (value) => formatDateTime(value), sortable: true },
    { key: 'resource', label: 'Resource', sortable: true },
    { key: 'action', label: 'Action', sortable: true },
    { key: 'userId', label: 'User' },
    { key: 'resourceId', label: 'Record' },
  ];

  if (loading) {
    return (
      <div className="page-shell">
        <div className="page-header"><Skeleton type="title" style={{ width: '25%' }} /></div>
        <div className="stats-grid"><Skeleton type="stat" count={4} /></div>
        <div className="section-grid"><Skeleton type="card" style={{ height: '320px' }} /><Skeleton type="card" style={{ height: '320px' }} /></div>
      </div>
    );
  }

  return (
    <div className="page-shell">
      <div className="page-header">
        <div>
          <h1>System health and audit monitor</h1>
          <p>Operational confidence for the gateway, microservices, and audit trail behind the marketplace.</p>
        </div>
        <div className="pill-list">
          <span className="pill">Service reachability</span>
          <span className="pill">Gateway posture</span>
          <span className="pill">Audit explorer</span>
        </div>
      </div>

      <div className="stats-grid">
        <MetricCard icon={Wifi} label="Services online" value={`${onlineCount}/${services.length}`} detail="Current service reachability from the frontend" tone="accent" />
        <MetricCard icon={ShieldCheck} label="Audit entries" value={logs.length} detail="Most recent operational actions tracked" tone="success" />
        <MetricCard icon={Database} label="Gateway posture" value={onlineCount === services.length ? 'Healthy' : 'Degraded'} detail="Based on active module responses" tone={onlineCount === services.length ? 'success' : 'warning'} />
        <MetricCard icon={TimerReset} label="Last refresh" value={lastRefresh ? lastRefresh.toLocaleTimeString() : 'Pending'} detail="Snapshot time for this operational view" tone="info" />
      </div>

      <div className="section-grid">
        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title">Service status</div>
              <div className="card-subtitle">Reachability of the core modules the workspace depends on.</div>
            </div>
          </div>
          <div className="list-stack">
            {services.map((service) => (
              <div key={service.name} className="list-row">
                <div className="list-row-head">
                  <div>
                    <div className="list-row-title">{service.name}</div>
                    <div className="list-row-meta">Checked through live frontend API requests.</div>
                  </div>
                  <StatusBadge value={service.status} compact />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title">Audit summary</div>
              <div className="card-subtitle">Recent event density from the platform activity stream.</div>
            </div>
          </div>
          <div className="list-stack">
            {logs.slice(0, 5).map((log) => (
              <div key={log.id} className="list-row">
                <div className="list-row-head">
                  <div>
                    <div className="list-row-title">{log.resource} · {log.action}</div>
                    <div className="list-row-meta">{formatDateTime(log.timestamp)}</div>
                  </div>
                  <StatusBadge value="active" compact />
                </div>
              </div>
            ))}
            {!logs.length ? <div className="empty-state"><h3>No audit activity</h3><p>Audit logs will appear as operators start using the platform.</p></div> : null}
          </div>
        </div>
      </div>

      <DataTable
        title="Audit log explorer"
        subtitle="Search and sort operational records without leaving the monitoring surface."
        actions={<button className="btn btn-secondary" type="button" onClick={loadData}>Refresh checks</button>}
        columns={logColumns}
        data={logs}
        searchPlaceholder="Search audit logs by action, resource, or user"
      />
    </div>
  );
}
