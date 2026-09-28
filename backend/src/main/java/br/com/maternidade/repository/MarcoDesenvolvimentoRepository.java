package br.com.maternidade.repository;

import br.com.maternidade.model.MarcoDesenvolvimento;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MarcoDesenvolvimentoRepository extends JpaRepository<MarcoDesenvolvimento, Integer> {
    List<MarcoDesenvolvimento> findAllByOrderByIdadeMinMesesAscTituloAsc();
}
