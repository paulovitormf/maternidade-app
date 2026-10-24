package br.com.maternidade.model;
import jakarta.persistence.*;
@Entity @Table(name="usuario_crianca") @IdClass(UsuarioCriancaId.class)
public class UsuarioCrianca {
    @Id @Column(name="id_usuario") private Integer idUsuario;
    @Id @Column(name="id_crianca") private Integer idCrianca;
    @Column(name="tipo_relacao", nullable=false) private String tipoRelacao;
    @Column(name="tipo_acesso", nullable=false) private String tipoAcesso;
    @Column(name="concedido_por") private Integer concedidoPor;
    @Column(name="pode_editar", nullable=false) private boolean podeEditar;
    @Column(name="ativo", nullable=false) private boolean ativo;

    public UsuarioCrianca() {}

    public UsuarioCrianca(Integer u, Integer c, String r) {
        this(u, c, r, "PRINCIPAL", null, true);
    }

    public UsuarioCrianca(Integer u, Integer c, String r, String tipoAcesso, Integer concedidoPor, boolean podeEditar) {
        this.idUsuario = u;
        this.idCrianca = c;
        this.tipoRelacao = r;
        this.tipoAcesso = tipoAcesso;
        this.concedidoPor = concedidoPor;
        this.podeEditar = podeEditar;
        this.ativo = true;
    }
}
