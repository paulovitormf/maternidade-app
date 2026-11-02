package br.com.maternidade.repository;

import br.com.maternidade.model.Notificacao;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

public interface NotificacaoRepository extends JpaRepository<Notificacao, Long> {
    List<Notificacao> findByIdUsuarioOrderByDataAgendadaDesc(Integer idUsuario);

    @Modifying
    @Query("""
            update Notificacao n
            set n.status = 'LIDA', n.dataLeitura = CURRENT_TIMESTAMP
            where n.idUsuario = :idUsuario and n.status <> 'LIDA'
            """)
    void marcarComoLidas(@Param("idUsuario") Integer idUsuario);
}
