package br.com.maternidade.model;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import java.io.Serializable;
import java.util.Objects;

@Embeddable
public class ForumTopicoCurtidaId implements Serializable {
    @Column(name = "id_topico")
    private Long topicoId;
    @Column(name = "id_usuario")
    private Integer usuarioId;

    public ForumTopicoCurtidaId() {}
    public ForumTopicoCurtidaId(Long topicoId, Integer usuarioId) {
        this.topicoId = topicoId;
        this.usuarioId = usuarioId;
    }

    public Long getTopicoId() { return topicoId; }
    public Integer getUsuarioId() { return usuarioId; }
    @Override public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof ForumTopicoCurtidaId that)) return false;
        return Objects.equals(topicoId, that.topicoId) && Objects.equals(usuarioId, that.usuarioId);
    }
    @Override public int hashCode() { return Objects.hash(topicoId, usuarioId); }
}
