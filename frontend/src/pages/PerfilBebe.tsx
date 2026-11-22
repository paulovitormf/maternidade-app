import { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, Baby, CalendarDays, Camera, Ruler, Scale, Syringe } from 'lucide-react';
import axios from 'axios';
import { Link, useParams } from 'react-router-dom';
import api from '../services/api';

type CriancaDetalhe = {
  id_crianca: number;
  nome: string;
  data_nascimento: string;
  hora_nascimento: string;
  sexo?: string | null;
  peso_nascimento?: number | null;
  altura_nascimento?: number | null;
  observacoes?: string | null;
  idade_meses: number;
  pode_editar: boolean;
};

type Registro = {
  id_registro: number;
  id_crianca: number | null;
  nome_crianca: string | null;
  tipo: string;
  titulo: string;
  descricao?: string | null;
  valor?: number | null;
  unidade?: string | null;
  dose?: string | null;
  confirmado: boolean;
  data_registro: string;
  horario?: string | null;
  foto_base64?: string | null;
  idade_meses?: number | null;
  pode_editar: boolean;
};

export default function PerfilBebe() {
  const { id } = useParams();
  const [crianca, setCrianca] = useState<CriancaDetalhe | null>(null);
  const [registros, setRegistros] = useState<Registro[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');

  useEffect(() => {
    let ativo = true;
    if (!id || !/^\d+$/.test(id)) {
      setErro('Perfil de bebê inválido.');
      setCarregando(false);
      return () => { ativo = false; };
    }

    Promise.all([
      api.get<CriancaDetalhe>(`/criancas/${id}`),
      api.get<Registro[]>(`/registros/crianca/${id}`),
    ])
      .then(([detalhe, historico]) => {
        if (!ativo) return;
        setCrianca(detalhe.data);
        setRegistros(historico.data);
      })
      .catch((error: unknown) => {
        if (!ativo) return;
        const status = axios.isAxiosError(error) ? error.response?.status : undefined;
        setErro(status === 403
          ? 'Você não tem acesso ao perfil desta criança.'
          : status === 404
            ? 'Este perfil de bebê não foi encontrado.'
            : 'Não foi possível carregar as informações. Verifique sua conexão e tente novamente.');
      })
      .finally(() => {
        if (ativo) setCarregando(false);
      });

    return () => { ativo = false; };
  }, [id]);

  const medidas = useMemo(() => ({
    peso: registros.find((registro) => registro.tipo === 'PESO' && registro.valor != null),
    altura: registros.find((registro) => registro.tipo === 'ALTURA' && registro.valor != null),
  }), [registros]);

  if (carregando) {
    return <section className="card" role="status">Carregando perfil do bebê...</section>;
  }

  if (erro || !crianca) {
    return (
      <section className="space-y-5">
        <Link className="inline-flex items-center gap-2 text-sm font-bold text-[#B0435B]" to="/cadastrar-bebe">
          <ArrowLeft size={17} /> Voltar para Meus bebês
        </Link>
        <div className="alert-error" role="alert">{erro || 'Não foi possível carregar este perfil.'}</div>
      </section>
    );
  }

  const idade = crianca.idade_meses < 12
    ? `${crianca.idade_meses} ${crianca.idade_meses === 1 ? 'mês' : 'meses'}`
    : `${Math.floor(crianca.idade_meses / 12)} ${Math.floor(crianca.idade_meses / 12) === 1 ? 'ano' : 'anos'}${crianca.idade_meses % 12 ? ` e ${crianca.idade_meses % 12} ${crianca.idade_meses % 12 === 1 ? 'mês' : 'meses'}` : ''}`;

  return (
    <section className="mx-auto w-full max-w-5xl space-y-6 pb-12">
      <Link className="inline-flex items-center gap-2 text-sm font-bold text-[#B0435B] hover:underline" to="/cadastrar-bebe">
        <ArrowLeft size={17} /> Voltar para Meus bebês
      </Link>

      <header className="card flex flex-col gap-5 sm:flex-row sm:items-center">
        <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-[#FADCE1] text-[#B0435B]">
          <Baby size={34} />
        </span>
        <div className="min-w-0 flex-1">
          <p className="eyebrow">Perfil individual</p>
          <h1 className="display-title !text-3xl">{crianca.nome}</h1>
          <p className="page-subtitle">{idade}</p>
        </div>
        <Link className="secondary-button sm:!w-auto" to={`/registros?crianca=${crianca.id_crianca}`}>
          <Camera size={17} className="mr-2" /> Ver registros
        </Link>
      </header>

      {!crianca.pode_editar && (
        <p className="rounded-xl bg-slate-100 px-4 py-3 text-sm text-slate-600">
          Você está vendo este perfil como responsável com acesso somente para leitura.
        </p>
      )}

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4" aria-label="Resumo individual">
        <article className="card">
          <CalendarDays className="mb-3 text-[#C8526B]" />
          <p className="text-sm text-slate-500">Nascimento</p>
          <strong className="mt-1 block text-slate-800">{formatarData(crianca.data_nascimento)}</strong>
          <span className="text-sm text-slate-500">{crianca.hora_nascimento?.slice(0, 5) || 'Horário não informado'}</span>
          <span className="mt-1 block text-sm text-slate-500">Sexo: {crianca.sexo === 'F' ? 'Feminino' : crianca.sexo === 'M' ? 'Masculino' : 'Não informado'}</span>
        </article>
        <article className="card">
          <Scale className="mb-3 text-[#3B7280]" />
          <p className="text-sm text-slate-500">Peso ao nascer</p>
          <strong className="mt-1 block text-slate-800">{formatarMedida(crianca.peso_nascimento, 'kg')}</strong>
          <span className="text-sm text-slate-500">Último registro: {formatarMedida(medidas.peso?.valor, medidas.peso?.unidade || 'kg')}</span>
        </article>
        <article className="card">
          <Ruler className="mb-3 text-[#3B7280]" />
          <p className="text-sm text-slate-500">Comprimento ao nascer</p>
          <strong className="mt-1 block text-slate-800">{formatarMedida(crianca.altura_nascimento, 'cm')}</strong>
          <span className="text-sm text-slate-500">Último registro: {formatarMedida(medidas.altura?.valor, medidas.altura?.unidade || 'cm')}</span>
        </article>
        <article className="card">
          <Syringe className="mb-3 text-[#3B7280]" />
          <p className="text-sm text-slate-500">Registros de vacina</p>
          <strong className="mt-1 block text-slate-800">{registros.filter((registro) => registro.tipo === 'VACINA').length}</strong>
          <span className="text-sm text-slate-500">Anotações vinculadas a este perfil</span>
        </article>
      </section>

      {crianca.observacoes && (
        <section className="card">
          <h2 className="section-title">Observações do nascimento</h2>
          <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-slate-600">{crianca.observacoes}</p>
        </section>
      )}

      <section className="space-y-4">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="eyebrow">Histórico individual</p>
            <h2 className="section-title">Registros de {crianca.nome}</h2>
            <p className="text-sm text-slate-500">Medidas, vacinas, consultas, fotos e outros momentos deste bebê.</p>
          </div>
          {crianca.pode_editar && (
            <Link className="dashboard-hero-button" to={`/registros?crianca=${crianca.id_crianca}`}>
              Adicionar registro
            </Link>
          )}
        </div>

        {registros.length === 0 ? (
          <div className="records-empty">
            <Camera size={30} />
            <h3>Nenhum registro para {crianca.nome}</h3>
            <p>Os registros vinculados a este bebê aparecerão aqui.</p>
          </div>
        ) : (
          <div className="records-list">
            {registros.map((registro) => (
              <article className="record-card" key={registro.id_registro}>
                {registro.foto_base64 && <img className="record-photo" src={registro.foto_base64} alt={registro.titulo} />}
                <div className="record-card-body">
                  <div className="record-card-top">
                    <span className="record-type">{labelTipo(registro.tipo)}</span>
                    <time>{formatarData(registro.data_registro)}{registro.horario ? ` às ${registro.horario.slice(0, 5)}` : ''}</time>
                  </div>
                  <h3>{registro.titulo}</h3>
                  {registro.descricao && <p>{registro.descricao}</p>}
                  {(registro.valor != null || registro.dose) && (
                    <div className="record-card-meta">
                      {registro.valor != null && <span>{formatarMedida(registro.valor, registro.unidade || '')}</span>}
                      {registro.dose && <span>Dose: {registro.dose}</span>}
                      {registro.tipo === 'VACINA' && registro.confirmado && <span>Aplicada</span>}
                    </div>
                  )}
                  {registro.pode_editar && (
                    <Link className="mt-4 inline-flex text-sm font-bold text-[#B0435B] hover:underline" to={`/registros?crianca=${crianca.id_crianca}&editar=${registro.id_registro}`}>
                      Editar registro
                    </Link>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </section>
  );
}

function formatarData(valor: string) {
  return new Intl.DateTimeFormat('pt-BR').format(new Date(`${valor}T00:00:00`));
}

function formatarMedida(valor?: number | null, unidade = '') {
  if (valor == null) return 'Não informado';
  return `${new Intl.NumberFormat('pt-BR', { maximumFractionDigits: 2 }).format(valor)}${unidade ? ` ${unidade}` : ''}`;
}

function labelTipo(tipo: string) {
  return ({
    VACINA: 'Vacina',
    PESO: 'Peso',
    ALTURA: 'Altura',
    INTRODUCAO_ALIMENTAR: 'Introdução alimentar',
    FOTO: 'Foto',
    INTERACAO: 'Interação',
    PRIMEIRA_PALAVRA: 'Primeira palavra',
    CONSULTA: 'Consulta',
    EXAME: 'Exame',
    OUTRO: 'Outro',
  } as Record<string, string>)[tipo] || tipo;
}
