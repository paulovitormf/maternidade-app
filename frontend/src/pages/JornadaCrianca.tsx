import { Baby, CalendarCheck2, CheckCircle2, ChevronRight, Ruler, ShieldCheck, Syringe, Utensils } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

type CriancaResumo = {
  id_crianca: number;
  nome: string;
  data_nascimento: string;
  peso_nascimento?: number | null;
  altura_nascimento?: number | null;
};

type JornadaCriancaResumo = {
  meses: number;
  desenvolvimento: string;
  alimentacao: string;
  crescimento: string;
  vacinas: string;
  cuidados: string;
};

const JORNADAS: JornadaCriancaResumo[] = [
  { meses: 0, desenvolvimento: 'Acolhimento, contato pele a pele e respostas a sons e vozes.', alimentacao: 'Leite materno exclusivo, quando possível, ou orientação individualizada da equipe de saúde.', crescimento: 'Registre peso, comprimento e perímetro da cabeça na primeira consulta.', vacinas: 'Confira BCG e hepatite B ao nascer no Calendário Nacional de Vacinação.', cuidados: 'Teste do pezinho, orelhinha, olhinho e coraçãozinho conforme orientação da maternidade.' },
  { meses: 1, desenvolvimento: 'Pode fixar o olhar por instantes e acalmar-se com voz e colo.', alimentacao: 'Observe sinais de fome e saciedade e mantenha a orientação do aleitamento.', crescimento: 'Acompanhe a curva de peso e comprimento; a tendência entre consultas importa mais que um número isolado.', vacinas: 'Verifique se as vacinas do nascimento foram registradas na caderneta.', cuidados: 'Sono seguro: de barriga para cima, em superfície firme e sem objetos soltos.' },
  { meses: 2, desenvolvimento: 'Pode sorrir socialmente, emitir sons e acompanhar pessoas com o olhar.', alimentacao: 'Leite materno em livre demanda; não ofereça água, chás ou outros alimentos sem orientação.', crescimento: 'Faça a consulta de puericultura e leve a caderneta para registrar medidas.', vacinas: 'Confira penta, VIP, pneumocócica e rotavírus, conforme o PNI vigente.', cuidados: 'Converse, cante e faça momentos curtos de brincadeira de barriga para baixo acordado.' },
  { meses: 3, desenvolvimento: 'Maior interação, sorriso e controle progressivo da cabeça.', alimentacao: 'Mantenha o leite materno; observe pega, mamadas e sinais de desconforto.', crescimento: 'Compare peso, comprimento e perímetro cefálico nas curvas da caderneta.', vacinas: 'Confira a primeira dose da meningocócica conforme o calendário vigente.', cuidados: 'Evite telas; ofereça rostos, vozes e objetos seguros para observar.' },
  { meses: 4, desenvolvimento: 'Pode rir, levar as mãos à boca e buscar objetos com os olhos.', alimentacao: 'Ainda não é hora de iniciar alimentos por conta própria.', crescimento: 'Registre as medidas na consulta e observe a evolução do controle da cabeça.', vacinas: 'Confira as segundas doses de penta, VIP, pneumocócica e rotavírus.', cuidados: 'Brinque no chão, sempre com supervisão, e mantenha objetos pequenos fora do alcance.' },
  { meses: 5, desenvolvimento: 'Pode rolar, explorar as mãos e responder mais às pessoas.', alimentacao: 'Prepare a transição para a alimentação complementar aos 6 meses com orientação.', crescimento: 'Observe crescimento proporcional e não use tabelas de peso isoladas da curva.', vacinas: 'Confira a segunda dose da meningocócica quando indicada pelo PNI.', cuidados: 'Verifique o ambiente: quedas, sufocamento e queimaduras são riscos importantes.' },
  { meses: 6, desenvolvimento: 'Pode sentar com apoio, balbuciar e explorar objetos com as mãos.', alimentacao: 'A partir de 6 meses, ofereça alimentos in natura ou minimamente processados e água; mantenha o leite materno.', crescimento: 'Registre peso, comprimento e perímetro cefálico; a consulta avalia a curva de crescimento.', vacinas: 'Confira penta e VIP; veja também as recomendações vigentes para influenza e covid-19.', cuidados: 'Alimentos macios, amassados com garfo, sem açúcar e sem ultraprocessados.' },
  { meses: 7, desenvolvimento: 'Pode sentar com mais estabilidade, transferir objetos e responder ao próprio nome.', alimentacao: 'Aumente variedade e consistência gradualmente, respeitando fome e saciedade.', crescimento: 'Observe energia, apetite e evolução nas curvas; não force a criança a comer.', vacinas: 'Mantenha a caderneta atualizada e confira doses atrasadas na UBS.', cuidados: 'Ofereça pedaços seguros e supervisione sempre durante as refeições.' },
  { meses: 8, desenvolvimento: 'Pode engatinhar ou se deslocar, procurar objetos e imitar sons.', alimentacao: 'Inclua feijões, cereais/raízes, legumes, verduras, carnes ou ovos nas refeições.', crescimento: 'Acompanhe peso e comprimento na puericultura, especialmente se houver perda de apetite.', vacinas: 'Confira o calendário individual da criança e possíveis campanhas vigentes.', cuidados: 'Proteja tomadas, escadas, produtos de limpeza e objetos pequenos.' },
  { meses: 9, desenvolvimento: 'Pode bater palmas, apontar, brincar de esconder e ficar em pé com apoio.', alimentacao: 'Avance para texturas mais espessas e pedaços macios, sem liquidificar ou peneirar.', crescimento: 'Registre medidas e observe o desenvolvimento motor sem comparar crianças.', vacinas: 'Confira a dose de febre amarela e demais vacinas previstas para a idade.', cuidados: 'Estimule brincadeiras no chão e comunicação; evite andadores.' },
  { meses: 10, desenvolvimento: 'Pode se apoiar para andar, usar gestos e compreender pedidos simples.', alimentacao: 'Ofereça refeições da família adaptadas, com pouco sal e sem bebidas adoçadas.', crescimento: 'Use a caderneta e as curvas da OMS como referência para acompanhamento profissional.', vacinas: 'Revise a caderneta e procure a UBS se houver alguma dose pendente.', cuidados: 'Nomeie objetos e ações, leia e converse diariamente.' },
  { meses: 11, desenvolvimento: 'Pode dar passos com apoio, fazer pinça e demonstrar preferências.', alimentacao: 'Mantenha variedade, água e leite materno; respeite sinais de saciedade.', crescimento: 'Observe a tendência do crescimento e leve dúvidas à consulta.', vacinas: 'Prepare a conferência das vacinas do primeiro ano.', cuidados: 'Evite engasgos: uvas inteiras, castanhas, pipoca e alimentos duros exigem atenção especial.' },
  { meses: 12, desenvolvimento: 'Pode ficar em pé, andar com apoio, apontar e falar algumas palavras.', alimentacao: 'Comida da família em cortes seguros; não ofereça açúcar até 2 anos.', crescimento: 'Avalie peso, comprimento, perímetro cefálico e saúde bucal na consulta.', vacinas: 'Confira pneumocócica 20, meningocócica ACWY e tríplice viral conforme PNI 2026.', cuidados: 'Primeira avaliação odontológica e atualização da caderneta.' },
  { meses: 13, desenvolvimento: 'Amplia gestos, imitação, compreensão e exploração do ambiente.', alimentacao: 'Mantenha refeições variadas, água e rotina sem telas durante a alimentação.', crescimento: 'Observe a curva e o apetite, sem usar peso ideal fixo.', vacinas: 'Siga as doses de rotina e campanhas indicadas para a criança.', cuidados: 'Brincadeiras de encaixe, música e conversa favorecem linguagem e coordenação.' },
  { meses: 14, desenvolvimento: 'Pode andar com mais segurança e buscar ajuda para se comunicar.', alimentacao: 'Ofereça alimentos em pedaços pequenos e macios, permitindo autonomia supervisionada.', crescimento: 'Registre peso e altura nas consultas de rotina.', vacinas: 'Confira pendências diretamente na caderneta ou na UBS.', cuidados: 'Reforce limites com afeto e mantenha supervisão em água, altura e rua.' },
  { meses: 15, desenvolvimento: 'Pode caminhar, usar mais palavras e seguir instruções simples.', alimentacao: 'Mantenha comida caseira; evite ultraprocessados, sucos e bebidas açucaradas.', crescimento: 'Converse sobre crescimento, sono, evacuação e comportamento na puericultura.', vacinas: 'Confira DTP, VIP, tríplice viral e varicela, conforme calendário vigente.', cuidados: 'Estimule leitura, brincadeiras de movimento e escovação com orientação.' },
  { meses: 16, desenvolvimento: 'Pode combinar gestos e palavras e demonstrar maior independência.', alimentacao: 'Varie cores, sabores e texturas sem obrigar a comer.', crescimento: 'Acompanhe a evolução nas curvas, não apenas o peso do dia.', vacinas: 'Mantenha registros e atualize doses atrasadas com a equipe de saúde.', cuidados: 'Rotina previsível de sono, alimentação e brincadeira ajuda a criança.' },
  { meses: 17, desenvolvimento: 'Amplia vocabulário, imitação e capacidade de resolver pequenos desafios.', alimentacao: 'Refeições da família com água; limite alimentos muito salgados e ultraprocessados.', crescimento: 'Verifique medidas e desenvolvimento na próxima consulta.', vacinas: 'Consulte a caderneta para o próximo reforço.', cuidados: 'Fale frases curtas, ofereça escolhas simples e celebre tentativas.' },
  { meses: 18, desenvolvimento: 'Pode correr, subir com ajuda, usar palavras e brincar de faz de conta.', alimentacao: 'Mantenha alimentação variada e hábitos saudáveis; amamentação pode continuar até 2 anos ou mais.', crescimento: 'Reavalie peso, altura, desenvolvimento e saúde bucal.', vacinas: 'Confira reforços e doses pendentes do primeiro ano.', cuidados: 'Observe comunicação, movimento e interação; dúvidas devem ser levadas ao pediatra.' },
  { meses: 24, desenvolvimento: 'Pode formar frases curtas, correr, chutar bola e brincar perto de outras crianças.', alimentacao: 'A criança pode comer a comida da família; priorize alimentos in natura e água.', crescimento: 'Acompanhe peso, altura e IMC nas curvas da caderneta.', vacinas: 'Confirme os reforços de 4 anos que se aproximam e campanhas anuais.', cuidados: 'Escovação com creme dental fluoretado e rotina de sono.' },
  { meses: 30, desenvolvimento: 'Amplia a fala, imaginação, autonomia e coordenação motora.', alimentacao: 'Mantenha refeições em família sem telas e respeite fome e saciedade.', crescimento: 'Observe crescimento e desenvolvimento global nas consultas.', vacinas: 'Mantenha a caderneta atualizada conforme PNI e campanhas.', cuidados: 'Brincadeiras de desenhar, montar, correr e contar histórias.' },
  { meses: 36, desenvolvimento: 'Pode conversar melhor, pedalar com apoio, desenhar formas e brincar simbolicamente.', alimentacao: 'Incentive variedade e participação segura no preparo dos alimentos.', crescimento: 'Avalie peso, altura, visão, audição e desenvolvimento com profissionais.', vacinas: 'Revise doses atrasadas e o calendário da criança.', cuidados: 'Reforce segurança no trânsito, água, telas e contato com desconhecidos.' },
  { meses: 42, desenvolvimento: 'Pode cooperar em brincadeiras, contar histórias simples e aperfeiçoar movimentos.', alimentacao: 'Evite bebidas açucaradas e ultraprocessados; mantenha água disponível.', crescimento: 'Compare a evolução com a própria curva, não com padrões de internet.', vacinas: 'Prepare a revisão do calendário de 4 anos.', cuidados: 'Estimule autonomia com supervisão e comunicação sobre sentimentos.' },
  { meses: 48, desenvolvimento: 'Pode correr, pular, usar frases mais completas e participar de jogos com regras simples.', alimentacao: 'Mantenha refeições equilibradas e rotina ativa.', crescimento: 'Faça avaliação de crescimento, visão, audição, saúde bucal e desenvolvimento.', vacinas: 'Confira DTP, poliomielite, varicela e demais doses previstas aos 4 anos.', cuidados: 'Sono regular, atividade física e limites consistentes para telas.' },
  { meses: 54, desenvolvimento: 'Amplia raciocínio, linguagem, coordenação fina e interação social.', alimentacao: 'Incentive a criança a experimentar alimentos variados sem pressão.', crescimento: 'Acompanhe a curva de crescimento e sinais de dificuldade escolar ou motora.', vacinas: 'Mantenha a caderneta e as campanhas sazonais em dia.', cuidados: 'Converse sobre segurança corporal, emoções e convivência.' },
  { meses: 60, desenvolvimento: 'Pode narrar experiências, seguir regras, desenhar pessoas e realizar tarefas com mais autonomia.', alimentacao: 'Consolide hábitos de alimentação saudável para toda a família.', crescimento: 'Avalie crescimento, desenvolvimento, visão, audição e saúde bucal.', vacinas: 'Revise todo o calendário até 5 anos com a UBS.', cuidados: 'Prepare a transição para a escola, mantendo rotina, afeto e acompanhamento.' },
];

JORNADAS.push(
  { meses: 72, desenvolvimento: 'Expande leitura, escrita e raciocínio em brincadeiras e tarefas escolares.', alimentacao: 'Alimentação equilibrada e participação das crianças no preparo seguro.', crescimento: 'Avaliação anual de crescimento, saúde física e emocional.', vacinas: 'Verifique vacinas faltantes antes de novos ciclos escolares.', cuidados: 'Higiene, atividade física, sono adequado e acompanhamento escolar.' },
  { meses: 96, desenvolvimento: 'Amplia interesse, amizades, responsabilidade e raciocínio de situações cotidianas.', alimentacao: 'Privilegie alimentos naturais e ajude a construir escolhas saudáveis.', crescimento: 'Converse sobre mudanças corporais e acompanhe consultas anuais.', vacinas: 'Confira reforços e campanhas do calendário nacional.', cuidados: 'Escuta ativa, saúde mental, exercícios, sono e limites claros.' },
  { meses: 120, desenvolvimento: 'Maior autonomia, pensamento abstrato, identidade e relações sociais.', alimentacao: 'Estimule escolhas balanceadas, sem rótulos de “bom” ou “ruim”.', crescimento: 'Acompanhe puberdade, postura e curvas de crescimento com o pediatra.', vacinas: 'Revise HPV, meningocócica e demais vacinas na faixa de 9 a 12 anos.', cuidados: 'Saúde emocional, internet segura, atividade física e educação em saúde.' },
  { meses: 144, desenvolvimento: 'Consolida autonomia, raciocínio abstrato, identidade e habilidades sociais, cada um no seu ritmo.', alimentacao: 'Incentive refeições variadas e uma relação positiva com a alimentação, sem dietas restritivas.', crescimento: 'Acompanhe crescimento, puberdade, sono e bem-estar nas consultas de rotina.', vacinas: 'Confira a caderneta e as vacinas recomendadas para a idade com a equipe de saúde.', cuidados: 'Converse sobre saúde emocional, relações, segurança digital e autonomia.' },
);

function idadeEmMeses(dataNascimento: string) {
  const nascimento = new Date(`${dataNascimento}T00:00:00`);
  const hoje = new Date();
  let meses = (hoje.getFullYear() - nascimento.getFullYear()) * 12 + hoje.getMonth() - nascimento.getMonth();
  if (hoje.getDate() < nascimento.getDate()) meses -= 1;
  return Math.max(0, meses);
}

export default function JornadaCrianca() {
  const [criancas, setCriancas] = useState<CriancaResumo[]>([]);
  const [idSelecionado, setIdSelecionado] = useState<number>();
  const [carregando, setCarregando] = useState(true);
  const [marcos, setMarcos] = useState<Array<{ id_registro: number; titulo: string; confirmado: boolean }>>([]);
  const [erroMarco, setErroMarco] = useState('');
  const [marcoModal, setMarcoModal] = useState<JornadaCriancaResumo | null>(null);
  const [marcoData, setMarcoData] = useState(new Date().toISOString().slice(0, 10));
  const [marcoDescricao, setMarcoDescricao] = useState('');
  const [marcoFoto, setMarcoFoto] = useState('');
  const idUsuario = Number(localStorage.getItem('id_usuario'));

  useEffect(() => {
    api.get<CriancaResumo[]>(`/criancas/usuario/${idUsuario}`)
      .then(({ data }) => { setCriancas(data); setIdSelecionado(data[0]?.id_crianca); })
      .finally(() => setCarregando(false));
  }, [idUsuario]);

  useEffect(() => {
    if (!idSelecionado) {
      setMarcos([]);
      return;
    }
    api.get<Array<{ id_registro: number; titulo: string; confirmado: boolean }>>(`/registros/crianca/${idSelecionado}`)
      .then(({ data }) => setMarcos(data.filter((registro) => registro.titulo.startsWith('Marco observado:') && registro.confirmado)))
      .catch(() => setErroMarco('Não foi possível carregar os marcos observados.'));
  }, [idSelecionado]);

  const crianca = criancas.find((item) => item.id_crianca === idSelecionado) ?? criancas[0];
  const meses = crianca ? idadeEmMeses(crianca.data_nascimento) : 0;
  const jornadasExibidas = useMemo(
    () => JORNADAS.filter((jornada) => [0, 3, 6, 12, 18, 24, 36, 48, 60, 72, 96, 120, 144].includes(jornada.meses)),
    [],
  );
  const jornadaAtual = useMemo(() => {
    const jornadasAcompanhadas = jornadasExibidas.filter((jornada) => jornada.meses <= meses);
    return jornadasAcompanhadas[jornadasAcompanhadas.length - 1];
  }, [meses, jornadasExibidas]);

  const marcoObservado = (jornada: JornadaCriancaResumo) =>
    marcos.some((marco) => marco.titulo === `Marco observado: ${jornada.meses} meses`);

  const alternarMarco = async (jornada: JornadaCriancaResumo) => {
    if (!crianca) return;
    const existente = marcos.find((marco) => marco.titulo === `Marco observado: ${jornada.meses} meses`);
    try {
      if (existente) {
        await api.delete(`/registros/${existente.id_registro}`);
        const atualizados = await api.get<Array<{ id_registro: number; titulo: string; confirmado: boolean }>>(`/registros/crianca/${crianca.id_crianca}`);
        setMarcos(atualizados.data.filter((registro) => registro.titulo.startsWith('Marco observado:') && registro.confirmado));
        setErroMarco('');
        return;
      }
      setMarcoData(new Date().toISOString().slice(0, 10));
      setMarcoDescricao(jornada.desenvolvimento);
      setMarcoFoto('');
      setMarcoModal(jornada);
    } catch {
      setErroMarco('Não foi possível remover o marco observado.');
    }
  };

  const salvarMarcoObservado = async () => {
    if (!crianca || !marcoModal) return;
    try {
      await api.post('/registros', {
        id_usuario: idUsuario,
        id_crianca: crianca.id_crianca,
        id_gestacao: null,
        tipo: 'MARCO_DESENVOLVIMENTO',
        titulo: `Marco observado: ${marcoModal.meses} meses`,
        descricao: marcoDescricao.trim() || marcoModal.desenvolvimento,
        confirmado: true,
        data_registro: marcoData,
        foto_base64: marcoFoto || null,
        fase_jornada: `${Math.floor(marcoModal.meses / 12)} anos`,
      });
      const atualizados = await api.get<Array<{ id_registro: number; titulo: string; confirmado: boolean }>>(`/registros/crianca/${crianca.id_crianca}`);
      setMarcos(atualizados.data.filter((registro) => registro.titulo.startsWith('Marco observado:') && registro.confirmado));
      setMarcoModal(null);
      setErroMarco('');
    } catch {
      setErroMarco('Não foi possível salvar o marco observado.');
    }
  };

  if (carregando) return <section className="child-milestones-section"><p className="text-sm text-slate-500">Carregando acompanhamento da criança...</p></section>;
  if (!crianca) {
    return <section className="child-milestones-section"><p className="eyebrow">Acompanhamento infantil</p><h2 className="section-title">Jornada do bebê e da criança</h2><p className="milestones-subtitle">Cadastre uma criança para liberar o acompanhamento personalizado do nascimento aos 12 anos.</p><Link to="/cadastrar-bebe" className="dashboard-hero-button">Cadastrar criança <ChevronRight size={17} /></Link></section>;
  }

  return (
    <section className="child-milestones-section" aria-labelledby="child-milestones-title">
      <div className="section-heading milestones-heading">
        <div><p className="eyebrow">Acompanhamento infantil</p><h2 id="child-milestones-title" className="section-title">Jornada de {crianca.nome}</h2><p className="milestones-subtitle">Acompanhe o desenvolvimento do nascimento aos 12 anos.</p></div>
        <Baby size={30} strokeWidth={1.7} aria-hidden="true" />
      </div>
      {criancas.length > 1 && <label className="child-selector"><span>Criança acompanhada</span><select className="field-control" value={crianca.id_crianca} onChange={(e) => setIdSelecionado(Number(e.target.value))}>{criancas.map((item) => <option key={item.id_crianca} value={item.id_crianca}>{item.nome}</option>)}</select></label>}
      {erroMarco && <div className="alert-error" role="alert">{erroMarco}</div>}
      {marcoModal && (
        <div className="record-modal-backdrop" role="presentation">
          <form className="record-modal" onSubmit={(event) => { event.preventDefault(); void salvarMarcoObservado(); }}>
            <div className="record-modal-heading">
              <div><p className="eyebrow">Marco observado</p><h2>{marcoModal.meses === 0 ? 'Nascimento' : marcoModal.meses < 24 ? `${marcoModal.meses} meses` : `${marcoModal.meses / 12} anos`}</h2></div>
              <button type="button" aria-label="Fechar" onClick={() => setMarcoModal(null)}>×</button>
            </div>
            <label>Quando aconteceu
              <input className="field-control" type="date" value={marcoData} onChange={(event) => setMarcoData(event.target.value)} required />
            </label>
            <label>Observação da responsável
              <textarea className="field-control" rows={3} value={marcoDescricao} onChange={(event) => setMarcoDescricao(event.target.value)} />
            </label>
            <label className="record-file">Foto <span>(opcional)</span>
              <input type="file" accept="image/*" onChange={(event) => {
                const arquivo = event.target.files?.[0];
                if (!arquivo) return;
                if (arquivo.size > 5 * 1024 * 1024) { setErroMarco('A foto deve ter no máximo 5 MB.'); return; }
                const leitor = new FileReader();
                leitor.onload = () => setMarcoFoto(String(leitor.result));
                leitor.readAsDataURL(arquivo);
              }} />
            </label>
            {marcoFoto && <img src={marcoFoto} alt="Prévia do marco" className="record-photo" />}
            <button className="dashboard-hero-button record-submit" type="submit"><CheckCircle2 size={17} />Salvar marco observado</button>
          </form>
        </div>
      )}
      <div className="child-summary-grid">
        <div><span>Idade aproximada</span><strong>{meses < 24 ? `${meses} meses` : `${Math.floor(meses / 12)} anos`}</strong></div>
        <div><span>Próximo foco</span><strong>{jornadaAtual ? `Até ${jornadaAtual.meses} meses` : 'Nascimento'}</strong></div>
      </div>
      <div className="child-topic-legend"><span><Ruler size={15} />Crescimento</span><span><Syringe size={15} />Vacinas</span><span><Utensils size={15} />Alimentação</span><span><ShieldCheck size={15} />Cuidados</span></div>
      <div className="child-milestones-scroll" tabIndex={0} aria-label={`Jornada de ${crianca.nome} do nascimento aos 12 anos`}>
        {jornadasExibidas.map((jornada) => {
          const concluido = jornada.meses <= meses;
          const idade = jornada.meses === 0 ? 'Nascimento' : jornada.meses < 24 ? `${jornada.meses} meses` : `${jornada.meses / 12} anos`;
          return (
            <article className={`child-milestone-card ${concluido ? 'child-milestone-done' : ''}`} key={jornada.meses}>
              <div className="child-milestone-heading">
                <span className="milestone-age">{idade}</span>
                {concluido && <span className="child-done-label"><CheckCircle2 size={15} />Acompanhado</span>}
              </div>
              <div className="child-info-grid">
                <div><strong>Desenvolvimento esperado</strong><p>{jornada.desenvolvimento}</p></div>
                <div><strong>Alimentação</strong><p>{jornada.alimentacao}</p></div>
                <div><strong>Crescimento e peso</strong><p>{jornada.crescimento}</p></div>
                <div><strong>Vacinas</strong><p>{jornada.vacinas}</p></div>
                <div><strong>Cuidados</strong><p>{jornada.cuidados}</p></div>
                <div>
                  <strong>Registro</strong>
                  <p><CalendarCheck2 size={15} className="inline mr-1" />Leve a caderneta nas consultas.</p>
                  <Link to={`/registros?crianca=${crianca.id_crianca}&tipo=MARCO_DESENVOLVIMENTO`} className="inline-flex items-center gap-1 text-sm font-bold text-[#B0435B]">Registrar nesta fase <ChevronRight size={14} /></Link>
                  <button
                    type="button"
                    className={`mt-3 inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-xs font-bold ${marcoObservado(jornada) ? 'border-emerald-300 bg-emerald-50 text-emerald-700' : 'border-slate-200 bg-white text-slate-600 hover:border-[#C8526B]'}`}
                    aria-pressed={marcoObservado(jornada)}
                    onClick={() => void alternarMarco(jornada)}
                  >
                    <CheckCircle2 size={15} />
                    {marcoObservado(jornada) ? 'Marco observado' : 'Marcar como observado'}
                  </button>
                </div>
              </div>
            </article>
          );
        })}
      </div>
      <p className="milestones-disclaimer">Cada criança tem seu próprio ritmo: diferenças pequenas entre marcos podem ser normais. Este conteúdo é educativo e não substitui avaliação profissional. Vacinas, peso, alimentação e desenvolvimento devem ser confirmados com a equipe que acompanha a criança. <a href="https://www.gov.br/saude/pt-br/vacinacao/calendario" target="_blank" rel="noreferrer">Consultar calendário oficial</a>.</p>
    </section>
  );
}
