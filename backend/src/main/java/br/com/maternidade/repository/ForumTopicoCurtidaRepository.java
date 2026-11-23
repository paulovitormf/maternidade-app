package br.com.maternidade.repository;

import br.com.maternidade.model.ForumTopicoCurtida;
import br.com.maternidade.model.ForumTopicoCurtidaId;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ForumTopicoCurtidaRepository extends JpaRepository<ForumTopicoCurtida, ForumTopicoCurtidaId> {
    long countByTopicoId(Long topicoId);
}
