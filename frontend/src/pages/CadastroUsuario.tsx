import { FormEvent, useState } from 'react';
import axios from 'axios';
import { Eye, EyeOff } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import {
  AUTH_CHANGED_EVENT,
  cadastrarUsuario,
  CadastroUsuarioPayload,
  loginUsuario,
  USUARIO_STORAGE_KEY,
} from '../services/usuarioService';
import { mostrarToast } from '../services/toastService';

export default function CadastroUsuario() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ nome: '', email: '', senha: '', data_nascimento: '', telefone: '' });
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [erro, setErro] = useState('');

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setErro('');

    if(form.senha.length < 8){
      setErro('A senha deve ter no mínimo 8 caracteres.');
      return;
    }
    try {
      const payload: CadastroUsuarioPayload = { usuario: { ...form, qnt_gestacao: 0 } };
      await cadastrarUsuario(payload);
      mostrarToast('Conta criada com sucesso!');
    } catch (error) {
      setErro(obterMensagemErro(error));
      return;
    }

    try {
      const respostaLogin = await loginUsuario({ email: form.email, senha: form.senha });
      localStorage.setItem('access_token', respostaLogin.token);
      localStorage.setItem('id_usuario', String(respostaLogin.usuario.id_usuario));
      localStorage.setItem(USUARIO_STORAGE_KEY, JSON.stringify(respostaLogin.usuario));
      window.dispatchEvent(new Event(AUTH_CHANGED_EVENT));
      navigate('/continuar-cadastro', { state: { etapa: 'gestacao' }, replace: true });
    } catch (error) {
      setErro(
        `Sua conta foi criada, mas não foi possível entrar automaticamente. ${obterMensagemErro(error)} Entre usando seu e-mail e senha.`,
      );
    }
  };

  const fields = [
    ['nome', 'Nome completo', 'text', true],
    ['email', 'E-mail', 'email', true],
    ['telefone', 'Telefone', 'tel', false],
    ['data_nascimento', 'Data de nascimento', 'date', true],
    ['senha', 'Senha', 'password', true],
  ] as const;

  return (
    <section className="form-card card">
      <div className="mb-8">
        <p className="eyebrow">Comece sua jornada</p>
        <h1 className="display-title !text-3xl">Crie seu cadastro</h1>
        <p className="page-subtitle">Um espaço acolhedor para cuidar de cada detalhe.</p>
      </div>
      <form onSubmit={submit} className="form-grid">
        {fields.map(([name, label, type, required], index) => (
          <label className={`field ${index < 2 || name === 'senha' ? 'field-wide' : ''}`} key={name}>
            <span className="field-label">{label}{required ? ' *' : ''}</span>
            {name === 'senha' ? (
              <div className="relative">
                <input
                  className="field-control pr-12"
                  type={mostrarSenha ? 'text' : 'password'}
                  required={required}
                  minLength={8}
                  value={form[name]}
                  onChange={(e) => setForm({ ...form, [name]: e.target.value })}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 flex items-center px-4 text-slate-500 transition hover:text-[#B0435B] focus:outline-none"
                  onClick={() => setMostrarSenha((visivel) => !visivel)}
                  aria-label={mostrarSenha ? 'Ocultar senha' : 'Mostrar senha'}
                  title={mostrarSenha ? 'Ocultar senha' : 'Mostrar senha'}
                >
                  {mostrarSenha ? <EyeOff size={19} /> : <Eye size={19} />}
                </button>
              </div>
            ) : (
              <input
                className="field-control"
                type={type}
                required={required}
                value={form[name]}
                onChange={(e) => setForm({ ...form, [name]: e.target.value })}
              />
            )}
            {name === 'senha' && (
              <span className="text-sm text-slate-500">
                A senha deve ter no mínimo 8 caracteres.
              </span>
            )}
          </label>
        ))}
        {erro && <p className="alert-error field-wide">{erro}</p>}
        <div className="field-wide mt-2">
          <button className="primary-button" type="submit">Criar minha conta</button>
          <p className="mt-4 text-center text-sm text-slate-500">
            Já possui cadastro? <Link className="font-bold text-[#B0435B] hover:underline" to="/login">Entrar</Link>
          </p>
        </div>
      </form>
    </section>
  );
}

function obterMensagemErro(error: unknown) {
  if (axios.isAxiosError(error)) {
    const resposta = error.response?.data;
    const mensagem = typeof resposta === 'string'
      ? resposta
      : resposta && typeof resposta.message === 'string'
        ? resposta.message
        : null;
    return mensagem || 'Não foi possível conectar ao servidor. Tente novamente.';
  }

  return 'Não foi possível conectar ao servidor. Tente novamente.';
}
