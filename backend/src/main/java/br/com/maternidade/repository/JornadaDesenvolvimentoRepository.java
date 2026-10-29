package br.com.maternidade.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import br.com.maternidade.model.JornadaDesenvolvimento;

@Repository
public interface JornadaDesenvolvimentoRepository extends JpaRepository<JornadaDesenvolvimento, Integer> {
    List<JornadaDesenvolvimento> findAllByOrderByIdadeMinMesesAscTituloAsc();
}
