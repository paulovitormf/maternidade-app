package br.com.maternidade.repository;

import br.com.maternidade.model.ForumCategoria;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ForumCategoriaRepository extends JpaRepository<ForumCategoria, Integer> {
    List<ForumCategoria> findByAtivoTrueOrderByNomeAsc();
}
