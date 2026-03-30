import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2, Search } from 'lucide-react';
import api from '../api';
import { formatCurrency, toTitleCase } from '../utils/format';

function buildSections(results) {
  return [
    {
      label: 'Customers',
      items: results?.customers || [],
      path: '/customers',
      subtitle: (customer) => customer.email || customer.phone || 'Customer profile',
      title: (customer) => `${customer.firstName || ''} ${customer.lastName || ''}`.trim(),
    },
    {
      label: 'Vehicles',
      items: results?.vehicles || [],
      path: '/vehicles',
      subtitle: (vehicle) => `${formatCurrency(vehicle.price)} · ${vehicle.condition || 'vehicle'}`,
      title: (vehicle) => `${vehicle.make || ''} ${vehicle.model || ''} ${vehicle.year || ''}`.trim(),
    },
    {
      label: 'Deals',
      items: results?.deals || [],
      path: '/deals',
      subtitle: (deal) => `${toTitleCase(deal.stage)} · ${formatCurrency(deal.amount || deal.totalAmount)}`,
      title: (deal) => `${deal.customerName || 'Customer'} · ${deal.vehicleDescription || 'Deal'}`,
    },
  ].filter((section) => section.items.length > 0);
}

export default function GlobalSearch() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const wrapperRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (query.trim().length < 2) {
      setResults(null);
      return undefined;
    }

    const timer = setTimeout(async () => {
      setIsLoading(true);
      try {
        const data = await api.get(`/search?q=${encodeURIComponent(query.trim())}`);
        setResults(data);
      } catch (error) {
        console.error('Search failed', error);
      } finally {
        setIsLoading(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    function handleOutsideClick(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setResults(null);
      }
    }

    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const sections = useMemo(() => buildSections(results), [results]);
  const totalResults = sections.reduce((total, section) => total + section.items.length, 0);

  function handleSubmit() {
    if (query.trim().length < 2) return;
    navigate(`/search?q=${encodeURIComponent(query.trim())}`);
    setResults(null);
  }

  return (
    <div className="header-search" ref={wrapperRef} style={{ minWidth: 'min(360px, 100%)' }}>
      <Search size={16} strokeWidth={2.2} />
      <input
        type="text"
        placeholder="Search customers, vehicles, deals"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === 'Enter') handleSubmit();
        }}
      />
      {isLoading ? <Loader2 size={16} strokeWidth={2.2} className="spin" /> : null}

      {results ? (
        <div className="search-dropdown">
          <div className="search-dropdown-header">{totalResults} records matched "{query.trim()}"</div>
          {sections.length ? (
            sections.map((section) => (
              <div key={section.label} className="search-section">
                <h4>{section.label}</h4>
                {section.items.slice(0, 3).map((item) => (
                  <div key={item.id} className="search-item" onClick={() => navigate(section.path)}>
                    <div className="search-item-title">{section.title(item)}</div>
                    <div className="search-item-sub">{section.subtitle(item)}</div>
                  </div>
                ))}
              </div>
            ))
          ) : (
            <div className="search-empty">No results found.</div>
          )}
        </div>
      ) : null}
    </div>
  );
}

