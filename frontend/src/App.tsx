import { BrowserRouter, Link, Route, Routes, useLocation } from 'react-router-dom';
import { Baby, CalendarDays, ChevronRight, CircleUserRound, Heart, HeartHandshake, Home, Menu, Plus, Sparkles } from 'lucide-react';

import CadastroBebe from './pages/CadastroCrianca';
import CadastroGestacao from './pages/CadastroGestacao';
import CadastroUsuario from './pages/CadastroUsuario';
import Login from './pages/Login';

export default function App() {
  return (
    <BrowserRouter>
      <AppLayout />
    </BrowserRouter>
  );
}

function AppLayout() {
  const location = useLocation();
  const isHome = location.pathname === '/';

  return (
    <div className="app-shell">
      <nav className="app-nav">
        <div className="nav-inner">
          <Link to="/" className="brand">
            <span className="brand-mark text-[#C8526B]"><Heart size={21} strokeWidth={1.8} fill="currentColor" /></span>
            <span className="brand-name">Maternidade</span>
          </Link>
          <div className="nav-links">
            <Link className="nav-link" to="/"><Home size={16} strokeWidth={1.8} />Início</Link>
            <Link className="nav-link" to="/cadastrar-gestacao"><CalendarDays size={16} strokeWidth={1.8} />Gestação</Link>
            <Link className="nav-link" to="/cadastrar-bebe"><Baby size={16} strokeWidth={1.8} />Bebê</Link>
            <Link className="nav-link" to="/login"><CircleUserRound size={16} strokeWidth={1.8} />Entrar</Link>
          </div>
          <button className="mobile-menu-button" type="button" aria-label="Abrir menu"><Menu size={21} /></button>
        </div>
      </nav>

      <main className="page-main">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/cadastrar-usuario" element={<CadastroUsuario />} />
          <Route path="/cadastrar-bebe" element={<CadastroBebe />} />
          <Route path="/cadastrar-gestacao" element={<CadastroGestacao />} />
          <Route path="/" element={<HomeDashboard />} />
        </Routes>
      </main>

      {isHome && (
        <nav className="mobile-bottom-nav" aria-label="Navegação principal">
          <Link className="mobile-bottom-link active" to="/"><Home size={19} strokeWidth={1.8} /><span>Início</span></Link>
          <Link className="mobile-bottom-link" to="/cadastrar-gestacao"><CalendarDays size={19} strokeWidth={1.8} /><span>Gestação</span></Link>
          <Link className="mobile-add-button" to="/cadastrar-gestacao" aria-label="Adicionar gestação"><Plus size={23} strokeWidth={1.8} /></Link>
          <Link className="mobile-bottom-link" to="/cadastrar-bebe"><Baby size={19} strokeWidth={1.8} /><span>Bebê</span></Link>
          <Link className="mobile-bottom-link" to="/login"><CircleUserRound size={19} strokeWidth={1.8} /><span>Conta</span></Link>
        </nav>
      )}
    </div>
  );
}

function HomeDashboard() {
  return (
    <section className="dashboard">
      <header className="dashboard-header">
        <div>
          <p className="eyebrow">Seu espaço de cuidado</p>
          <h1 className="display-title">Olá, vamos cuidar de você?</h1>
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
      </div>

      <div className="dashboard-tip">
        <span className="dashboard-tip-icon"><Heart size={18} strokeWidth={1.7} fill="currentColor" /></span>
        <div><strong>Um lembrete para você</strong><p>Pequenos registros ajudam a guardar grandes momentos.</p></div>
      </div>
    </section>
  );
}
