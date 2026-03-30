import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { AlertCircle, AlertTriangle, CheckCircle2, Info, Loader2, X } from 'lucide-react';

const ToastContext = createContext(null);

export function useToast() {
  return useContext(ToastContext);
}

function ToastItem({ toast, onRemove }) {
  const [progress, setProgress] = useState(100);
  const [exiting, setExiting] = useState(false);
  const duration = toast.duration || 4000;

  useEffect(() => {
    if (toast.type === 'loading') return undefined;

    const interval = setInterval(() => {
      setProgress((current) => Math.max(0, current - (100 / (duration / 50))));
    }, 50);

    const timer = setTimeout(() => {
      setExiting(true);
      setTimeout(() => onRemove(toast.id), 240);
    }, duration);

    return () => {
      clearInterval(interval);
      clearTimeout(timer);
    };
  }, [duration, onRemove, toast.id, toast.type]);

  const icons = {
    success: CheckCircle2,
    error: AlertCircle,
    info: Info,
    warning: AlertTriangle,
    loading: Loader2,
  };

  const tones = {
    success: { accent: 'var(--accent-success)', background: 'var(--accent-success-soft)' },
    error: { accent: 'var(--accent-danger)', background: 'var(--accent-danger-soft)' },
    info: { accent: 'var(--accent-blue)', background: 'var(--accent-blue-soft)' },
    warning: { accent: 'var(--accent-warning)', background: 'var(--accent-warning-soft)' },
    loading: { accent: 'var(--accent-primary)', background: 'var(--accent-primary-soft)' },
  };

  const Icon = icons[toast.type] || Info;
  const tone = tones[toast.type] || tones.info;

  return (
    <div
      style={{
        minWidth: '320px',
        maxWidth: '420px',
        padding: '16px 18px',
        borderRadius: '22px',
        background: 'var(--bg-surface-strong)',
        border: '1px solid var(--border-color)',
        boxShadow: 'var(--shadow-md)',
        transform: exiting ? 'translateX(24px)' : 'translateX(0)',
        opacity: exiting ? 0 : 1,
        transition: 'transform 180ms ease, opacity 180ms ease',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
        <div
          style={{
            width: '38px',
            height: '38px',
            display: 'grid',
            placeItems: 'center',
            borderRadius: '14px',
            background: tone.background,
            color: tone.accent,
            flexShrink: 0,
          }}
        >
          <Icon size={18} strokeWidth={2.2} className={toast.type === 'loading' ? 'spin' : ''} />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ color: 'var(--text-primary)', fontWeight: 800, marginBottom: '4px' }}>{toast.title}</div>
          <div style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>{toast.message}</div>
        </div>
        <button
          type="button"
          onClick={() => onRemove(toast.id)}
          style={{ background: 'transparent', border: 0, color: 'var(--text-muted)', cursor: 'pointer' }}
        >
          <X size={16} strokeWidth={2.2} />
        </button>
      </div>
      {toast.type !== 'loading' ? (
        <div
          style={{
            position: 'absolute',
            left: 0,
            bottom: 0,
            height: '3px',
            width: `${progress}%`,
            background: tone.accent,
            transition: 'width 50ms linear',
          }}
        />
      ) : null}
    </div>
  );
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const counterRef = useRef(0);

  const removeToast = useCallback((id) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
  }, []);

  const addToast = useCallback((type, message, title, duration) => {
    const id = Date.now() + counterRef.current++;
    setToasts((current) => [...current, { id, type, message, title, duration }]);
    return id;
  }, []);

  const toast = useMemo(
    () => ({
      success: (message, title = 'Success') => addToast('success', message, title),
      error: (message, title = 'Error') => addToast('error', message, title),
      info: (message, title = 'Info') => addToast('info', message, title),
      warning: (message, title = 'Warning') => addToast('warning', message, title),
      loading: (message, title = 'Working') => addToast('loading', message, title),
      dismiss: (id) => removeToast(id),
      promise: async (promise, messages) => {
        const loadingId = addToast('loading', messages.loading, 'Working');
        try {
          const result = await promise;
          removeToast(loadingId);
          addToast('success', messages.success, 'Success');
          return result;
        } catch (error) {
          removeToast(loadingId);
          addToast('error', messages.error || error.message, 'Error');
          throw error;
        }
      },
    }),
    [addToast, removeToast],
  );

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <div style={{ position: 'fixed', top: '24px', right: '24px', zIndex: 260, display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {toasts.map((toastItem) => (
          <ToastItem key={toastItem.id} toast={toastItem} onRemove={removeToast} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

