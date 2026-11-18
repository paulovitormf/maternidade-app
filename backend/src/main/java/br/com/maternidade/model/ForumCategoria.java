package br.com.maternidade.model;

import jakarta.persistence.*;

@Entity
@Table(name = "forum_categoria")
public class ForumCategoria {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_categoria")
    private Integer id;
    @Column(nullable = false, length = 150)
    private String nome;
    @Column(columnDefinition = "TEXT")
    private String descricao;
    @Column(nullable = false, length = 20)
    private String tipo;
    @Column(nullable = false)
    private Boolean ativo = true;

    protected ForumCategoria() {}
    public Integer getId() { return id; }
    public String getNome() { return nome; }
    public String getDescricao() { return descricao; }
    public String getTipo() { return tipo; }
    public Boolean getAtivo() { return ativo; }
}
