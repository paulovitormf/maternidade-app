import { FormEvent, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { cadastrarUsuario, CadastroUsuarioPayload } from '../services/usuarioService';

export default function CadastroUsuario() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ nome: '', email: '', senha: '', data_nascimento: '', telefone: '' });
  const [erro, setErro] = useState('');

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setErro('');
    try {
      const payload: CadastroUsuarioPayload = { usuario: { ...form, qnt_gestacao: 0 } };
      await cadastrarUsuario(payload);
      navigate('/login');
    } catch {
      setErro('Não foi possível realizar o cadastro. Confira os dados e tente novamente.');
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
          <label className={`field ${index < 2 ? 'field-wide' : ''}`} key={name}>
            <span className="field-label">{label}{required ? ' *' : ''}</span>
            <input
              className="field-control"
              type={type}
              required={required}
              value={form[name]}
              onChange={(e) => setForm({ ...form, [name]: e.target.value })}
            />
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
