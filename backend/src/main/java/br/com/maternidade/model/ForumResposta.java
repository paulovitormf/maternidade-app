package br.com.maternidade.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "forum_resposta")
public class ForumResposta {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_resposta")
    private Long id;
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "id_topico")
    private ForumTopico topico;
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "id_usuario")
    private Usuario usuario;
    @Column(nullable = false, columnDefinition = "TEXT")
    private String conteudo;
    @Column(nullable = false, length = 20)
    private String status = "ATIVA";
    @Column(name = "data_criacao", insertable = false, updatable = false)
    private LocalDateTime dataCriacao;

    protected ForumResposta() {}
    public ForumResposta(ForumTopico topico, Usuario usuario, String conteudo) {
        this.topico = topico;
        this.usuario = usuario;
        this.conteudo = conteudo;
    }
    public Long getId() { return id; }
    public Usuario getUsuario() { return usuario; }
    public String getConteudo() { return conteudo; }
    public LocalDateTime getDataCriacao() { return dataCriacao; }
}
