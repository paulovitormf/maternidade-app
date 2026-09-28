package br.com.maternidade.dto;

import java.time.LocalDate;

public record GestacaoDTO(
    LocalDate ultima_mestruacao,
    Integer idade_gestacional,
    String tipo_gestacao,
    Boolean pre_natal
) {}