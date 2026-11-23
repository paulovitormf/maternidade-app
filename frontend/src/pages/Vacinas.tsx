import { useState } from 'react';
import { Baby, Heart, Printer } from 'lucide-react';
import CalendarioVacinaBebe from './VacinaBebe';
import CalendarioVacinaGestante from './VacinaGestante';

type PublicoVacina = 'mae' | 'bebe';

type VacinasProps = {
  publicoInicial?: PublicoVacina;
};

export default function Vacinas({ publicoInicial = 'mae' }: VacinasProps) {
  const [publico, setPublico] = useState<PublicoVacina>(publicoInicial);

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <header className="mb-6">
        <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-[#B84A62]">
          Saúde da família
        </p>
        <h1 className="text-3xl font-bold tracking-tight text-slate-800">
          Vacinas
        </h1>
        <p className="mt-2 max-w-2xl text-slate-600">
          Consulte os calendários de vacinação da mãe e do bebê em um só lugar.
        </p>
        <button type="button" className="secondary-button mt-4 !w-auto" onClick={() => window.print()}>
          <Printer size={17} /> Exportar / imprimir carteira
        </button>
      </header>

      <div
        className="mb-8 grid grid-cols-2 gap-3 sm:gap-4"
        role="group"
        aria-label="Selecione de quem são as vacinas"
      >
        <button
          type="button"
          aria-pressed={publico === 'mae'}
          onClick={() => setPublico('mae')}
          className={`flex min-h-24 items-center justify-center gap-3 rounded-2xl border-2 px-4 py-5 text-left transition focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#FADCE1] sm:min-h-28 sm:gap-4 sm:px-6 ${
            publico === 'mae'
              ? 'border-[#C8526B] bg-[#FADCE1]/60 text-[#8F344A] shadow-sm'
              : 'border-slate-200 bg-white text-slate-600 hover:border-[#FECDD3] hover:bg-[#FDF7F8]'
          }`}
        >
          <Heart className="shrink-0" size={27} aria-hidden="true" />
          <span>
            <span className="block text-lg font-bold sm:text-xl">Mãe</span>
            <span className="mt-1 hidden text-sm sm:block">
              Vacinação materna
            </span>
          </span>
        </button>

        <button
          type="button"
          aria-pressed={publico === 'bebe'}
          onClick={() => setPublico('bebe')}
          className={`flex min-h-24 items-center justify-center gap-3 rounded-2xl border-2 px-4 py-5 text-left transition focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#FADCE1] sm:min-h-28 sm:gap-4 sm:px-6 ${
            publico === 'bebe'
              ? 'border-[#3B7280] bg-[#EBF3F5] text-[#315C66] shadow-sm'
              : 'border-slate-200 bg-white text-slate-600 hover:border-[#D5E7EB] hover:bg-[#F8FAFC]'
          }`}
        >
          <Baby className="shrink-0" size={29} aria-hidden="true" />
          <span>
            <span className="block text-lg font-bold sm:text-xl">Bebê</span>
            <span className="mt-1 hidden text-sm sm:block">
              Vacinação infantil
            </span>
          </span>
        </button>
      </div>

      {publico === 'mae' ? (
        <CalendarioVacinaGestante />
      ) : (
        <CalendarioVacinaBebe />
      )}
    </main>
  );
}
