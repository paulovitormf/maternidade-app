package br.com.maternidade.repository;
import br.com.maternidade.model.*;
import org.springframework.data.jpa.repository.JpaRepository;
public interface UsuarioCriancaRepository extends JpaRepository<UsuarioCrianca, UsuarioCriancaId> {
    boolean existsByIdUsuarioAndIdCrianca(Integer idUsuario, Integer idCrianca);

    boolean existsByIdUsuarioAndIdCriancaAndTipoAcessoAndAtivo(
            Integer idUsuario, Integer idCrianca, String tipoAcesso, boolean ativo);
}
