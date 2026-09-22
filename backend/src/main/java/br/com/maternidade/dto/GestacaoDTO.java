package br.com.maternidade.dto;

import java.time.LocalDate;

public record GestacaoDTO(
    Long id_usuario,
    LocalDate ultima_mestruacao,
    Integer idade_gestacional,
    LocalDate data_parto,
    String tipo_gestacao,
    Boolean pre_natal
) {}