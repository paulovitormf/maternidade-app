import axios from 'axios';
import { Eye, EyeOff, Heart } from 'lucide-react';
import { FormEvent, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AUTH_CHANGED_EVENT, loginUsuario, USUARIO_STORAGE_KEY } from '../services/usuarioService';

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(false);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setErro('');
    setCarregando(true);
    try {
      const usuario = await loginUsuario({ email, senha });
      localStorage.setItem('access_token', usuario.token);
      localStorage.setItem('id_usuario', String(usuario.usuario.id_usuario));
      localStorage.setItem(USUARIO_STORAGE_KEY, JSON.stringify(usuario.usuario));
      window.dispatchEvent(new Event(AUTH_CHANGED_EVENT));
      navigate('/');
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const resposta = error.response?.data;
        const mensagem = typeof resposta === 'string'
          ? resposta
          : resposta && typeof resposta.message === 'string'
            ? resposta.message
            : null;
        setErro(mensagem || 'Não foi possível conectar ao servidor. Tente novamente.');
      } else {
        setErro('Não foi possível conectar ao servidor. Tente novamente.');
      }
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className="auth-layout">
      <section className="auth-intro">
        <p className="mb-12 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-[#FADCE1]"><Heart size={29} strokeWidth={1.6} fill="currentColor" /></p>
        <p className="eyebrow !text-[#FADCE1]">Seu espaço de cuidado</p>
        <h1 className="font-display text-5xl font-bold leading-tight">Cuidado e carinho em cada etapa.</h1>
        <p className="mt-5 max-w-sm text-base leading-7 text-white/80">
          Apoio e acolhimento para mães, pais e responsáveis acompanharem essa jornada com leveza e tudo em um só lugar.
        </p>
      </section>
      <section className="auth-card">
        <p className="eyebrow">Acesso seguro</p>
        <h1 className="display-title !text-3xl">Entrar na sua conta</h1>
        <p className="page-subtitle mb-7">Continue acompanhando cada momento importante.</p>
        <form onSubmit={submit} className="space-y-5">
          <label className="field">
            <span className="field-label">E-mail</span>
            <input className="field-control" type="email" required placeholder="seu@email.com" value={email} onChange={(e) => setEmail(e.target.value)} />
          </label>
          <label className="field">
            <span className="field-label">Senha</span>
            <div className="relative">
              <input
                className="field-control pr-12"
                type={mostrarSenha ? 'text' : 'password'}
                required
                placeholder="Digite sua senha"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 flex items-center px-4 text-slate-500 transition hover:text-[#B0435B] focus:outline-none focus:ring-4 focus:ring-[#FADCE1]"
                onClick={() => setMostrarSenha((visivel) => !visivel)}
                aria-label={mostrarSenha ? 'Ocultar senha' : 'Mostrar senha'}
                title={mostrarSenha ? 'Ocultar senha' : 'Mostrar senha'}
              >
                {mostrarSenha ? <EyeOff size={19} /> : <Eye size={19} />}
              </button>
            </div>
          </label>
          {erro && <p className="alert-error">{erro}</p>}
          <button className="primary-button" disabled={carregando}>{carregando ? 'Entrando...' : 'Entrar'}</button>
        </form>
        <p className="mt-6 text-center text-sm text-slate-500">
          Ainda não tem uma conta? <Link className="font-bold text-[#B0435B] hover:underline" to="/cadastrar-usuario">Criar cadastro</Link>
        </p>
      </section>
    </div>
  );
}
