import { useEffect, useMemo, useRef, useState } from 'react';
import axios from 'axios';
import { Activity, Apple, Baby, Check, ClipboardCheck, Clock3, HeartPulse, MessageCircle, ShieldCheck, Utensils } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../services/api';

type GestacaoResumo = { ultima_mestruacao: string; data_parto: string };
type SemanaGestacao = { semana: number; titulo: string; texto: string; fruta: string; tamanho: string; desenvolvimento: string; interacao: string; vacinas: string; alimentacao: string; exames: string; acompanhamento: string; exercicios: string };

const frutas = [
  ['semente', 'uma semente'], ['lentilha', 'uma lentilha'], ['mirtilo', 'um mirtilo'], ['ervilha', 'uma ervilha'], ['uva', 'uma uva'], ['limão', 'um limão'], ['damasco', 'um damasco'], ['pêssego', 'um pêssego'], ['laranja', 'uma laranja'], ['maçã', 'uma maçã'], ['banana', 'uma banana'], ['mamão', 'um mamão pequeno'], ['abacate', 'um abacate'], ['coco', 'um coco pequeno'], ['melão', 'um melão pequeno'], ['melão', 'um melão'], ['abacaxi', 'um abacaxi pequeno'], ['jaca', 'uma jaca pequena'], ['abóbora', 'uma abóbora pequena'], ['abóbora', 'uma abóbora'], ['melancia', 'uma melancia pequena'],
];

function calcularSemanaAtual(ultimaMestruacao: string) { const inicio = new Date(`${ultimaMestruacao}T00:00:00`); const hoje = new Date(); hoje.setHours(0, 0, 0, 0); return Math.max(0, Math.min(42, Math.floor((hoje.getTime() - inicio.getTime()) / 86400000 / 7))); }
function formatarDataGestacao(data: string) { return new Intl.DateTimeFormat('pt-BR', { dateStyle: 'long' }).format(new Date(`${data}T00:00:00`)); }

function criarSemana(semana: number): SemanaGestacao {
  const fase = semana < 14 ? 'primeiro trimestre' : semana < 28 ? 'segundo trimestre' : 'terceiro trimestre';
  const [fruta, tamanho] = frutas[Math.min(Math.floor(semana / 2), frutas.length - 1)];
  const vacinas = semana >= 28 ? 'Confira na UBS a dTpa (a partir da 20ª semana) e a vacina contra o vírus sincicial respiratório (a partir da 28ª). Mantenha influenza, COVID-19, hepatite B e dT conforme histórico e calendário.' : semana >= 20 ? 'Converse com a UBS sobre a dTpa, indicada a partir da 20ª semana. Verifique também influenza, COVID-19, hepatite B e dT conforme histórico e calendário.' : 'Na primeira consulta, leve a caderneta para avaliar influenza, COVID-19, hepatite B e dT conforme histórico. Febre amarela só em situações indicadas pela equipe.';
  const exames = semana <= 12 ? 'Acompanhe os exames iniciais, como tipagem sanguínea/Rh, hemograma, glicemia e testes para infecções, conforme a equipe.' : semana < 24 ? 'Mantenha consultas e ultrassonografias indicadas; a equipe pode solicitar exames adicionais conforme seu histórico.' : semana < 29 ? 'Converse sobre a avaliação de glicemia e a repetição de hemograma e testes para infecções, conforme o pré-natal.' : 'Siga o calendário de consultas e exames; perto do nascimento, revise sinais de alerta, plano de parto e documentos.';
  return { semana, titulo: semana < 14 ? 'Primeiro trimestre' : semana < 28 ? 'Segundo trimestre' : 'Terceiro trimestre', texto: `Acompanhe esta ${fase} com calma e registre suas dúvidas para a próxima consulta.`, fruta, tamanho, desenvolvimento: semana < 20 ? 'O bebê cresce rapidamente e os órgãos continuam se formando.' : semana < 28 ? 'O bebê ganha força e amadurece; os movimentos podem ficar mais perceptíveis.' : 'O bebê continua amadurecendo e se preparando para o nascimento.', interacao: semana >= 20 ? 'Converse, cante e faça carinho na barriga se isso for confortável para você.' : 'Fale com o bebê e cuide do seu descanso; o vínculo começa durante toda a gestação.', vacinas, alimentacao: 'Priorize alimentos variados, água, frutas, verduras, feijões e fontes de proteína. Evite álcool e siga orientações individuais sobre suplementos e alimentos a evitar.', exames, acompanhamento: 'Registre consultas e vacinas na caderneta e procure a equipe se tiver sinais de alerta ou dúvidas.', exercicios: 'Se não houver contraindicação, prefira atividade leve ou moderada, como caminhada, com liberação da equipe de pré-natal.' };
}

const jornadasGestacao = Array.from({ length: 41 }, (_, semana) => criarSemana(semana));

export default function JornadaGestacao() {
  const [gestacao, setGestacao] = useState<GestacaoResumo | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');
  const [gestacaoNaoEncontrada, setGestacaoNaoEncontrada] = useState(false);
  const semanaAtualRef = useRef<HTMLElement | null>(null);
  const idUsuario = Number(localStorage.getItem('id_usuario'));

  useEffect(() => { let ativo = true; api.get<GestacaoResumo>(`/gestacoes/usuario/${idUsuario}/mais-recente`).then(({ data }) => { if (ativo) setGestacao(data); }).catch((error: unknown) => { if (!ativo) return; const naoEncontrada = axios.isAxiosError(error) && error.response?.status === 404; setGestacaoNaoEncontrada(naoEncontrada); setErro(naoEncontrada ? 'Ainda não há uma gestação cadastrada para este usuário.' : 'Não foi possível carregar os dados da gestação. Tente novamente.'); }).finally(() => { if (ativo) setCarregando(false); }); return () => { ativo = false; }; }, [idUsuario]);
  const semanaAtual = useMemo(() => gestacao ? calcularSemanaAtual(gestacao.ultima_mestruacao) : 0, [gestacao]);
  const jornadaAtual = jornadasGestacao[semanaAtual] ?? jornadasGestacao[jornadasGestacao.length - 1];
  const progresso = Math.min(100, Math.round((semanaAtual / 40) * 100));
  useEffect(() => { if (gestacao && semanaAtualRef.current && typeof semanaAtualRef.current.scrollIntoView === 'function') semanaAtualRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' }); }, [gestacao, semanaAtual]);

  return <section className="space-y-6">
    <header><span className="form-icon form-icon-pink mb-4"><HeartPulse size={28} /></span><p className="eyebrow">Acompanhamento gestacional</p><h1 className="display-title">Jornada da gestação</h1><p className="page-subtitle">Uma semana por vez, com informações simples para acolher você e acompanhar o bebê.</p></header>
    {carregando && <div className="card" role="status" aria-live="polite"><p className="text-sm text-slate-500">Carregando os dados da gestação...</p></div>}
    {!carregando && erro && (gestacaoNaoEncontrada ? <section className="card empty-state"><Baby size={32} /><h2>Nenhuma gestação cadastrada</h2><p>{erro}</p><Link to="/cadastrar-gestacao" className="dashboard-hero-button">Cadastrar gestação</Link></section> : <div className="alert-error" role="alert">{erro}</div>)}
    {!carregando && gestacao && <section className="milestones-section" aria-labelledby="gestation-milestones-title">
      <div className="milestones-heading"><div><p className="eyebrow">Seu acompanhamento</p><h2 id="gestation-milestones-title" className="section-title">Sua jornada, semana a semana</h2><p className="milestones-subtitle">Estimativa baseada na data da última menstruação cadastrada.</p></div><span className="gestation-week-badge">{semanaAtual}ª semana</span></div>
      <div className="gestation-summary"><div><span>Previsão de parto</span><strong>{formatarDataGestacao(gestacao.data_parto)}</strong></div><div><span>Progresso estimado</span><strong>{progresso}%</strong></div></div>
      <div className="gestation-progress" role="progressbar" aria-label="Progresso estimado da gestação" aria-valuemin={0} aria-valuemax={100} aria-valuenow={progresso}><span style={{ width: `${progresso}%` }} /></div>
      <p className="current-milestone"><strong>Nesta fase:</strong> {jornadaAtual.titulo}. {jornadaAtual.texto}</p>
      <div className="milestones-scroll" tabIndex={0} aria-label="Jornada da gestação por semana">
        {jornadasGestacao.map((jornada) => { const concluido = jornada.semana <= semanaAtual; return <article className="milestone-item" key={jornada.semana} ref={jornada.semana === semanaAtual ? semanaAtualRef : undefined}><div className={`milestone-marker ${concluido ? 'milestone-marker-done' : ''}`} aria-hidden="true">{concluido ? <Check size={15} strokeWidth={2.5} /> : <Clock3 size={15} strokeWidth={2} />}</div><div className="milestone-card"><span className="milestone-age">{jornada.semana}ª semana</span><h2>{jornada.titulo}</h2><p>{jornada.texto}</p><div className="week-topics">
          <div className="journey-topic" tabIndex={0}><span className="journey-topic-label"><Baby size={17} /> Tamanho do bebê</span><span className="journey-topic-hint">Passe o mouse ou toque</span><div className="journey-popover"><div className="fruit-illustration" aria-hidden="true">🍎</div><strong>{jornada.tamanho}</strong><p><b>{jornada.fruta}:</b> comparação aproximada e educativa.</p><p>{jornada.desenvolvimento}</p><p className="topic-note"><MessageCircle size={15} /> {jornada.interacao}</p></div></div>
          <div className="journey-topic" tabIndex={0}><span className="journey-topic-label"><HeartPulse size={17} /> Cuidados da gestante</span><span className="journey-topic-hint">Passe o mouse ou toque</span><div className="journey-popover care-popover"><p><ShieldCheck size={15} /><b>Vacinas:</b> {jornada.vacinas}</p><p><Utensils size={15} /><b>Alimentação:</b> {jornada.alimentacao}</p><p><ClipboardCheck size={15} /><b>Exames:</b> {jornada.exames}</p><p><HeartPulse size={15} /><b>Acompanhamento:</b> {jornada.acompanhamento}</p><p><Activity size={15} /><b>Exercícios:</b> {jornada.exercicios}</p></div></div>
        </div></div></article>; })}
      </div>
      <p className="milestones-disclaimer">Conteúdo educativo: confirme vacinas, exames, alimentação e exercícios com sua equipe. <Apple size={14} className="inline" /> Fontes: <a href="https://www.gov.br/saude/pt-br/vacinacao/calendario" target="_blank" rel="noreferrer">Calendário Nacional de Vacinação</a>, <a href="https://www.gov.br/saude/pt-br/assuntos/saude-de-a-a-z/g/gravidez/exames-e-vacinas/exames-e-vacinas/" target="_blank" rel="noreferrer">Ministério da Saúde — exames e vacinas</a> e <a href="https://www.who.int/tools/elena/interventions/nutrition-counselling-pregnancy" target="_blank" rel="noreferrer">OMS — nutrição na gestação</a>.</p>
    </section>}
  </section>;
}
