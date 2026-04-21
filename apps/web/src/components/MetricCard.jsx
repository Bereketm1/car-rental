import React from 'react';

const toneColors = {
  accent: { bg: 'var(--metric-accent-bg)', icon: 'var(--metric-accent-icon)', border: 'var(--metric-accent-border)' },
  success: { bg: 'var(--metric-success-bg)', icon: 'var(--metric-success-icon)', border: 'var(--metric-success-border)' },
  warning: { bg: 'var(--metric-warning-bg)', icon: 'var(--metric-warning-icon)', border: 'var(--metric-warning-border)' },
  info: { bg: 'var(--metric-info-bg)', icon: 'var(--metric-info-icon)', border: 'var(--metric-info-border)' },
  danger: { bg: 'var(--metric-danger-bg)', icon: 'var(--metric-danger-icon)', border: 'var(--metric-danger-border)' },
};

export default function MetricCard({ icon: Icon, label, value, detail, tone = 'accent' }) {
  const colors = toneColors[tone] || toneColors.accent;

  return (
    <div
      className="metric-card"
      style={{
        '--mc-bg': colors.bg,
        '--mc-icon': colors.icon,
        '--mc-border': colors.border,
      }}
    >
      <div className="metric-card-icon">
        {Icon ? <Icon size={22} /> : null}
      </div>
      <div className="metric-card-content">
        <span className="metric-card-label">{label}</span>
        <span className="metric-card-value">{value}</span>
        {detail ? <span className="metric-card-detail">{detail}</span> : null}
      </div>
    </div>
  );
}
