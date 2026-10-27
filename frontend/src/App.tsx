import { BrowserRouter, Link, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { Baby, CalendarDays, ChevronRight, CircleUserRound, Heart, HeartHandshake, Home, LogOut, Menu, Plus, Sparkles } from 'lucide-react';

import CadastroBebe from './pages/CadastroCrianca';
import CadastroGestacao from './pages/CadastroGestacao';
import CadastroUsuario from './pages/CadastroUsuario';
import ContinuarCadastro from './pages/ContinuarCadastro';
import Login from './pages/Login';
import MarcosGestacao from './pages/MarcosGestacao';
import MarcosDesenvolvimento from './pages/MarcosDesenvolvimento';
import VacinaBebe from './pages/VacinaBebe';
import VacinaGestante from './pages/VacinaGestante';
import Perfil from './pages/Perfil';
import MarcosCrianca from './pages/MarcosCrianca';
import { AUTH_CHANGED_EVENT, USUARIO_STORAGE_KEY, UsuarioPublico } from './services/usuarioService';

export default function App() {
  return (
    <BrowserRouter>
      <AppLayout />
    </BrowserRouter>
  );
}

function AppLayout() {
  const location = useLocation();
  const [, setAuthVersion] = useState(0);
  const isHome = location.pathname === '/';
  const isAuthenticated = hasValidSession();
  const usuario = getStoredUser();

  useEffect(() => {
    const refresh = () => setAuthVersion((version) => version + 1);
    window.addEventListener(AUTH_CHANGED_EVENT, refresh);
    window.addEventListener('storage', refresh);
    return () => {
      window.removeEventListener(AUTH_CHANGED_EVENT, refresh);
      window.removeEventListener('storage', refresh);
    };
  }, []);

  return (
    <div className="app-shell">
      <nav className="app-nav">
        <div className="nav-inner">
          <Link to="/" className="brand">
            <span className="brand-mark text-[#C8526B]"><Heart size={21} strokeWidth={1.8} fill="currentColor" /></span>
            <span className="brand-name">Maternidade</span>
          </Link>
          <div className="nav-links">
            {isAuthenticated && <Link className="nav-link" to="/"><Home size={16} strokeWidth={1.8} />Início</Link>}
            {isAuthenticated && <Link className="nav-link" to="/cadastrar-gestacao"><CalendarDays size={16} strokeWidth={1.8} />Gestação</Link>}
            {isAuthenticated && <Link className="nav-link" to="/cadastrar-bebe"><Baby size={16} strokeWidth={1.8} />Bebê</Link>}
            {isAuthenticated && <Link className="nav-link" to="/marcos-desenvolvimento"><Sparkles size={16} strokeWidth={1.8} />Marcos</Link>}
            {isAuthenticated && <Link className="nav-link" to="/marcos-gestacao"><CalendarDays size={16} strokeWidth={1.8} />Marcos da gestação</Link>}
            {isAuthenticated && (<Link className="nav-link" to="/vacinas-bebe"><Baby size={16} strokeWidth={1.8} />Vacinas do bebê</Link>)}
            {isAuthenticated && (<Link className="nav-link" to="/vacinas-gestante"><Heart size={16} strokeWidth={1.8} />Vacinas da gestante</Link>)}
          </div>
          {isAuthenticated && usuario ? <ProfileMenu usuario={usuario} /> : (
            <Link className="nav-login-button" to="/login"><CircleUserRound size={18} />Entrar</Link>
          )}
          <button className="mobile-menu-button" type="button" aria-label="Abrir menu"><Menu size={21} /></button>
        </div>
      </nav>

      <main className="page-main">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/cadastrar-usuario" element={<CadastroUsuario />} />
          <Route path="/continuar-cadastro" element={<ProtectedRoute><ContinuarCadastro /></ProtectedRoute>} />
          <Route path="/cadastrar-bebe" element={<ProtectedRoute><CadastroBebe /></ProtectedRoute>} />
          <Route path="/cadastrar-gestacao" element={<ProtectedRoute><CadastroGestacao /></ProtectedRoute>} />
          <Route path="/marcos-desenvolvimento" element={<ProtectedRoute><MarcosDesenvolvimento /></ProtectedRoute>} />
          <Route path="/marcos-gestacao" element={<ProtectedRoute><MarcosGestacao /></ProtectedRoute>} />
          <Route path="/vacinas-bebe" element={<ProtectedRoute><VacinaBebe /></ProtectedRoute>} />
          <Route path="/vacinas-gestante" element={<ProtectedRoute><VacinaGestante /></ProtectedRoute>}/>
          <Route path="/perfil" element={<ProtectedRoute><Perfil /></ProtectedRoute>} />
          <Route path="/" element={isAuthenticated ? <HomeDashboard /> : <WelcomeScreen />} />
          <Route path="/marcos-crianca" element={<ProtectedRoute><MarcosCrianca /></ProtectedRoute>} />
        </Routes>
      </main>

      {isHome && isAuthenticated && (
        <nav className="mobile-bottom-nav" aria-label="Navegação principal">
          <Link className="mobile-bottom-link active" to="/"><Home size={19} strokeWidth={1.8} /><span>Início</span></Link>
          <Link className="mobile-bottom-link" to="/cadastrar-gestacao"><CalendarDays size={19} strokeWidth={1.8} /><span>Gestação</span></Link>
          <Link className="mobile-add-button" to="/cadastrar-gestacao" aria-label="Adicionar gestação"><Plus size={23} strokeWidth={1.8} /></Link>
          <Link className="mobile-bottom-link" to="/cadastrar-bebe"><Baby size={19} strokeWidth={1.8} /><span>Bebê</span></Link>
          <Link className="mobile-bottom-link" to="/perfil"><CircleUserRound size={19} strokeWidth={1.8} /><span>Perfil</span></Link>
        </nav>
      )}
    </div>
  );
}

function ProtectedRoute({ children }: { children: ReactNode }) {
  return hasValidSession()
    ? children
    : <Navigate to="/login" replace />;
}

function ProfileMenu({ usuario }: { usuario: UsuarioPublico }) {
  const [aberto, setAberto] = useState(false);
  const primeiroNome = usuario.nome.trim().split(/\s+/)[0];

  const sair = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('id_usuario');
    localStorage.removeItem(USUARIO_STORAGE_KEY);
    window.dispatchEvent(new Event(AUTH_CHANGED_EVENT));
  };

  return (
    <div className="profile-menu-wrap">
      <button
        className="profile-menu-trigger"
        type="button"
        aria-expanded={aberto}
        aria-haspopup="menu"
        onClick={() => setAberto((value) => !value)}
        onMouseEnter={() => setAberto(true)}
      >
        <span className="profile-photo">{getInitials(usuario.nome)}</span>
        <span className="profile-trigger-name">{primeiroNome}</span>
        <ChevronRight size={15} className={`profile-chevron ${aberto ? 'rotate-90' : ''}`} />
      </button>
      {aberto && (
        <div className="profile-dropdown" role="menu" onMouseLeave={() => setAberto(false)}>
          <div className="profile-dropdown-heading">
            <strong>{usuario.nome}</strong>
            <span>{usuario.email}</span>
          </div>
          <Link to="/perfil" className="profile-dropdown-link" role="menuitem" onClick={() => setAberto(false)}>
            <CircleUserRound size={17} /> Meu perfil
          </Link>
          <button className="profile-dropdown-link profile-logout" type="button" role="menuitem" onClick={sair}>
            <span><LogOut size={17} /> Sair</span>
          </button>
        </div>
      )}
    </div>
  );
}

function WelcomeScreen() {
  return (
    <section className="welcome-screen">
      <div className="welcome-mark" aria-hidden="true">
        <HeartHandshake size={42} strokeWidth={1.35} />
      </div>
      <p className="eyebrow">Um espaço para cuidar</p>
      <h1 className="display-title welcome-title">Acompanhe sua jornada com mais leveza.</h1>
      <p className="page-subtitle welcome-subtitle">
        Organize informações importantes da gestação e dos primeiros momentos do bebê em um só lugar.
      </p>
      <div className="welcome-actions">
        <Link className="primary-button" to="/login">Entrar na minha conta</Link>
        <Link className="secondary-button" to="/cadastrar-usuario">Criar cadastro</Link>
      </div>
      <div className="welcome-benefits">
        <div className="welcome-benefit">
          <Heart size={20} strokeWidth={1.8} fill="currentColor" />
          <strong>Cuidado em um só lugar</strong>
          <span>Organize sua gestação e os primeiros momentos do bebê.</span>
        </div>
        <div className="welcome-benefit">
          <Baby size={20} strokeWidth={1.8} />
          <strong>Acompanhe cada fase</strong>
          <span>Registre informações importantes com praticidade e carinho.</span>
        </div>
        <div className="welcome-benefit">
          <Sparkles size={20} strokeWidth={1.8} />
          <strong>Mais tranquilidade</strong>
          <span>Tenha uma rotina mais leve para cuidar do que realmente importa.</span>
        </div>
      </div>
    </section>
  );
}

function HomeDashboard() {
  const usuario = getStoredUser();
  const nome = usuario?.nome?.trim().split(/\s+/)[0] || 'querida';

  return (
    <section className="dashboard">
      <header className="dashboard-header">
        <div>
          <p className="eyebrow">Seu espaço de cuidado</p>
          <h1 className="display-title">Olá, {nome}!</h1>
          <p className="page-subtitle">Acompanhe sua jornada com leveza, informação e carinho.</p>
        </div>
        <div className="dashboard-avatar"><CircleUserRound size={24} strokeWidth={1.7} /></div>
      </header>

      <div className="dashboard-hero">
        <div>
          <span className="dashboard-hero-icon"><Sparkles size={19} strokeWidth={1.8} /></span>
          <p className="mt-5 text-sm font-bold text-[#3B7280]">Sua jornada começa aqui</p>
          <h2 className="mt-2 text-2xl font-extrabold leading-tight text-slate-800 sm:text-3xl">Um cuidado de cada vez.</h2>
          <p className="mt-3 max-w-md text-sm leading-6 text-slate-600">Registre sua gestação e tenha as informações mais importantes sempre por perto.</p>
          <Link to="/cadastrar-gestacao" className="dashboard-hero-button">Começar acompanhamento <ChevronRight size={17} /></Link>
        </div>
        <div className="dashboard-hero-illustration" aria-hidden="true"><HeartHandshake size={112} strokeWidth={1.15} /></div>
      </div>

      <div className="section-heading">
        <div>
          <p className="eyebrow">Acesso rápido</p>
          <h2 className="section-title">O que você deseja registrar?</h2>
        </div>
      </div>
      <div className="quick-actions">
        <Link to="/cadastrar-gestacao" className="quick-action quick-action-blue group">
          <span className="quick-action-icon"><CalendarDays size={23} strokeWidth={1.7} /></span>
          <span><strong>Acompanhar gestação</strong><small>Calcule a previsão de parto</small></span>
          <ChevronRight size={18} />
        </Link>
        <Link to="/cadastrar-bebe" className="quick-action quick-action-pink group">
          <span className="quick-action-icon"><Baby size={23} strokeWidth={1.7} /></span>
          <span><strong>Cadastrar bebê</strong><small>Registre os primeiros momentos</small></span>
          <ChevronRight size={18} />
        </Link>
        <Link to="/marcos-desenvolvimento" className="quick-action quick-action-blue group">
          <span className="quick-action-icon"><Sparkles size={23} strokeWidth={1.7} /></span>
          <span><strong>Acompanhar desenvolvimento</strong><small>Veja os marcos por idade</small></span>
          <ChevronRight size={18} />
        </Link>
        <Link to="/marcos-gestacao" className="quick-action quick-action-pink group">
          <span className="quick-action-icon"><CalendarDays size={23} strokeWidth={1.7} /></span>
          <span><strong>Marcos da gestação</strong><small>Acompanhe as semanas e a previsão de parto</small></span>
          <ChevronRight size={18} />
        </Link>
      </div>

  <div className="dashboard-tip">
        <span className="dashboard-tip-icon"><Heart size={18} strokeWidth={1.7} fill="currentColor" /></span>
        <div><strong>Um lembrete para você</strong><p>Pequenos registros ajudam a guardar grandes momentos.</p></div>
      </div>
    </section>
  );
}

function getStoredUser(): UsuarioPublico | null {
  const data = localStorage.getItem(USUARIO_STORAGE_KEY);
  if (!data) return null;
  try {
    return JSON.parse(data) as UsuarioPublico;
  } catch {
    return null;
  }
}

function hasValidSession() {
  const token = localStorage.getItem('access_token');
  const usuario = getStoredUser();
  if (!token || !usuario) return false;
  try {
    const payload = JSON.parse(atob(token.split('.')[1])) as { exp?: number };
    return !payload.exp || payload.exp * 1000 > Date.now();
  } catch {
    return false;
  }
}

function getInitials(nome: string) {
  return nome.trim().split(/\s+/).slice(0, 2).map((parte) => parte[0]).join('').toUpperCase();
}
