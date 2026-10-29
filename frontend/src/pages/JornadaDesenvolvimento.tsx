import { useEffect, useState } from 'react';
import { AlertCircle, Baby } from 'lucide-react';
import api from '../services/api';

type Jornada = {
  idJornada: number;
  titulo: string;
  descricao: string;
  idadeMinMeses: number;
  idadeMaxMeses: number | null;
  categoria: string;
};

export default function JornadasDesenvolvimento() {
  const [jornadas, setJornadas] = useState<Jornada[]>([]);
  const [erro, setErro] = useState('');

  useEffect(() => {
    api.get<Jornada[]>('/jornadas-desenvolvimento')
      .then(({ data }) => setJornadas(data))
      .catch(() => setErro('Não foi possível carregar as jornadas de desenvolvimento.'));
  }, []);

  return (
    <section className="space-y-6">
      <header>
        <span className="form-icon form-icon-blue mb-4"><Baby size={28} /></span>
        <p className="eyebrow">Acompanhamento infantil</p>
        <h1 className="display-title">Jornada do desenvolvimento</h1>
        <p className="page-subtitle">Consulte uma trilha organizada por fases para acompanhar cada conquista.</p>
      </header>
      {erro && <div className="alert-error"><AlertCircle size={17} className="mr-2 inline" />{erro}</div>}
      <div className="grid gap-4 md:grid-cols-2">
        {jornadas.map((jornada) => (
          <article className="card" key={jornada.idJornada}>
            <p className="eyebrow">{jornada.categoria}</p>
            <h2 className="text-xl font-extrabold text-slate-800">{jornada.titulo}</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">{jornada.descricao}</p>
            <p className="mt-4 text-xs font-bold text-[#3B7280]">
              {jornada.idadeMinMeses} {jornada.idadeMaxMeses ? `a ${jornada.idadeMaxMeses}` : '+'} meses
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
