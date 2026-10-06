import { FormEvent, useEffect, useState } from 'react';
import { Baby, CalendarDays, Plus, RotateCcw } from 'lucide-react';
import axios from 'axios';
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

type Crianca = {
  idCrianca: number;
  nome: string;
  dataNascimento: string;
  horaNascimento: string;
  sexo?: string;
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
  const [criancas, setCriancas] = useState<Crianca[]>([]);
  const [carregandoLista, setCarregandoLista] = useState(true);
  const [erroLista, setErroLista] = useState('');
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [form, setForm] = useState(initial);
  const [mensagem, setMensagem] = useState('');
  const [erro, setErro] = useState('');

  const carregarCriancas = async () => {
    setCarregandoLista(true);
    setErroLista('');
    try {
      const response = await api.get<Crianca[]>('/criancas');
      setCriancas(response.data);
    } catch {
      setErroLista('Não foi possível carregar os bebês cadastrados.');
    } finally {
      setCarregandoLista(false);
    }
  };

  useEffect(() => {
    void carregarCriancas();
  }, []);

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
      await carregarCriancas();
      setMostrarFormulario(false);
    } catch (error) {
      const resposta = axios.isAxiosError(error) ? error.response?.data : null;
      const mensagem = typeof resposta === 'string'
        ? resposta
        : resposta && typeof resposta.message === 'string'
          ? resposta.message
          : 'Não foi possível registrar os dados. Confira as informações e tente novamente.';
      setErro(mensagem);
    }
  };

  const set = (name: keyof Form, value: string) => setForm((previous) => ({ ...previous, [name]: value }));

  if (!mostrarFormulario) {
    return (
      <section className="mx-auto w-full max-w-5xl space-y-8 pb-12">
        <header className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <span className="form-icon form-icon-pink mb-4"><Baby size={28} strokeWidth={1.65} /></span>
            <p className="eyebrow">Primeiros momentos</p>
            <h1 className="display-title">Meus bebês</h1>
            <p className="page-subtitle">Tenha os dados de cada criança organizados em um só lugar.</p>
          </div>
          <button className="primary-button sm:!w-auto" type="button" onClick={() => setMostrarFormulario(true)}>
            <Plus size={18} className="mr-2" /> Cadastrar novo bebê
          </button>
        </header>
        {erroLista && <div className="alert-error">{erroLista}</div>}
        {carregandoLista ? (
          <div className="card text-center text-sm text-slate-500">Carregando bebês cadastrados...</div>
        ) : criancas.length === 0 ? (
          <div className="empty-state card">
            <Baby size={36} />
            <h2>Nenhum bebê cadastrado</h2>
            <p>Cadastre os dados do seu bebê para começar a acompanhar essa fase.</p>
            <button className="primary-button sm:!w-auto" type="button" onClick={() => setMostrarFormulario(true)}>
              Cadastrar primeiro bebê
            </button>
          </div>
        ) : (
          <section>
            <div className="section-heading">
              <h2 className="section-title flex items-center gap-2"><Baby size={21} /> Bebês cadastrados</h2>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              {criancas.map((crianca) => (
                <article className="card" key={crianca.idCrianca}>
                  <p className="eyebrow">Perfil do bebê</p>
                  <h2 className="text-xl font-extrabold text-slate-800">{crianca.nome}</h2>
                  <p className="mt-3 flex items-center gap-2 text-sm text-slate-600">
                    <CalendarDays size={16} className="text-[#C8526B]" />
                    Nascimento: {formatarData(crianca.dataNascimento)}
                  </p>
                </article>
              ))}
            </div>
          </section>
        )}
      </section>
    );
  }

  return (
    <section className="form-card card">
      <div className="mb-8">
        <button className="mb-5 inline-flex items-center gap-2 text-sm font-bold text-[#B0435B] hover:underline" type="button" onClick={() => setMostrarFormulario(false)}>
          <RotateCcw size={16} /> Voltar para meus bebês
        </button>
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

function formatarData(value: string) {
  return new Intl.DateTimeFormat('pt-BR', { dateStyle: 'long' }).format(new Date(`${value}T00:00:00`));
}
