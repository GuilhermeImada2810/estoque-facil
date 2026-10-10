import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  LogOut,
  Menu,
  X,
  User,
  Boxes,
  ShieldCheck
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../hooks/useToast';
import { FirebaseNotice } from './FirebaseNotice';

export const Layout = () => {
  const { currentUser, logout } = useAuth();
  const { success, error } = useToast();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      success('Sessão encerrada com sucesso.');
      navigate('/login');
    } catch (err) {
      error('Erro ao sair da conta: ' + err.message);
    }
  };

  const getInitials = (name, email) => {
    if (name) {
      return name
        .split(' ')
        .map((n) => n[0])
        .slice(0, 2)
        .join('')
        .toUpperCase();
    }
    if (email) {
      return email.substring(0, 2).toUpperCase();
    }
    return 'EF';
  };

  const displayName = currentUser?.displayName || currentUser?.email?.split('@')[0] || 'Usuário';

  return (
    <div className="app-shell">
      {/* Sidebar Desktop e Mobile Drawer */}
      <aside className={`app-sidebar ${mobileMenuOpen ? 'open' : ''}`}>
        <div className="sidebar-brand">
          <div className="brand-logo-wrap">
            <Boxes className="brand-icon" size={26} />
          </div>
          <div className="brand-info">
            <h1 className="brand-title">Estoque Fácil</h1>
            <span className="brand-tag">Gestão Inteligente</span>
          </div>
          <button
            type="button"
            className="mobile-close-btn"
            onClick={() => setMobileMenuOpen(false)}
            aria-label="Fechar menu"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="sidebar-nav">
          <span className="nav-section-title">Principal</span>
          <NavLink
            to="/dashboard"
            onClick={() => setMobileMenuOpen(false)}
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
          >
            <LayoutDashboard size={20} />
            <span>Dashboard</span>
          </NavLink>

          <NavLink
            to="/produtos"
            onClick={() => setMobileMenuOpen(false)}
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
          >
            <Package size={20} />
            <span>Produtos</span>
          </NavLink>
        </nav>

        <div className="sidebar-footer">
          <div className="user-profile-widget">
            <div className="user-avatar" title={displayName}>
              {getInitials(currentUser?.displayName, currentUser?.email)}
            </div>
            <div className="user-details">
              <span className="user-name" title={displayName}>{displayName}</span>
              <span className="user-email" title={currentUser?.email}>{currentUser?.email}</span>
            </div>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            className="btn-logout"
            title="Encerrar sessão"
          >
            <LogOut size={18} />
            <span>Sair</span>
          </button>
        </div>
      </aside>

      {/* Backdrop para mobile */}
      {mobileMenuOpen && (
        <div
          className="sidebar-backdrop"
          onClick={() => setMobileMenuOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Conteúdo Principal */}
      <div className="app-main">
        {/* Header Superior */}
        <header className="app-header">
          <div className="header-left">
            <button
              type="button"
              className="mobile-menu-toggle"
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Abrir menu de navegação"
            >
              <Menu size={22} />
            </button>
            <div className="header-status-badge">
              <ShieldCheck size={16} />
              <span>Ambiente Seguro</span>
            </div>
          </div>

          <div className="header-right">
            <div className="user-header-pill">
              <User size={16} />
              <span>{displayName}</span>
            </div>
          </div>
        </header>

        {/* Notificação Firebase se faltar config */}
        <FirebaseNotice />

        {/* View / Rota Atual */}
        <main className="app-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
