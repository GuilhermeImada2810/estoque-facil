import React from 'react';
import { AlertCircle, Trash2, X } from 'lucide-react';

export const ConfirmModal = ({ isOpen, onClose, onConfirm, title, message, itemName, loading }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div className="modal-dialog modal-danger" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-header-icon danger">
            <AlertCircle size={22} />
          </div>
          <h3 className="modal-title">{title || 'Confirmar Exclusão'}</h3>
          <button
            type="button"
            className="modal-close-btn"
            onClick={onClose}
            aria-label="Fechar"
            disabled={loading}
          >
            <X size={18} />
          </button>
        </div>

        <div className="modal-body">
          <p className="modal-message">
            {message || 'Tem certeza de que deseja excluir este item? Esta ação não pode ser desfeita.'}
          </p>
          {itemName && (
            <div className="modal-highlight-box">
              <strong>Produto:</strong> {itemName}
            </div>
          )}
        </div>

        <div className="modal-footer">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={onClose}
            disabled={loading}
          >
            Cancelar
          </button>
          <button
            type="button"
            className="btn btn-danger"
            onClick={onConfirm}
            disabled={loading}
          >
            {loading ? (
              <span className="spinner-sm" />
            ) : (
              <>
                <Trash2 size={16} />
                Excluir
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
