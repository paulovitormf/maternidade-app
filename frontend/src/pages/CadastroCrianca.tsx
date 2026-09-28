import { FormEvent, useState } from 'react';
import { Baby } from 'lucide-react';
import api from '../services/api';

type Form = {
  nome: string;
  data_nascimento: string;
  hora_nascimento: string;
  sexo: string;
  peso_nascimento: string;
  altura_nascimento: string;
  observacoes: string;
  tipo_relacao: string;
};

const initial: Form = {
  nome: '',
  data_nascimento: '',
  hora_nascimento: '',
  sexo: 'F',
  peso_nascimento: '',
  altura_nascimento: '',
  observacoes: '',
  tipo_relacao: 'MAE',
};

export default function CadastroCrianca() {
  const [form, setForm] = useState(initial);
  const [mensagem, setMensagem] = useState('');
  const [erro, setErro] = useState('');

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setErro('');
    setMensagem('');
    if (!localStorage.getItem('access_token')) {
      setErro('Faça login antes de cadastrar uma criança.');
      return;
    }
    try {
      await api.post('/criancas', {
        ...form,
        hora_nascimento: `${form.hora_nascimento}:00`,
        peso_nascimento: form.peso_nascimento ? Number(form.peso_nascimento) : null,
        altura_nascimento: form.altura_nascimento ? Number(form.altura_nascimento) : null,
        observacoes: form.observacoes || null,
      });
      setMensagem('Registro salvo com sucesso!');
      setForm(initial);
    } catch {
      setErro('Não foi possível registrar os dados. Confira as informações e tente novamente.');
    }
  };

  const set = (name: keyof Form, value: string) => setForm((previous) => ({ ...previous, [name]: value }));

  return (
    <section className="form-card card">
      <div className="mb-8">
        <span className="form-icon form-icon-pink mb-4"><Baby size={28} strokeWidth={1.65} /></span>
        <p className="eyebrow">Primeiros momentos</p>
        <h1 className="display-title !text-3xl">Cadastro do bebê</h1>
        <p className="page-subtitle">Registre os dados do nascimento para acompanhar essa nova fase.</p>
      </div>
      {mensagem && <div className="alert-success mb-5">{mensagem}</div>}
      {erro && <div className="alert-error mb-5">{erro}</div>}
      <form onSubmit={submit} className="form-grid">
        <label className="field field-wide">
          <span className="field-label">Nome do bebê *</span>
          <input className="field-control" required placeholder="Ex.: Clara Silva" value={form.nome} onChange={(e) => set('nome', e.target.value)} />
        </label>
        <label className="field">
          <span className="field-label">Data de nascimento *</span>
          <input className="field-control" required type="date" value={form.data_nascimento} onChange={(e) => set('data_nascimento', e.target.value)} />
        </label>
        <label className="field">
          <span className="field-label">Horário de nascimento *</span>
          <input className="field-control" required type="time" value={form.hora_nascimento} onChange={(e) => set('hora_nascimento', e.target.value)} />
        </label>
        <label className="field">
          <span className="field-label">Sexo</span>
          <select className="field-control" value={form.sexo} onChange={(e) => set('sexo', e.target.value)}>
            <option value="F">Feminino</option>
            <option value="M">Masculino</option>
          </select>
        </label>
        <label className="field">
          <span className="field-label">Relação com o bebê</span>
          <select className="field-control" value={form.tipo_relacao} onChange={(e) => set('tipo_relacao', e.target.value)}>
            <option value="MAE">Mãe</option>
            <option value="PAI">Pai</option>
            <option value="RESPONSAVEL">Responsável</option>
          </select>
        </label>
        <label className="field">
          <span className="field-label">Peso ao nascer (kg)</span>
          <input className="field-control" type="number" step="0.01" min="0" placeholder="Ex.: 3,25" value={form.peso_nascimento} onChange={(e) => set('peso_nascimento', e.target.value)} />
        </label>
        <label className="field">
          <span className="field-label">Altura ao nascer (cm)</span>
          <input className="field-control" type="number" step="0.1" min="0" placeholder="Ex.: 48,5" value={form.altura_nascimento} onChange={(e) => set('altura_nascimento', e.target.value)} />
        </label>
        <label className="field field-wide">
          <span className="field-label">Observações</span>
          <textarea className="field-control min-h-28 resize-y" rows={3} placeholder="Conte algo importante sobre o nascimento..." value={form.observacoes} onChange={(e) => set('observacoes', e.target.value)} />
        </label>
        <button className="primary-button field-wide mt-2" type="submit">Salvar dados do bebê</button>
      </form>
    </section>
  );
}
