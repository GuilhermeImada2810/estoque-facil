import React, { useState, useCallback } from 'react';
import { CheckCircle2, AlertCircle, AlertTriangle, Info, X } from 'lucide-react';
import { ToastContext } from './toastContextDef';

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback((message, type = 'info', duration = 4000) => {
    const id = Date.now() + Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);

    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }
  }, [removeToast]);

  const success = useCallback((msg) => addToast(msg, 'success'), [addToast]);
  const error = useCallback((msg) => addToast(msg, 'error', 5000), [addToast]);
  const warning = useCallback((msg) => addToast(msg, 'warning', 4500), [addToast]);
  const info = useCallback((msg) => addToast(msg, 'info'), [addToast]);

  return (
    <ToastContext.Provider value={{ success, error, warning, info, addToast }}>
      {children}
      <div className="toast-container" aria-live="polite">
        {toasts.map((toast) => {
          let Icon = Info;
          let typeClass = 'toast-info';
          if (toast.type === 'success') {
            Icon = CheckCircle2;
            typeClass = 'toast-success';
          } else if (toast.type === 'error') {
            Icon = AlertCircle;
            typeClass = 'toast-error';
          } else if (toast.type === 'warning') {
            Icon = AlertTriangle;
            typeClass = 'toast-warning';
          }

          return (
            <div key={toast.id} className={`toast-card ${typeClass}`}>
              <div className="toast-icon-wrapper">
                <Icon size={20} />
              </div>
              <div className="toast-content">
                <p className="toast-message">{toast.message}</p>
              </div>
              <button
                type="button"
                onClick={() => removeToast(toast.id)}
                className="toast-close-btn"
                aria-label="Fechar notificação"
              >
                <X size={16} />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
};
