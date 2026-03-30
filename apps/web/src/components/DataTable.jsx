import React, { useMemo, useState } from 'react';
import { ArrowDown, ArrowUp, Search } from 'lucide-react';

export default function DataTable({
  title,
  subtitle,
  actions,
  columns,
  data,
  searchPlaceholder = 'Search records...',
  summary,
  emptyTitle = 'No results found',
  emptyMessage = 'Try adjusting your search or filters.',
}) {
  const [search, setSearch] = useState('');
  const [sortConfig, setSortConfig] = useState(null);

  const filteredData = useMemo(() => {
    let result = [...(Array.isArray(data) ? data : [])];

    if (search.trim()) {
      const query = search.trim().toLowerCase();
      result = result.filter((item) =>
        Object.values(item || {}).some((value) => String(value ?? '').toLowerCase().includes(query)),
      );
    }

    if (sortConfig) {
      result.sort((left, right) => {
        const leftValue = left?.[sortConfig.key];
        const rightValue = right?.[sortConfig.key];

        if (leftValue == null && rightValue == null) return 0;
        if (leftValue == null) return sortConfig.direction === 'asc' ? -1 : 1;
        if (rightValue == null) return sortConfig.direction === 'asc' ? 1 : -1;

        if (leftValue < rightValue) return sortConfig.direction === 'asc' ? -1 : 1;
        if (leftValue > rightValue) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return result;
  }, [data, search, sortConfig]);

  function handleSort(key) {
    setSortConfig((current) => {
      if (!current || current.key !== key) return { key, direction: 'asc' };
      return { key, direction: current.direction === 'asc' ? 'desc' : 'asc' };
    });
  }

  return (
    <div className="table-shell">
      {title || subtitle || actions ? (
        <div className="card-header table-shell-header">
          <div>
            {title ? <div className="card-title">{title}</div> : null}
            {subtitle ? <div className="card-subtitle">{subtitle}</div> : null}
          </div>
          {actions ? <div className="toolbar-cluster">{actions}</div> : null}
        </div>
      ) : null}

      <div className="toolbar">
        <div className="toolbar-cluster">
          <div className="header-search">
            <Search size={16} strokeWidth={2.2} />
            <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder={searchPlaceholder} />
          </div>
        </div>
        <div className="table-footnote">{summary || `Showing ${filteredData.length} records`}</div>
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  onClick={() => column.sortable && handleSort(column.key)}
                  style={{ cursor: column.sortable ? 'pointer' : 'default' }}
                >
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                    {column.label}
                    {column.sortable && sortConfig?.key === column.key ? (
                      sortConfig.direction === 'asc' ? <ArrowUp size={14} strokeWidth={2.2} /> : <ArrowDown size={14} strokeWidth={2.2} />
                    ) : null}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredData.map((item, index) => (
              <tr key={item.id || index}>
                {columns.map((column) => (
                  <td key={column.key}>{column.render ? column.render(item[column.key], item) : item[column.key]}</td>
                ))}
              </tr>
            ))}
            {filteredData.length === 0 ? (
              <tr>
                <td colSpan={columns.length}>
                  <div className="empty-state">
                    <h3>{emptyTitle}</h3>
                    <p>{emptyMessage}</p>
                  </div>
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}
