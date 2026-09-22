package br.com.maternidade.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import br.com.maternidade.model.Usuario;
import java.util.Optional;

@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, Long> {

    // Verifica se já existe um usuário com o e-mail informado (usado na validação de cadastro)
    boolean existsByEmail(String email);

    // Busca usuário pelo e-mail (útil para autenticação e login)
    Optional<Usuario> findByEmail(String email);
}