package br.com.maternidade.model;
import java.io.Serializable;
public class UsuarioCriancaId implements Serializable {
    private Integer idUsuario; private Integer idCrianca;
    public UsuarioCriancaId() {}
    public UsuarioCriancaId(Integer u, Integer c) { idUsuario=u; idCrianca=c; }
    public Integer getIdUsuario(){return idUsuario;} public Integer getIdCrianca(){return idCrianca;}
    @Override public boolean equals(Object o){return o instanceof UsuarioCriancaId x && idUsuario.equals(x.idUsuario) && idCrianca.equals(x.idCrianca);}
    @Override public int hashCode(){return 31*idUsuario.hashCode()+idCrianca.hashCode();}
}
