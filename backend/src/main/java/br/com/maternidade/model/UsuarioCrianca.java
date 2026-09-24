package br.com.maternidade.model;
import jakarta.persistence.*;
@Entity @Table(name="usuario_crianca") @IdClass(UsuarioCriancaId.class)
public class UsuarioCrianca {
    @Id @Column(name="id_usuario") private Long idUsuario;
    @Id @Column(name="id_crianca") private Long idCrianca;
    @Column(name="tipo_relacao", nullable=false) private String tipoRelacao;
    public UsuarioCrianca() {}
    public UsuarioCrianca(Long u, Long c, String r){idUsuario=u;idCrianca=c;tipoRelacao=r;}
}
