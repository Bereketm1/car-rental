import React from 'react';

export default function MetricCard({ icon: Icon, label, value, detail, tone = 'accent', children }) {
  return (
    <article className={`metric-card tone-${tone}`}>
      <div className="metric-card-head">
        <div className="metric-icon-wrap">{Icon ? <Icon size={18} strokeWidth={2.2} /> : null}</div>
        <span className="metric-label">{label}</span>
      </div>
      <div className="metric-value">{value}</div>
      {detail ? <p className="metric-detail">{detail}</p> : null}
      {children}
    </article>
  );
}

