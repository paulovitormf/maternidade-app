package br.com.maternidade.dto;

import br.com.maternidade.model.Registro;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;

public record RegistroPublicoDTO(Long id_registro, Integer id_crianca, String nome_crianca, Integer id_gestacao, String tipo, String titulo, String descricao, BigDecimal valor, String unidade, String dose, Boolean confirmado, LocalDate data_registro, LocalTime horario, String foto_base64, Integer idade_meses, Integer semana_gestacao, boolean pode_editar) {
    public static RegistroPublicoDTO from(Registro r, Integer idUsuarioAtual) {
        Integer idade = null; Integer semana = null;
        if (r.getCrianca() != null) {
            idade = (int) Math.max(0, java.time.temporal.ChronoUnit.MONTHS.between(r.getCrianca().getDataNascimento(), r.getDataRegistro()));
        }
        if (r.getGestacao() != null) {
            semana = (int) Math.max(0, Math.min(42, java.time.temporal.ChronoUnit.DAYS.between(r.getGestacao().getUltimaMestruacao(), r.getDataRegistro()) / 7));
        }
        return new RegistroPublicoDTO(r.getIdRegistro(), r.getCrianca() == null ? null : r.getCrianca().getIdCrianca(), r.getCrianca() == null ? null : r.getCrianca().getNome(), r.getGestacao() == null ? null : r.getGestacao().getIdGestacao(), r.getTipo(), r.getTitulo(), r.getDescricao(), r.getValor(), r.getUnidade(), r.getDose(), r.getConfirmado(), r.getDataRegistro(), r.getHorario(), r.getFotoBase64(), idade, semana, r.getUsuario().getIdUsuario().equals(idUsuarioAtual));
    }
}
