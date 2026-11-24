package br.com.maternidade.dto;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;

public record CriancaAtualizacaoDTO(
        String nome,
        LocalDate data_nascimento,
        LocalTime hora_nascimento,
        String sexo,
        BigDecimal peso_nascimento,
        BigDecimal altura_nascimento,
        String observacoes
) {}
