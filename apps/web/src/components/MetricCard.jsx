import React from 'react';

export default function MetricCard({ icon: Icon, label, value, detail, tone = 'accent', children }) {
  return (
    <article className="metric-card">
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
        {Icon ? (
          <div className={`metric-icon-wrap tone-${tone}`}>
            <Icon size={17} strokeWidth={2.2} />
          </div>
        ) : null}
        <span className="metric-label">{label}</span>
      </div>
      <div className="metric-value">{value}</div>
      {detail ? <p className="metric-detail">{detail}</p> : null}
      {children}
    </article>
  );
}

