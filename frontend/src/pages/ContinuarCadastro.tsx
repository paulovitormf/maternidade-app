import { Baby, CalendarDays, CheckCircle2, HeartPulse } from 'lucide-react';
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
      <section className="form-card card">
        <span className="form-icon form-icon-blue mb-4"><HeartPulse size={28} strokeWidth={1.65} /></span>
        <p className="eyebrow">Seu acompanhamento</p>
        <h1 className="display-title !text-3xl">Quer cadastrar uma gestação?</h1>
        <p className="page-subtitle mb-7">Você pode registrar agora ou deixar para mais tarde.</p>
        <div className="space-y-3">
          <button className="primary-button" type="button" onClick={() => abrirCadastro('/cadastrar-gestacao')}>
            <CalendarDays size={18} className="mr-2" /> Cadastrar gestação
          </button>
          <button className="secondary-button" type="button" onClick={adiar}>
            Deixar para mais tarde
          </button>
        </div>
      </section>
    );
  }

  if (etapa === 'crianca') {
    return (
      <section className="form-card card">
        <span className="form-icon form-icon-pink mb-4"><Baby size={28} strokeWidth={1.65} /></span>
        <p className="eyebrow">Primeiros momentos</p>
        <h1 className="display-title !text-3xl">Quer adicionar uma criança?</h1>
        <p className="page-subtitle mb-7">Cadastre os dados agora ou deixe para fazer isso mais tarde.</p>
        <div className="space-y-3">
          <button className="primary-button" type="button" onClick={() => abrirCadastro('/cadastrar-bebe')}>
            <Baby size={18} className="mr-2" /> Cadastrar criança
          </button>
          <button className="secondary-button" type="button" onClick={adiar}>
            Deixar para mais tarde
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="form-card card">
      <span className="form-icon form-icon-pink mb-4"><CheckCircle2 size={28} strokeWidth={1.65} /></span>
      <p className="eyebrow">Cadastro concluído</p>
      <h1 className="display-title !text-3xl">Deseja fazer mais algum cadastro?</h1>
      <p className="page-subtitle mb-7">
        Você pode cadastrar outra gestação ou adicionar mais uma criança. Se preferir, deixe para mais tarde.
      </p>
      <div className="space-y-3">
        <button className="primary-button" type="button" onClick={() => abrirCadastro('/cadastrar-gestacao')}>
          <CalendarDays size={18} className="mr-2" /> Cadastrar gestação
        </button>
        <button className="secondary-button" type="button" onClick={() => abrirCadastro('/cadastrar-bebe')}>
          <Baby size={18} className="mr-2" /> Cadastrar criança
        </button>
        <button className="secondary-button" type="button" onClick={adiar}>
          Deixar para mais tarde
        </button>
      </div>
    </section>
  );
}
