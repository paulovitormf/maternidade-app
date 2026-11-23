package br.com.maternidade.repository;

import br.com.maternidade.model.Registro;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface RegistroRepository extends JpaRepository<Registro, Long> {
    List<Registro> findByUsuarioIdUsuarioOrderByDataRegistroDescHorarioDescCriadoEmDesc(Integer idUsuario);

    List<Registro> findByCriancaIdCriancaOrderByDataRegistroDescHorarioDescCriadoEmDesc(Integer idCrianca);
}
