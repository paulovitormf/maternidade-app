import { FormEvent, useEffect, useState } from 'react';
import { Baby, CalendarDays, Eye, Pencil, Plus, RotateCcw, MoreVertical, Search, Trash2, X } from 'lucide-react';
import axios from 'axios';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { mostrarToast } from '../services/toastService';

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
  tipoAcesso: 'PRINCIPAL' | 'RESPONSAVEL';
  podeEditar: boolean;
};

type CriancaDetalhe = {
  nome: string;
  data_nascimento: string;
  hora_nascimento: string;
  sexo: string | null;
  peso_nascimento: number | null;
  altura_nascimento: number | null;
  observacoes: string | null;
  pode_editar: boolean;
};

type UsuarioBusca = {
  id_usuario: number;
  nome: string;
  email_mascarado: string;
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
  const navigate = useNavigate();
  const location = useLocation();
  const estadoCadastro = location.state as { abrirFormulario?: boolean; origemCadastro?: 'inicio' | 'mais' } | null;
  const [criancas, setCriancas] = useState<Crianca[]>([]);
  const [carregandoLista, setCarregandoLista] = useState(true);
  const [erroLista, setErroLista] = useState('');
  const [mensagemLista, setMensagemLista] = useState('');
  const [mostrarFormulario, setMostrarFormulario] = useState(Boolean(estadoCadastro?.abrirFormulario));
  const [form, setForm] = useState(initial);
  const [criancaEditando, setCriancaEditando] = useState<Crianca | null>(null);
  const [erro, setErro] = useState('');
  const [carregandoEdicao, setCarregandoEdicao] = useState(false);
  const [excluindoCrianca, setExcluindoCrianca] = useState(false);
  const [mostrarConfirmacaoExclusao, setMostrarConfirmacaoExclusao] = useState(false);
  const [menuAberto, setMenuAberto] = useState<number | null>(null);
  const [criancaParaResponsavel, setCriancaParaResponsavel] = useState<Crianca | null>(null);
  const [buscaResponsavel, setBuscaResponsavel] = useState('');
  const [responsaveisEncontrados, setResponsaveisEncontrados] = useState<UsuarioBusca[]>([]);
  const [responsavelSelecionado, setResponsavelSelecionado] = useState<UsuarioBusca | null>(null);
  const [carregandoResponsaveis, setCarregandoResponsaveis] = useState(false);
  const [salvandoResponsavel, setSalvandoResponsavel] = useState(false);
  const [salvandoCrianca, setSalvandoCrianca] = useState(false);
  const [erroResponsavel, setErroResponsavel] = useState('');
  const [mensagemResponsavel, setMensagemResponsavel] = useState('');

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

  useEffect(() => {
    const termo = buscaResponsavel.trim();
    if (!criancaParaResponsavel || responsavelSelecionado || termo.length < 2) {
      setResponsaveisEncontrados([]);
      setCarregandoResponsaveis(false);
      return;
    }

    const controller = new AbortController();
    const timeout = window.setTimeout(async () => {
      setCarregandoResponsaveis(true);
      setErroResponsavel('');
      try {
        const response = await api.get<UsuarioBusca[]>('/usuarios/busca', {
          params: { q: termo },
          signal: controller.signal,
        });
        setResponsaveisEncontrados(response.data);
      } catch (error) {
        if (!axios.isCancel(error)) {
          setErroResponsavel('Não foi possível buscar usuários. Tente novamente.');
          setResponsaveisEncontrados([]);
        }
      } finally {
        if (!controller.signal.aborted) {
          setCarregandoResponsaveis(false);
        }
      }
    }, 300);

    return () => {
      window.clearTimeout(timeout);
      controller.abort();
    };
  }, [buscaResponsavel, criancaParaResponsavel, responsavelSelecionado]);

  const abrirVinculoResponsavel = (crianca: Crianca) => {
    setMenuAberto(null);
    setBuscaResponsavel('');
    setResponsavelSelecionado(null);
    setErroResponsavel('');
    setMensagemResponsavel('');
    setCriancaParaResponsavel(crianca);
  };

  const adicionarResponsavel = async () => {
    if (!criancaParaResponsavel || !responsavelSelecionado) {
      setErroResponsavel('Selecione um usuário para continuar.');
      return;
    }
    setSalvandoResponsavel(true);
    setErroResponsavel('');
    try {
      await api.post(`/criancas/${criancaParaResponsavel.idCrianca}/responsaveis`, {
        id_usuario: responsavelSelecionado.id_usuario,
      });
      setMensagemResponsavel(`${responsavelSelecionado.nome} foi vinculado(a) a ${criancaParaResponsavel.nome}.`);
      setCriancaParaResponsavel(null);
      setBuscaResponsavel('');
      setResponsavelSelecionado(null);
    } catch (error) {
      const resposta = axios.isAxiosError(error) ? error.response?.data : null;
      setErroResponsavel(typeof resposta === 'string'
        ? resposta
        : resposta && typeof resposta.message === 'string'
          ? resposta.message
          : 'Não foi possível adicionar este responsável. Tente novamente.');
    } finally {
      setSalvandoResponsavel(false);
    }
  };

  const iniciarEdicao = async (crianca: Crianca) => {
    setMenuAberto(null);
    setErroLista('');
    setMensagemLista('');
    setCarregandoEdicao(true);
    try {
      const { data } = await api.get<CriancaDetalhe>(`/criancas/${crianca.idCrianca}`);
      if (!data.pode_editar) {
        setErroLista('Você não tem permissão para editar os dados deste bebê.');
        return;
      }
      setCriancaEditando(crianca);
      setForm({
        nome: data.nome,
        data_nascimento: data.data_nascimento,
        hora_nascimento: data.hora_nascimento.slice(0, 5),
        sexo: data.sexo || 'F',
        peso_nascimento: data.peso_nascimento?.toString() || '',
        altura_nascimento: data.altura_nascimento?.toString() || '',
        observacoes: data.observacoes || '',
        tipo_relacao: 'MAE',
      });
      setErro('');
      setMostrarFormulario(true);
    } catch (error) {
      const resposta = axios.isAxiosError(error) ? error.response?.data : null;
      setErroLista(typeof resposta === 'string'
        ? resposta
        : 'Não foi possível carregar os dados deste bebê para edição.');
    } finally {
      setCarregandoEdicao(false);
    }
  };

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setErro('');
    setSalvandoCrianca(true);
    const idUsuario = Number(localStorage.getItem('id_usuario'));
    if (!Number.isInteger(idUsuario) || idUsuario <= 0) {
      setErro('Faça login antes de cadastrar uma criança.');
      setSalvandoCrianca(false);
      return;
    }
    try {
      const dadosCrianca = {
        nome: form.nome,
        data_nascimento: form.data_nascimento,
        hora_nascimento: `${form.hora_nascimento}:00`,
        sexo: form.sexo,
        peso_nascimento: form.peso_nascimento ? Number(form.peso_nascimento) : null,
        altura_nascimento: form.altura_nascimento ? Number(form.altura_nascimento) : null,
        observacoes: form.observacoes || null,
      };
      if (criancaEditando) {
        await api.put(`/criancas/${criancaEditando.idCrianca}`, dadosCrianca);
        setForm(initial);
        setCriancaEditando(null);
        await carregarCriancas();
        setMostrarFormulario(false);
        setMensagemLista('Dados do bebê atualizados com sucesso.');
        return;
      }
      await api.post('/criancas', {
        ...dadosCrianca,
        id_usuario: idUsuario,
        tipo_relacao: form.tipo_relacao,
      });
      mostrarToast('Bebê cadastrado com sucesso!');
      setForm(initial);
      setMensagemLista('');
      await carregarCriancas();
      setMostrarFormulario(false);
      if (estadoCadastro?.origemCadastro === 'inicio') {
        navigate('/continuar-cadastro', { state: { etapa: 'mais' }, replace: true });
      } else {
        navigate('/', { replace: true });
      }
    } catch (error) {
      const resposta = axios.isAxiosError(error) ? error.response?.data : null;
      const mensagem = typeof resposta === 'string'
        ? resposta
        : resposta && typeof resposta.message === 'string'
          ? resposta.message
          : 'Não foi possível registrar os dados. Confira as informações e tente novamente.';
      setErro(mensagem);
    } finally {
      setSalvandoCrianca(false);
    }
  };

  const excluirCrianca = async () => {
    if (!criancaEditando || excluindoCrianca || salvandoCrianca) return;
    setErro('');
    setExcluindoCrianca(true);
    try {
      await api.delete(`/criancas/${criancaEditando.idCrianca}`);
      setMostrarConfirmacaoExclusao(false);
      setCriancaEditando(null);
      setForm(initial);
      setMostrarFormulario(false);
      await carregarCriancas();
      mostrarToast('Bebê e registros vinculados excluídos com sucesso.');
    } catch (error) {
      const resposta = axios.isAxiosError(error) ? error.response?.data : null;
      const mensagem = typeof resposta === 'string'
        ? resposta
        : resposta && typeof resposta.message === 'string'
          ? resposta.message
          : 'Não foi possível excluir os dados deste bebê. Tente novamente.';
      setMostrarConfirmacaoExclusao(false);
      setErro(mensagem);
    } finally {
      setExcluindoCrianca(false);
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
          <button className="primary-button sm:!w-auto" type="button" onClick={() => { setForm(initial); setCriancaEditando(null); setMensagemLista(''); setMostrarFormulario(true); }}>
            <Plus size={18} className="mr-2" /> Cadastrar novo bebê
          </button>
        </header>
        {mensagemLista && <div role="status" className="alert-success">{mensagemLista}</div>}
        {mensagemResponsavel && (
          <div role="status" className="alert-success">
            {mensagemResponsavel}
            <button
              type="button"
              aria-label="Fechar mensagem"
              className="ml-3 font-bold"
              onClick={() => setMensagemResponsavel('')}
            >
              ×
            </button>
          </div>
        )}
        {carregandoEdicao && <p role="status" className="text-sm text-slate-500">Carregando dados para edição...</p>}
        {erroLista && <div className="alert-error">{erroLista}</div>}
        {carregandoLista ? (
          <div className="card text-center text-sm text-slate-500">Carregando bebês cadastrados...</div>
        ) : criancas.length === 0 ? (
          <div className="empty-state card">
            <Baby size={36} />
            <h2>Nenhum bebê cadastrado</h2>
            <p>Cadastre os dados do seu bebê para começar a acompanhar essa fase.</p>
            <button className="primary-button sm:!w-auto" type="button" onClick={() => { setForm(initial); setCriancaEditando(null); setMostrarFormulario(true); }}>
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
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="eyebrow">Perfil do bebê</p>
                      <h2 className="text-xl font-extrabold text-slate-800">
                        <Link className="hover:text-[#B0435B] hover:underline" to={`/bebes/${crianca.idCrianca}`}>
                        {crianca.nome}
                        </Link>
                      </h2>
                    </div>
                    {crianca.podeEditar && crianca.tipoAcesso === 'PRINCIPAL' && (
                      <div className="relative">
                        <button
                          type="button"
                          aria-label={`Opções de ${crianca.nome}`}
                          disabled={carregandoEdicao}
                          onClick={() => setMenuAberto(menuAberto === crianca.idCrianca ? null : crianca.idCrianca)}
                          className="text-slate-600 hover:text-[#B0435B] disabled:opacity-50"
                        >
                          <MoreVertical size={22} />
                        </button>
                        {menuAberto === crianca.idCrianca && (
                          <div className="absolute right-0 top-full z-10 mt-1 w-52 rounded-lg border bg-white py-1 shadow-lg">
                            <button type="button" onClick={() => abrirVinculoResponsavel(crianca)} className="w-full px-4 py-2 text-left text-sm hover:bg-slate-100">
                              Adicionar Responsável
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                  {crianca.tipoAcesso === 'RESPONSAVEL' && (
                    <p className="mt-2 inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">
                      Responsável secundário · somente leitura
                    </p>
                  )}
                  <p className="mt-3 flex items-center gap-2 text-sm text-slate-600">
                    <CalendarDays size={16} className="text-[#C8526B]" />
                    Nascimento: {formatarData(crianca.dataNascimento)}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <Link
                      className="secondary-button !w-auto !gap-2 !rounded-xl !px-3 !py-2 text-sm"
                      to={`/bebes/${crianca.idCrianca}`}
                      aria-label={`Ver perfil de ${crianca.nome}`}
                    >
                      <Eye size={16} /> Ver perfil
                    </Link>
                    {crianca.podeEditar && (
                      <button
                        className="record-action-button"
                        type="button"
                        onClick={() => void iniciarEdicao(crianca)}
                        aria-label={`Editar ${crianca.nome}`}
                      >
                        <Pencil size={15} /> Editar
                      </button>
                    )}
                  </div>
                </article>




              ))}
            </div>
          </section>
        )}
        {criancaParaResponsavel && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4"
            role="presentation"
            onMouseDown={(event) => {
              if (event.target === event.currentTarget && !salvandoResponsavel) {
                setCriancaParaResponsavel(null);
              }
            }}
          >
            <section
              role="dialog"
              aria-modal="true"
              aria-labelledby="titulo-vinculo-responsavel"
              className="w-full max-w-lg space-y-5 rounded-2xl bg-white p-6 shadow-xl"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="eyebrow">Compartilhar cuidado</p>
                  <h2 id="titulo-vinculo-responsavel" className="text-xl font-extrabold text-slate-800">
                    Adicionar responsável
                  </h2>
                  <p className="mt-1 text-sm text-slate-500">
                    Escolha uma conta para vincular ao perfil de {criancaParaResponsavel.nome}.
                  </p>
                </div>
                <button
                  type="button"
                  aria-label="Fechar"
                  disabled={salvandoResponsavel}
                  onClick={() => setCriancaParaResponsavel(null)}
                  className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 disabled:opacity-50"
                >
                  <X size={20} />
                </button>
              </div>
              {erroResponsavel && <p role="alert" className="alert-error">{erroResponsavel}</p>}
              {responsavelSelecionado ? (
                <div className="flex items-center justify-between gap-3 rounded-xl border border-[#F4C4CD] bg-[#FFF8F9] px-4 py-3">
                  <div>
                    <p className="font-bold text-slate-800">{responsavelSelecionado.nome}</p>
                    <p className="text-sm text-slate-500">{responsavelSelecionado.email_mascarado}</p>
                  </div>
                  <button
                    type="button"
                    aria-label="Remover responsável selecionado"
                    onClick={() => setResponsavelSelecionado(null)}
                    className="rounded-lg p-2 text-slate-500 hover:bg-white hover:text-[#B0435B]"
                  >
                    <X size={18} />
                  </button>
                </div>
              ) : (
                <div className="relative">
                  <div className="relative">
                    <Search size={18} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      className="field-control pl-10"
                      type="search"
                      autoComplete="off"
                      aria-label="Buscar responsável pelo nome"
                      placeholder="Digite pelo menos 2 letras do nome"
                      value={buscaResponsavel}
                      onChange={(event) => setBuscaResponsavel(event.target.value)}
                    />
                  </div>
                  {carregandoResponsaveis && <p className="mt-2 text-sm text-slate-500">Buscando usuários...</p>}
                  {!carregandoResponsaveis && buscaResponsavel.trim().length >= 2 && !erroResponsavel && responsaveisEncontrados.length === 0 && (
                    <p className="mt-2 text-sm text-slate-500">Nenhum usuário encontrado com esse nome.</p>
                  )}
                  {responsaveisEncontrados.length > 0 && (
                    <ul className="absolute z-10 mt-1 max-h-56 w-full overflow-y-auto rounded-xl border border-rose-100 bg-white py-1 shadow-lg">
                      {responsaveisEncontrados.map((usuario) => (
                        <li key={usuario.id_usuario}>
                          <button
                            type="button"
                            className="w-full px-4 py-3 text-left transition hover:bg-rose-50"
                            onClick={() => setResponsavelSelecionado(usuario)}
                          >
                            <span className="block font-bold text-slate-800">{usuario.nome}</span>
                            <span className="text-sm text-slate-500">{usuario.email_mascarado}</span>
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
              <p className="text-sm text-slate-500">
                O responsável precisa ter uma conta no app. O vínculo concede acesso ao perfil imediatamente.
              </p>
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  disabled={salvandoResponsavel}
                  onClick={() => setCriancaParaResponsavel(null)}
                  className="rounded-xl px-4 py-2 text-sm font-bold text-slate-600 hover:bg-slate-100 disabled:opacity-50"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  disabled={!responsavelSelecionado || salvandoResponsavel}
                  onClick={() => void adicionarResponsavel()}
                  className="primary-button sm:!w-auto disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {salvandoResponsavel ? 'Adicionando...' : 'Adicionar responsável'}
                </button>
              </div>
            </section>
          </div>
        )}
      </section>
    );
  }

  return (
    <section className="form-card card">
      <div className="mb-8">
        <button className="mb-5 inline-flex items-center gap-2 text-sm font-bold text-[#B0435B] hover:underline" type="button" onClick={() => { setMostrarFormulario(false); setCriancaEditando(null); setForm(initial); setErro(''); }}>
          <RotateCcw size={16} /> Voltar para meus bebês
        </button>
        <span className="form-icon form-icon-pink mb-4"><Baby size={28} strokeWidth={1.65} /></span>
        <p className="eyebrow">Primeiros momentos</p>
        <h1 className="display-title !text-3xl">{criancaEditando ? 'Editar dados do bebê' : 'Cadastro do bebê'}</h1>
        <p className="page-subtitle">{criancaEditando ? `Atualize os dados de ${criancaEditando.nome}.` : 'Registre os dados do nascimento para acompanhar essa nova fase.'}</p>
      </div>
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
        {!criancaEditando && (
          <label className="field">
            <span className="field-label">Relação com o bebê</span>
            <select className="field-control" value={form.tipo_relacao} onChange={(e) => set('tipo_relacao', e.target.value)}>
              <option value="MAE">Mãe</option>
              <option value="PAI">Pai</option>
              <option value="RESPONSAVEL">Responsável</option>
            </select>
          </label>
        )}
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
        <button className="primary-button field-wide mt-2" type="submit" disabled={salvandoCrianca}>
          {salvandoCrianca ? 'Salvando dados...' : criancaEditando ? 'Salvar alterações' : 'Salvar dados do bebê'}
        </button>
      </form>
      {criancaEditando && (
        <div className="mt-8 border-t border-rose-100 pt-5">
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-xl border border-rose-200 px-4 py-2.5 text-sm font-bold text-rose-700 transition hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-50"
            onClick={() => { setErro(''); setMostrarConfirmacaoExclusao(true); }}
            disabled={excluindoCrianca || salvandoCrianca}
          >
            <Trash2 size={16} />
            {excluindoCrianca ? 'Excluindo bebê...' : 'Excluir bebê'}
          </button>
        </div>
      )}
      {mostrarConfirmacaoExclusao && criancaEditando && (
        <div
          className="fixed inset-0 z-[80] flex items-center justify-center bg-slate-900/40 p-4"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget && !excluindoCrianca) {
              setMostrarConfirmacaoExclusao(false);
            }
          }}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="titulo-confirmar-exclusao-crianca"
            className="w-full max-w-lg space-y-5 rounded-2xl bg-white p-6 shadow-xl"
          >
            <div>
              <p className="eyebrow text-rose-700">Ação permanente</p>
              <h2 id="titulo-confirmar-exclusao-crianca" className="text-xl font-extrabold text-slate-800">
                Excluir o perfil de {criancaEditando.nome}?
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">
                O perfil e todos os registros vinculados, incluindo informações de crescimento, alimentação, vacinas e desenvolvimento, serão removidos para todos os responsáveis. Esta ação não pode ser desfeita.
              </p>
            </div>
            <div className="flex flex-col-reverse justify-end gap-3 sm:flex-row">
              <button
                type="button"
                autoFocus
                className="secondary-button sm:!w-auto"
                onClick={() => setMostrarConfirmacaoExclusao(false)}
                disabled={excluindoCrianca}
              >
                Cancelar
              </button>
              <button
                type="button"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-rose-600 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-rose-700 disabled:cursor-not-allowed disabled:opacity-50"
                onClick={() => void excluirCrianca()}
                disabled={excluindoCrianca}
              >
                <Trash2 size={16} />
                {excluindoCrianca ? 'Excluindo bebê...' : 'Sim, excluir bebê'}
              </button>
            </div>
          </section>
        </div>
      )}
    </section>
  );
}

function formatarData(value: string) {
  return new Intl.DateTimeFormat('pt-BR', { dateStyle: 'long' }).format(new Date(`${value}T00:00:00`));
}
