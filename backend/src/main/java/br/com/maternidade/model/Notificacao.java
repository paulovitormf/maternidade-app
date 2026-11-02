package br.com.maternidade.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "notificacao")
public class Notificacao {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_notificacao")
    private Long id;

    @Column(name = "id_usuario", nullable = false)
    private Integer idUsuario;

    @Column(name = "id_crianca")
    private Integer idCrianca;

    @Column(nullable = false, length = 200)
    private String titulo;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String mensagem;

    @Column(nullable = false, length = 30)
    private String tipo;

    @Column(name = "data_agendada", nullable = false)
    private LocalDateTime dataAgendada;

    @Column(name = "data_leitura")
    private LocalDateTime dataLeitura;

    @Column(nullable = false, length = 20)
    private String status;

    protected Notificacao() {
    }

    public Notificacao(Integer idUsuario, Integer idCrianca, String titulo, String mensagem) {
        this.idUsuario = idUsuario;
        this.idCrianca = idCrianca;
        this.titulo = titulo;
        this.mensagem = mensagem;
        this.tipo = "COMPARTILHAMENTO";
        this.dataAgendada = LocalDateTime.now();
        this.status = "ENVIADA";
    }

    public Long getId() { return id; }
    public String getTitulo() { return titulo; }
    public String getMensagem() { return mensagem; }
    public LocalDateTime getDataAgendada() { return dataAgendada; }
    public String getStatus() { return status; }
}
