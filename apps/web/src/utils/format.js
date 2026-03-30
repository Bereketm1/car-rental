export function safeArray(value) {
  return Array.isArray(value) ? value : [];
}

export function formatCurrency(value, options = {}) {
  const amount = Number(value) || 0;
  return new Intl.NumberFormat('en-ET', {
    style: 'currency',
    currency: 'ETB',
    notation: options.compact ? 'compact' : 'standard',
    maximumFractionDigits: options.maximumFractionDigits ?? 0,
  }).format(amount);
}

export function formatCompactNumber(value) {
  return new Intl.NumberFormat('en-US', {
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(Number(value) || 0);
}

export function formatPercent(value, digits = 1) {
  const numeric = Number(value) || 0;
  return `${numeric.toFixed(digits)}%`;
}

export function formatDateTime(value) {
  if (!value) return 'N/A';
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? 'N/A' : date.toLocaleString();
}

export function formatDate(value) {
  if (!value) return 'N/A';
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? 'N/A' : date.toLocaleDateString();
}

export function toTitleCase(value) {
  return String(value || '')
    .replace(/[_-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/\b\w/g, (match) => match.toUpperCase());
}

export function getInitials(value) {
  return String(value || '')
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() || '')
    .join('') || 'MM';
}

const STATUS_TONES = {
  active: 'success',
  approved: 'success',
  available: 'success',
  completed: 'success',
  converted: 'success',
  paid: 'success',
  online: 'success',
  contacted: 'success',

  pending: 'warning',
  submitted: 'warning',
  under_review: 'warning',
  in_review: 'warning',
  requested: 'warning',
  reserved: 'warning',
  financing: 'warning',
  vehicle_selected: 'warning',
  loan_applied: 'warning',
  documentation: 'warning',
  negotiation: 'warning',
  inquiry: 'warning',

  rejected: 'danger',
  cancelled: 'danger',
  inactive: 'danger',
  lost: 'danger',
  offline: 'danger',
  sold: 'danger',

  qualified: 'info',
  draft: 'info',
  planned: 'info',
  new: 'info',
  new_condition: 'info',
  certified: 'info',
  finance: 'info',
  dealer: 'info',
  insurance: 'info',
};

export function getStatusTone(value) {
  const normalized = String(value || 'neutral').toLowerCase().replace(/\s+/g, '_');
  return STATUS_TONES[normalized] || 'neutral';
}

export function sumBy(items, selector) {
  return safeArray(items).reduce((total, item) => total + (Number(selector(item)) || 0), 0);
}

