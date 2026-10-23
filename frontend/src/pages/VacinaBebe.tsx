import { Baby, CalendarDays, Info, Syringe } from 'lucide-react';

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

const totalVacinas = etapas.reduce((total, etapa) => total + etapa.vacinas.length, 0);

export default function VacinaBebe() {
  return (
    <section className="space-y-6">
      <header className="page-heading">
        <span className="form-icon form-icon-blue mb-4">
          <Baby size={28} />
        </span>
        <p className="eyebrow">Acompanhamento infantil</p>
        <h1 className="display-title">Vacinação do bebê</h1>
        <p className="page-subtitle">
          Acompanhe as vacinas de rotina do nascimento até os 5 anos de idade.
        </p>
      </header>

      <div className="grid items-start gap-6 lg:grid-cols-[280px_minmax(0,1fr)]">
        <aside className="space-y-4">
          <section className="card">
            <div className="form-icon form-icon-pink mb-4">
              <CalendarDays size={24} />
            </div>
            <h2 className="font-extrabold text-slate-800">Resumo do calendário</h2>
            <div className="mt-4 divide-y divide-rose-100">
              <div className="flex items-center justify-between gap-3 py-3">
                <span className="text-sm text-slate-600">Etapas</span>
                <strong className="text-slate-800">{etapas.length}</strong>
              </div>
              <div className="flex items-center justify-between gap-3 py-3">
                <span className="text-sm text-slate-600">Registros de doses</span>
                <strong className="text-slate-800">{totalVacinas}</strong>
              </div>
              <div className="flex items-center justify-between gap-3 py-3">
                <span className="text-sm text-slate-600">Período</span>
                <strong className="text-slate-800">0 a 5 anos</strong>
              </div>
            </div>
          </section>

          <div className="flex gap-3 rounded-2xl border border-[#D5E7EB] bg-[#EBF3F5] p-4">
            <Info className="mt-0.5 shrink-0 text-[#3B7280]" size={19} />
            <p className="text-sm leading-6 text-slate-700">
              Confira as datas no cartão de vacinação e procure a unidade de saúde em caso de atraso.
            </p>
          </div>
        </aside>

        <section className="card">
          <div className="mb-7 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-extrabold text-slate-800">Calendário por idade</h2>
              <p className="mt-1 text-sm text-slate-500">Doses de rotina até os 5 anos</p>
            </div>
            <span className="rounded-full bg-[#FADCE1] px-3 py-1.5 text-xs font-extrabold text-[#B0435B]">
              Calendário de referência
            </span>
          </div>

          <div className="space-y-6">
            {etapas.map((etapa, indice) => (
              <article className="relative pl-12" key={etapa.idade}>
                {indice < etapas.length - 1 && (
                  <div className="absolute bottom-[-28px] left-[15px] top-10 w-px bg-rose-200" />
                )}
                <div className="absolute left-0 top-0 flex h-8 w-8 items-center justify-center rounded-full border-2 border-[#C8526B] bg-white text-[#B0435B]">
                  <Syringe size={15} />
                </div>
                <h3 className="font-extrabold text-slate-800">{etapa.idade}</h3>
                <div className="mt-3 divide-y divide-slate-100 rounded-2xl border border-slate-200">
                  {etapa.vacinas.map((vacina) => (
                    <div className="flex items-center justify-between gap-4 p-4" key={vacina.nome}>
                      <span className="text-sm font-semibold text-slate-700">{vacina.nome}</span>
                      <span className="shrink-0 text-right text-xs font-bold text-[#3B7280]">{vacina.doses}</span>
                    </div>
                  ))}
                </div>
              </article>
            ))}
          </div>

          <footer className="mt-8 border-t border-slate-100 pt-5">
            <a
              href="https://www.gov.br/saude/pt-br/vacinacao/arquivos/calendario-nacional-de-vacinacao-crianca/view"
              target="_blank"
              rel="noreferrer"
              className="text-sm font-semibold text-[#B0435B] underline underline-offset-4 hover:text-[#8F344A]"
            >
              Consultar calendário oficial do Ministério da Saúde
            </a>
          </footer>
        </section>
      </div>
    </section>
  );
}
