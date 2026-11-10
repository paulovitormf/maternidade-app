
import { useState, useMemo } from 'react';
import {
  Baby,
  CalendarDays,
  Info,
  Search,
  Syringe,
  ClipboardList,
} from 'lucide-react';

type Vacina = {
  nome: string;
  doses: string;
};

type Etapa = {
  idade: string;
  vacinas: Vacina[];
};

const etapas: Etapa[] = [
  {
    idade: 'Ao nascer',
    vacinas: [
      { nome: 'BCG', doses: 'Dose única' },
      { nome: 'Hepatite B', doses: '1ª dose' },
    ],
  },
  {
    idade: '2 meses',
    vacinas: [
      { nome: 'Pentavalente', doses: '1ª dose' },
      { nome: 'Poliomielite (VIP)', doses: '1ª dose' },
      { nome: 'Pneumocócica 10-valente', doses: '1ª dose' },
      { nome: 'Rotavírus', doses: '1ª dose' },
    ],
  },
  {
    idade: '3 meses',
    vacinas: [{ nome: 'Meningocócica C', doses: '1ª dose' }],
  },
  {
    idade: '4 meses',
    vacinas: [
      { nome: 'Pentavalente', doses: '2ª dose' },
      { nome: 'Poliomielite (VIP)', doses: '2ª dose' },
      { nome: 'Pneumocócica 10-valente', doses: '2ª dose' },
      { nome: 'Rotavírus', doses: '2ª dose' },
    ],
  },
  {
    idade: '5 meses',
    vacinas: [{ nome: 'Meningocócica C', doses: '2ª dose' }],
  },
  {
    idade: '6 meses',
    vacinas: [
      { nome: 'Pentavalente', doses: '3ª dose' },
      { nome: 'Poliomielite (VIP)', doses: '3ª dose' },
      { nome: 'Influenza', doses: '1ª dose' },
      { nome: 'Covid-19', doses: '1ª dose' },
    ],
  },
  {
    idade: '7 meses',
    vacinas: [{ nome: 'Covid-19', doses: '2ª dose' }],
  },
  {
    idade: '9 meses',
    vacinas: [
      { nome: 'Febre amarela', doses: '1ª dose' },
      { nome: 'Covid-19', doses: '3ª dose' },
    ],
  },
  {
    idade: '12 meses',
    vacinas: [
      { nome: 'Pneumocócica 10-valente', doses: 'Reforço' },
      { nome: 'Meningocócica ACWY', doses: 'Reforço' },
      { nome: 'Tríplice viral', doses: '1ª dose' },
    ],
  },
  {
    idade: '15 meses',
    vacinas: [
      { nome: 'DTP', doses: '1º reforço' },
      { nome: 'Poliomielite (VIP)', doses: '1º reforço' },
      { nome: 'Hepatite A', doses: 'Dose única' },
      { nome: 'Tetraviral ou varicela', doses: '1ª dose' },
    ],
  },
  {
    idade: '4 anos',
    vacinas: [
      { nome: 'DTP', doses: '2º reforço' },
      { nome: 'Poliomielite (VIP)', doses: '2º reforço' },
      { nome: 'Febre amarela', doses: 'Reforço' },
      { nome: 'Varicela', doses: '2ª dose' },
    ],
  },
];

const totalVacinas = etapas.reduce(
  (total, etapa) => total + etapa.vacinas.length,
  0,
);

export default function CalendarioVacinaBebe() {
  const [busca, setBusca] = useState('');

  const etapasFiltradas = useMemo(() => {
    const termo = busca.trim().toLowerCase();
    if (!termo) return etapas;

    return etapas
      .map((etapa) => {
        const correspondeIdade = etapa.idade.toLowerCase().includes(termo);
        const vacinasCorrespondentes = etapa.vacinas.filter(
          (v) =>
            v.nome.toLowerCase().includes(termo) ||
            v.doses.toLowerCase().includes(termo),
        );

        if (correspondeIdade) {
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
      .filter((etapa): etapa is Etapa => etapa !== null);
  }, [busca]);

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
                  {etapas.length}
                </span>
              </div>

              <div className="flex items-center justify-between gap-3 py-3">
                <span className="text-sm text-slate-600">
                  Doses previstas
                </span>

                <span className="font-semibold text-slate-800">
                  {totalVacinas}
                </span>
              </div>

              <div className="flex items-center justify-between gap-3 py-3">
                <span className="text-sm text-slate-600">
                  Última etapa
                </span>

                <span className="font-semibold text-slate-800">
                  4 anos
                </span>
              </div>
            </div>
          </section>

          <div className="flex gap-3 rounded-xl border border-[#D5E7EB] bg-[#EBF3F5] p-4">
            <Info
              className="mt-0.5 shrink-0 text-[#3B7280]"
              size={19}
            />

            <p className="text-sm leading-6 text-slate-700">
              Confira o cartão de vacinação da criança e procure
              uma unidade de saúde para confirmar as doses e os
              intervalos recomendados.
            </p>
          </div>
        </aside>

        {/* Linha do tempo */}
        <section className="min-w-0 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
          <div className="mb-7 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-bold text-slate-800">
                Calendário por idade
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Etapas da vacinação infantil
              </p>
            </div>

            <span className="rounded-full bg-[#EBF3F5] px-3 py-1.5 text-xs font-semibold text-[#315C66]">
              Calendário de referência
            </span>
          </div>

          {/* Campo de busca rápida */}
          <div className="mb-6 relative">
            <Search size={18} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="search"
              aria-label="Buscar por vacina ou idade"
              placeholder="Buscar por vacina (ex: BCG, Rotavírus) ou idade (ex: 2 meses)..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 pl-10 pr-4 py-2.5 text-sm text-slate-800 outline-none transition focus:border-[#C8526B] focus:bg-white focus:ring-4 focus:ring-[#fadce1]"
            />
          </div>

          <div className="space-y-8">
            {etapasFiltradas.length === 0 ? (
              <div className="py-8 text-center text-sm text-slate-500">
                Nenhuma vacina encontrada para &quot;{busca}&quot;.
              </div>
            ) : etapasFiltradas.map((etapa, indice) => (
              <article
                key={etapa.idade}
                className="relative pl-12"
              >
                {/* Linha vertical */}
                {indice < etapas.length - 1 && (
                  <div className="absolute bottom-[-34px] left-[15px] top-10 w-px bg-rose-200" />
                )}

                {/* Marcador da etapa */}
                <div className="absolute left-0 top-0 flex h-8 w-8 items-center justify-center rounded-full border-2 border-[#C8526B] bg-white text-[#B0435B]">
                  <Baby size={16} />
                </div>

                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-bold text-slate-800">
                      {etapa.idade}
                    </h3>

                    <span className="inline-flex items-center gap-1 text-xs text-slate-500">
                      <CalendarDays size={13} />
                      Etapa de vacinação
                    </span>
                  </div>

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

                          <p className="mt-1 text-sm text-slate-500">
                            {vacina.doses}
                          </p>
                        </div>
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
              href="https://www.gov.br/saude/pt-br/vacinacao/arquivos/calendario-nacional-de-vacinacao-crianca/view"
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
