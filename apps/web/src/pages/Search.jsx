import React, { useEffect, useMemo, useState } from 'react';
import { CarFront, Sparkles, UsersRound } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import api from '../api';
import MetricCard from '../components/MetricCard';
import Skeleton from '../components/Skeleton';
import StatusBadge from '../components/StatusBadge';
import { formatCurrency, safeArray, toTitleCase } from '../utils/format';

const resultConfig = {
  customers: { label: 'Customers', path: '/customers', icon: UsersRound },
  vehicles: { label: 'Vehicles', path: '/vehicles', icon: CarFront },
  deals: { label: 'Deals', path: '/deals', icon: Sparkles },
};

export default function Search() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const query = params.get('q') || '';
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState({ customers: [], vehicles: [], deals: [] });

  useEffect(() => {
    if (!query.trim()) return;
    performSearch();
  }, [query]);

  async function performSearch() {
    setLoading(true);
    try {
      const response = await api.get(`/search?q=${encodeURIComponent(query.trim())}`);
      setResults({
        customers: safeArray(response?.customers),
        vehicles: safeArray(response?.vehicles),
        deals: safeArray(response?.deals),
      });
    } finally {
      setLoading(false);
    }
  }

  const sections = useMemo(
    () => Object.entries(resultConfig).map(([key, config]) => ({ key, config, items: results[key] || [] })),
    [results],
  );

  const totalResults = sections.reduce((sum, section) => sum + section.items.length, 0);

  if (loading) {
    return (
      <div className="page-shell">
        <div className="page-header"><Skeleton type="title" style={{ width: '24%' }} /></div>
        <div className="section-grid"><Skeleton type="card" style={{ height: '320px' }} /><Skeleton type="card" style={{ height: '320px' }} /></div>
      </div>
    );
  }

  return (
    <div className="page-shell">
      <div className="page-header">
        <div>
          <h1>Search results</h1>
          <p>{query ? `Cross-platform matches for "${query}".` : 'Start with a term from the global search box.'}</p>
        </div>
        {query ? (
          <div className="pill-list">
            <span className="pill">{totalResults} total matches</span>
            <span className="pill">{sections.filter((section) => section.items.length).length} active result groups</span>
          </div>
        ) : null}
      </div>

      {query ? (
        <>
          <div className="stats-grid">
            {sections.map(({ key, config, items }) => {
              const Icon = config.icon;
              return (
                <MetricCard
                  key={key}
                  icon={Icon}
                  label={config.label}
                  value={items.length}
                  detail={items.length ? `Matches available in ${config.label.toLowerCase()}` : `No ${config.label.toLowerCase()} matched`}
                  tone={items.length ? 'accent' : 'neutral'}
                />
              );
            })}
            <MetricCard icon={Sparkles} label="Total matches" value={totalResults} detail="Combined results across all indexed modules" tone="info" />
          </div>

          <div className="section-grid">
            {sections.map(({ key, config, items }) => {
              const Icon = config.icon;
              return (
                <div key={key} className="card">
                  <div className="card-header">
                    <div>
                      <div className="card-title">{config.label}</div>
                      <div className="card-subtitle">{items.length} match(es)</div>
                    </div>
                    <div className="metric-icon-wrap"><Icon size={18} strokeWidth={2.2} /></div>
                  </div>
                  <div className="list-stack">
                    {items.length ? (
                      items.slice(0, 6).map((item) => (
                        <button key={item.id} type="button" className="list-row" style={{ textAlign: 'left', cursor: 'pointer' }} onClick={() => navigate(config.path)}>
                          {key === 'customers' ? (
                            <>
                              <div className="list-row-head">
                                <div>
                                  <div className="list-row-title">{item.firstName} {item.lastName}</div>
                                  <div className="list-row-meta">{item.email || item.phone}</div>
                                </div>
                                <StatusBadge value={item.status || 'active'} compact />
                              </div>
                              <div className="list-row-meta">{item.city || 'Location not recorded'}</div>
                            </>
                          ) : key === 'vehicles' ? (
                            <>
                              <div className="list-row-head">
                                <div>
                                  <div className="list-row-title">{item.make} {item.model} {item.year}</div>
                                  <div className="list-row-meta">{item.supplierName || 'Supplier not assigned'}</div>
                                </div>
                                <StatusBadge value={item.status || 'available'} compact />
                              </div>
                              <div className="list-row-meta">{formatCurrency(item.price)} · {toTitleCase(item.condition)}</div>
                            </>
                          ) : (
                            <>
                              <div className="list-row-head">
                                <div>
                                  <div className="list-row-title">{item.customerName}</div>
                                  <div className="list-row-meta">{item.vehicleDescription}</div>
                                </div>
                                <StatusBadge value={item.stage || 'vehicle_selected'} compact />
                              </div>
                              <div className="list-row-meta">{formatCurrency(item.amount || item.totalAmount)}</div>
                            </>
                          )}
                        </button>
                      ))
                    ) : (
                      <div className="empty-state" style={{ minHeight: '180px' }}>
                        <h3>No matches</h3>
                        <p>No {config.label.toLowerCase()} matched this search term.</p>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </>
      ) : (
        <div className="section-grid">
          <div className="card">
            <div className="card-header">
              <div>
                <div className="card-title">Search the marketplace</div>
                <div className="card-subtitle">Use the global search in the header to query customers, vehicles, and deals from one place.</div>
              </div>
            </div>
            <div className="list-stack">
              <div className="list-row">
                <div className="list-row-title">Customer searches</div>
                <p>Find records by name, email, phone number, or city.</p>
              </div>
              <div className="list-row">
                <div className="list-row-title">Vehicle searches</div>
                <p>Search by make, model, year, supplier, or availability.</p>
              </div>
              <div className="list-row">
                <div className="list-row-title">Deal searches</div>
                <p>Look up pipeline items by customer, vehicle, or transaction stage.</p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="empty-state" style={{ minHeight: '100%' }}>
              <h3>Global search is ready</h3>
              <p>Enter a term in the header search box to open a cross-module result view here.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
