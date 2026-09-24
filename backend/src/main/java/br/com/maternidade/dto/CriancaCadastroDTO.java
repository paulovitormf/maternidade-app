package br.com.maternidade.dto;

import java.time.LocalDate;
import java.time.LocalTime;
import java.math.BigDecimal;

public record CriancaCadastroDTO(
    String nome,
    LocalDate data_nascimento,
    LocalTime hora_nascimento,
    String sexo,
    BigDecimal peso_nascimento,
    BigDecimal altura_nascimento,
    String observacoes,
    String tipo_relacao,
    Long id_usuario
) {}