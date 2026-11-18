package br.com.maternidade.repository;

import br.com.maternidade.model.ForumTopico;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;
import java.util.Optional;

public interface ForumTopicoRepository extends JpaRepository<ForumTopico, Long> {
    @Query("""
            select t from ForumTopico t
            where t.status <> 'ARQUIVADO'
              and (:categoriaId is null or t.categoria.id = :categoriaId)
              and (:busca is null
                   or lower(t.titulo) like lower(concat('%', :busca, '%'))
                   or lower(t.conteudo) like lower(concat('%', :busca, '%')))
            order by t.fixado desc, t.dataAtualizacao desc
            """)
    List<ForumTopico> buscar(@Param("categoriaId") Integer categoriaId, @Param("busca") String busca);
    Optional<ForumTopico> findByIdAndStatusNot(Long id, String status);
    long countByCategoriaIdAndStatusNot(Integer categoriaId, String status);
}
