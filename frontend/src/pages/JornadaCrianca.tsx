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

type MarcoCrianca = {
  meses: number;
  desenvolvimento: string;
  alimentacao: string;
  crescimento: string;
  vacinas: string;
  cuidados: string;
};

const MARCOS: MarcoCrianca[] = [
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

function idadeEmMeses(dataNascimento: string) {
  const nascimento = new Date(`${dataNascimento}T00:00:00`);
  const hoje = new Date();
  let meses = (hoje.getFullYear() - nascimento.getFullYear()) * 12 + hoje.getMonth() - nascimento.getMonth();
  if (hoje.getDate() < nascimento.getDate()) meses -= 1;
  return Math.max(0, meses);
}

export default function MarcosCrianca() {
  const [criancas, setCriancas] = useState<CriancaResumo[]>([]);
  const [idSelecionado, setIdSelecionado] = useState<number>();
  const [carregando, setCarregando] = useState(true);
  const idUsuario = Number(localStorage.getItem('id_usuario'));

  useEffect(() => {
    api.get<CriancaResumo[]>(`/criancas/usuario/${idUsuario}`)
      .then(({ data }) => { setCriancas(data); setIdSelecionado(data[0]?.id_crianca); })
      .finally(() => setCarregando(false));
  }, [idUsuario]);

  const crianca = criancas.find((item) => item.id_crianca === idSelecionado) ?? criancas[0];
  const meses = crianca ? idadeEmMeses(crianca.data_nascimento) : 0;
  const marcoAtual = useMemo(() => {
    const marcosAcompanhados = MARCOS.filter((marco) => marco.meses <= meses);
    return marcosAcompanhados[marcosAcompanhados.length - 1];
  }, [meses]);

  if (carregando) return <section className="child-milestones-section"><p className="text-sm text-slate-500">Carregando acompanhamento da criança...</p></section>;
  if (!crianca) {
    return <section className="child-milestones-section"><p className="eyebrow">Acompanhamento infantil</p><h2 className="section-title">Marcos do bebê e da criança</h2><p className="milestones-subtitle">Cadastre uma criança para liberar o acompanhamento personalizado até os 5 anos.</p><Link to="/cadastrar-bebe" className="dashboard-hero-button">Cadastrar criança <ChevronRight size={17} /></Link></section>;
  }

  return (
    <section className="child-milestones-section" aria-labelledby="child-milestones-title">
      <div className="section-heading milestones-heading">
        <div><p className="eyebrow">Acompanhamento infantil</p><h2 id="child-milestones-title" className="section-title">Marcos de {crianca.nome}</h2><p className="milestones-subtitle">Informações organizadas até 5 anos de idade.</p></div>
        <Baby size={30} strokeWidth={1.7} aria-hidden="true" />
      </div>
      {criancas.length > 1 && <label className="child-selector"><span>Criança acompanhada</span><select className="field-control" value={crianca.id_crianca} onChange={(e) => setIdSelecionado(Number(e.target.value))}>{criancas.map((item) => <option key={item.id_crianca} value={item.id_crianca}>{item.nome}</option>)}</select></label>}
      <div className="child-summary-grid">
        <div><span>Idade aproximada</span><strong>{meses < 24 ? `${meses} meses` : `${Math.floor(meses / 12)} anos`}</strong></div>
        <div><span>Próximo foco</span><strong>{marcoAtual ? `Até ${marcoAtual.meses} meses` : 'Nascimento'}</strong></div>
      </div>
      <div className="child-topic-legend"><span><Ruler size={15} />Crescimento</span><span><Syringe size={15} />Vacinas</span><span><Utensils size={15} />Alimentação</span><span><ShieldCheck size={15} />Cuidados</span></div>
      <div className="child-milestones-scroll" tabIndex={0} aria-label={`Marcos de ${crianca.nome} até 5 anos`}>
        {MARCOS.map((marco) => { const concluido = marco.meses <= meses; const idade = marco.meses === 0 ? 'Nascimento' : marco.meses < 24 ? `${marco.meses} meses` : `${marco.meses / 12} anos`; return <article className={`child-milestone-card ${concluido ? 'child-milestone-done' : ''}`} key={marco.meses}><div className="child-milestone-heading"><span className="milestone-age">{idade}</span>{concluido && <span className="child-done-label"><CheckCircle2 size={15} />Acompanhado</span>}</div><div className="child-info-grid"><div><strong>Desenvolvimento</strong><p>{marco.desenvolvimento}</p></div><div><strong>Alimentação</strong><p>{marco.alimentacao}</p></div><div><strong>Crescimento e peso</strong><p>{marco.crescimento}</p></div><div><strong>Vacinas</strong><p>{marco.vacinas}</p></div><div><strong>Cuidados</strong><p>{marco.cuidados}</p></div><div><strong>Registro</strong><p><CalendarCheck2 size={15} className="inline mr-1" />Leve a caderneta nas consultas.</p></div></div></article>; })}
      </div>
      <p className="milestones-disclaimer">Conteúdo educativo baseado em orientações do Ministério da Saúde. Vacinas, peso, alimentação e desenvolvimento devem ser confirmados com a equipe que acompanha a criança. <a href="https://www.gov.br/saude/pt-br/vacinacao/calendario" target="_blank" rel="noreferrer">Consultar calendário oficial</a>.</p>
    </section>
  );
}
