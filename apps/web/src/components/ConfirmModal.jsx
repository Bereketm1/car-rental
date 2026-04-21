import React from 'react';
import Modal from './Modal';
import { AlertTriangle } from 'lucide-react';

export default function ConfirmModal({ open, onClose, onConfirm, title, message, confirmText = 'Confirm', isDestructive = false, loading = false }) {
  return (
    <Modal open={open} onClose={onClose} size="small">
      <div style={{ textAlign: 'center', padding: '16px 0 8px' }}>
        {isDestructive ? (
          <div style={{ display: 'inline-flex', padding: '16px', borderRadius: '50%', background: 'var(--accent-danger-soft)', color: 'var(--accent-danger)', marginBottom: '16px' }}>
            <AlertTriangle size={32} />
          </div>
        ) : null}
        <h2 style={{ fontSize: '1.2rem', fontWeight: 800, margin: '0 0 12px 0', color: 'var(--text-primary)' }}>{title}</h2>
        <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', marginBottom: '24px', lineHeight: 1.5 }}>{message}</p>
        
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
          <button 
            type="button" 
            className="btn btn-outline-secondary" 
            onClick={onClose} 
            disabled={loading}
            style={{ minWidth: '100px' }}
          >
            Cancel
          </button>
          <button 
            type="button" 
            className={`btn ${isDestructive ? 'btn-danger' : 'btn-primary'}`} 
            onClick={onConfirm} 
            disabled={loading}
            style={{ minWidth: '100px' }}
          >
            {loading ? 'Working...' : confirmText}
          </button>
        </div>
      </div>
    </Modal>
  );
}
