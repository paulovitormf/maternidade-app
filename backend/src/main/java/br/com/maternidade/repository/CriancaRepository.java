package br.com.maternidade.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import br.com.maternidade.model.Crianca;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

@Repository
public interface CriancaRepository extends JpaRepository<Crianca, Integer> {
    @Query("select c from Crianca c where c.idCrianca in (select uc.idCrianca from UsuarioCrianca uc where uc.idUsuario = :idUsuario) order by c.dataNascimento desc, c.nome asc")
    List<Crianca> findByUsuarioId(@Param("idUsuario") Integer idUsuario);
}