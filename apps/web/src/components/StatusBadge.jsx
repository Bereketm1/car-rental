import React from 'react';
import { getStatusTone, toTitleCase } from '../utils/format';

export default function StatusBadge({ value, tone, compact = false, className = '' }) {
  const normalized = String(value || 'unknown').toLowerCase().replace(/\s+/g, '_');
  const resolvedTone = tone || getStatusTone(normalized);
  const label = toTitleCase(normalized);

  return (
    <span className={`status-badge tone-${resolvedTone} ${compact ? 'compact' : ''} ${className}`.trim()}>
      <span className="status-badge-dot" />
      {label}
    </span>
  );
}

