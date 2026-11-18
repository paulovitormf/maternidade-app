package br.com.maternidade.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "forum_topico_curtida")
public class ForumTopicoCurtida {
    @EmbeddedId
    private ForumTopicoCurtidaId id;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("topicoId")
    @JoinColumn(name = "id_topico")
    private ForumTopico topico;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("usuarioId")
    @JoinColumn(name = "id_usuario")
    private Usuario usuario;

    @Column(name = "data_curtida", insertable = false, updatable = false)
    private LocalDateTime dataCurtida;

    protected ForumTopicoCurtida() {}
    public ForumTopicoCurtida(ForumTopico topico, Usuario usuario) {
        this.topico = topico;
        this.usuario = usuario;
        this.id = new ForumTopicoCurtidaId(topico.getId(), usuario.getIdUsuario());
    }
}
