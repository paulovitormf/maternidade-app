package br.com.maternidade.repository;

import br.com.maternidade.model.HelloMessage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface HelloRepository extends JpaRepository<HelloMessage, Long> {
}