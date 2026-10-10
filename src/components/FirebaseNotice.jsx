import React from 'react';
import { AlertTriangle, KeyRound, ExternalLink } from 'lucide-react';
import { isFirebaseConfigured } from '../services/firebase';

export const FirebaseNotice = () => {
  if (isFirebaseConfigured) return null;

  return (
    <aside className="firebase-notice-banner" aria-label="Aviso de configuração do Firebase">
      <div className="firebase-notice-content">
        <div className="firebase-notice-icon">
          <AlertTriangle size={22} />
        </div>
        <div className="firebase-notice-text">
          <strong>Configuração do Firebase necessária:</strong>
          <span>
            Para autenticar usuários e salvar produtos na nuvem, preencha as variáveis de ambiente no arquivo <code>.env</code> com base no <code>.env.example</code>.
          </span>
        </div>
      </div>
      <a
        href="https://console.firebase.google.com/"
        target="_blank"
        rel="noopener noreferrer"
        className="firebase-notice-link"
      >
        <KeyRound size={16} />
        Firebase Console
        <ExternalLink size={14} />
      </a>
    </aside>
  );
};
