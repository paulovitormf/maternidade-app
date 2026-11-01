import { describe, expect, it } from 'vitest';
import {
  calcularPrevisaoParto,
  calcularSemanaAtual,
  formatarDataBrasileira,
  formatarDetalheGestacao,
  formatarTipoGestacao,
  separarGestacoesPorStatus,
} from './gestacaoUtils';

describe('gestacaoUtils', () => {
  describe('calcularPrevisaoParto', () => {
    it('deve retornar null para DUM vazia ou nula', () => {
      expect(calcularPrevisaoParto('')).toBeNull();
    });

    it('deve somar 280 dias à data da DUM', () => {
      const previsao = calcularPrevisaoParto('2026-01-01');
      expect(previsao).not.toBeNull();
      expect(previsao?.getFullYear()).toBe(2026);
      expect(previsao?.getMonth()).toBe(9); // Outubro (0-indexed: 9)
      expect(previsao?.getDate()).toBe(8);
    });
  });

  describe('calcularSemanaAtual', () => {
    it('deve retornar 0 para entrada vazia', () => {
      expect(calcularSemanaAtual('')).toBe(0);
    });

    it('deve calcular semanas decorridas com base na data de referência', () => {
      const dum = '2026-01-01';
      const ref = new Date('2026-01-29T12:00:00'); // 28 dias = 4 semanas
      expect(calcularSemanaAtual(dum, ref)).toBe(4);
    });

    it('deve limitar a idade gestacional máxima em 42 semanas', () => {
      const dum = '2024-01-01';
      const ref = new Date('2026-01-01T12:00:00');
      expect(calcularSemanaAtual(dum, ref)).toBe(42);
    });
  });

  describe('separarGestacoesPorStatus', () => {
    it('deve separar gestações entre atuais e anteriores com base na data do parto', () => {
      const gestacoes = [
        { id: 1, data_parto: '2026-12-01' },
        { id: 2, data_parto: '2025-01-01' },
      ];
      const { atuais, anteriores } = separarGestacoesPorStatus(gestacoes, '2026-06-01');

      expect(atuais).toHaveLength(1);
      expect(atuais[0].id).toBe(1);
      expect(anteriores).toHaveLength(1);
      expect(anteriores[0].id).toBe(2);
    });
  });

  describe('formatarTipoGestacao e formatarDetalheGestacao', () => {
    it('deve formatar tipos conhecidos e fallback', () => {
      expect(formatarTipoGestacao('UNICA')).toBe('Única');
      expect(formatarTipoGestacao('GEMEOS')).toBe('Gêmeos');
      expect(formatarTipoGestacao('TRIGEMEOS_OU_MAIS')).toBe('Trigêmeos ou mais');
      expect(formatarTipoGestacao('AINDA_NAO_SEI')).toBe('Ainda não sei');
      expect(formatarTipoGestacao(undefined)).toBe('Gestação');
    });

    it('deve formatar detalhes de gestação múltipla', () => {
      expect(formatarDetalheGestacao('BIVITELINO')).toBe('Bivitelino');
      expect(formatarDetalheGestacao('UNIVITELINO')).toBe('Univitelino');
      expect(formatarDetalheGestacao('AINDA_NAO_SEI')).toBe('Ainda não sei');
      expect(formatarDetalheGestacao('')).toBe('');
    });
  });

  describe('formatarDataBrasileira', () => {
    it('deve formatar data padrão BR longo', () => {
      const formatada = formatarDataBrasileira('2026-05-15');
      expect(formatada).toContain('2026');
      expect(formatada).toContain('maio');
    });

    it('deve retornar string vazia para valores nulos ou inválidos', () => {
      expect(formatarDataBrasileira(null)).toBe('');
      expect(formatarDataBrasileira('data-invalida')).toBe('');
    });
  });
});
