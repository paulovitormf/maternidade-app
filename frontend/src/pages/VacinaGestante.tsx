import {
  Clock3,
  Info,
  Syringe,
  ClipboardList,
} from 'lucide-react';

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
    periodo: 'Marco gestacional',
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
    periodo: 'Marco gestacional',
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

export default function VacinaGestante() {
  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Cabeçalho */}
      <header className="mb-8">
        <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-[#B84A62]">
          Saúde materna
        </p>

        <h1 className="text-3xl font-bold tracking-tight text-slate-800">
          Calendário de vacinação
        </h1>

        <p className="mt-2 max-w-2xl text-slate-600">
          Visualize as etapas da vacinação e acompanhe as orientações
          importantes durante a gestação.
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
                  4
                </span>
              </div>

              <div className="flex items-center justify-between gap-3 py-3">
                <span className="text-sm text-slate-600">
                  Marcos gestacionais
                </span>

                <span className="font-semibold text-slate-800">
                  20ª e 28ª semanas
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

          <div className="space-y-8">
            {etapas.map((etapa, indice) => (
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

                        <div className="min-w-0">
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
    </main>
  );
}