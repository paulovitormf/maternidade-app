package br.com.maternidade.dto;

import br.com.maternidade.model.Crianca;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;

public record CriancaPublicaDTO(
        Long id_crianca,
        String nome,
        LocalDate data_nascimento,
        LocalTime hora_nascimento,
        String sexo,
        BigDecimal peso_nascimento,
        BigDecimal altura_nascimento,
        String observacoes
) {
    public static CriancaPublicaDTO from(Crianca crianca) {
        return new CriancaPublicaDTO(
                crianca.getIdCrianca().longValue(),
                crianca.getNome(),
                crianca.getDataNascimento(),
                crianca.getHoraNascimento(),
                crianca.getSexo(),
                crianca.getPesoNascimento(),
                crianca.getAlturaNascimento(),
                crianca.getObservacoes()
        );
    }
}
