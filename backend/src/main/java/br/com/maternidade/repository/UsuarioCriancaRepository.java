package br.com.maternidade.repository;
import br.com.maternidade.model.*;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
public interface UsuarioCriancaRepository extends JpaRepository<UsuarioCrianca, UsuarioCriancaId> {
    boolean existsByIdUsuarioAndIdCrianca(Integer idUsuario, Integer idCrianca);

    boolean existsByIdUsuarioAndIdCriancaAndTipoAcessoAndAtivo(
            Integer idUsuario, Integer idCrianca, String tipoAcesso, boolean ativo);

    boolean existsByIdUsuarioAndIdCriancaAndAtivo(
            Integer idUsuario, Integer idCrianca, boolean ativo);

    boolean existsByIdUsuarioAndIdCriancaAndAtivoAndPodeEditar(
            Integer idUsuario, Integer idCrianca, boolean ativo, boolean podeEditar);

    Optional<UsuarioCrianca> findByIdUsuarioAndIdCriancaAndAtivo(
            Integer idUsuario, Integer idCrianca, boolean ativo);
}
