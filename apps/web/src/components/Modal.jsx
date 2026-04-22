import React, { useEffect, useCallback } from 'react';
import { X } from 'lucide-react';

export default function Modal({ open, onClose, title, subtitle, size = 'medium', children }) {

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  const stableOnClose = useCallback(() => { onClose?.(); }, [onClose]);

  useEffect(() => {
    if (!open) return;
    function handleEsc(event) {
      if (event.key === 'Escape') {
        stableOnClose();
      }
    }
    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [open, stableOnClose]);

  if (!open) return null;

  const sizeClass = size === 'large' ? 'modal-lg' : size === 'small' ? 'modal-sm' : '';

  return (
    <div className="modal-overlay">
      {/* Backdrop: this invisible layer sits BEHIND the dialog and handles close */}
      <div
        className="modal-backdrop-click"
        onClick={stableOnClose}
      />
      {/* Dialog: sits on top of the backdrop via z-index, completely independent */}
      <div className={`modal-dialog ${sizeClass}`} role="dialog" aria-modal="true">
        <div className="modal-header">
          <div>
            {title ? <h2 className="modal-title">{title}</h2> : null}
            {subtitle ? <p className="modal-subtitle">{subtitle}</p> : null}
          </div>
          <button className="modal-close" type="button" onClick={stableOnClose} aria-label="Close modal">
            <X size={18} />
          </button>
        </div>
        <div className="modal-body">
          {children}
        </div>
      </div>
    </div>
  );
}
