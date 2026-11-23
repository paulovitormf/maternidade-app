import { useEffect, useMemo, useState } from 'react';
import {
  Clock3,
  Info,
  Search,
  Syringe,
  ClipboardList,
} from 'lucide-react';
import api from '../services/api';

const etapas = [
  {
    numero: '01',
    titulo: 'Início do pré-natal',
    periodo: 'Na primeira consulta',
    descricao:
      'Revisar o cartão de vacinação e planejar as doses necessárias.',
    vacinas: [
      {
        nome: 'Hepatite B',
        descricao:
          'Ajuda a prevenir a infecção pelo vírus da hepatite B, que pode ser transmitida ao bebê durante o parto.',
        detalhe: '3 doses, conforme histórico vacinal',
      },
      {
        nome: 'dT — difteria e tétano',
        descricao:
          'Protege contra difteria e tétano, doenças que podem causar complicações importantes para a gestante e o bebê.',
        detalhe: 'Esquema definido conforme histórico vacinal',
      },
      {
        nome: 'Influenza',
        descricao:
          'Protege contra a gripe e suas complicações, que podem ser mais graves durante a gestação.',
        detalhe: '1 dose por temporada',
      },
      {
        nome: 'Covid-19',
        descricao:
          'Reduz o risco de formas graves da Covid-19 e contribui para a proteção da gestante durante a gravidez.',
        detalhe: '1 dose a cada gestação',
      },
    ],
  },
  {
    numero: '02',
    titulo: 'A partir da 20ª semana',
    periodo: 'Jornada gestacional',
    descricao:
      'Período de referência para a vacinação com dTpa.',
    vacinas: [
      {
        nome: 'dTpa',
        descricao:
          'Protege contra difteria, tétano e coqueluche. A vacinação ajuda a transferir anticorpos para o bebê antes do nascimento.',
        detalhe: '1 dose a cada gestação, conforme orientação vacinal',
      },
    ],
  },
  {
    numero: '03',
    titulo: 'A partir da 28ª semana',
    periodo: 'Jornada gestacional',
    descricao:
      'Período de referência para a vacinação contra o VSR.',
    vacinas: [
      {
        nome: 'Vírus sincicial respiratório (VSR)',
        descricao:
          'Ajuda a proteger o bebê contra formas graves de infecção pelo VSR nos primeiros meses de vida.',
        detalhe: '1 dose a cada gestação',
      },
    ],
  },
  {
    numero: '04',
    titulo: 'Avaliação individual',
    periodo: 'Conforme indicação',
    descricao:
      'Algumas vacinas exigem avaliação específica durante a gestação.',
    vacinas: [
      {
        nome: 'Febre amarela',
        descricao:
          'Protege contra a febre amarela, mas durante a gestação só deve ser considerada após avaliação individual do risco e benefício.',
        detalhe: 'Avaliação profissional em situações excepcionais',
      },
    ],
  },
];

export default function CalendarioVacinaGestante() {
  const [busca, setBusca] = useState('');
  const [gestacaoId, setGestacaoId] = useState<number>();
  const [vacinasRegistradas, setVacinasRegistradas] = useState<Array<{ id_registro: number; tipo: string; titulo: string; confirmado: boolean }>>([]);
  const [erro, setErro] = useState('');
  const idUsuario = Number(localStorage.getItem('id_usuario'));

  useEffect(() => {
    api.get<{ id_gestacao: number }>(`/gestacoes/usuario/${idUsuario}/mais-recente`)
      .then(({ data }) => setGestacaoId(data.id_gestacao))
      .catch(() => setGestacaoId(undefined));
  }, [idUsuario]);

  useEffect(() => {
    if (!gestacaoId) return;
    api.get<Array<{ id_registro: number; tipo: string; titulo: string; confirmado: boolean }>>(`/registros/usuario/${idUsuario}`)
      .then(({ data }) => setVacinasRegistradas(data.filter((registro) => registro.tipo === 'VACINA')))
      .catch(() => setErro('Não foi possível carregar as vacinas da gestação.'));
  }, [gestacaoId, idUsuario]);

  const etapasFiltradas = useMemo(() => {
    const termo = busca.trim().toLowerCase();
    if (!termo) return etapas;

    return etapas
      .map((etapa) => {
        const correspondeTitulo =
          etapa.titulo.toLowerCase().includes(termo) ||
          etapa.periodo.toLowerCase().includes(termo);
        const vacinasCorrespondentes = etapa.vacinas.filter(
          (v) =>
            v.nome.toLowerCase().includes(termo) ||
            v.descricao.toLowerCase().includes(termo) ||
            v.detalhe.toLowerCase().includes(termo),
        );

        if (correspondeTitulo) {
          return etapa;
        }

        if (vacinasCorrespondentes.length > 0) {
          return {
            ...etapa,
            vacinas: vacinasCorrespondentes,
          };
        }

        return null;
      })
      .filter((etapa): etapa is (typeof etapas)[number] => etapa !== null);
  }, [busca]);

  const vacinaTomada = (nome: string) =>
    vacinasRegistradas.some((registro) => registro.confirmado && registro.titulo.trim().toLowerCase() === nome.trim().toLowerCase());

  const alternarVacina = async (nome: string) => {
    if (!gestacaoId) {
      setErro('Cadastre uma gestação antes de registrar vacinas maternas.');
      return;
    }
    const existente = vacinasRegistradas.find((registro) =>
      registro.confirmado && registro.titulo.trim().toLowerCase() === nome.trim().toLowerCase(),
    );
    try {
      if (existente) {
        await api.delete(`/registros/${existente.id_registro}`);
      } else {
        await api.post('/registros', {
          id_usuario: idUsuario,
          id_crianca: null,
          id_gestacao: gestacaoId,
          tipo: 'VACINA',
          titulo: nome,
          descricao: 'Vacina materna registrada na jornada da gestação.',
          confirmado: true,
          data_registro: new Date().toISOString().slice(0, 10),
          responsavel_nome: JSON.parse(localStorage.getItem('usuario_autenticado') || '{}').nome || null,
          fase_jornada: 'Gestação',
        });
      }
      const atualizados = await api.get<Array<{ id_registro: number; tipo: string; titulo: string; confirmado: boolean }>>(`/registros/usuario/${idUsuario}`);
      setVacinasRegistradas(atualizados.data.filter((registro) => registro.tipo === 'VACINA'));
      setErro('');
    } catch {
      setErro('Não foi possível atualizar a vacina materna.');
    }
  };

  return (
    <div className="grid items-start gap-6 lg:grid-cols-[300px_minmax(0,1fr)]">
        {/* Resumo lateral */}
        <aside className="space-y-4">
          <section className="rounded-2xl border border-slate-200 bg-white p-5">
            <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-[#EBF3F5] text-[#3B7280]">
              <ClipboardList size={23} />
            </div>

            <h2 className="font-semibold text-slate-800">
              Resumo do calendário
            </h2>

            <div className="mt-4 divide-y divide-slate-100">
              <div className="flex items-center justify-between gap-3 py-3">
                <span className="text-sm text-slate-600">
                  Etapas
                </span>

                <span className="font-semibold text-slate-800">
                  4
                </span>
              </div>

              <div className="flex items-center justify-between gap-3 py-3">
                <span className="text-sm text-slate-600">
                  Jornadas gestacionais
                </span>

                <span className="font-semibold text-slate-800">
                  20ª e 28ª semanas
                </span>
              </div>
            </div>
          </section>
          {gestacaoId && (
            <a className="secondary-button !w-auto" href="/calendario?tipo=VACINA">
              Agendar vacina materna
            </a>
          )}

          <div className="flex gap-3 rounded-xl border border-[#D5E7EB] bg-[#EBF3F5] p-4">
            <Info
              className="mt-0.5 shrink-0 text-[#3B7280]"
              size={19}
            />

            <p className="text-sm leading-6 text-slate-700">
              O esquema individual depende do histórico vacinal e da
              orientação da equipe de pré-natal.
            </p>
          </div>
        </aside>

        {/* Calendário em linha do tempo */}
        <section className="min-w-0 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
          <div className="mb-7 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-bold text-slate-800">
                Etapas da vacinação
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Referências ao longo da gestação
              </p>
            </div>

            <span className="rounded-full bg-[#FADCE1] px-3 py-1.5 text-xs font-semibold text-[#B0435B]">
              Calendário de referência
            </span>
          </div>

          {/* Busca rápida de vacinas */}
          <div className="mb-6 relative">
            <Search size={18} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="search"
              aria-label="Buscar por vacina da gestante"
              placeholder="Buscar por vacina (ex: dTpa, Hepatite B, Gripe)..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 pl-10 pr-4 py-2.5 text-sm text-slate-800 outline-none transition focus:border-[#C8526B] focus:bg-white focus:ring-4 focus:ring-[#fadce1]"
            />
          </div>

          {erro && <div className="alert-error mb-5" role="alert">{erro}</div>}

          <div className="space-y-8">
            {etapasFiltradas.length === 0 ? (
              <div className="py-8 text-center text-sm text-slate-500">
                Nenhuma vacina encontrada para &quot;{busca}&quot;.
              </div>
            ) : etapasFiltradas.map((etapa, indice) => (
              <article
                key={etapa.numero}
                className="relative pl-12"
              >
                {/* Linha vertical da timeline */}
                {indice < etapas.length - 1 && (
                  <div className="absolute bottom-[-34px] left-[15px] top-10 w-px bg-rose-200" />
                )}

                {/* Número da etapa */}
                <div className="absolute left-0 top-0 flex h-8 w-8 items-center justify-center rounded-full border-2 border-[#C8526B] bg-white text-xs font-bold text-[#B0435B]">
                  {etapa.numero}
                </div>

                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-bold text-slate-800">
                      {etapa.titulo}
                    </h3>

                    <span className="inline-flex items-center gap-1 text-xs text-slate-500">
                      <Clock3 size={13} />
                      {etapa.periodo}
                    </span>
                  </div>

                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    {etapa.descricao}
                  </p>

                  {/* Vacinas da etapa */}
                  <div className="mt-3 divide-y divide-slate-100 rounded-xl border border-slate-200">
                    {etapa.vacinas.map((vacina) => (
                      <div
                        key={vacina.nome}
                        className="flex items-start gap-3 p-4"
                      >
                        <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#FDF7F8] text-[#C8526B]">
                          <Syringe size={19} />
                        </div>

                        <div className="min-w-0 flex-1">
                          <h4 className="text-sm font-semibold text-slate-800">
                            {vacina.nome}
                          </h4>

                          <p className="mt-1 text-sm leading-5 text-slate-600">
                            {vacina.descricao}
                          </p>

                          <p className="mt-1 text-sm leading-5 text-slate-500">
                            {vacina.detalhe}
                          </p>
                        </div>
                        {gestacaoId && (
                          <button
                            type="button"
                            role="checkbox"
                            aria-checked={vacinaTomada(vacina.nome)}
                            onClick={() => alternarVacina(vacina.nome)}
                            className={`ml-auto min-w-24 rounded-xl border px-3 py-2 text-xs font-bold transition ${vacinaTomada(vacina.nome) ? 'border-emerald-300 bg-emerald-50 text-emerald-700' : 'border-slate-200 bg-white text-slate-600 hover:border-[#C8526B]'}`}
                          >
                            {vacinaTomada(vacina.nome) ? 'Tomada' : 'Marcar tomada'}
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </article>
            ))}
          </div>

          {/* Fonte oficial */}
          <footer className="mt-8 border-t border-slate-100 pt-5">
            <a
              href="https://www.gov.br/saude/pt-br/vacinacao/arquivos/calendario-nacional-de-vacinacao-gestante/view"
              target="_blank"
              rel="noreferrer"
              className="text-sm font-medium text-[#B0435B] underline underline-offset-4 hover:text-[#8F344A]"
            >
              Consultar calendário oficial do Ministério da Saúde
            </a>
          </footer>
        </section>
      </div>
  );
}