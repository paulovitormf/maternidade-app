package br.com.maternidade.dto;

import java.time.LocalDate;

public record UsuarioCadastroDTO(
    UsuarioData usuario,
    GestacaoData gestacao
) {
    public record UsuarioData(
        String nome,
        String email,
        String senha,
        LocalDate data_nascimento,
        String telefone,
        Integer qnt_gestacao
    ) {}

    public record GestacaoData(
        LocalDate ultima_mestruacao,
        Integer idade_gestacional,
        String tipo_gestacao,
        Boolean pre_natal
    ) {}
}