import { Baby, CalendarDays, CheckCircle2, ChevronRight, HeartPulse } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';

type Etapa = 'gestacao' | 'crianca' | 'mais';

type EstadoCadastro = {
  etapa?: Etapa;
};

export default function ContinuarCadastro() {
  const navigate = useNavigate();
  const location = useLocation();
  const estado = location.state as EstadoCadastro | null;
  const etapa = estado?.etapa ?? 'mais';
  const cadastroInicial = etapa !== 'mais';

  const abrirCadastro = (rota: string) => {
    navigate(rota, {
      state: {
        abrirFormulario: true,
        origemCadastro: cadastroInicial ? 'inicio' : 'mais',
      },
    });
  };

  const adiar = () => {
    if (etapa === 'gestacao') {
      navigate('/continuar-cadastro', { state: { etapa: 'crianca' }, replace: true });
      return;
    }
    navigate('/', { replace: true });
  };

  if (etapa === 'gestacao') {
    return (
      <section className="form-card card text-center sm:text-left">
        <div className="flex flex-col items-center sm:items-start">
          <span className="form-icon form-icon-blue mb-4"><HeartPulse size={28} strokeWidth={1.65} /></span>
          <p className="eyebrow">Seu acompanhamento</p>
          <h1 className="display-title !text-3xl">Quer cadastrar uma gestação?</h1>
          <p className="page-subtitle mb-7">Você pode registrar agora ou deixar para mais tarde.</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <button className="primary-button flex-1" type="button" onClick={() => abrirCadastro('/cadastrar-gestacao')}>
            <CalendarDays size={18} className="mr-2" /> Cadastrar gestação
          </button>
          <button className="secondary-button flex-1" type="button" onClick={adiar}>
            Deixar para mais tarde
          </button>
        </div>
      </section>
    );
  }

  if (etapa === 'crianca') {
    return (
      <section className="form-card card text-center sm:text-left">
        <div className="flex flex-col items-center sm:items-start">
          <span className="form-icon form-icon-pink mb-4"><Baby size={28} strokeWidth={1.65} /></span>
          <p className="eyebrow">Primeiros momentos</p>
          <h1 className="display-title !text-3xl">Quer adicionar uma criança?</h1>
          <p className="page-subtitle mb-7">Cadastre os dados agora ou deixe para fazer isso mais tarde.</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <button className="primary-button flex-1" type="button" onClick={() => abrirCadastro('/cadastrar-bebe')}>
            <Baby size={18} className="mr-2" /> Cadastrar criança
          </button>
          <button className="secondary-button flex-1" type="button" onClick={adiar}>
            Deixar para mais tarde
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="form-card card">
      <div className="flex flex-col items-center sm:items-start mb-6">
        <span className="form-icon form-icon-pink mb-4"><CheckCircle2 size={28} strokeWidth={1.65} /></span>
        <p className="eyebrow">Próximos passos</p>
        <h1 className="display-title !text-3xl">Deseja cadastrar algo mais?</h1>
        <p className="page-subtitle">
          Você pode cadastrar outra gestação ou adicionar mais uma criança. Se preferir, continue para o início.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <button
          className="flex items-center justify-between rounded-2xl border border-[#D6E9ED] bg-[#EBF3F5]/60 p-4 text-left transition hover:bg-[#EBF3F5] hover:border-[#3B7280] group"
          type="button"
          onClick={() => abrirCadastro('/cadastrar-gestacao')}
        >
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-[#3B7280] shadow-sm">
              <CalendarDays size={20} strokeWidth={1.7} />
            </span>
            <div>
              <strong className="block text-sm font-extrabold text-slate-800">Cadastrar gestação</strong>
              <small className="text-xs text-slate-500">Acompanhe semanas e previsão</small>
            </div>
          </div>
          <ChevronRight size={18} className="text-slate-400 group-hover:translate-x-1 transition-transform" />
        </button>

        <button
          className="flex items-center justify-between rounded-2xl border border-[#FADCE1] bg-[#FFF8F9] p-4 text-left transition hover:bg-[#FADCE1]/60 hover:border-[#C8526B] group"
          type="button"
          onClick={() => abrirCadastro('/cadastrar-bebe')}
        >
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-[#C8526B] shadow-sm">
              <Baby size={20} strokeWidth={1.7} />
            </span>
            <div>
              <strong className="block text-sm font-extrabold text-slate-800">Cadastrar bebê</strong>
              <small className="text-xs text-slate-500">Dados do nascimento e puericultura</small>
            </div>
          </div>
          <ChevronRight size={18} className="text-slate-400 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

      <div className="mt-6 pt-5 border-t border-[#fecdd3]/60 flex justify-center sm:justify-end">
        <button
          className="secondary-button w-full sm:w-auto"
          type="button"
          onClick={adiar}
        >
          Deixar para mais tarde
        </button>
      </div>
    </section>
  );
}
