package br.com.maternidade.model;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Entity
@Table(name = "registro")
public class Registro {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) @Column(name = "id_registro")
    private Long idRegistro;
    @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "id_usuario", nullable = false)
    private Usuario usuario;
    @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "id_crianca")
    private Crianca crianca;
    @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "id_gestacao")
    private Gestacao gestacao;
    @Column(nullable = false, length = 40) private String tipo;
    @Column(nullable = false, length = 180) private String titulo;
    @Column(columnDefinition = "TEXT") private String descricao;
    @Column(precision = 10, scale = 2) private BigDecimal valor;
    @Column(length = 30) private String unidade;
    @Column(length = 80) private String dose;
    @Column(nullable = false) private Boolean confirmado = false;
    @Column(name = "data_registro", nullable = false) private LocalDate dataRegistro;
    private LocalTime horario;
    @Lob @Column(name = "foto_base64", columnDefinition = "LONGTEXT") private String fotoBase64;
    @Column(name = "local_evento", length = 180) private String localEvento;
    @Column(name = "profissional", length = 180) private String profissional;
    @Column(name = "responsavel_nome", length = 250) private String responsavelNome;
    @Column(name = "fase_jornada", length = 80) private String faseJornada;
    @Column(name = "criado_em", nullable = false) private LocalDateTime criadoEm;

    @PrePersist void antesDeSalvar() { if (criadoEm == null) criadoEm = LocalDateTime.now(); if (confirmado == null) confirmado = false; }
    public Long getIdRegistro() { return idRegistro; }
    public Usuario getUsuario() { return usuario; }
    public void setUsuario(Usuario usuario) { this.usuario = usuario; }
    public Crianca getCrianca() { return crianca; }
    public void setCrianca(Crianca crianca) { this.crianca = crianca; }
    public Gestacao getGestacao() { return gestacao; }
    public void setGestacao(Gestacao gestacao) { this.gestacao = gestacao; }
    public String getTipo() { return tipo; }
    public void setTipo(String tipo) { this.tipo = tipo; }
    public String getTitulo() { return titulo; }
    public void setTitulo(String titulo) { this.titulo = titulo; }
    public String getDescricao() { return descricao; }
    public void setDescricao(String descricao) { this.descricao = descricao; }
    public BigDecimal getValor() { return valor; }
    public void setValor(BigDecimal valor) { this.valor = valor; }
    public String getUnidade() { return unidade; }
    public void setUnidade(String unidade) { this.unidade = unidade; }
    public String getDose() { return dose; }
    public void setDose(String dose) { this.dose = dose; }
    public Boolean getConfirmado() { return confirmado; }
    public void setConfirmado(Boolean confirmado) { this.confirmado = confirmado; }
    public LocalDate getDataRegistro() { return dataRegistro; }
    public void setDataRegistro(LocalDate dataRegistro) { this.dataRegistro = dataRegistro; }
    public LocalTime getHorario() { return horario; }
    public void setHorario(LocalTime horario) { this.horario = horario; }
    public String getFotoBase64() { return fotoBase64; }
    public void setFotoBase64(String fotoBase64) { this.fotoBase64 = fotoBase64; }
    public String getLocalEvento() { return localEvento; }
    public void setLocalEvento(String localEvento) { this.localEvento = localEvento; }
    public String getProfissional() { return profissional; }
    public void setProfissional(String profissional) { this.profissional = profissional; }
    public String getResponsavelNome() { return responsavelNome; }
    public void setResponsavelNome(String responsavelNome) { this.responsavelNome = responsavelNome; }
    public String getFaseJornada() { return faseJornada; }
    public void setFaseJornada(String faseJornada) { this.faseJornada = faseJornada; }
    public LocalDateTime getCriadoEm() { return criadoEm; }
}
