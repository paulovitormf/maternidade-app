package br.com.maternidade.model;
import java.io.Serializable;
public class UsuarioCriancaId implements Serializable {
    private Long idUsuario; private Long idCrianca;
    public UsuarioCriancaId() {}
    public UsuarioCriancaId(Long u, Long c) { idUsuario=u; idCrianca=c; }
    public Long getIdUsuario(){return idUsuario;} public Long getIdCrianca(){return idCrianca;}
    @Override public boolean equals(Object o){return o instanceof UsuarioCriancaId x && idUsuario.equals(x.idUsuario) && idCrianca.equals(x.idCrianca);}
    @Override public int hashCode(){return 31*idUsuario.hashCode()+idCrianca.hashCode();}
}
