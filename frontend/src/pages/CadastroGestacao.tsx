import { FormEvent, useEffect, useMemo, useState } from 'react';
import type React from 'react';
import axios from 'axios';
import { CalendarDays, CheckCircle2, Clock3, Edit3, HeartPulse, Plus, RotateCcw, Trash2 } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { mostrarToast } from '../services/toastService';

type Gestacao = {
  id_gestacao: number;
  ultima_mestruacao: string;
  idade_gestacional: number;
  data_parto: string;
  tipo_gestacao?: string;
  tipo_gestacao_detalhe?: string;
  pre_natal?: boolean;
};

type GestacaoForm = {
  ultima_mestruacao: string;
  idade_gestacional: string;
  tipo_gestacao: string;
  tipo_gestacao_detalhe: string;
  pre_natal: boolean;
};

const initialForm: GestacaoForm = {
  ultima_mestruacao: '',
  idade_gestacional: '',
  tipo_gestacao: 'UNICA',
  tipo_gestacao_detalhe: '',
  pre_natal: false,
};

const formatarData = (data: Date) =>
  new Intl.DateTimeFormat('pt-BR', { dateStyle: 'long' }).format(data);

export default function CadastroGestacao() {
  const navigate = useNavigate();
  const location = useLocation();
  const estadoCadastro = location.state as { abrirFormulario?: boolean; origemCadastro?: 'inicio' | 'mais' } | null;
  const [gestacoes, setGestacoes] = useState<Gestacao[]>([]);
  const [carregandoLista, setCarregandoLista] = useState(true);
  const [erroLista, setErroLista] = useState('');
  const [mostrarFormulario, setMostrarFormulario] = useState(Boolean(estadoCadastro?.abrirFormulario));
  const [formData, setFormData] = useState<GestacaoForm>(initialForm);
  const [mensagemSucesso, setMensagemSucesso] = useState('');
  const [erroApi, setErroApi] = useState('');
  const [carregando, setCarregando] = useState(false);
  const [excluindo, setExcluindo] = useState(false);
  const [mostrarConfirmacaoExclusao, setMostrarConfirmacaoExclusao] = useState(false);
  const [gestacaoEditando, setGestacaoEditando] = useState<number | null>(null);
  const tipoMultiplo = formData.tipo_gestacao === 'GEMEOS' || formData.tipo_gestacao === 'TRIGEMEOS_OU_MAIS';

  const carregarGestacoes = async () => {
    setCarregandoLista(true);
    setErroLista('');
    try {
      const response = await api.get<Gestacao[]>('/gestacoes');
      setGestacoes(response.data);
    } catch {
      setErroLista('Não foi possível carregar suas gestações.');
    } finally {
      setCarregandoLista(false);
    }
  };

  useEffect(() => {
    void carregarGestacoes();
  }, []);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const target = event.target;
    const value = target instanceof HTMLInputElement && target.type === 'checkbox'
      ? target.checked
      : target.value;
    setFormData((prev) => ({ ...prev, [target.name]: value }));
  };

  const previsaoParto = useMemo(() => {
    if (!formData.ultima_mestruacao) {
      return null;
    }

    const [ano, mes, dia] = formData.ultima_mestruacao.split('-').map(Number);
    const data = new Date(ano, mes - 1, dia);
    data.setDate(data.getDate() + 280);
    return Number.isNaN(data.getTime()) ? null : data;
  }, [formData.ultima_mestruacao]);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setMensagemSucesso('');
    setErroApi('');
    setCarregando(true);
    const idUsuario = Number(localStorage.getItem('id_usuario'));
    if (!Number.isInteger(idUsuario) || idUsuario <= 0) {
      setErroApi('Faça login antes de cadastrar uma gestação.');
      setCarregando(false);
      return;
    }

    const dum = new Date(`${formData.ultima_mestruacao}T00:00:00`);
    if (Number.isNaN(dum.getTime()) || dum > new Date()) {
      setErroApi('Informe uma data válida. A DUM não pode estar no futuro.');
      setCarregando(false);
      return;
    }

    try {
      const payload = {
        id_usuario: idUsuario,
        ultima_mestruacao: formData.ultima_mestruacao,
        idade_gestacional: formData.idade_gestacional ? Number(formData.idade_gestacional) : null,
        tipo_gestacao: formData.tipo_gestacao,
        tipo_gestacao_detalhe: tipoMultiplo ? formData.tipo_gestacao_detalhe : null,
        pre_natal: formData.pre_natal,
      };
      if (gestacaoEditando) {
        await api.put(`/gestacoes/${gestacaoEditando}`, payload);
      } else {
        await api.post('/gestacoes', payload);
        mostrarToast('Gestação cadastrada com sucesso!');
      }
      const novaGestacao = gestacaoEditando === null;
      setMensagemSucesso(gestacaoEditando ? 'Gestação atualizada com sucesso.' : 'Gestação salva! A previsão de parto foi calculada automaticamente.');
      setFormData(initialForm);
      setGestacaoEditando(null);
      await carregarGestacoes();
      setMostrarFormulario(false);
      if (novaGestacao && estadoCadastro?.origemCadastro === 'inicio') {
        navigate('/continuar-cadastro', {
          state: { etapa: 'crianca' },
          replace: true,
        });
      } else if (novaGestacao) {
        navigate('/', { replace: true });
      }
    } catch (error) {
      const resposta = axios.isAxiosError(error) ? error.response?.data : null;
      const mensagem = typeof resposta === 'string'
        ? resposta
        : resposta && typeof resposta.message === 'string'
          ? resposta.message
          : 'Não foi possível salvar os dados. Confira as informações e tente novamente.';
      setErroApi(mensagem);
    } finally {
      setCarregando(false);
    }
  };

  const editar = (gestacao: Gestacao) => {
    setGestacaoEditando(gestacao.id_gestacao);
    setFormData({
      ultima_mestruacao: gestacao.ultima_mestruacao,
      idade_gestacional: String(gestacao.idade_gestacional ?? ''),
      tipo_gestacao: gestacao.tipo_gestacao || 'AINDA_NAO_SEI',
      tipo_gestacao_detalhe: gestacao.tipo_gestacao_detalhe || '',
      pre_natal: Boolean(gestacao.pre_natal),
    });
    setMensagemSucesso('');
    setErroApi('');
    setMostrarFormulario(true);
  };

  const excluirGestacao = async () => {
    if (gestacaoEditando === null || excluindo || carregando) return;
    setErroApi('');
    setExcluindo(true);
    try {
      await api.delete(`/gestacoes/${gestacaoEditando}`);
      setMostrarConfirmacaoExclusao(false);
      setGestacaoEditando(null);
      setFormData(initialForm);
      setMostrarFormulario(false);
      await carregarGestacoes();
      mostrarToast('Gestação e registros vinculados excluídos com sucesso.');
    } catch (error) {
      const resposta = axios.isAxiosError(error) ? error.response?.data : null;
      const mensagem = typeof resposta === 'string'
        ? resposta
        : resposta && typeof resposta.message === 'string'
          ? resposta.message
          : 'Não foi possível excluir esta gestação. Tente novamente.';
      setMostrarConfirmacaoExclusao(false);
      setErroApi(mensagem);
    } finally {
      setExcluindo(false);
    }
  };

  if (!mostrarFormulario) {
    const hoje = new Date().toISOString().split('T')[0];
    const atuais = gestacoes.filter((gestacao) => gestacao.data_parto >= hoje);
    const anteriores = gestacoes.filter((gestacao) => gestacao.data_parto < hoje);

    return (
      <section className="mx-auto w-full max-w-5xl space-y-8 pb-12">
        <header className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <span className="form-icon form-icon-blue mb-4"><HeartPulse size={28} strokeWidth={1.65} /></span>
            <p className="eyebrow">Acompanhamento</p>
            <h1 className="display-title">Minhas gestações</h1>
            <p className="page-subtitle">Acompanhe sua jornada e mantenha cada registro importante por perto.</p>
          </div>
          <button className="primary-button sm:!w-auto" type="button" onClick={() => setMostrarFormulario(true)}>
            <Plus size={18} className="mr-2" /> Cadastrar gestação
          </button>
        </header>

        {erroLista && <div className="alert-error">{erroLista}</div>}
        {carregandoLista ? (
          <div className="card text-center text-sm text-slate-500">Carregando suas gestações...</div>
        ) : gestacoes.length === 0 ? (
          <div className="empty-state card">
            <CalendarDays size={34} />
            <h2>Nenhuma gestação cadastrada</h2>
            <p>Comece seu acompanhamento registrando uma nova gestação.</p>
            <button className="primary-button sm:!w-auto" type="button" onClick={() => setMostrarFormulario(true)}>
              Cadastrar primeira gestação
            </button>
          </div>
        ) : (
          <>
            <GestacaoSection titulo="Gestação atual" icone={<Clock3 size={19} />} gestacoes={atuais} vazio="Nenhuma gestação no momento atual." onCadastrar={() => setMostrarFormulario(true)} onEditar={(gestacao) => editar(gestacao)} />
            <GestacaoSection titulo="Gestações anteriores" icone={<CheckCircle2 size={19} />} gestacoes={anteriores} vazio="Você ainda não possui gestações anteriores." onEditar={(gestacao) => editar(gestacao)} />
          </>
        )}
      </section>
    );
  }

  return (
    <section className="form-card card">
      <div className="mb-8">
        <button className="mb-5 inline-flex items-center gap-2 text-sm font-bold text-[#B0435B] hover:underline" type="button" onClick={() => { setMostrarFormulario(false); setGestacaoEditando(null); setFormData(initialForm); }}>
          <RotateCcw size={16} /> Voltar para minhas gestações
        </button>
        <span className="form-icon form-icon-blue mb-4"><HeartPulse size={28} strokeWidth={1.65} /></span>
        <p className="eyebrow">Acompanhamento</p>
        <h1 className="display-title !text-3xl">{gestacaoEditando ? 'Editar gestação' : 'Registro da gestação'}</h1>
        <p className="page-subtitle">Informe a DUM e calcularemos a previsão de parto para você.</p>
      </div>
      {mensagemSucesso && <div className="alert-success mb-5">{mensagemSucesso}</div>}
      {erroApi && <div className="alert-error mb-5">{erroApi}</div>}
      <form onSubmit={handleSubmit} className="form-grid">
        <label className="field field-wide">
          <span className="field-label">Data da última menstruação (DUM) *</span>
          <input
            className="field-control"
            type="date"
            name="ultima_mestruacao"
            required
            max={new Date().toISOString().split('T')[0]}
            value={formData.ultima_mestruacao}
            onChange={handleChange}
          />
        </label>
        <label className="field">
          <span className="field-label">Idade gestacional (semanas)</span>
          <input className="field-control" type="number" name="idade_gestacional" min="0" max="42" placeholder="Ex.: 14" value={formData.idade_gestacional} onChange={handleChange} />
        </label>
        <label className="field">
          <span className="field-label">Tipo de gestação</span>
          <select className="field-control" name="tipo_gestacao" value={formData.tipo_gestacao} onChange={handleChange}>
            <option value="UNICA">Única</option>
            <option value="GEMEOS">Gêmeos</option>
            <option value="TRIGEMEOS_OU_MAIS">Trigêmeos ou mais</option>
            <option value="AINDA_NAO_SEI">Ainda não sei</option>
          </select>
        </label>
        {tipoMultiplo && (
          <label className="field field-wide">
            <span className="field-label">Tipo dos gêmeos</span>
            <select className="field-control" name="tipo_gestacao_detalhe" value={formData.tipo_gestacao_detalhe} onChange={handleChange} required>
              <option value="">Selecione uma opção</option>
              <option value="BIVITELINO">Bivitelino</option>
              <option value="UNIVITELINO">Univitelino</option>
              <option value="AINDA_NAO_SEI">Ainda não sei</option>
            </select>
          </label>
        )}
        <label className="field-wide flex cursor-pointer items-center gap-3 rounded-2xl bg-[#EBF3F5] p-4">
          <input className="h-5 w-5 accent-[#C8526B]" type="checkbox" name="pre_natal" checked={formData.pre_natal} onChange={handleChange} />
          <span className="text-sm font-semibold text-[#3B7280]">Já realiza acompanhamento pré-natal?</span>
        </label>
        {previsaoParto && (
          <div className="field-wide rounded-2xl border border-[#FECDD3] bg-[#FADCE1] p-4">
            <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-[#B0435B]">Previsão automática</p>
            <p className="mt-1 text-sm font-bold text-slate-800">
              Data provável do parto: {formatarData(previsaoParto)}
            </p>
            <p className="mt-1 text-xs text-slate-600">Cálculo estimado com base em 280 dias após a DUM.</p>
          </div>
        )}
        <button className="primary-button field-wide mt-2" type="submit" disabled={carregando}>
          {carregando ? 'Salvando gestação...' : gestacaoEditando ? 'Salvar alterações' : 'Salvar dados da gestação'}
        </button>
      </form>
      {gestacaoEditando !== null && (
        <div className="mt-8 border-t border-rose-100 pt-5">
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-xl border border-rose-200 px-4 py-2.5 text-sm font-bold text-rose-700 transition hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-50"
            onClick={() => { setErroApi(''); setMostrarConfirmacaoExclusao(true); }}
            disabled={excluindo || carregando}
          >
            <Trash2 size={16} />
            {excluindo ? 'Excluindo gestação...' : 'Excluir gestação'}
          </button>
        </div>
      )}
      {mostrarConfirmacaoExclusao && gestacaoEditando !== null && (
        <div
          className="fixed inset-0 z-[80] flex items-center justify-center bg-slate-900/40 p-4"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget && !excluindo) {
              setMostrarConfirmacaoExclusao(false);
            }
          }}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="titulo-confirmar-exclusao-gestacao"
            className="w-full max-w-lg space-y-5 rounded-2xl bg-white p-6 shadow-xl"
          >
            <div>
              <p className="eyebrow text-rose-700">Ação permanente</p>
              <h2 id="titulo-confirmar-exclusao-gestacao" className="text-xl font-extrabold text-slate-800">
                Excluir esta gestação?
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">
                A gestação e todos os registros vinculados, como consultas e exames, serão removidos. Esta ação não pode ser desfeita.
              </p>
            </div>
            <div className="flex flex-col-reverse justify-end gap-3 sm:flex-row">
              <button
                type="button"
                autoFocus
                className="secondary-button sm:!w-auto"
                onClick={() => setMostrarConfirmacaoExclusao(false)}
                disabled={excluindo}
              >
                Cancelar
              </button>
              <button
                type="button"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-rose-600 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-rose-700 disabled:cursor-not-allowed disabled:opacity-50"
                onClick={() => void excluirGestacao()}
                disabled={excluindo}
              >
                <Trash2 size={16} />
                {excluindo ? 'Excluindo gestação...' : 'Sim, excluir gestação'}
              </button>
            </div>
          </section>
        </div>
      )}
    </section>
  );
}

function GestacaoSection({
  titulo,
  icone,
  gestacoes,
  vazio,
  onCadastrar,
  onEditar,
}: {
  titulo: string;
  icone: React.ReactNode;
  gestacoes: Gestacao[];
  vazio: string;
  onCadastrar?: () => void;
  onEditar: (gestacao: Gestacao) => void;
}) {
  return (
    <section>
      <div className="section-heading">
        <h2 className="section-title flex items-center gap-2">{icone}{titulo}</h2>
      </div>
      {gestacoes.length === 0 ? (
        <div className="card flex flex-col items-start gap-3 text-sm text-slate-500">
          <span>{vazio}</span>
          {onCadastrar && <button className="secondary-button sm:!w-auto" type="button" onClick={onCadastrar}><Plus size={17} className="mr-2" /> Cadastrar gestação</button>}
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {gestacoes.map((gestacao) => (
            <article className="card" key={gestacao.id_gestacao}>
              <p className="eyebrow">{gestacao.tipo_gestacao || 'Gestação'}</p>
              <h3 className="text-xl font-extrabold text-slate-800">
                Previsão do parto: {formatarDataString(gestacao.data_parto)}
              </h3>
              <div className="mt-4 grid gap-2 text-sm text-slate-600">
                <p><strong>DUM:</strong> {formatarDataString(gestacao.ultima_mestruacao)}</p>
                <p><strong>Idade gestacional:</strong> {gestacao.idade_gestacional} semanas</p>
                <p><strong>Pré-natal:</strong> {gestacao.pre_natal ? 'Em acompanhamento' : 'Ainda não informado'}</p>
              </div>
              {gestacao.tipo_gestacao_detalhe && <p className="mt-2 text-sm text-slate-600"><strong>Classificação:</strong> {formatarDetalhe(gestacao.tipo_gestacao_detalhe)}</p>}
              <button className="secondary-button mt-4 sm:!w-auto" type="button" onClick={() => onEditar(gestacao)}>
                <Edit3 size={16} className="mr-2" /> Editar
              </button>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

function formatarDetalhe(value: string) {
  return value === 'BIVITELINO' ? 'Bivitelino' : value === 'UNIVITELINO' ? 'Univitelino' : 'Ainda não sei';
}

function formatarDataString(value: string) {
  return new Intl.DateTimeFormat('pt-BR', { dateStyle: 'long' }).format(new Date(`${value}T00:00:00`));
}
