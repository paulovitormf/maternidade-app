import { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { Baby, Check, Clock3, HeartPulse } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../services/api';

type GestacaoResumo = {
  ultima_mestruacao: string;
  data_parto: string;
};

const jornadasGestacao = [
  { semana: 4, titulo: 'Início da gestação', texto: 'O embrião começa a se desenvolver. Confirme o acompanhamento com um profissional de saúde.' },
  { semana: 8, titulo: 'Primeiras mudanças', texto: 'Podem surgir náuseas, cansaço e maior sensibilidade. Cuide do descanso e da hidratação.' },
  { semana: 12, titulo: 'Fim do primeiro trimestre', texto: 'É um bom momento para manter os exames do pré-natal em dia e conversar sobre vitaminas.' },
  { semana: 16, titulo: 'Segundo trimestre', texto: 'A barriga pode começar a aparecer e a disposição costuma melhorar para muitas gestantes.' },
  { semana: 20, titulo: 'Metade do caminho', texto: 'Converse com o pré-natal sobre os exames indicados para esta fase da gestação.' },
  { semana: 24, titulo: 'Novas sensações', texto: 'Os movimentos do bebê podem ficar mais perceptíveis. Registre suas descobertas.' },
  { semana: 28, titulo: 'Terceiro trimestre', texto: 'Organize dúvidas, consultas e o planejamento para o nascimento com sua equipe de saúde.' },
  { semana: 32, titulo: 'Preparação para a chegada', texto: 'Comece a separar documentos e itens importantes, respeitando suas possibilidades.' },
  { semana: 36, titulo: 'Reta final', texto: 'Mantenha o contato com o serviço de saúde e observe as orientações para os sinais de parto.' },
  { semana: 40, titulo: 'Data provável do parto', texto: 'A data é uma estimativa. O nascimento pode acontecer antes ou depois dela.' },
];

function calcularSemanaAtual(ultimaMestruacao: string) {
  const inicio = new Date(`${ultimaMestruacao}T00:00:00`);
  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);
  const diferenca = Math.floor((hoje.getTime() - inicio.getTime()) / 86400000);
  return Math.max(0, Math.min(42, Math.floor(diferenca / 7)));
}

function formatarDataGestacao(data: string) {
  return new Intl.DateTimeFormat('pt-BR', { dateStyle: 'long' }).format(new Date(`${data}T00:00:00`));
}

export default function JornadaGestacao() {
  const [gestacao, setGestacao] = useState<GestacaoResumo | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');
  const [gestacaoNaoEncontrada, setGestacaoNaoEncontrada] = useState(false);
  const idUsuario = Number(localStorage.getItem('id_usuario'));

  useEffect(() => {
    let ativo = true;
    api.get<GestacaoResumo>(`/gestacoes/usuario/${idUsuario}/mais-recente`)
      .then(({ data }) => { if (ativo) setGestacao(data); })
      .catch((error: unknown) => {
        if (!ativo) return;
        const naoEncontrada = axios.isAxiosError(error) && error.response?.status === 404;
        setGestacaoNaoEncontrada(naoEncontrada);
        setErro(
          naoEncontrada
            ? 'Ainda não há uma gestação cadastrada para este usuário.'
            : 'Não foi possível carregar os dados da gestação. Tente novamente.',
        );
      })
      .finally(() => { if (ativo) setCarregando(false); });
    return () => { ativo = false; };
  }, [idUsuario]);

  const semanaAtual = useMemo(
    () => gestacao ? calcularSemanaAtual(gestacao.ultima_mestruacao) : 0,
    [gestacao],
  );
  const jornadasConcluidas = jornadasGestacao.filter((jornada) => jornada.semana <= semanaAtual);
  const jornadaAtual = jornadasConcluidas[jornadasConcluidas.length - 1];
  const progresso = Math.min(100, Math.round((semanaAtual / 40) * 100));

  return (
    <section className="space-y-6">
      <header>
        <span className="form-icon form-icon-pink mb-4"><HeartPulse size={28} /></span>
        <p className="eyebrow">Acompanhamento gestacional</p>
        <h1 className="display-title">Jornada da gestação</h1>
        <p className="page-subtitle">Consulte as etapas estimadas da gestação com base na data informada no pré-natal.</p>
      </header>

      {carregando && (
        <div className="card" role="status" aria-live="polite">
          <p className="text-sm text-slate-500">Carregando os dados da gestação...</p>
        </div>
      )}

      {!carregando && erro && (
        gestacaoNaoEncontrada ? (
          <section className="card empty-state">
            <Baby size={32} />
            <h2>Nenhuma gestação cadastrada</h2>
            <p>{erro}</p>
            <Link to="/cadastrar-gestacao" className="dashboard-hero-button">Cadastrar gestação</Link>
          </section>
        ) : (
          <div className="alert-error" role="alert">{erro}</div>
        )
      )}

      {!carregando && gestacao && (
        <section className="milestones-section" aria-labelledby="gestation-milestones-title">
          <div className="milestones-heading">
            <div>
              <p className="eyebrow">Seu acompanhamento</p>
              <h2 id="gestation-milestones-title" className="section-title">Sua jornada, semana a semana</h2>
              <p className="milestones-subtitle">Estimativa baseada na data da última menstruação cadastrada.</p>
            </div>
            <span className="gestation-week-badge">{semanaAtual}ª semana</span>
          </div>

          <div className="gestation-summary">
            <div><span>Previsão de parto</span><strong>{formatarDataGestacao(gestacao.data_parto)}</strong></div>
            <div><span>Progresso estimado</span><strong>{progresso}%</strong></div>
          </div>
          <div
            className="gestation-progress"
            role="progressbar"
            aria-label="Progresso estimado da gestação"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={progresso}
          >
            <span style={{ width: `${progresso}%` }} />
          </div>

          {jornadaAtual && (
            <p className="current-milestone"><strong>Nesta fase:</strong> {jornadaAtual.titulo}. {jornadaAtual.texto}</p>
          )}

          <div className="milestones-scroll" tabIndex={0} aria-label="Jornada da gestação por semana">
            {jornadasGestacao.map((jornada) => {
              const concluido = jornada.semana <= semanaAtual;
              return (
                <article className="milestone-item" key={jornada.semana}>
                  <div className={`milestone-marker ${concluido ? 'milestone-marker-done' : ''}`} aria-hidden="true">
                    {concluido ? <Check size={15} strokeWidth={2.5} /> : <Clock3 size={15} strokeWidth={2} />}
                  </div>
                  <div className="milestone-card">
                    <span className="milestone-age">{jornada.semana}ª semana</span>
                    <h2>{jornada.titulo}</h2>
                    <p>{jornada.texto}</p>
                  </div>
                </article>
              );
            })}
          </div>
          <p className="milestones-disclaimer">As informações são gerais e não substituem o acompanhamento pré-natal.</p>
        </section>
      )}
    </section>
  );
}