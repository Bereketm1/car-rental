/**
 * Utility formatting functions used across all pages.
 */

const ETB = new Intl.NumberFormat('en-ET', {
  style: 'currency',
  currency: 'ETB',
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

const ETB_COMPACT = new Intl.NumberFormat('en', {
  notation: 'compact',
  compactDisplay: 'short',
  minimumFractionDigits: 0,
  maximumFractionDigits: 1,
});

export function formatCurrency(value, options = {}) {
  const num = Number(value || 0);
  if (options.compact) {
    return `ETB ${ETB_COMPACT.format(num)}`;
  }
  return ETB.format(num);
}

export function formatDate(value) {
  if (!value) return '—';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return String(value);
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
}

export function formatDateTime(value) {
  if (!value) return '—';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return String(value);
  return d.toLocaleString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function formatCompactNumber(value) {
  const num = Number(value || 0);
  if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1)}M`;
  if (num >= 1_000) return `${(num / 1_000).toFixed(1)}K`;
  return String(num);
}

export function formatPercent(value) {
  const num = Number(value || 0);
  return `${num.toFixed(1)}%`;
}

export function safeArray(value) {
  if (Array.isArray(value)) return value;
  if (value && typeof value === 'object' && Array.isArray(value.data)) return value.data;
  if (value && typeof value === 'object' && !Array.isArray(value)) {
    // Some endpoints return { success, data } wrapper
    if (value.data && Array.isArray(value.data)) return value.data;
  }
  return [];
}

export function getInitials(name) {
  if (!name) return 'U';
  return name
    .split(' ')
    .filter(Boolean)
    .map((word) => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

