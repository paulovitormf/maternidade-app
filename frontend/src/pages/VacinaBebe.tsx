
import {
  Baby,
  CalendarDays,
  Info,
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

export default function VacinaBebe() {
  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Cabeçalho */}
      <header className="mb-8">
        <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-[#3B7280]">
          Acompanhamento infantil
        </p>

        <h1 className="text-3xl font-bold tracking-tight text-slate-800">
          Vacinação do bebê
        </h1>

        <p className="mt-2 max-w-2xl text-slate-600">
          Acompanhe as etapas da vacinação infantil e consulte
          as doses previstas para cada idade.
        </p>
      </header>

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

          <div className="space-y-8">
            {etapas.map((etapa, indice) => (
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
    </main>
  );
}
