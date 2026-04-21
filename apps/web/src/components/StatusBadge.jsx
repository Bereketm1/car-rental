import React from 'react';

const statusTheme = {
  // generic
  active: { bg: '#E6F7F0', color: '#0F7B5B' },
  inactive: { bg: '#FEF0E7', color: '#B5600A' },
  pending: { bg: '#FEF6E0', color: '#9A7210' },

  // deal stages
  inquiry: { bg: '#EBF1FB', color: '#2C5DAE' },
  vehicle_selected: { bg: '#E6F7F0', color: '#0F7B5B' },
  loan_applied: { bg: '#FEF6E0', color: '#9A7210' },
  under_review: { bg: '#FEF0E7', color: '#B5600A' },
  negotiation: { bg: '#FEF0E7', color: '#B5600A' },
  financing: { bg: '#EBF1FB', color: '#2C5DAE' },
  documentation: { bg: '#FEF6E0', color: '#9A7210' },
  approval: { bg: '#E6F7F0', color: '#0F7B5B' },
  contract_signed: { bg: '#E6F7F0', color: '#0F7B5B' },
  approved: { bg: '#E6F7F0', color: '#0F7B5B' },
  rejected: { bg: '#FDEAEA', color: '#B83232' },
  completed: { bg: '#E6F7F0', color: '#0F7B5B' },
  cancelled: { bg: '#F3F4F6', color: '#6B7280' },

  // lead / marketing
  new: { bg: '#EBF1FB', color: '#2C5DAE' },
  contacted: { bg: '#FEF6E0', color: '#9A7210' },
  qualified: { bg: '#E6F7F0', color: '#0F7B5B' },
  converted: { bg: '#E6F7F0', color: '#0F7B5B' },

  // vehicle
  available: { bg: '#E6F7F0', color: '#0F7B5B' },
  reserved: { bg: '#FEF6E0', color: '#9A7210' },
  sold: { bg: '#F3F4F6', color: '#6B7280' },

  // condition
  used: { bg: '#FEF0E7', color: '#B5600A' },
  certified: { bg: '#EBF1FB', color: '#2C5DAE' },

  // finance
  in_review: { bg: '#FEF0E7', color: '#B5600A' },
  more_info_needed: { bg: '#FEF6E0', color: '#9A7210' },

  // document
  national_id: { bg: '#EBF1FB', color: '#2C5DAE' },
  salary_letter: { bg: '#FEF6E0', color: '#9A7210' },
  bank_statement: { bg: '#E6F7F0', color: '#0F7B5B' },
  utility_bill: { bg: '#F3F4F6', color: '#6B7280' },
  uploaded: { bg: '#E6F7F0', color: '#0F7B5B' },
  requested: { bg: '#FEF6E0', color: '#9A7210' },
  submitted: { bg: '#EBF1FB', color: '#2C5DAE' },

  // partner
  supplier: { bg: '#EBF1FB', color: '#2C5DAE' },
  dealer: { bg: '#EBF1FB', color: '#2C5DAE' },
  financial_institution: { bg: '#E6F7F0', color: '#0F7B5B' },
  finance: { bg: '#E6F7F0', color: '#0F7B5B' },
  service_provider: { bg: '#FEF6E0', color: '#9A7210' },
  insurance: { bg: '#FEF0E7', color: '#B5600A' },

  // campaign
  draft: { bg: '#F3F4F6', color: '#6B7280' },
  paused: { bg: '#FEF0E7', color: '#B5600A' },
  planned: { bg: '#EBF1FB', color: '#2C5DAE' },

  // generic
  interested: { bg: '#EBF1FB', color: '#2C5DAE' },
  employed: { bg: '#E6F7F0', color: '#0F7B5B' },
  other: { bg: '#F3F4F6', color: '#6B7280' },
  paid: { bg: '#E6F7F0', color: '#0F7B5B' },
  bank: { bg: '#EBF1FB', color: '#2C5DAE' },
  lender: { bg: '#FEF6E0', color: '#9A7210' },
  microfinance: { bg: '#FEF0E7', color: '#B5600A' },
};

const fallback = { bg: '#F3F4F6', color: '#6B7280' };

export default function StatusBadge({ value, compact }) {
  const key = String(value || '').toLowerCase().replace(/[\s-]+/g, '_');
  const theme = statusTheme[key] || fallback;
  const displayLabel = String(value || 'unknown').replace(/_/g, ' ');

  return (
    <span
      className={`status-badge ${compact ? 'compact' : ''}`}
      style={{
        backgroundColor: theme.bg,
        color: theme.color,
      }}
    >
      {displayLabel}
    </span>
  );
}
