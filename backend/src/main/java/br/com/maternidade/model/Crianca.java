package br.com.maternidade.model;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;

@Entity
@Table(name = "crianca")
public class Crianca {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_crianca")
    private Long idCrianca;

    @Column(name = "nome", nullable = false, length = 250)
    private String nome;

    @Column(name = "data_nascimento", nullable = false)
    private LocalDate dataNascimento;

    @Column(name = "hora_nascimento", nullable = false)
    private LocalTime horaNascimento;

    @Column(name = "sexo")
    private String sexo; // 'F' ou 'M'

    @Column(name = "peso_nascimento", precision = 5, scale = 2)
    private BigDecimal pesoNascimento;

    @Column(name = "altura_nascimento", precision = 5, scale = 2)
    private BigDecimal alturaNascimento;

    @Column(name = "observacoes", columnDefinition = "TEXT")
    private String observacoes;

    @Column(name = "previsao_nascimento", nullable = false)
    private LocalDate previsaoNascimento;

    public Crianca() {}

    // Getters e Setters
    public Long getIdCrianca() { return idCrianca; }
    public void setIdCrianca(Long idCrianca) { this.idCrianca = idCrianca; }

    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }

    public LocalDate getDataNascimento() { return dataNascimento; }
    public void setDataNascimento(LocalDate dataNascimento) { this.dataNascimento = dataNascimento; }

    public LocalTime getHoraNascimento() { return horaNascimento; }
    public void setHoraNascimento(LocalTime horaNascimento) { this.horaNascimento = horaNascimento; }

    public String getSexo() { return sexo; }
    public void setSexo(String sexo) { this.sexo = sexo; }

    public BigDecimal getPesoNascimento() { return pesoNascimento; }
    public void setPesoNascimento(BigDecimal pesoNascimento) { this.pesoNascimento = pesoNascimento; }

    public BigDecimal getAlturaNascimento() { return alturaNascimento; }
    public void setAlturaNascimento(BigDecimal alturaNascimento) { this.alturaNascimento = alturaNascimento; }

    public String getObservacoes() { return observacoes; }
    public void setObservacoes(String observacoes) { this.observacoes = observacoes; }

    public LocalDate getPrevisaoNascimento() { return previsaoNascimento; }
    public void setPrevisaoNascimento(LocalDate previsaoNascimento) { this.previsaoNascimento = previsaoNascimento; }
}