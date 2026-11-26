package br.com.maternidade.repository;

import br.com.maternidade.model.EmailVerificacao;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EmailVerificacaoRepository extends JpaRepository<EmailVerificacao, Long> {

    Optional<EmailVerificacao> findByUsuarioEmail(String email);
}
