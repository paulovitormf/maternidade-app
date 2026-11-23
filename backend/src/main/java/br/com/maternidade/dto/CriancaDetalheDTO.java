package br.com.maternidade.dto;

import br.com.maternidade.model.Crianca;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;

public record CriancaDetalheDTO(
        Integer id_crianca,
        String nome,
        LocalDate data_nascimento,
        LocalTime hora_nascimento,
        String sexo,
        BigDecimal peso_nascimento,
        BigDecimal altura_nascimento,
        String observacoes,
        Integer idade_meses,
        boolean pode_editar
) {
    public static CriancaDetalheDTO from(Crianca crianca, boolean podeEditar) {
        int idadeMeses = (int) Math.max(0,
                java.time.temporal.ChronoUnit.MONTHS.between(
                        crianca.getDataNascimento(), LocalDate.now()));
        return new CriancaDetalheDTO(
                crianca.getIdCrianca(),
                crianca.getNome(),
                crianca.getDataNascimento(),
                crianca.getHoraNascimento(),
                crianca.getSexo(),
                crianca.getPesoNascimento(),
                crianca.getAlturaNascimento(),
                crianca.getObservacoes(),
                idadeMeses,
                podeEditar);
    }
}
