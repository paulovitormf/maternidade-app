package br.com.maternidade.model;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;

@Entity
@Table(name = "gestacao")
public class Gestacao {

    public static LocalDate calcularDataParto(LocalDate ultimaMestruacao) {
        if (ultimaMestruacao == null) {
            return null;
        }
        return ultimaMestruacao.plusDays(280);
    }

    public static Integer calcularIdadeGestacional(LocalDate ultimaMestruacao) {
        if (ultimaMestruacao == null) {
            return null;
        }

        long diasDesdeDum = ChronoUnit.DAYS.between(ultimaMestruacao, LocalDate.now());
        return Math.max(0, Math.min(42, (int) (diasDesdeDum / 7)));
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_gestacao")
    private Integer idGestacao;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_usuario", nullable = false)
    private Usuario usuario;

    @Column(name = "ultima_mestruacao", nullable = false)
    private LocalDate ultimaMestruacao;

    @Column(name = "idade_gestacional")
    private Integer idadeGestacional;

    @Column(name = "data_parto")
    private LocalDate dataParto;

    @Column(name = "tipo_gestacao", columnDefinition = "TEXT")
    private String tipoGestacao;

    @Column(name = "pre_natal")
    private Boolean preNatal;

    // Construtor Padrão (Exigido pelo JPA)
    public Gestacao() {}

    // Construtor Completo
    public Gestacao(Integer idGestacao, Usuario usuario, LocalDate ultimaMestruacao, Integer idadeGestacional, LocalDate dataParto, String tipoGestacao, Boolean preNatal) {
        this.idGestacao = idGestacao;
        this.usuario = usuario;
        this.ultimaMestruacao = ultimaMestruacao;
        this.idadeGestacional = idadeGestacional;
        this.dataParto = dataParto;
        this.tipoGestacao = tipoGestacao;
        this.preNatal = preNatal;
    }

    // Getters e Setters
    public Integer getIdGestacao() {
        return idGestacao;
    }

    public void setIdGestacao(Integer idGestacao) {
        this.idGestacao = idGestacao;
    }

    public Usuario getUsuario() {
        return usuario;
    }

    public void setUsuario(Usuario usuario) {
        this.usuario = usuario;
    }

    public LocalDate getUltimaMestruacao() {
        return ultimaMestruacao;
    }

    public void setUltimaMestruacao(LocalDate ultimaMestruacao) {
        this.ultimaMestruacao = ultimaMestruacao;
    }

    public Integer getIdadeGestacional() {
        return idadeGestacional;
    }

    public void setIdadeGestacional(Integer idadeGestacional) {
        this.idadeGestacional = idadeGestacional;
    }

    public LocalDate getDataParto() {
        return dataParto;
    }

    public void setDataParto(LocalDate dataParto) {
        this.dataParto = dataParto;
    }

    public String getTipoGestacao() {
        return tipoGestacao;
    }

    public void setTipoGestacao(String tipoGestacao) {
        this.tipoGestacao = tipoGestacao;
    }

    public Boolean getPreNatal() {
        return preNatal;
    }

    public void setPreNatal(Boolean preNatal) {
        this.preNatal = preNatal;
    }
}