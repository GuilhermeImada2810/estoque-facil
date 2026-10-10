import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Boxes,
  Mail,
  Lock,
  User,
  ArrowRight,
  TrendingUp,
  Shield,
  Layers,
  KeyRound
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../hooks/useToast';
import { getAuthErrorMessage } from '../utils/authErrors';
import { FirebaseNotice } from '../components/FirebaseNotice';

export const Login = () => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [isResettingPassword, setIsResettingPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [resetEmail, setResetEmail] = useState('');

  const { login, signup, resetPassword } = useAuth();
  const { success, error } = useToast();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email.trim() || !password) {
      error('Preencha seu e-mail e senha.');
      return;
    }

    setLoading(true);
    try {
      await login(email.trim(), password);
      success('Login efetuado com sucesso! Bem-vindo(a).');
      navigate('/dashboard');
    } catch (err) {
      error(getAuthErrorMessage(err.code || err.message));
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!displayName.trim()) {
      error('Informe seu nome ou o nome da sua empresa.');
      return;
    }
    if (!email.trim() || !password) {
      error('Preencha todos os campos obrigatórios.');
      return;
    }
    if (password.length < 6) {
      error('A senha deve conter no mínimo 6 caracteres.');
      return;
    }
    if (password !== confirmPassword) {
      error('As senhas digitadas não coincidem.');
      return;
    }

    setLoading(true);
    try {
      await signup(email.trim(), password, displayName.trim());
      success('Conta criada com sucesso! Seja bem-vindo(a) ao Estoque Fácil.');
      navigate('/dashboard');
    } catch (err) {
      error(getAuthErrorMessage(err.code || err.message));
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!resetEmail.trim()) {
      error('Informe seu endereço de e-mail para recuperar o acesso.');
      return;
    }

    setLoading(true);
    try {
      await resetPassword(resetEmail.trim());
      success('Link de recuperação enviado com sucesso! Verifique sua caixa de entrada.');
      setIsResettingPassword(false);
      setEmail(resetEmail);
    } catch (err) {
      error(getAuthErrorMessage(err.code || err.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        {/* Lado Esquerdo: Banner Visual e Recursos */}
        <div className="auth-hero-panel">
          <div className="auth-hero-content">
            <div className="auth-hero-logo">
              <Boxes size={36} />
              <span>Estoque Fácil</span>
            </div>

            <h2 className="auth-hero-title">
              O controle de estoque simples, ágil e eficiente para o seu negócio.
            </h2>
            <p className="auth-hero-subtitle">
              Cadastre produtos, monitore preços, evite faltas e tome decisões inteligentes para sua pequena empresa em tempo real.
            </p>

            <div className="auth-features-list">
              <div className="auth-feature-item">
                <div className="feature-icon-badge">
                  <TrendingUp size={18} />
                </div>
                <div>
                  <strong>Métricas em Tempo Real</strong>
                  <p>Monitore o valor total do seu patrimônio e a quantidade de itens.</p>
                </div>
              </div>

              <div className="auth-feature-item">
                <div className="feature-icon-badge">
                  <Shield size={18} />
                </div>
                <div>
                  <strong>Acesso Isolado e Seguro</strong>
                  <p>Seus dados e produtos são restritos apenas à sua conta.</p>
                </div>
              </div>

              <div className="auth-feature-item">
                <div className="feature-icon-badge">
                  <Layers size={18} />
                </div>
                <div>
                  <strong>Alertas de Baixo Estoque</strong>
                  <p>Identifique na hora quais mercadorias precisam de reposição.</p>
                </div>
              </div>
            </div>

            <div className="auth-hero-footer">
              <span>Desenvolvido com React, Vite e Firebase</span>
            </div>
          </div>
        </div>

        {/* Lado Direito: Formulário */}
        <div className="auth-form-panel">
          <FirebaseNotice />

          <div className="auth-card">
            {isResettingPassword ? (
              /* Formulário de Recuperação de Senha */
              <div className="auth-flow-wrapper">
                <div className="auth-header">
                  <div className="auth-header-icon">
                    <KeyRound size={26} />
                  </div>
                  <h3>Recuperar Senha</h3>
                  <p>Enviaremos um link de redefinição para o seu e-mail cadastrado.</p>
                </div>

                <form onSubmit={handleResetPassword} className="auth-form">
                  <div className="form-group">
                    <label htmlFor="reset-email" className="form-label">E-mail Cadastrado</label>
                    <div className="input-group">
                      <Mail size={18} className="input-icon" />
                      <input
                        id="reset-email"
                        type="email"
                        required
                        value={resetEmail}
                        onChange={(e) => setResetEmail(e.target.value)}
                        placeholder="seu@email.com"
                        className="form-input"
                        disabled={loading}
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="btn btn-primary btn-block btn-lg"
                    disabled={loading}
                  >
                    {loading ? <span className="spinner-sm" /> : 'Enviar E-mail de Recuperação'}
                  </button>

                  <button
                    type="button"
                    onClick={() => setIsResettingPassword(false)}
                    className="btn btn-text btn-block"
                    disabled={loading}
                  >
                    Voltar para o Login
                  </button>
                </form>
              </div>
            ) : (
              /* Formulário de Login / Cadastro */
              <div className="auth-flow-wrapper">
                <div className="auth-tabs">
                  <button
                    type="button"
                    className={`auth-tab-btn ${!isRegistering ? 'active' : ''}`}
                    onClick={() => setIsRegistering(false)}
                  >
                    Entrar na Conta
                  </button>
                  <button
                    type="button"
                    className={`auth-tab-btn ${isRegistering ? 'active' : ''}`}
                    onClick={() => setIsRegistering(true)}
                  >
                    Criar Nova Conta
                  </button>
                </div>

                <div className="auth-header">
                  <h3>{isRegistering ? 'Crie sua conta gratuitamente' : 'Bem-vindo de volta!'}</h3>
                  <p>
                    {isRegistering
                      ? 'Preencha seus dados para gerenciar o estoque da sua empresa.'
                      : 'Acesse o painel com suas credenciais cadastradas.'}
                  </p>
                </div>

                <form onSubmit={isRegistering ? handleRegister : handleLogin} className="auth-form">
                  {isRegistering && (
                    <div className="form-group">
                      <label htmlFor="reg-name" className="form-label">Seu Nome ou Empresa</label>
                      <div className="input-group">
                        <User size={18} className="input-icon" />
                        <input
                          id="reg-name"
                          type="text"
                          required
                          value={displayName}
                          onChange={(e) => setDisplayName(e.target.value)}
                          placeholder="Ex: Mercadinho Central ou João Silva"
                          className="form-input"
                          disabled={loading}
                        />
                      </div>
                    </div>
                  )}

                  <div className="form-group">
                    <label htmlFor="auth-email" className="form-label">Endereço de E-mail</label>
                    <div className="input-group">
                      <Mail size={18} className="input-icon" />
                      <input
                        id="auth-email"
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="seu@empresa.com"
                        className="form-input"
                        disabled={loading}
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <div className="label-with-action">
                      <label htmlFor="auth-password" className="form-label">Senha</label>
                      {!isRegistering && (
                        <button
                          type="button"
                          onClick={() => {
                            setResetEmail(email);
                            setIsResettingPassword(true);
                          }}
                          className="form-link-subtle"
                        >
                          Esqueceu a senha?
                        </button>
                      )}
                    </div>
                    <div className="input-group">
                      <Lock size={18} className="input-icon" />
                      <input
                        id="auth-password"
                        type="password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder={isRegistering ? 'Mínimo de 6 caracteres' : 'Sua senha'}
                        className="form-input"
                        disabled={loading}
                      />
                    </div>
                  </div>

                  {isRegistering && (
                    <div className="form-group">
                      <label htmlFor="reg-confirm-password" className="form-label">Confirmar Senha</label>
                      <div className="input-group">
                        <Lock size={18} className="input-icon" />
                        <input
                          id="reg-confirm-password"
                          type="password"
                          required
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          placeholder="Repita a senha digitada"
                          className="form-input"
                          disabled={loading}
                        />
                      </div>
                    </div>
                  )}

                  <button
                    type="submit"
                    className="btn btn-primary btn-block btn-lg"
                    disabled={loading}
                  >
                    {loading ? (
                      <span className="spinner-sm" />
                    ) : (
                      <>
                        <span>{isRegistering ? 'Cadastrar e Começar' : 'Acessar Estoque'}</span>
                        <ArrowRight size={18} />
                      </>
                    )}
                  </button>
                </form>

                <div className="auth-footer-toggle">
                  {isRegistering ? (
                    <p>
                      Já possui uma conta?{' '}
                      <button
                        type="button"
                        onClick={() => setIsRegistering(false)}
                        className="form-link"
                      >
                        Fazer login
                      </button>
                    </p>
                  ) : (
                    <p>
                      Ainda não tem uma conta?{' '}
                      <button
                        type="button"
                        onClick={() => setIsRegistering(true)}
                        className="form-link"
                      >
                        Cadastre-se grátis
                      </button>
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
