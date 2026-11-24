import { useEffect, useState } from 'react';
import { Baby, Heart, Printer } from 'lucide-react';
import { Navigate } from 'react-router-dom';
import CalendarioVacinaBebe from './VacinaBebe';
import CalendarioVacinaGestante from './VacinaGestante';
import api from '../services/api';

type PublicoVacina = 'mae' | 'bebe';

type VacinasProps = {
  publicoInicial?: PublicoVacina;
  somenteGestante?: boolean;
};

export default function Vacinas({ publicoInicial = 'mae', somenteGestante = false }: VacinasProps) {
  const [publico, setPublico] = useState<PublicoVacina>(publicoInicial);
  const [temGestacao, setTemGestacao] = useState<boolean | null>(null);

  useEffect(() => {
    api.get<unknown[]>('/gestacoes')
      .then(({ data }) => setTemGestacao(data.length > 0))
      .catch(() => setTemGestacao(false));
  }, []);

  useEffect(() => {
    if (temGestacao === false) {
      setPublico('bebe');
    }
  }, [temGestacao]);

  if (temGestacao === null) {
    return (
      <main className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <section className="card" role="status" aria-live="polite">
          <p className="text-sm text-slate-500">Verificando informações da gestação...</p>
        </section>
      </main>
    );
  }

  if (somenteGestante && !temGestacao) {
    return <Navigate to="/vacinas-bebe" replace />;
  }

  const mostrarVacinasGestante = temGestacao;

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <header className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-[#B84A62]">
            Saúde da família
          </p>
          <h1 className="text-3xl font-bold tracking-tight text-slate-800">
            Vacinas
          </h1>
          <p className="mt-2 max-w-2xl text-slate-600">
            Consulte os calendários de vacinação da mãe e do bebê em um só lugar.
          </p>
        </div>
        <button type="button" className="secondary-button inline-flex shrink-0 !w-full items-center justify-center gap-2 sm:!w-auto" onClick={() => window.print()}>
          <Printer size={17} aria-hidden="true" />
          <span>Exportar carteira</span>
        </button>
      </header>

      <div className="mb-6 flex justify-center">
        <div
          className="flex flex-wrap justify-center gap-2"
          role="group"
          aria-label="Selecione de quem são as vacinas"
        >
        {mostrarVacinasGestante && (
          <button
            type="button"
            aria-pressed={publico === 'mae'}
            onClick={() => setPublico('mae')}
            className={`flex h-14 min-w-[9.5rem] items-center justify-center gap-2 rounded-xl border px-4 py-2 text-left transition focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#FADCE1] ${
              publico === 'mae'
                ? 'border-[#C8526B] bg-[#FADCE1]/60 text-[#8F344A] shadow-sm'
                : 'border-slate-200 bg-white text-slate-600 hover:border-[#FECDD3] hover:bg-[#FDF7F8]'
            }`}
          >
            <Heart className="shrink-0" size={18} aria-hidden="true" />
            <span>
              <span className="block text-sm font-bold sm:text-base">Mãe</span>
              <span className="mt-0.5 hidden text-xs sm:block">
                Vacinação materna
              </span>
            </span>
          </button>
        )}

        <button
          type="button"
          aria-pressed={publico === 'bebe'}
          onClick={() => setPublico('bebe')}
          className={`flex h-14 min-w-[9.5rem] items-center justify-center gap-2 rounded-xl border px-4 py-2 text-left transition focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#FADCE1] ${
            publico === 'bebe'
              ? 'border-[#3B7280] bg-[#EBF3F5] text-[#315C66] shadow-sm'
              : 'border-slate-200 bg-white text-slate-600 hover:border-[#D5E7EB] hover:bg-[#F8FAFC]'
          }`}
        >
          <Baby className="shrink-0" size={19} aria-hidden="true" />
          <span>
            <span className="block text-sm font-bold sm:text-base">Bebê</span>
            <span className="mt-0.5 hidden text-xs sm:block">
              Vacinação infantil
            </span>
          </span>
        </button>
        </div>
      </div>

      {publico === 'mae' ? (
        <CalendarioVacinaGestante />
      ) : (
        <CalendarioVacinaBebe />
      )}
    </main>
  );
}
