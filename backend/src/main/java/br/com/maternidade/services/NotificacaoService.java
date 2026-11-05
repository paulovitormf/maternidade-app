package br.com.maternidade.services;

import br.com.maternidade.model.Notificacao;
import br.com.maternidade.repository.NotificacaoRepository;
import br.com.maternidade.repository.UsuarioRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class NotificacaoService {
    private final NotificacaoRepository notificacaoRepository;
    private final UsuarioRepository usuarioRepository;

    public NotificacaoService(NotificacaoRepository notificacaoRepository, UsuarioRepository usuarioRepository) {
        this.notificacaoRepository = notificacaoRepository;
        this.usuarioRepository = usuarioRepository;
    }

    public java.util.List<Notificacao> listar(String email) {
        var usuario = usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("Usuário autenticado não encontrado."));
        return notificacaoRepository.findByIdUsuarioOrderByDataAgendadaDesc(usuario.getIdUsuario());
    }

    @Transactional
    public void marcarComoLidas(String email) {
        var usuario = usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("Usuário autenticado não encontrado."));
        notificacaoRepository.marcarComoLidas(usuario.getIdUsuario());
    }

    public void registrarCompartilhamento(Integer idPrincipal, Integer idSegundo, Integer idCrianca,
            String nomePrincipal, String nomeCrianca) {
        notificacaoRepository.save(new Notificacao(
                idPrincipal, idCrianca,
                "Compartilhamento realizado",
                nomePrincipal + " compartilhou " + nomeCrianca + " com outro responsável."));
        notificacaoRepository.save(new Notificacao(
                idSegundo, idCrianca,
                "Acesso compartilhado",
                "Você recebeu acesso ao perfil de " + nomeCrianca + "."));
    }
}
