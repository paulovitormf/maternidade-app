package br.com.maternidade.model;

import static org.assertj.core.api.Assertions.assertThat;

import java.time.LocalDate;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

class GestacaoModelTest {

    @Test
    @DisplayName("Deve calcular data de parto para 280 dias após a DUM")
    void deveCalcularDataPartoCorretamente() {
        LocalDate dum = LocalDate.of(2026, 1, 1);
        LocalDate dataParto = Gestacao.calcularDataParto(dum);

        assertThat(dataParto).isEqualTo(LocalDate.of(2026, 10, 8));
    }

    @Test
    @DisplayName("Deve retornar null ao calcular data de parto para DUM nula")
    void deveRetornarNullParaDumNulaEmDataParto() {
        assertThat(Gestacao.calcularDataParto(null)).isNull();
    }

    @Test
    @DisplayName("Deve retornar null ao calcular idade gestacional para DUM nula")
    void deveRetornarNullParaDumNulaEmIdadeGestacional() {
        assertThat(Gestacao.calcularIdadeGestacional(null)).isNull();
    }

    @Test
    @DisplayName("Deve calcular idade gestacional dentro dos limites de 0 a 42 semanas")
    void deveCalcularIdadeGestacionalDentroDosLimites() {
        LocalDate hoje = LocalDate.now();
        assertThat(Gestacao.calcularIdadeGestacional(hoje.minusDays(14))).isEqualTo(2);
        assertThat(Gestacao.calcularIdadeGestacional(hoje.minusWeeks(50))).isEqualTo(42);
        assertThat(Gestacao.calcularIdadeGestacional(hoje.plusDays(7))).isZero();
    }
}
