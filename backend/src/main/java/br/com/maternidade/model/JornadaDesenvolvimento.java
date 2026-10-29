package br.com.maternidade.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "jornada_desenvolvimento")
public class JornadaDesenvolvimento {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_jornada")
    private Integer idJornada;

    @Column(nullable = false, length = 200)
    private String titulo;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String descricao;

    @Column(name = "idade_min_meses", nullable = false)
    private Integer idadeMinMeses;

    @Column(name = "idade_max_meses")
    private Integer idadeMaxMeses;

    @Column(nullable = false, length = 20)
    private String categoria;

    private String fonte;

    @Column(name = "link_fonte", length = 500)
    private String linkFonte;

    public Integer getIdJornada() { return idJornada; }
    public String getTitulo() { return titulo; }
    public String getDescricao() { return descricao; }
    public Integer getIdadeMinMeses() { return idadeMinMeses; }
    public Integer getIdadeMaxMeses() { return idadeMaxMeses; }
    public String getCategoria() { return categoria; }
    public String getFonte() { return fonte; }
    public String getLinkFonte() { return linkFonte; }
}
