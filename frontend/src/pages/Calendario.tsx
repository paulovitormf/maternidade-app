import { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { CalendarDays, Clock3, Edit3, Plus, Trash2, X } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import api from '../services/api';

type Crianca = { idCrianca: number; nome: string; podeEditar: boolean };
type Gestacao = { id_gestacao: number; ultima_mestruacao: string };
type Registro = {
  id_registro: number;
  id_crianca: number | null;
  nome_crianca: string | null;
  id_gestacao: number | null;
  tipo: string;
  titulo: string;
  descricao?: string;
  data_registro: string;
  horario?: string;
  confirmado: boolean;
  pode_editar: boolean;
  local_evento?: string;
  profissional?: string;
  responsavel_nome?: string;
  fase_jornada?: string;
};

type Formulario = {
  vinculo: string;
  tipo: 'CONSULTA' | 'EXAME' | 'VACINA' | 'OUTRO';
  titulo: string;
  descricao: string;
  data_registro: string;
  horario: string;
  local_evento: string;
  profissional: string;
  responsavel_nome: string;
};

const vazio = (criancas: Crianca[], gestacoes: Gestacao[]): Formulario => ({
  vinculo: criancas[0] ? `crianca:${criancas[0].idCrianca}` : gestacoes[0] ? `gestacao:${gestacoes[0].id_gestacao}` : '',
  tipo: 'CONSULTA',
  titulo: '',
  descricao: '',
  data_registro: new Date().toISOString().slice(0, 10),
  horario: '',
  local_evento: '',
  profissional: '',
  responsavel_nome: '',
});

export default function Calendario() {
  const idUsuario = Number(localStorage.getItem('id_usuario'));
  const [searchParams] = useSearchParams();
  const [criancas, setCriancas] = useState<Crianca[]>([]);
  const [gestacoes, setGestacoes] = useState<Gestacao[]>([]);
  const [eventos, setEventos] = useState<Registro[]>([]);
  const [aberto, setAberto] = useState(false);
  const [editando, setEditando] = useState<number | null>(null);
  const [form, setForm] = useState<Formulario>(vazio([], []));
  const [filtro, setFiltro] = useState('');
  const [filtroTipo, setFiltroTipo] = useState('');
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(true);

  const carregar = async () => {
    setCarregando(true);
    try {
      const [criancasResp, registrosResp] = await Promise.all([
        api.get<Crianca[]>('/criancas'),
        api.get<Registro[]>(`/registros/usuario/${idUsuario}`),
      ]);
      let gestacao: Gestacao[] = [];
      try {
        const resp = await api.get<Gestacao>(`/gestacoes/usuario/${idUsuario}/mais-recente`);
        if (resp.data) gestacao = [resp.data];
      } catch (error) {
        if (!axios.isAxiosError(error) || error.response?.status !== 404) throw error;
      }
      setCriancas(criancasResp.data);
      setGestacoes(gestacao);
      setEventos(registrosResp.data.filter((registro) =>
        ['CONSULTA', 'EXAME', 'VACINA', 'OUTRO'].includes(registro.tipo),
      ));
    } catch {
      setErro('Não foi possível carregar o calendário.');
    } finally {
      setCarregando(false);
    }
  };

  useEffect(() => { carregar(); }, [idUsuario]);
  useEffect(() => {
    const crianca = searchParams.get('crianca');
    const tipo = searchParams.get('tipo');
    if (crianca) setFiltro(crianca);
    if (tipo) setFiltroTipo(tipo);
  }, [searchParams]);

  const futuros = useMemo(() => eventos
    .filter((evento) => (!filtro || String(evento.id_crianca) === filtro || (filtro === 'gestacao' && evento.id_gestacao)))
    .filter((evento) => !filtroTipo || evento.tipo === filtroTipo)
    .sort((a, b) => `${a.data_registro} ${a.horario || ''}`.localeCompare(`${b.data_registro} ${b.horario || ''}`)),
  [eventos, filtro]);

  const abrirNovo = () => {
    setEditando(null);
    setForm(vazio(criancas, gestacoes));
    setErro('');
    setAberto(true);
  };

  const editar = (evento: Registro) => {
    setEditando(evento.id_registro);
    setForm({
      vinculo: evento.id_crianca ? `crianca:${evento.id_crianca}` : evento.id_gestacao ? `gestacao:${evento.id_gestacao}` : '',
      tipo: evento.tipo as Formulario['tipo'],
      titulo: evento.titulo,
      descricao: evento.descricao || '',
      data_registro: evento.data_registro,
      horario: evento.horario || '',
      local_evento: evento.local_evento || '',
      profissional: evento.profissional || '',
      responsavel_nome: evento.responsavel_nome || '',
    });
    setErro('');
    setAberto(true);
  };

  const salvar = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!form.vinculo || !form.titulo.trim()) {
      setErro('Selecione para quem é o evento e informe um título.');
      return;
    }
    const [tipoVinculo, id] = form.vinculo.split(':');
    const payload = {
      id_usuario: idUsuario,
      id_crianca: tipoVinculo === 'crianca' ? Number(id) : null,
      id_gestacao: tipoVinculo === 'gestacao' ? Number(id) : null,
      tipo: form.tipo,
      titulo: form.titulo.trim(),
      descricao: form.descricao.trim(),
      data_registro: form.data_registro,
      horario: form.horario || null,
      local_evento: form.local_evento || null,
      profissional: form.profissional || null,
      responsavel_nome: form.responsavel_nome || JSON.parse(localStorage.getItem('usuario_autenticado') || '{}').nome || null,
      confirmado: false,
    };
    try {
      if (editando) await api.put(`/registros/${editando}`, payload);
      else await api.post('/registros', payload);
      setAberto(false);
      await carregar();
    } catch (error) {
      const resposta = axios.isAxiosError(error) ? error.response?.data : null;
      setErro(typeof resposta === 'string' ? resposta : 'Não foi possível salvar o evento.');
    }
  };

  const excluir = async (evento: Registro) => {
    if (!window.confirm(`Excluir o evento "${evento.titulo}"?`)) return;
    try {
      await api.delete(`/registros/${evento.id_registro}`);
      await carregar();
    } catch {
      setErro('Não foi possível excluir o evento.');
    }
  };

  const concluir = async (evento: Registro) => {
    try {
      await api.put(`/registros/${evento.id_registro}`, {
        id_usuario: idUsuario,
        id_crianca: evento.id_crianca,
        id_gestacao: evento.id_gestacao,
        tipo: evento.tipo,
        titulo: evento.titulo,
        descricao: evento.descricao,
        valor: null,
        unidade: null,
        dose: null,
        confirmado: true,
        data_registro: evento.data_registro,
        horario: evento.horario,
        local_evento: evento.local_evento,
        profissional: evento.profissional,
        responsavel_nome: evento.responsavel_nome,
      });
      await carregar();
    } catch {
      setErro('Não foi possível concluir o evento.');
    }
  };

  return (
    <section className="mx-auto w-full max-w-6xl space-y-6 pb-12">
      <header className="records-header">
        <div>
          <p className="eyebrow">Agenda da família</p>
          <h1 className="display-title">Calendário</h1>
          <p className="page-subtitle">Consultas, exames, vacinas e acontecimentos da gestação e das crianças.</p>
        </div>
        <button className="dashboard-hero-button" type="button" onClick={abrirNovo}><Plus size={18} /> Novo evento</button>
      </header>

      {erro && <div className="alert-error" role="alert">{erro}</div>}

      <div className="records-toolbar">
        <label className="field">
          <span className="field-label">Pessoa vinculada</span>
          <select className="field-control" value={filtro} onChange={(event) => setFiltro(event.target.value)}>
            <option value="">Todas</option>
            {gestacoes.length > 0 && <option value="gestacao">Gestação</option>}
            {criancas.map((crianca) => <option key={crianca.idCrianca} value={String(crianca.idCrianca)}>{crianca.nome}</option>)}
          </select>
        </label>
        <label className="field">
          <span className="field-label">Tipo</span>
          <select className="field-control" value={filtroTipo} onChange={(event) => setFiltroTipo(event.target.value)}>
            <option value="">Todos</option>
            <option value="CONSULTA">Consultas</option>
            <option value="EXAME">Exames</option>
            <option value="VACINA">Vacinas</option>
            <option value="OUTRO">Outros eventos</option>
          </select>
        </label>
      </div>

      {carregando ? (
        <div className="card" role="status">Carregando calendário...</div>
      ) : futuros.length === 0 ? (
        <div className="records-empty">
          <CalendarDays size={30} />
          <h2>Nenhum evento cadastrado</h2>
          <p>Adicione consultas, vacinas, exames ou marcos importantes.</p>
          <button type="button" className="secondary-button" onClick={abrirNovo}>Adicionar evento</button>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {futuros.map((evento) => (
            <article className="card" key={evento.id_registro}>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="eyebrow">{evento.tipo === 'VACINA' ? 'Vacina' : evento.tipo === 'CONSULTA' ? 'Consulta' : evento.tipo === 'EXAME' ? 'Exame' : 'Evento'}</p>
                  <h2 className="mt-1 text-lg font-extrabold text-slate-800">{evento.titulo}</h2>
                </div>
                {evento.confirmado && <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-700">Concluído</span>}
              </div>
              <p className="mt-3 flex items-center gap-2 text-sm text-slate-600">
                <CalendarDays size={16} /> {new Date(`${evento.data_registro}T00:00:00`).toLocaleDateString('pt-BR')}
                {evento.horario && <><Clock3 size={16} /> {evento.horario.slice(0, 5)}</>}
              </p>
              {evento.nome_crianca && <p className="mt-2 text-sm font-semibold text-[#3B7280]">{evento.nome_crianca}</p>}
              {evento.descricao && <p className="mt-3 text-sm leading-6 text-slate-600">{evento.descricao}</p>}
              {evento.local_evento && <p className="mt-2 text-sm text-slate-600">Local: {evento.local_evento}</p>}
              {evento.profissional && <p className="mt-1 text-sm text-slate-600">Profissional: {evento.profissional}</p>}
              {evento.responsavel_nome && <p className="mt-1 text-sm text-slate-500">Responsável: {evento.responsavel_nome}</p>}
              {evento.pode_editar && (
                <div className="mt-5 flex flex-wrap gap-2">
                  {!evento.confirmado && <button type="button" className="secondary-button !w-auto" onClick={() => concluir(evento)}>Marcar concluído</button>}
                  <button type="button" className="record-action-button" onClick={() => editar(evento)}><Edit3 size={15} /> Editar</button>
                  <button type="button" className="record-action-button record-action-danger" onClick={() => excluir(evento)}><Trash2 size={15} /> Excluir</button>
                </div>
              )}
            </article>
          ))}
        </div>
      )}

      {aberto && (
        <div className="record-modal-backdrop" role="presentation">
          <form className="record-modal" onSubmit={salvar}>
            <div className="record-modal-heading">
              <div><p className="eyebrow">Novo compromisso</p><h2>{editando ? 'Editar evento' : 'Adicionar evento'}</h2></div>
              <button type="button" aria-label="Fechar" onClick={() => setAberto(false)}><X size={24} /></button>
            </div>
            <label>Para quem
              <select className="field-control" value={form.vinculo} onChange={(e) => setForm({ ...form, vinculo: e.target.value })} required>
                <option value="">Selecione</option>
                {gestacoes.map((gestacao) => <option key={gestacao.id_gestacao} value={`gestacao:${gestacao.id_gestacao}`}>Minha gestação</option>)}
                {criancas.map((crianca) => <option key={crianca.idCrianca} value={`crianca:${crianca.idCrianca}`}>{crianca.nome}</option>)}
              </select>
            </label>
            <label>Tipo
              <select className="field-control" value={form.tipo} onChange={(e) => setForm({ ...form, tipo: e.target.value as Formulario['tipo'] })}>
                <option value="CONSULTA">Consulta</option>
                <option value="EXAME">Exame</option>
                <option value="VACINA">Vacina</option>
                <option value="OUTRO">Outro evento</option>
              </select>
            </label>
            <div className="record-form-grid">
              <label>Data<input className="field-control" type="date" value={form.data_registro} onChange={(e) => setForm({ ...form, data_registro: e.target.value })} required /></label>
              <label>Hora (opcional)<input className="field-control" type="time" value={form.horario} onChange={(e) => setForm({ ...form, horario: e.target.value })} /></label>
            </div>
            <div className="record-form-grid">
              <label>Local<input className="field-control" value={form.local_evento} onChange={(e) => setForm({ ...form, local_evento: e.target.value })} placeholder="Unidade ou endereço" /></label>
              <label>Profissional<input className="field-control" value={form.profissional} onChange={(e) => setForm({ ...form, profissional: e.target.value })} placeholder="Nome do profissional" /></label>
            </div>
            <label>Responsável pelo registro<input className="field-control" value={form.responsavel_nome} onChange={(e) => setForm({ ...form, responsavel_nome: e.target.value })} placeholder="Nome de quem cadastrou" /></label>
            <label>Título<input className="field-control" value={form.titulo} onChange={(e) => setForm({ ...form, titulo: e.target.value })} placeholder="Ex.: Consulta pediátrica" required /></label>
            <label>Observações<textarea className="field-control" rows={3} value={form.descricao} onChange={(e) => setForm({ ...form, descricao: e.target.value })} /></label>
            {erro && <div className="alert-error" role="alert">{erro}</div>}
            <button className="dashboard-hero-button record-submit" type="submit"><CalendarDays size={17} /> Salvar evento</button>
          </form>
        </div>
      )}
    </section>
  );
}
