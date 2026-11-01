export function calcularPrevisaoParto(ultimaMestruacao: string): Date | null {
  if (!ultimaMestruacao) {
    return null;
  }
  const [ano, mes, dia] = ultimaMestruacao.split('-').map(Number);
  if (!ano || !mes || !dia) {
    return null;
  }
  const data = new Date(ano, mes - 1, dia);
  data.setDate(data.getDate() + 280);
  return Number.isNaN(data.getTime()) ? null : data;
}

export function calcularSemanaAtual(ultimaMestruacao: string, dataReferencia: Date = new Date()): number {
  if (!ultimaMestruacao) return 0;
  const inicio = new Date(`${ultimaMestruacao}T00:00:00`);
  if (Number.isNaN(inicio.getTime())) return 0;
  const hoje = new Date(dataReferencia);
  hoje.setHours(0, 0, 0, 0);
  const diferenca = Math.floor((hoje.getTime() - inicio.getTime()) / 86400000);
  return Math.max(0, Math.min(42, Math.floor(diferenca / 7)));
}

export function separarGestacoesPorStatus<T extends { data_parto: string }>(
  gestacoes: T[],
  hojeStr: string = new Date().toISOString().split('T')[0],
): { atuais: T[]; anteriores: T[] } {
  const atuais = gestacoes.filter((gestacao) => gestacao.data_parto >= hojeStr);
  const anteriores = gestacoes.filter((gestacao) => gestacao.data_parto < hojeStr);
  return { atuais, anteriores };
}

export function formatarTipoGestacao(tipo?: string): string {
  switch (tipo) {
    case 'UNICA':
      return 'Única';
    case 'GEMEOS':
      return 'Gêmeos';
    case 'TRIGEMEOS_OU_MAIS':
      return 'Trigêmeos ou mais';
    case 'AINDA_NAO_SEI':
      return 'Ainda não sei';
    default:
      return tipo || 'Gestação';
  }
}

export function formatarDetalheGestacao(detalhe?: string): string {
  if (detalhe === 'BIVITELINO') return 'Bivitelino';
  if (detalhe === 'UNIVITELINO') return 'Univitelino';
  if (detalhe === 'AINDA_NAO_SEI') return 'Ainda não sei';
  return detalhe || '';
}

export function formatarDataBrasileira(dataStr?: string | null): string {
  if (!dataStr) return '';
  const data = new Date(`${dataStr}T00:00:00`);
  if (Number.isNaN(data.getTime())) return '';
  return new Intl.DateTimeFormat('pt-BR', { dateStyle: 'long' }).format(data);
}
