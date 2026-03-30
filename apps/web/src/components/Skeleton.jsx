import React from 'react';

/**
 * Reusable Skeleton loader component using CSS shimmer effect.
 */
export default function Skeleton({ type, count = 1, style }) {
  const elements = Array.from({ length: count });

  const renderSkeleton = (index) => {
    switch (type) {
      case 'text':
        return <div key={index} className="skeleton skeleton-text" style={style}></div>;
      case 'title':
        return <div key={index} className="skeleton skeleton-title" style={style}></div>;
      case 'card':
        return <div key={index} className="skeleton skeleton-card" style={style}></div>;
      case 'stat':
        return <div key={index} className="skeleton skeleton-stat" style={style}></div>;
      case 'row':
        return <div key={index} className="skeleton skeleton-row" style={style}></div>;
      default:
        return <div key={index} className="skeleton" style={{ height: '20px', width: '100%', ...style }}></div>;
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '100%' }}>
      {elements.map((_, i) => renderSkeleton(i))}
    </div>
  );
}
