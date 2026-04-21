import React, { useEffect, useState } from 'react';
import { Activity, Moon, Palette, Sun } from 'lucide-react';
import api from '../api';
import StatusBadge from '../components/StatusBadge';
import { useTheme } from '../context/ThemeContext';

export default function Settings() {
  const { theme, toggleTheme } = useTheme();
  const [health, setHealth] = useState(null);
  const [loadingHealth, setLoadingHealth] = useState(false);

  async function checkHealth() {
    setLoadingHealth(true);
    try {
      const data = await api.get('/health');
      setHealth(data);
    } catch {
      setHealth({ gateway: 'error', services: [] });
    } finally {
      setLoadingHealth(false);
    }
  }

  useEffect(() => { checkHealth(); }, []);

  return (
    <div className="page-shell">
      <div className="page-header">
        <h1>Workspace settings</h1>
        <p>Configure theme preferences and view system health information.</p>
      </div>

      <div className="section-grid two-up">
        <div className="card">
          <div className="card-header compact">
            <div>
              <div className="card-title"><Palette size={18} style={{ marginRight: 8, verticalAlign: 'text-bottom' }} />Appearance</div>
              <div className="card-subtitle">Customize the visual theme of the platform.</div>
            </div>
          </div>
          <div className="list-stack">
            <div className="list-row">
              <div className="list-row-head">
                <div>
                  <div className="list-row-title">Theme mode</div>
                  <div className="list-row-meta">Switch between light and dark interface themes.</div>
                </div>
                <button
                  className="btn btn-outline-primary"
                  onClick={toggleTheme}
                  type="button"
                  style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                >
                  {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
                  {theme === 'dark' ? 'Switch to Light' : 'Switch to Dark'}
                </button>
              </div>
            </div>
            <div className="list-row">
              <div className="list-row-head">
                <div className="list-row-title">Current theme</div>
                <StatusBadge value={theme === 'dark' ? 'Dark Mode' : 'Light Mode'} compact />
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-header compact">
            <div>
              <div className="card-title"><Activity size={18} style={{ marginRight: 8, verticalAlign: 'text-bottom' }} />Platform info</div>
              <div className="card-subtitle">System version and operational details.</div>
            </div>
          </div>
          <div className="list-stack">
            <div className="list-row">
              <div className="list-row-title">Platform</div>
              <div className="list-row-meta">Merkato Motors • Vehicle Financing Marketplace</div>
            </div>
            <div className="list-row">
              <div className="list-row-title">Version</div>
              <div className="list-row-meta">1.0.0</div>
            </div>
            <div className="list-row">
              <div className="list-row-title">Architecture</div>
              <div className="list-row-meta">Microservices (8 services + API Gateway)</div>
            </div>
            <div className="list-row">
              <div className="list-row-title">Default credentials</div>
              <div className="list-row-meta">admin@merkato.com / admin123</div>
            </div>
          </div>
        </div>
      </div>

      <div className="card" style={{ marginTop: '16px' }}>
        <div className="card-header compact row-between">
          <div>
            <div className="card-title">Service health monitor</div>
            <div className="card-subtitle">Real-time connectivity status for all microservices.</div>
          </div>
          <button className="btn btn-outline-primary btn-sm" onClick={checkHealth} disabled={loadingHealth} type="button">
            {loadingHealth ? 'Checking...' : 'Refresh'}
          </button>
        </div>
        <div className="list-stack">
          {health?.services?.length ? health.services.map((svc) => (
            <div key={svc.name} className="list-row">
              <div className="list-row-head">
                <div>
                  <div className="list-row-title" style={{ textTransform: 'capitalize' }}>{svc.name} Service</div>
                  <div className="list-row-meta">Port {svc.port}</div>
                </div>
                <StatusBadge value={svc.status === 'healthy' ? 'active' : svc.status} compact />
              </div>
            </div>
          )) : (
            <div className="empty-state compact">
              <h3>{loadingHealth ? 'Checking services...' : 'Unable to fetch health data'}</h3>
              <p>Make sure the API Gateway and all services are running.</p>
            </div>
          )}
          {health?.timestamp ? (
            <div className="list-row">
              <div className="list-row-meta" style={{ textAlign: 'center', padding: '8px 0' }}>
                Last checked: {new Date(health.timestamp).toLocaleTimeString()}
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
