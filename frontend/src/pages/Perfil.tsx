import { LogOut, Mail, Phone, UserRound } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { AUTH_CHANGED_EVENT, USUARIO_STORAGE_KEY, UsuarioPublico } from '../services/usuarioService';

export default function Perfil() {
  const navigate = useNavigate();
  const usuario = getUsuario();

  const sair = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('id_usuario');
    localStorage.removeItem(USUARIO_STORAGE_KEY);
    window.dispatchEvent(new Event(AUTH_CHANGED_EVENT));
    navigate('/login', { replace: true });
  };

  if (!usuario) {
    return null;
  }

  return (
    <section className="mx-auto w-full max-w-3xl space-y-6">
      <header className="profile-header card">
        <div className="profile-avatar"><UserRound size={36} strokeWidth={1.5} /></div>
        <div>
          <p className="eyebrow">Minha conta</p>
          <h1 className="display-title !text-3xl">{usuario.nome}</h1>
          <p className="page-subtitle">Seus dados e preferências de cuidado.</p>
        </div>
      </header>

      <div className="card">
        <p className="eyebrow">Dados pessoais</p>
        <div className="profile-details">
          <div><Mail size={18} /><span><strong>E-mail</strong>{usuario.email}</span></div>
          <div><Phone size={18} /><span><strong>Telefone</strong>{usuario.telefone || 'Não informado'}</span></div>
          <div><UserRound size={18} /><span><strong>Data de nascimento</strong>{formatDate(usuario.data_nascimento)}</span></div>
        </div>
      </div>

      <button className="secondary-button !w-full sm:!w-auto" type="button" onClick={sair}>
        <LogOut size={17} className="mr-2" /> Sair da conta
      </button>
    </section>
  );
}

function getUsuario(): UsuarioPublico | null {
  const data = localStorage.getItem(USUARIO_STORAGE_KEY);
  if (!data) return null;
  try {
    return JSON.parse(data) as UsuarioPublico;
  } catch {
    return null;
  }
}

function formatDate(value?: string) {
  if (!value) return 'Não informado';
  const date = new Date(`${value}T00:00:00`);
  return Number.isNaN(date.getTime()) ? 'Não informado' : new Intl.DateTimeFormat('pt-BR').format(date);
}
