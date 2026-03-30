import React, { useState } from 'react';

const hotspots = [
  { id: 1, x: 25, y: 40, title: 'Turbocharged Engine', desc: '3.5L V6 with 400HP output.' },
  { id: 2, x: 65, y: 35, title: 'Premium Interior', desc: 'Hand-stitched leather with 12-inch display.' },
  { id: 3, x: 50, y: 80, title: 'Adaptive Suspension', desc: 'Active dampers for a smooth ride on any terrain.' },
];

export default function VehicleHotspots({ vehicle }) {
  const [active, setActive] = useState(null);

  return (
    <div className="hotspots-container" style={{ position: 'relative', overflow: 'hidden', borderRadius: '16px', border: '1px solid var(--border-color)', height: '100%', minHeight: '400px' }}>
      <img src={vehicle.imageUrl || 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&q=80&w=1200'} alt="Vehicle" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'linear-gradient(to bottom, rgba(0,0,0,0.4), transparent 30%, rgba(0,0,0,0.6))' }} />
      
      {hotspots.map(spot => (
        <div key={spot.id} 
             onMouseEnter={() => setActive(spot.id)} 
             onMouseLeave={() => setActive(null)}
             style={{ 
               position: 'absolute', 
               left: `${spot.x}%`, 
               top: `${spot.y}%`, 
               transform: 'translate(-50%, -50%)',
               zIndex: 2
             }}>
          <div className={`hotspot-dot ${active === spot.id ? 'active' : ''}`} />
          {active === spot.id && (
            <div className="hotspot-tooltip animate-in">
              <div className="hotspot-title">{spot.title}</div>
              <div className="hotspot-desc">{spot.desc}</div>
            </div>
          )}
        </div>
      ))}
      
      <div className="hotspots-overlay-text">
        <h3>Feature Tour: {vehicle.make} {vehicle.model}</h3>
        <p>Hover over points to explore the technology.</p>
      </div>

      <style>{`
        .hotspot-dot {
          width: 20px;
          height: 20px;
          background: var(--accent-cyan);
          border-radius: 50%;
          border: 3px solid #fff;
          box-shadow: 0 0 20px rgba(0, 212, 255, 0.6);
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          animation: pulse-cyan 2s infinite;
        }
        .hotspot-dot.active {
          transform: scale(1.3);
          background: #fff;
          border-color: var(--accent-cyan);
        }
        .hotspot-tooltip {
          position: absolute;
          bottom: 30px;
          left: 50%;
          transform: translateX(-50%);
          width: 220px;
          background: var(--bg-card);
          backdrop-filter: blur(12px);
          padding: 16px;
          border-radius: 12px;
          border: 1px solid var(--border-color);
          box-shadow: var(--shadow-lg);
          pointer-events: none;
        }
        .hotspot-title {
          font-weight: 700;
          font-size: 14px;
          color: var(--accent-cyan);
          margin-bottom: 4px;
        }
        .hotspot-desc {
          font-size: 12px;
          color: var(--text-secondary);
          line-height: 1.4;
        }
        .hotspots-overlay-text {
          position: absolute;
          bottom: 24px;
          left: 24px;
          text-shadow: 0 4px 12px rgba(0,0,0,0.8);
        }
        .hotspots-overlay-text h3 {
          color: #fff;
          margin: 0;
          font-size: 20px;
        }
        .hotspots-overlay-text p {
          color: rgba(255,255,255,0.7);
          font-size: 14px;
          margin: 4px 0 0;
        }
        @keyframes pulse-cyan {
          0% { box-shadow: 0 0 0 0 rgba(0, 212, 255, 0.6); }
          70% { box-shadow: 0 0 0 15px rgba(0, 212, 255, 0); }
          100% { box-shadow: 0 0 0 0 rgba(0, 212, 255, 0); }
        }
      `}</style>
    </div>
  );
}
