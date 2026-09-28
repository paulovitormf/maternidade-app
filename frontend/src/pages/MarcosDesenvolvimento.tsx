import { useEffect, useState } from 'react';
import { AlertCircle, Baby } from 'lucide-react';
import api from '../services/api';

type Marco = {
  idMarco: number;
  titulo: string;
  descricao: string;
  idadeMinMeses: number;
  idadeMaxMeses: number | null;
  categoria: string;
};

export default function MarcosDesenvolvimento() {
  const [marcos, setMarcos] = useState<Marco[]>([]);
  const [erro, setErro] = useState('');

  useEffect(() => {
    api.get<Marco[]>('/marcos-desenvolvimento')
      .then(({ data }) => setMarcos(data))
      .catch(() => setErro('Não foi possível carregar os marcos de desenvolvimento.'));
  }, []);

  return (
    <section className="space-y-6">
      <header>
        <span className="form-icon form-icon-blue mb-4"><Baby size={28} /></span>
        <p className="eyebrow">Acompanhamento infantil</p>
        <h1 className="display-title">Marcos do desenvolvimento</h1>
        <p className="page-subtitle">Consulte uma trilha organizada por fases para acompanhar cada conquista.</p>
      </header>
      {erro && <div className="alert-error"><AlertCircle size={17} className="mr-2 inline" />{erro}</div>}
      <div className="grid gap-4 md:grid-cols-2">
        {marcos.map((marco) => (
          <article className="card" key={marco.idMarco}>
            <p className="eyebrow">{marco.categoria}</p>
            <h2 className="text-xl font-extrabold text-slate-800">{marco.titulo}</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">{marco.descricao}</p>
            <p className="mt-4 text-xs font-bold text-[#3B7280]">
              {marco.idadeMinMeses} {marco.idadeMaxMeses ? `a ${marco.idadeMaxMeses}` : '+'} meses
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
