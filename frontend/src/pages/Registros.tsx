import { useEffect, useMemo, useState } from 'react';
import { CalendarDays, Camera, CheckCircle2, ClipboardList, Image, Pencil, Plus, Save, Trash2, X } from 'lucide-react';
import axios from 'axios';
import { Link, useSearchParams } from 'react-router-dom';
import api from '../services/api';

type Criança = { idCrianca: number; nome: string; podeEditar: boolean };
type Gestacao = { id_gestacao: number; ultima_mestruacao: string };
type Registro = { id_registro: number; id_crianca: number | null; nome_crianca: string | null; id_gestacao: number | null; tipo: string; titulo: string; descricao?: string; valor?: number; unidade?: string; dose?: string; confirmado: boolean; data_registro: string; horario?: string; foto_base64?: string; idade_meses?: number; semana_gestacao?: number; pode_editar: boolean };
type Formulario = { vinculo: string; tipo: string; titulo: string; descricao: string; valor: string; unidade: string; dose: string; data_registro: string; horario: string; confirmado: boolean; foto_base64: string };

const tipos = [
  ['VACINA', 'Vacina'], ['PESO', 'Peso'], ['ALTURA', 'Altura'], ['INTRODUCAO_ALIMENTAR', 'Introdução alimentar'], ['FOTO', 'Foto'], ['INTERACAO', 'Interação'], ['PRIMEIRA_PALAVRA', 'Primeira palavra'], ['CONSULTA', 'Consulta'], ['EXAME', 'Exame'], ['OUTRO', 'Outro'],
];
const vazio: Formulario = { vinculo: '', tipo: 'OUTRO', titulo: '', descricao: '', valor: '', unidade: '', dose: '', data_registro: new Date().toISOString().slice(0, 10), horario: '', confirmado: false, foto_base64: '' };

export default function Registros() {
  const [searchParams] = useSearchParams();
  const [registros, setRegistros] = useState<Registro[]>([]);
  const [criancas, setCriancas] = useState<Criança[]>([]);
  const [gestacoes, setGestacoes] = useState<Gestacao[]>([]);
  const [form, setForm] = useState<Formulario>(() => {
    const crianca = searchParams.get('crianca');
    return { ...vazio, vinculo: crianca ? `crianca:${crianca}` : '' };
  });
  const [aberto, setAberto] = useState(false);
  const [registroEditando, setRegistroEditando] = useState<number | null>(null);
  const [aba, setAba] = useState<'registros' | 'galeria'>('registros');
  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState('');
  const [filtroCrianca, setFiltroCrianca] = useState(searchParams.get('crianca') || '');
  const [filtroTipo, setFiltroTipo] = useState('');
  const [filtroBusca, setFiltroBusca] = useState('');
  const [filtroDe, setFiltroDe] = useState('');
  const [filtroAte, setFiltroAte] = useState('');
  const idUsuario = Number(localStorage.getItem('id_usuario'));

  const carregar = async () => {
    setCarregando(true);
    try {
      const [criancasResponse, registrosResponse] = await Promise.all([
        api.get<Criança[]>('/criancas'),
        api.get<Registro[]>(`/registros/usuario/${idUsuario}`),
      ]);
      const gestacaoResponse = await api
        .get<Gestacao>(`/gestacoes/usuario/${idUsuario}/mais-recente`)
        .catch((error: unknown) => {
          if (axios.isAxiosError(error) && error.response?.status === 404) return null;
          throw error;
        });
      const gestacoesDoUsuario = gestacaoResponse ? [gestacaoResponse.data] : [];

      setCriancas(criancasResponse.data);
      setRegistros(registrosResponse.data);
      setGestacoes(gestacoesDoUsuario);
      setForm((atual) => {
        if (atual.vinculo) return atual;
        const primeiraCrianca = criancasResponse.data.find((crianca) => crianca.podeEditar);
        const gestacao = gestacoesDoUsuario[0];
        const vinculo = primeiraCrianca
          ? `crianca:${primeiraCrianca.idCrianca}`
          : gestacao
            ? `gestacao:${gestacao.id_gestacao}`
            : '';
        return { ...atual, vinculo };
      });
    } catch {
      setErro('Não foi possível carregar os registros. Verifique se o back-end e o banco estão ativos.');
    } finally {
      setCarregando(false);
    }
  };
  useEffect(() => { void carregar(); }, [idUsuario]);
  useEffect(() => {
    const idEditar = Number(searchParams.get('editar'));
    if (!idEditar) return;
    const registro = registros.find((item) => item.id_registro === idEditar);
    if (registro?.pode_editar) abrirEdicao(registro);
  }, [registros, searchParams]);
  const filtrados = useMemo(() => registros.filter((registro) => {
    const busca = filtroBusca.trim().toLocaleLowerCase();
    return (!filtroCrianca || String(registro.id_crianca) === filtroCrianca)
      && (!filtroTipo || registro.tipo === filtroTipo)
      && (!filtroDe || registro.data_registro >= filtroDe)
      && (!filtroAte || registro.data_registro <= filtroAte)
      && (!busca || `${registro.titulo} ${registro.descricao || ''}`.toLocaleLowerCase().includes(busca));
  }), [registros, filtroCrianca, filtroTipo, filtroDe, filtroAte, filtroBusca]);
  const exibidos = useMemo(() => filtrados.filter((registro) => aba === 'galeria' ? Boolean(registro.foto_base64) : true), [filtrados, aba]);
  const alterar = (campo: keyof Formulario, valor: string | boolean) => setForm((atual) => ({ ...atual, [campo]: valor }));
  const abrirNovoRegistro = () => {
    setErro('');
    setRegistroEditando(null);
    setForm({ ...vazio, vinculo: filtroCrianca ? `crianca:${filtroCrianca}` : '' });
    setAberto(true);
  };
  const abrirEdicao = (registro: Registro) => {
    setErro('');
    setRegistroEditando(registro.id_registro);
    setForm({
      vinculo: registro.id_crianca != null
        ? `crianca:${registro.id_crianca}`
        : registro.id_gestacao != null
          ? `gestacao:${registro.id_gestacao}`
          : '',
      tipo: registro.tipo,
      titulo: registro.titulo,
      descricao: registro.descricao || '',
      valor: registro.valor == null ? '' : String(registro.valor),
      unidade: registro.unidade || '',
      dose: registro.dose || '',
      data_registro: registro.data_registro,
      horario: registro.horario?.slice(0, 5) || '',
      confirmado: registro.confirmado,
      foto_base64: registro.foto_base64 || '',
    });
    setAberto(true);
  };
  const foto = (arquivo: File | undefined) => { if (!arquivo) return; if (arquivo.size > 5 * 1024 * 1024) { setErro('A foto deve ter no máximo 5 MB.'); return; } const reader = new FileReader(); reader.onload = () => alterar('foto_base64', String(reader.result)); reader.readAsDataURL(arquivo); };
  const salvar = async (event: React.FormEvent) => {
    event.preventDefault();
    setErro('');
    setSalvando(true);
    const [tipoVinculo, id] = form.vinculo.split(':');
    try {
      const payload = {
        id_usuario: idUsuario,
        id_crianca: tipoVinculo === 'crianca' ? Number(id) : null,
        id_gestacao: tipoVinculo === 'gestacao' ? Number(id) : null,
        tipo: form.tipo,
        titulo: form.titulo,
        descricao: form.descricao,
        valor: form.valor ? Number(form.valor) : null,
        unidade: form.unidade || null,
        dose: form.dose || null,
        confirmado: form.confirmado,
        data_registro: form.data_registro,
        horario: form.horario || null,
        foto_base64: form.foto_base64 || null,
      };
      if (registroEditando != null) {
        await api.put(`/registros/${registroEditando}`, payload);
      } else {
        await api.post('/registros', payload);
      }
      setForm({ ...vazio, vinculo: form.vinculo });
      setAberto(false);
      setRegistroEditando(null);
      await carregar();
    } catch (error: unknown) {
      const resposta = axios.isAxiosError(error) ? error.response?.data : null;
      const mensagem = typeof resposta === 'string'
        ? resposta
        : typeof resposta === 'object' && resposta !== null && 'message' in resposta && typeof resposta.message === 'string'
          ? resposta.message
          : 'Não foi possível salvar este registro. Verifique se o back-end e o banco estão ativos.';
      setErro(mensagem);
    } finally {
      setSalvando(false);
    }
  };
  const excluir = async (registro: Registro) => {
    if (!registro.pode_editar || !window.confirm(`Excluir o registro "${registro.titulo}"? Essa ação não pode ser desfeita.`)) return;
    setErro('');
    try {
      await api.delete(`/registros/${registro.id_registro}`);
      await carregar();
    } catch (error: unknown) {
      const resposta = axios.isAxiosError(error) ? error.response?.data : null;
      setErro(typeof resposta === 'string'
        ? resposta
        : 'Não foi possível excluir este registro. Tente novamente.');
    }
  };
  const labelTipo = (tipo: string) => tipos.find(([valor]) => valor === tipo)?.[1] ?? tipo;
  const data = (valor: string, horario?: string) => `${new Intl.DateTimeFormat('pt-BR').format(new Date(`${valor}T00:00:00`))}${horario ? ` às ${horario.slice(0, 5)}` : ''}`;

  return (
    <section className="records-page">
      <header className="records-header">
        <div>
          <span className="form-icon form-icon-pink mb-4"><ClipboardList size={28} /></span>
          <p className="eyebrow">Memórias e acompanhamento</p>
          <h1 className="display-title">Registros</h1>
          <p className="page-subtitle">Guarde vacinas, medidas, descobertas e momentos importantes por criança e por data.</p>
        </div>
        <button className="dashboard-hero-button" type="button" onClick={abrirNovoRegistro}>
          <Plus size={18} /> Adicionar registro
        </button>
      </header>

      <div className="records-tabs">
        <button className={aba === 'registros' ? 'records-tab-active' : ''} type="button" onClick={() => setAba('registros')}>
          <ClipboardList size={17} /> Registros
        </button>
        <button className={aba === 'galeria' ? 'records-tab-active' : ''} type="button" onClick={() => setAba('galeria')}>
          <Image size={17} /> Galeria
        </button>
      </div>

      <section className="card grid gap-4 sm:grid-cols-2 lg:grid-cols-5" aria-label="Filtros de registros">
        <label className="field">
          <span className="field-label">Buscar</span>
          <input className="field-control" type="search" value={filtroBusca} onChange={(event) => setFiltroBusca(event.target.value)} placeholder="Título ou observação" />
        </label>
        <label className="field">
          <span className="field-label">Bebê</span>
          <select className="field-control" value={filtroCrianca} onChange={(event) => setFiltroCrianca(event.target.value)}>
            <option value="">Todos</option>
            {criancas.map((crianca) => <option key={crianca.idCrianca} value={crianca.idCrianca}>{crianca.nome}</option>)}
          </select>
        </label>
        <label className="field">
          <span className="field-label">Tipo</span>
          <select className="field-control" value={filtroTipo} onChange={(event) => setFiltroTipo(event.target.value)}>
            <option value="">Todos</option>
            {tipos.map(([valor, nome]) => <option key={valor} value={valor}>{nome}</option>)}
          </select>
        </label>
        <label className="field">
          <span className="field-label">A partir de</span>
          <input className="field-control" type="date" value={filtroDe} onChange={(event) => setFiltroDe(event.target.value)} />
        </label>
        <label className="field">
          <span className="field-label">Até</span>
          <input className="field-control" type="date" value={filtroAte} onChange={(event) => setFiltroAte(event.target.value)} />
        </label>
      </section>

      {erro && !aberto && <div className="alert-error" role="alert">{erro}</div>}
      {carregando ? (
        <div className="card" role="status"><p className="text-sm text-slate-500">Carregando registros...</p></div>
      ) : exibidos.length === 0 ? (
        <div className="records-empty">
          <Camera size={30} />
          <h2>{aba === 'galeria' ? 'Sua galeria está vazia' : filtrados.length === 0 ? 'Nenhum registro encontrado' : 'Nenhum registro com foto'}</h2>
          <p>{registros.length === 0 ? 'Adicione o primeiro momento para começar a acompanhar essa história.' : 'Tente ajustar os filtros ou adicione um novo registro.'}</p>
          <button type="button" className="secondary-button" onClick={abrirNovoRegistro}>Adicionar registro</button>
        </div>
      ) : (
        <>
          <p className="text-sm text-slate-500">{exibidos.length} {exibidos.length === 1 ? 'registro encontrado' : 'registros encontrados'}</p>
          <div className={aba === 'galeria' ? 'records-gallery' : 'records-list'}>
            {exibidos.map((registro) => (
              <article className="record-card" key={registro.id_registro}>
                {registro.foto_base64 && <img className="record-photo" src={registro.foto_base64} alt={registro.titulo} />}
                <div className="record-card-body">
                  <div className="record-card-top">
                    <span className="record-type">{labelTipo(registro.tipo)}</span>
                    <time><CalendarDays size={14} />{data(registro.data_registro, registro.horario)}</time>
                  </div>
                  <h2>{registro.titulo}</h2>
                  <p>{registro.descricao || 'Sem observação adicional.'}</p>
                  <div className="record-card-meta">
                    {registro.id_crianca != null && registro.nome_crianca && (
                      <Link to={`/bebes/${registro.id_crianca}`}>👶 {registro.nome_crianca}{registro.idade_meses != null ? ` · ${registro.idade_meses} meses` : ''}</Link>
                    )}
                    {registro.semana_gestacao != null && <span>🤰 {registro.semana_gestacao}ª semana</span>}
                    {registro.tipo === 'VACINA' && registro.confirmado && <span className="record-confirmed"><CheckCircle2 size={14} /> Tomada</span>}
                    {registro.dose && <span>Dose: {registro.dose}</span>}
                    {registro.valor != null && <span>{registro.valor} {registro.unidade || ''}</span>}
                  </div>
                  {registro.pode_editar && (
                    <div className="mt-4 flex flex-wrap gap-2">
                      <button className="secondary-button !w-auto" type="button" onClick={() => abrirEdicao(registro)} aria-label={`Editar ${registro.titulo}`}>
                        <Pencil size={15} className="mr-2" /> Editar
                      </button>
                      <button className="secondary-button !w-auto" type="button" onClick={() => void excluir(registro)} aria-label={`Excluir ${registro.titulo}`}>
                        <Trash2 size={15} className="mr-2" /> Excluir
                      </button>
                    </div>
                  )}
                </div>
              </article>
            ))}
          </div>
        </>
      )}

      {aberto && (
        <div className="record-modal-backdrop" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && !salvando && setAberto(false)}>
          <form className="record-modal" onSubmit={salvar}>
            <div className="record-modal-heading">
              <div>
                <p className="eyebrow">Memórias e acompanhamento</p>
                <h2>{registroEditando == null ? 'Adicionar registro' : 'Editar registro'}</h2>
              </div>
              <button type="button" aria-label="Fechar" disabled={salvando} onClick={() => setAberto(false)}><X /></button>
            </div>
            <label>Para quem
              <select className="field-control" value={form.vinculo} onChange={(event) => alterar('vinculo', event.target.value)} required>
                <option value="">Selecione</option>
                {criancas.filter((crianca) => crianca.podeEditar).map((crianca) => <option key={crianca.idCrianca} value={`crianca:${crianca.idCrianca}`}>{crianca.nome}</option>)}
                {gestacoes.map((gestacao) => <option key={gestacao.id_gestacao} value={`gestacao:${gestacao.id_gestacao}`}>Minha gestação (DUM: {gestacao.ultima_mestruacao})</option>)}
              </select>
            </label>
            <label>O que deseja registrar
              <select className="field-control" value={form.tipo} onChange={(event) => alterar('tipo', event.target.value)}>
                {tipos.map(([valor, nome]) => <option key={valor} value={valor}>{nome}</option>)}
              </select>
            </label>
            <div className="record-form-grid">
              <label>Data<input className="field-control" type="date" value={form.data_registro} onChange={(event) => alterar('data_registro', event.target.value)} required /></label>
              <label>Hora <span>(opcional)</span><input className="field-control" type="time" value={form.horario} onChange={(event) => alterar('horario', event.target.value)} /></label>
            </div>
            <label>Título<input className="field-control" value={form.titulo} onChange={(event) => alterar('titulo', event.target.value)} placeholder="Ex.: Primeira palavra" required /></label>
            {(form.tipo === 'PESO' || form.tipo === 'ALTURA') && (
              <div className="record-form-grid">
                <label>Valor<input className="field-control" type="number" step="0.01" value={form.valor} onChange={(event) => alterar('valor', event.target.value)} required /></label>
                <label>Unidade<input className="field-control" value={form.unidade} onChange={(event) => alterar('unidade', event.target.value)} placeholder={form.tipo === 'PESO' ? 'kg' : 'cm'} required /></label>
              </div>
            )}
            {form.tipo === 'VACINA' && (
              <>
                <label>Dose<input className="field-control" value={form.dose} onChange={(event) => alterar('dose', event.target.value)} placeholder="Ex.: 1ª dose" /></label>
                <label className="record-check"><input type="checkbox" checked={form.confirmado} onChange={(event) => alterar('confirmado', event.target.checked)} /> Confirmar que a vacina foi tomada</label>
              </>
            )}
            <label>Legenda ou observação<textarea className="field-control" rows={3} value={form.descricao} onChange={(event) => alterar('descricao', event.target.value)} placeholder="Conte o que aconteceu..." /></label>
            <label className="record-file">Foto <span>(opcional)</span>
              <input type="file" accept="image/*" onChange={(event) => foto(event.target.files?.[0])} />
              {form.foto_base64 && <img src={form.foto_base64} alt="Prévia do registro" />}
              {form.foto_base64 && <button className="text-sm font-bold text-[#B0435B]" type="button" onClick={() => alterar('foto_base64', '')}>Remover foto</button>}
            </label>
            {erro && <div className="alert-error" role="alert">{erro}</div>}
            <button className="dashboard-hero-button record-submit" disabled={salvando} type="submit">
              <Save size={17} />{salvando ? 'Salvando...' : registroEditando == null ? 'Salvar registro' : 'Salvar alterações'}
            </button>
          </form>
        </div>
      )}
    </section>
  );
}
