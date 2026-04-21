import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Search as SearchIcon, Users, CarFront, ArrowLeftRight, HeartHandshake, Megaphone } from 'lucide-react';
import api from '../api';
import StatusBadge from '../components/StatusBadge';
import { formatCurrency } from '../utils/format';

const typeIcons = {
  customer: Users,
  vehicle: CarFront,
  deal: ArrowLeftRight,
  partner: HeartHandshake,
  lead: Megaphone,
};

const typeLabels = {
  customer: 'Customer',
  vehicle: 'Vehicle',
  deal: 'Deal',
  partner: 'Partner',
  lead: 'Lead',
};

export default function Search() {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const qParam = searchParams.get('q') || '';

  const [query, setQuery] = useState(qParam);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  useEffect(() => {
    setQuery(qParam);
    if (qParam.trim()) {
      executeSearch(qParam.trim());
    } else {
      setResults([]);
      setSearched(false);
    }
  }, [qParam]);

  async function executeSearch(searchQuery) {
    setLoading(true);
    setSearched(true);
    try {
      const data = await api.get(`/search?q=${encodeURIComponent(searchQuery)}`);
      setResults(Array.isArray(data) ? data : []);
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
    }
  }

  function handleSearch(event) {
    event.preventDefault();
    if (!query.trim()) return;
    executeSearch(query.trim());
  }

  function renderResult(item, index) {
    const type = item._type || 'unknown';
    const Icon = typeIcons[type] || SearchIcon;
    let title = '';
    let subtitle = '';
    let badge = '';

    switch (type) {
      case 'customer':
        title = `${item.firstName || ''} ${item.lastName || ''}`.trim() || 'Customer';
        subtitle = `${item.email || 'No email'} • ${item.city || 'No city'}`;
        badge = item.status;
        break;
      case 'vehicle':
        title = `${item.make || ''} ${item.model || ''} ${item.year || ''}`.trim();
        subtitle = `${formatCurrency(item.price || 0)} • ${item.condition || 'N/A'}`;
        badge = item.status;
        break;
      case 'deal':
        title = item.customerName || 'Deal';
        subtitle = `${item.vehicleDescription || 'Vehicle pending'} • ${formatCurrency(item.totalAmount || item.amount || 0)}`;
        badge = item.stage;
        break;
      case 'partner':
        title = item.name || 'Partner';
        subtitle = `${item.type || 'supplier'} • ${item.city || 'N/A'}`;
        badge = item.status;
        break;
      case 'lead':
        title = item.name || `${item.firstName || ''} ${item.lastName || ''}`.trim() || 'Lead';
        subtitle = `${item.source || 'unknown'} • ${item.vehicleInterest || 'N/A'}`;
        badge = item.status;
        break;
      default:
        title = item.name || item.id || 'Result';
        subtitle = type;
    }

    return (
      <div key={`${type}-${item.id || index}`} className="list-row">
        <div className="list-row-head">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div className="search-result-icon">
              <Icon size={18} />
            </div>
            <div>
              <div className="list-row-title">{title}</div>
              <div className="list-row-meta">{subtitle}</div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className="search-type-label">{typeLabels[type] || type}</span>
            {badge ? <StatusBadge value={badge} compact /> : null}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-shell">
      <div className="page-header">
        <h1>Global search</h1>
        <p>Search across customers, vehicles, deals, partners, and leads in one place.</p>
      </div>

      <div className="card">
        <div className="card-header compact">
          <form onSubmit={handleSearch} style={{ display: 'flex', gap: '12px', width: '100%', alignItems: 'center' }}>
            <div style={{ position: 'relative', flex: 1 }}>
              <SearchIcon size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none' }} />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by name, email, phone, vehicle, or any keyword..."
                style={{ paddingLeft: '42px', width: '100%' }}
              />
            </div>
            <button className="btn btn-primary" type="submit" disabled={loading}>
              {loading ? 'Searching...' : 'Search'}
            </button>
          </form>
        </div>
      </div>

      {searched && (
        <div className="card" style={{ marginTop: '16px' }}>
          <div className="card-header compact">
            <div>
              <div className="card-title">Search results</div>
              <div className="card-subtitle">
                {loading ? 'Searching...' : `${results.length} result${results.length !== 1 ? 's' : ''} found`}
              </div>
            </div>
          </div>
          <div className="list-stack">
            {results.map((item, index) => renderResult(item, index))}
            {!results.length && !loading ? (
              <div className="empty-state compact">
                <h3>No results</h3>
                <p>Try different keywords or check the spelling.</p>
              </div>
            ) : null}
          </div>
        </div>
      )}
    </div>
  );
}
