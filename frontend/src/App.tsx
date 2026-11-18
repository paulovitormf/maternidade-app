import { BrowserRouter, Link, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { Baby, Bell, CalendarDays, ChevronDown, ChevronRight, ChevronUp, CircleUserRound, Heart, HeartHandshake, Home, LogOut, Menu, MessageCircle, Plus, Sparkles, Syringe, UserPlus, X } from 'lucide-react';
import { listarNotificacoes, marcarNotificacoesComoLidas } from './services/notificacaoService';
import type { Notificacao } from './services/notificacaoService';

import CadastroBebe from './pages/CadastroCrianca';
import CadastroGestacao from './pages/CadastroGestacao';
import CadastroUsuario from './pages/CadastroUsuario';
import ContinuarCadastro from './pages/ContinuarCadastro';
import Login from './pages/Login';
import JornadaGestacao from './pages/JornadaGestacao';
import JornadaDesenvolvimento from './pages/JornadaDesenvolvimento';
import Vacinas from './pages/Vacinas';
import Perfil from './pages/Perfil';
import JornadaCrianca from './pages/JornadaCrianca';
import Foruns from './pages/Foruns';
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
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

  // Fechar o menu móvel ao mudar de rota
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  return (
    <div className="app-shell">
      <nav className="app-nav">
        <div className="nav-inner">
          <Link to="/" className="brand">
            <span className="brand-mark text-[#C8526B]"><Heart size={21} strokeWidth={1.8} fill="currentColor" /></span>
            <span className="brand-name">Maternidade</span>
          </Link>
          <div className="nav-links">
            {isAuthenticated && <Link className={`nav-link ${location.pathname === '/' ? 'nav-link-active' : ''}`} to="/"><Home size={16} strokeWidth={1.8} />Início</Link>}
            {isAuthenticated && (
              <NavDropdown
                titulo="Gestação"
                icone={<CalendarDays size={16} strokeWidth={1.8} />}
                itens={[
                  { to: '/cadastrar-gestacao', rotulo: 'Minhas gestações', icone: <CalendarDays size={15} /> },
                  { to: '/jornada-gestacao', rotulo: 'Jornada da gestação', icone: <Sparkles size={15} /> },
                ]}
              />
            )}
            {isAuthenticated && (
              <NavDropdown
                titulo="Bebê & Criança"
                icone={<Baby size={16} strokeWidth={1.8} />}
                itens={[
                  { to: '/cadastrar-bebe', rotulo: 'Meus bebês', icone: <Baby size={15} /> },
                  { to: '/jornadas-desenvolvimento', rotulo: 'Jornada por fases', icone: <Sparkles size={15} /> },
                  { to: '/jornada-crianca', rotulo: 'Acompanhamento até 5 anos', icone: <CalendarDays size={15} /> },
                ]}
              />
            )}
            {isAuthenticated && (
              <Link className={`nav-link ${location.pathname.startsWith('/vacinas') ? 'nav-link-active' : ''}`} to="/vacinas">
                <Syringe size={16} strokeWidth={1.8} />Vacinas
              </Link>
            )}
            {isAuthenticated && <Link className={`nav-link ${location.pathname === '/foruns' ? 'nav-link-active' : ''}`} to="/foruns"><MessageCircle size={16} strokeWidth={1.8} />Fóruns</Link>}
          </div>
          {isAuthenticated && usuario ? (
            <div className="nav-user-actions">
              <NotificationCenter />
              <ProfileMenu usuario={usuario} />
            </div>
          ) : (
            <Link className="nav-login-button" to="/login"><CircleUserRound size={18} />Entrar</Link>
          )}
          {isAuthenticated && (
            <button
              className="mobile-menu-button ml-2"
              type="button"
              aria-label={mobileMenuOpen ? 'Fechar menu' : 'Abrir menu'}
              aria-expanded={mobileMenuOpen}
              onClick={() => setMobileMenuOpen((open) => !open)}
            >
              {mobileMenuOpen ? <X size={21} /> : <Menu size={21} />}
            </button>
          )}
        </div>
      </nav>

      {/* Gaveta de navegação Mobile */}
      {isAuthenticated && mobileMenuOpen && (
        <aside className="mobile-drawer-overlay sm:hidden" onClick={() => setMobileMenuOpen(false)}>
          <div className="mobile-drawer-content" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between border-b border-[#FADCE1] pb-4 mb-4">
              <div className="flex items-center gap-2.5">
                <span className="brand-mark !h-9 !w-9 !rounded-xl text-[#C8526B]"><Heart size={18} strokeWidth={1.8} fill="currentColor" /></span>
                <span className="brand-name !text-lg">Maternidade</span>
              </div>
              <button
                type="button"
                className="flex h-9 w-9 items-center justify-center rounded-xl bg-white border border-[#FECDD3] text-slate-500 hover:bg-[#FADCE1] hover:text-[#B0435B] transition"
                onClick={() => setMobileMenuOpen(false)}
                aria-label="Fechar menu"
              >
                <X size={19} />
              </button>
            </div>

            <div className="space-y-1.5 pb-6">
              <Link className={`mobile-nav-link ${location.pathname === '/' ? 'mobile-nav-link-active' : ''}`} to="/"><Home size={18} /><span>Início</span></Link>
              <Link className={`mobile-nav-link ${location.pathname === '/foruns' ? 'mobile-nav-link-active' : ''}`} to="/foruns"><MessageCircle size={18} /><span>Fóruns</span></Link>

              <p className="mobile-nav-heading">Gestação</p>
              <Link className={`mobile-nav-link ${location.pathname === '/cadastrar-gestacao' ? 'mobile-nav-link-active' : ''}`} to="/cadastrar-gestacao"><CalendarDays size={18} /><span>Minhas gestações</span></Link>
              <Link className={`mobile-nav-link ${location.pathname === '/jornada-gestacao' ? 'mobile-nav-link-active' : ''}`} to="/jornada-gestacao"><Sparkles size={18} /><span>Jornada da gestação</span></Link>

              <p className="mobile-nav-heading">Bebê e Criança</p>
              <Link className={`mobile-nav-link ${location.pathname === '/cadastrar-bebe' ? 'mobile-nav-link-active' : ''}`} to="/cadastrar-bebe"><Baby size={18} /><span>Meus bebês</span></Link>
              <Link className={`mobile-nav-link ${location.pathname === '/jornadas-desenvolvimento' ? 'mobile-nav-link-active' : ''}`} to="/jornadas-desenvolvimento"><Sparkles size={18} /><span>Jornadas de desenvolvimento</span></Link>
              <Link className={`mobile-nav-link ${location.pathname === '/jornada-crianca' ? 'mobile-nav-link-active' : ''}`} to="/jornada-crianca"><CalendarDays size={18} /><span>Acompanhamento até 5 anos</span></Link>

              <p className="mobile-nav-heading">Vacinas</p>
              <Link className={`mobile-nav-link ${location.pathname.startsWith('/vacinas') ? 'mobile-nav-link-active' : ''}`} to="/vacinas"><Syringe size={18} /><span>Vacinas da mãe e do bebê</span></Link>

              <p className="mobile-nav-heading">Sua Conta</p>
              <Link className={`mobile-nav-link ${location.pathname === '/perfil' ? 'mobile-nav-link-active' : ''}`} to="/perfil"><CircleUserRound size={18} /><span>Meu perfil</span></Link>
            </div>
          </div>
        </aside>
      )}

      <main className="page-main">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/cadastrar-usuario" element={<CadastroUsuario />} />
          <Route path="/continuar-cadastro" element={<ProtectedRoute><ContinuarCadastro /></ProtectedRoute>} />
          <Route path="/cadastrar-bebe" element={<ProtectedRoute><CadastroBebe /></ProtectedRoute>} />
          <Route path="/cadastrar-gestacao" element={<ProtectedRoute><CadastroGestacao /></ProtectedRoute>} />
          <Route path="/jornadas-desenvolvimento" element={<ProtectedRoute><JornadaDesenvolvimento /></ProtectedRoute>} />
          <Route path="/jornada-gestacao" element={<ProtectedRoute><JornadaGestacao /></ProtectedRoute>} />
          <Route path="/vacinas" element={<ProtectedRoute><Vacinas /></ProtectedRoute>} />
          <Route path="/vacinas-bebe" element={<ProtectedRoute><Vacinas publicoInicial="bebe" /></ProtectedRoute>} />
          <Route path="/vacinas-gestante" element={<ProtectedRoute><Vacinas /></ProtectedRoute>} />
          <Route path="/perfil" element={<ProtectedRoute><Perfil /></ProtectedRoute>} />
          <Route path="/foruns" element={<ProtectedRoute><Foruns /></ProtectedRoute>} />
          <Route path="/foruns/:topicId" element={<ProtectedRoute><Foruns /></ProtectedRoute>} />
          <Route path="/" element={isAuthenticated ? <HomeDashboard /> : <WelcomeScreen />} />
          <Route path="/jornada-crianca" element={<ProtectedRoute><JornadaCrianca /></ProtectedRoute>} />
        </Routes>
      </main>

      {isAuthenticated && (
        <nav className="mobile-bottom-nav" aria-label="Navegação principal">
          <Link className={`mobile-bottom-link ${location.pathname === '/' ? 'active' : ''}`} to="/"><Home size={19} strokeWidth={1.8} /><span>Início</span></Link>
          <Link className={`mobile-bottom-link ${location.pathname.startsWith('/cadastrar-gestacao') || location.pathname.startsWith('/jornada-gestacao') ? 'active' : ''}`} to="/cadastrar-gestacao"><CalendarDays size={19} strokeWidth={1.8} /><span>Gestação</span></Link>
          <Link className="mobile-add-button" to="/cadastrar-gestacao" aria-label="Adicionar gestação"><Plus size={23} strokeWidth={1.8} /></Link>
          <Link className={`mobile-bottom-link ${location.pathname.startsWith('/cadastrar-bebe') || location.pathname.startsWith('/jornada') ? 'active' : ''}`} to="/cadastrar-bebe"><Baby size={19} strokeWidth={1.8} /><span>Bebê</span></Link>
          <Link className={`mobile-bottom-link ${location.pathname === '/perfil' ? 'active' : ''}`} to="/perfil"><CircleUserRound size={19} strokeWidth={1.8} /><span>Perfil</span></Link>
        </nav>
      )}
    </div>
  );
}

function NavDropdown({
  titulo,
  icone,
  itens,
}: {
  titulo: string;
  icone: ReactNode;
  itens: { to: string; rotulo: string; icone: ReactNode }[];
}) {
  const [aberto, setAberto] = useState(false);
  const location = useLocation();
  const ativo = itens.some((item) => location.pathname === item.to);

  return (
    <div
      className="relative"
      onMouseEnter={() => setAberto(true)}
      onMouseLeave={() => setAberto(false)}
    >
      <button
        type="button"
        className={`nav-link ${ativo ? 'nav-link-active' : ''}`}
        onClick={() => setAberto((val) => !val)}
        aria-expanded={aberto}
      >
        {icone}
        {titulo}
        <ChevronDown size={14} className={`transition-transform ${aberto ? 'rotate-180' : ''}`} />
      </button>

      {aberto && (
        <div className="nav-dropdown-menu" role="menu">
          <div className="nav-dropdown-surface">
            {itens.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className={`nav-dropdown-item ${location.pathname === item.to ? 'nav-dropdown-item-active' : ''}`}
                role="menuitem"
                onClick={() => setAberto(false)}
              >
                {item.icone}
                <span>{item.rotulo}</span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function ProtectedRoute({ children }: { children: ReactNode }) {
  return hasValidSession()
    ? children
    : <Navigate to="/login" replace />;
}

function NotificationCenter() {
  const [aberto, setAberto] = useState(false);
  const [animacoesAtivas, setAnimacoesAtivas] = useState(false);
  const [notificacoes, setNotificacoes] = useState<Notificacao[]>([]);
  const [erro, setErro] = useState(false);

  useEffect(() => {
    listarNotificacoes()
      .then(setNotificacoes)
      .catch(() => setErro(true));
  }, []);

  useEffect(() => {
    if (!aberto) return;
    const fecharAoClicarFora = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('.notification-menu-wrap')) {
        setAberto(false);
      }
    };
    document.addEventListener('click', fecharAoClicarFora);
    return () => document.removeEventListener('click', fecharAoClicarFora);
  }, [aberto]);

  const alternarNotificacoes = () => {
    setAnimacoesAtivas(true);
    const novoEstado = !aberto;
    setAberto(novoEstado);
    if (novoEstado && notificacoes.some((notificacao) => notificacao.status !== 'LIDA')) {
      marcarNotificacoesComoLidas()
        .then(() => setNotificacoes((atuais) => atuais.map((notificacao) => ({ ...notificacao, status: 'LIDA' }))))
        .catch(() => undefined);
    }
  };

  return (
    <div className={`notification-menu-wrap ${aberto ? 'notification-menu-wrap-open' : ''} ${animacoesAtivas ? 'notification-animations-ready' : ''}`}>
      <div className={`notification-morph-container ${aberto ? 'notification-morph-expanded' : ''}`}>
        <button
          className={`notification-trigger ${aberto ? 'notification-trigger-open' : ''}`}
          type="button"
          aria-label="Abrir notificações"
          aria-expanded={aberto}
          aria-controls="notification-panel"
          onClick={alternarNotificacoes}
        >
          {aberto && (
            <span className="notification-trigger-copy">
              <strong>Notificações</strong>
              <span>Avisos importantes aparecerão aqui.</span>
            </span>
          )}
          {notificacoes.some((notificacao) => notificacao.status !== 'LIDA') && (
            <span className="notification-badge" aria-label={`${notificacoes.filter((notificacao) => notificacao.status !== 'LIDA').length} notificações`}>
              {notificacoes.filter((notificacao) => notificacao.status !== 'LIDA').length}
            </span>
          )}
        </button>
        <section className={`notification-panel ${aberto ? 'notification-panel-open' : 'notification-panel-closed'}`} id="notification-panel" aria-label="Notificações" aria-hidden={!aberto}>
          <div className="notification-panel-content">
            {erro ? (
              <div className="notification-empty">
                <strong>Não foi possível carregar as notificações.</strong>
              </div>
            ) : notificacoes.length === 0 ? (
              <div className="notification-empty">
                <Bell size={27} strokeWidth={1.8} aria-hidden="true" />
                <strong>Nenhuma notificação nova</strong>
                <p>Você está em dia por enquanto.</p>
              </div>
            ) : (
              <div className="notification-list">
                {notificacoes.map((notificacao) => (
                  <article className={`notification-item ${notificacao.status === 'LIDA' ? 'read' : 'unread'}`} key={notificacao.id}>
                    <Bell size={17} aria-hidden="true" />
                    <div>
                      <strong>{notificacao.titulo}</strong>
                      <p>{notificacao.mensagem}</p>
                      <time>{new Date(notificacao.dataAgendada).toLocaleString('pt-BR')}</time>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        </section>
      </div>
      <span className="notification-fixed-icon" aria-hidden="true">
        <Bell size={18} strokeWidth={2.2} />
      </span>
    </div>
  );
}

function ProfileMenu({ usuario }: { usuario: UsuarioPublico }) {
  const [aberto, setAberto] = useState(false);
  const primeiroNome = usuario.nome.trim().split(/\s+/)[0];

  useEffect(() => {
    if (!aberto) return;
    const fecharAoClicarFora = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('.profile-menu-wrap')) {
        setAberto(false);
      }
    };
    document.addEventListener('click', fecharAoClicarFora);
    return () => document.removeEventListener('click', fecharAoClicarFora);
  }, [aberto]);

  const sair = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('id_usuario');
    localStorage.removeItem(USUARIO_STORAGE_KEY);
    window.dispatchEvent(new Event(AUTH_CHANGED_EVENT));
  };

  return (
    <div className={`profile-menu-wrap ${aberto ? 'profile-menu-wrap-open' : ''}`}>
      <div className={`profile-morph-container ${aberto ? 'profile-morph-expanded' : 'profile-morph-collapsed'}`}>
        <button
          className={`profile-morph-header ${aberto ? 'profile-morph-header-open' : ''}`}
          type="button"
          aria-expanded={aberto}
          aria-haspopup="menu"
          onClick={(e) => {
            e.stopPropagation();
            setAberto((val) => !val);
          }}
        >
          <span className="profile-photo shrink-0">{getInitials(usuario.nome)}</span>
          <span className="profile-morph-identity">
            <span className="profile-trigger-name">{primeiroNome}</span>
            {aberto && <span className="profile-morph-email truncate">{usuario.email}</span>}
          </span>
          <ChevronRight size={15} className={`profile-chevron shrink-0 transition-transform duration-200 ${aberto ? 'rotate-90' : ''}`} />
        </button>

        <div className={`profile-morph-menu ${aberto ? 'profile-morph-menu-open' : 'profile-morph-menu-closed'}`} role="menu" aria-hidden={!aberto}>
          <Link to="/perfil" className="profile-dropdown-link" role="menuitem" onClick={() => setAberto(false)}>
            <CircleUserRound size={17} />
            <span>Meu perfil</span>
          </Link>
          <button className="profile-dropdown-link profile-logout" type="button" role="menuitem" onClick={sair}>
            <LogOut size={17} />
            <span>Sair</span>
          </button>
        </div>
      </div>
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
        <Link className="primary-button flex items-center justify-center gap-2" to="/login">
          <CircleUserRound size={18} />
          <span>Entrar</span>
        </Link>
        <Link className="secondary-button flex items-center justify-center gap-2" to="/cadastrar-usuario">
          <UserPlus size={18} />
          <span>Cadastre-se</span>
        </Link>
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
  const nome = usuario?.nome?.trim().split(/\s+/)[0];

  return (
    <section className="dashboard">
      <header className="dashboard-header">
        <div>
          <p className="eyebrow">Seu espaço de cuidado</p>
          <h1 className="display-title">{nome ? `Olá, ${nome}!` : 'Olá!'}</h1>
          <p className="page-subtitle">Acompanhe sua jornada de cuidado com leveza, informação e carinho.</p>
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

      <div className="space-y-6">
        <div>
          <div className="section-heading">
            <p className="eyebrow">Para a gestação</p>
            <h2 className="section-title">Acompanhamento gestacional</h2>
          </div>
          <div className="quick-actions">
            <Link to="/cadastrar-gestacao" className="quick-action quick-action-pink group">
              <span className="quick-action-icon"><CalendarDays size={23} strokeWidth={1.7} /></span>
              <span><strong>Registrar gestação</strong><small>Calcule a previsão de parto e acompanhe histórico</small></span>
              <ChevronRight size={18} />
            </Link>
            <Link to="/jornada-gestacao" className="quick-action quick-action-pink group">
              <span className="quick-action-icon"><Sparkles size={23} strokeWidth={1.7} /></span>
              <span><strong>Jornada da gestação</strong><small>Acompanhe as semanas e marcos estimados</small></span>
              <ChevronRight size={18} />
            </Link>
          </div>
        </div>

        <div>
          <div className="section-heading">
            <p className="eyebrow">Para o bebê e a infância</p>
            <h2 className="section-title">Acompanhamento infantil</h2>
          </div>
          <div className="quick-actions">
            <Link to="/cadastrar-bebe" className="quick-action quick-action-blue group">
              <span className="quick-action-icon"><Baby size={23} strokeWidth={1.7} /></span>
              <span><strong>Meus bebês</strong><small>Registre dados de nascimento e compartilhe acesso</small></span>
              <ChevronRight size={18} />
            </Link>
            <Link to="/vacinas" className="quick-action quick-action-blue group">
              <span className="quick-action-icon"><Syringe size={23} strokeWidth={1.7} /></span>
              <span><strong>Vacinas da família</strong><small>Consulte os calendários da mãe e do bebê</small></span>
              <ChevronRight size={18} />
            </Link>
          </div>
        </div>
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
