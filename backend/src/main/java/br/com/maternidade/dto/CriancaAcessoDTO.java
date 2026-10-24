package br.com.maternidade.dto;

import java.time.LocalDate;
import java.time.LocalTime;

public record CriancaAcessoDTO(
        Integer idCrianca,
        String nome,
        LocalDate dataNascimento,
        LocalTime horaNascimento,
        String sexo,
        String tipoAcesso,
        boolean podeEditar
) {}
