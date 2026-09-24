import { FormEvent, useState } from 'react';
import api from '../services/api';

type Form = { nome: string; data_nascimento: string; hora_nascimento: string; sexo: string; peso_nascimento: string; altura_nascimento: string; observacoes: string; tipo_relacao: string; id_usuario: string };
const initial: Form = { nome: '', data_nascimento: '', hora_nascimento: '', sexo: 'F', peso_nascimento: '', altura_nascimento: '', observacoes: '', tipo_relacao: 'MAE', id_usuario: '' };

export default function CadastroCrianca() {
  const [form, setForm] = useState(initial);
  const [mensagem, setMensagem] = useState('');
  const [erro, setErro] = useState('');
  const submit = async (event: FormEvent) => {
    event.preventDefault(); setErro(''); setMensagem('');
    const idUsuario = Number(form.id_usuario || localStorage.getItem('id_usuario'));
    if (!Number.isInteger(idUsuario) || idUsuario <= 0) {
      setErro('Faça login antes de cadastrar uma criança.');
      return;
    }
    try {
      await api.post('/criancas', { ...form, id_usuario: idUsuario, hora_nascimento: `${form.hora_nascimento}:00`, peso_nascimento: form.peso_nascimento ? Number(form.peso_nascimento) : null, altura_nascimento: form.altura_nascimento ? Number(form.altura_nascimento) : null });
      setMensagem('Registro salvo com sucesso!'); setForm(initial);
    } catch { setErro('Não foi possível registrar os dados do bebê.'); }
  };
  const set = (name: keyof Form, value: string) => setForm({ ...form, [name]: value });
  return <section className="max-w-xl mx-auto my-8 bg-white p-6 shadow rounded-lg"><h1 className="text-2xl font-bold mb-4">Cadastro do Bebê</h1>
    <form onSubmit={submit} className="space-y-4">
      <input className="w-full rounded border p-2" required placeholder="Nome" value={form.nome} onChange={e => set('nome', e.target.value)} />
      <div className="grid grid-cols-2 gap-3"><input className="rounded border p-2" required type="date" value={form.data_nascimento} onChange={e => set('data_nascimento', e.target.value)} /><input className="rounded border p-2" required type="time" value={form.hora_nascimento} onChange={e => set('hora_nascimento', e.target.value)} /></div>
      <div className="grid grid-cols-2 gap-3"><select className="rounded border p-2" value={form.sexo} onChange={e => set('sexo', e.target.value)}><option value="F">Feminino</option><option value="M">Masculino</option></select><select className="rounded border p-2" value={form.tipo_relacao} onChange={e => set('tipo_relacao', e.target.value)}><option value="MAE">Mãe</option><option value="PAI">Pai</option><option value="RESPONSAVEL">Responsável</option></select></div>
      <input className="w-full rounded border p-2" type="number" step="0.01" placeholder="Peso (kg)" value={form.peso_nascimento} onChange={e => set('peso_nascimento', e.target.value)} /><input className="w-full rounded border p-2" type="number" step="0.01" placeholder="Altura (cm)" value={form.altura_nascimento} onChange={e => set('altura_nascimento', e.target.value)} /><textarea className="w-full rounded border p-2" placeholder="Observações" value={form.observacoes} onChange={e => set('observacoes', e.target.value)} />
      {mensagem && <p className="text-emerald-600">{mensagem}</p>}{erro && <p className="text-rose-600">{erro}</p>}<button className="w-full rounded bg-rose-600 p-2 text-white">Salvar</button>
    </form></section>;
}
