import { FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
      setErro('Não foi possível realizar o cadastro.');
    }
  };
  return <section className="max-w-xl mx-auto my-8 bg-white p-6 shadow rounded-lg">
    <h1 className="text-2xl font-bold mb-4">Criar cadastro</h1>
    <form onSubmit={submit} className="space-y-4">
      {(['nome', 'email', 'senha', 'data_nascimento', 'telefone'] as const).map((field) => (
        <label className="block" key={field}><span className="block text-sm font-medium">{field.replace('_', ' ')}</span>
          <input className="mt-1 w-full rounded border p-2" type={field === 'senha' ? 'password' : field === 'email' ? 'email' : field === 'data_nascimento' ? 'date' : 'text'} required={field !== 'telefone'} value={form[field]} onChange={(e) => setForm({ ...form, [field]: e.target.value })} />
        </label>
      ))}
      {erro && <p className="text-rose-600">{erro}</p>}
      <button className="w-full rounded bg-pink-500 p-2 text-white" type="submit">Cadastrar</button>
    </form>
  </section>;
}
