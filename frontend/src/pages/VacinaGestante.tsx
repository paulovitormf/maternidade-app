
import { useState } from 'react';

const vacinas = [
  'Hepatite B',
  'dT (difteria e tétano)',
  'Influenza (gripe)',
  'Covid-19',
  'dTpa (coqueluche)',
  'VSR',
];

export default function VacinaGestante() {
  const [conferidas, setConferidas] = useState<string[]>([]);

  function alternarVacina(nome: string) {
    setConferidas((atual) =>
      atual.includes(nome)
        ? atual.filter((item) => item !== nome)
        : [...atual, nome],
    );
  }

  return (
    <main className="mx-auto max-w-4xl px-6 py-10">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800">
          Calendário de Vacinação
        </h1>

        <p className="mt-2 text-slate-600">
          Acompanhe as vacinas recomendadas durante a gestação.
        </p>
      </header>

      <section className="mb-6 rounded-2xl border border-rose-200/60 bg-[#FADCE1]/40 p-5">
        <p className="font-semibold text-slate-800">
          Meu acompanhamento
        </p>

        <p className="mt-1 text-sm text-slate-600">
          {conferidas.length} de {vacinas.length} vacinas conferidas
        </p>

        <div className="mt-3 h-2 rounded-full bg-white">
          <div
            className="h-2 rounded-full bg-[#C8526B] transition-all"
            style={{
              width: `${(conferidas.length / vacinas.length) * 100}%`,
            }}
          />
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5">
        <h2 className="mb-4 text-xl font-semibold text-slate-800">
          Lista de vacinas
        </h2>

        <div className="divide-y divide-slate-100">
          {vacinas.map((vacina) => (
            <label
              key={vacina}
              className="flex cursor-pointer items-center gap-3 py-4"
            >
              <input
                type="checkbox"
                checked={conferidas.includes(vacina)}
                onChange={() => alternarVacina(vacina)}
                className="h-4 w-4 accent-[#C8526B]"
              />

              <span className="text-slate-700">{vacina}</span>
            </label>
          ))}
        </div>
      </section>

      <p className="mt-4 text-sm text-slate-500">
        Consulte a equipe de pré-natal para confirmar seu calendário
        individual. As marcações desta versão ainda não são salvas.
      </p>
    </main>
  );
}
