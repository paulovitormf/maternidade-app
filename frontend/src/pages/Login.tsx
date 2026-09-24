import { FormEvent, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { loginUsuario } from '../services/usuarioService';
import axios from 'axios';

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(false);
  const submit = async (event: FormEvent) => {
    event.preventDefault(); setErro(''); setCarregando(true);
    try { const usuario = await loginUsuario({ email, senha }); localStorage.setItem('id_usuario', String(usuario.id_usuario)); navigate('/'); }
    catch (error) {
      setErro(axios.isAxiosError(error) && typeof error.response?.data === 'string' ? error.response.data : 'E-mail ou senha inválidos.');
    } finally { setCarregando(false); }
  };
  return <div className="max-w-md mx-auto my-12 bg-white rounded p-8 shadow">
    <h1 className="text-3xl font-bold mb-6">Entrar</h1>
    <form onSubmit={submit} className="space-y-4">
      <input className="w-full rounded border p-3" type="email" required placeholder="seu@email.com" value={email} onChange={(e) => setEmail(e.target.value)} />
      <input className="w-full rounded border p-3" type="password" required placeholder="Senha" value={senha} onChange={(e) => setSenha(e.target.value)} />
      {erro && <p className="text-rose-600">{erro}</p>}
      <button className="w-full rounded bg-pink-500 p-3 text-white disabled:opacity-60" disabled={carregando}>{carregando ? 'Entrando...' : 'Entrar'}</button>
    </form>
    <Link className="mt-4 block text-pink-600" to="/cadastrar-usuario">Criar conta</Link>
  </div>;
}
