package br.com.maternidade.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "forum_topico")
public class ForumTopico {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_topico")
    private Long id;
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "id_categoria")
    private ForumCategoria categoria;
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "id_usuario")
    private Usuario usuario;
    @Column(nullable = false, length = 200)
    private String titulo;
    @Column(nullable = false, columnDefinition = "TEXT")
    private String conteudo;
    @Column(nullable = false, length = 20)
    private String status = "ABERTO";
    @Column(nullable = false)
    private Boolean fixado = false;
    @Column(name = "data_criacao", insertable = false, updatable = false)
    private LocalDateTime dataCriacao;
    @Column(name = "data_atualizacao", insertable = false, updatable = false)
    private LocalDateTime dataAtualizacao;

    protected ForumTopico() {}
    public ForumTopico(ForumCategoria categoria, Usuario usuario, String titulo, String conteudo) {
        this.categoria = categoria;
        this.usuario = usuario;
        this.titulo = titulo;
        this.conteudo = conteudo;
    }
    public Long getId() { return id; }
    public ForumCategoria getCategoria() { return categoria; }
    public Usuario getUsuario() { return usuario; }
    public String getTitulo() { return titulo; }
    public String getConteudo() { return conteudo; }
    public String getStatus() { return status; }
    public Boolean getFixado() { return fixado; }
    public LocalDateTime getDataCriacao() { return dataCriacao; }
    public LocalDateTime getDataAtualizacao() { return dataAtualizacao; }
}
