package br.com.maternidade.dto;
import br.com.maternidade.model.Gestacao;
import java.time.LocalDate;
public record GestacaoPublicaDTO(Integer id_gestacao, Integer id_usuario, LocalDate ultima_mestruacao, Integer idade_gestacional, LocalDate data_parto, String tipo_gestacao, String tipo_gestacao_detalhe, Boolean pre_natal) {
    public static GestacaoPublicaDTO from(Gestacao g) { return new GestacaoPublicaDTO(g.getIdGestacao(), g.getUsuario().getIdUsuario(), g.getUltimaMestruacao(), g.getIdadeGestacional(), g.getDataParto(), g.getTipoGestacao(), g.getTipoGestacaoDetalhe(), g.getPreNatal()); }
}
