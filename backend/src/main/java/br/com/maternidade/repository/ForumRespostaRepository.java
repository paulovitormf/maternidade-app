package br.com.maternidade.repository;

import br.com.maternidade.model.ForumResposta;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ForumRespostaRepository extends JpaRepository<ForumResposta, Long> {
    List<ForumResposta> findByTopicoIdAndStatusOrderByDataCriacaoAsc(Long topicoId, String status);
    long countByTopicoIdAndStatus(Long topicoId, String status);
}
