import React from 'react';
import { Link } from 'react-router-dom';
import { HelpCircle, ArrowLeft } from 'lucide-react';

export const NotFound = () => {
  return (
    <div className="not-found-container">
      <div className="not-found-card">
        <HelpCircle size={64} className="not-found-icon" />
        <h2>Página Não Encontrada</h2>
        <p>O link que você tentou acessar não existe ou foi removido.</p>
        <Link to="/dashboard" className="btn btn-primary">
          <ArrowLeft size={18} />
          <span>Voltar ao Dashboard</span>
        </Link>
      </div>
    </div>
  );
};
