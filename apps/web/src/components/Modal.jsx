import React, { useEffect, useRef } from 'react';
import { X } from 'lucide-react';

export default function Modal({ open, onClose, title, subtitle, size = 'medium', children }) {
  const overlayRef = useRef(null);
  const contentRef = useRef(null);

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

  useEffect(() => {
    function handleEsc(event) {
      if (event.key === 'Escape' && open) {
        onClose?.();
      }
    }
    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [open, onClose]);

  function handleOverlayClick(event) {
    if (event.target === overlayRef.current) {
      onClose?.();
    }
  }

  if (!open) return null;

  const sizeClass = size === 'large' ? 'modal-lg' : size === 'small' ? 'modal-sm' : '';

  return (
    <div className="modal-overlay" ref={overlayRef} onClick={handleOverlayClick}>
      <div className={`modal-dialog ${sizeClass}`} ref={contentRef} role="dialog" aria-modal="true">
        <div className="modal-header">
          <div>
            {title ? <h2 className="modal-title">{title}</h2> : null}
            {subtitle ? <p className="modal-subtitle">{subtitle}</p> : null}
          </div>
          <button className="modal-close" type="button" onClick={onClose} aria-label="Close modal">
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
