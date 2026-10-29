package br.com.maternidade.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import br.com.maternidade.model.Crianca;
import br.com.maternidade.dto.CriancaAcessoDTO;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

@Repository
public interface CriancaRepository extends JpaRepository<Crianca, Integer> {
    @Query("""
            select new br.com.maternidade.dto.CriancaAcessoDTO(
                c.idCrianca, c.nome, c.dataNascimento, c.horaNascimento, c.sexo,
                uc.tipoAcesso, uc.podeEditar
            )
            from Crianca c, UsuarioCrianca uc
            where uc.idCrianca = c.idCrianca
              and uc.idUsuario = :idUsuario
              and uc.ativo = true
            order by c.dataNascimento desc, c.nome asc
            """)
    List<CriancaAcessoDTO> findByUsuarioId(@Param("idUsuario") Integer idUsuario);
    @Query(value = "SELECT c.* FROM crianca c INNER JOIN usuario_crianca uc ON uc.id_crianca = c.id_crianca WHERE uc.id_usuario = :idUsuario AND uc.ativo = true ORDER BY c.data_nascimento DESC", nativeQuery = true)
    List<Crianca> findEntidadesByUsuarioId(@Param("idUsuario") Integer idUsuario);
}
