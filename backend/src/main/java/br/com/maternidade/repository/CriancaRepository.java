package br.com.maternidade.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import br.com.maternidade.model.Crianca;

@Repository
public interface CriancaRepository extends JpaRepository<Crianca, Long> {
}