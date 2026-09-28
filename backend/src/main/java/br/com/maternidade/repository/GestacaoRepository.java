package br.com.maternidade.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import br.com.maternidade.model.Gestacao;
import java.util.List;
import java.util.Optional;

@Repository
public interface GestacaoRepository extends JpaRepository<Gestacao, Integer> {

    // Busca todas as gestações associadas a um determinado usuário (mãe)
    List<Gestacao> findByUsuarioIdUsuario(Integer idUsuario);

    // Busca a gestação mais recente de um determinado usuário
    Optional<Gestacao> findFirstByUsuarioIdUsuarioOrderByIdGestacaoDesc(Integer idUsuario);
}