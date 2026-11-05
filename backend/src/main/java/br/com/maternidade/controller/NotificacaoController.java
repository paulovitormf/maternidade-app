package br.com.maternidade.controller;

import br.com.maternidade.services.NotificacaoService;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/notificacoes")
public class NotificacaoController {
    private final NotificacaoService notificacaoService;

    public NotificacaoController(NotificacaoService notificacaoService) {
        this.notificacaoService = notificacaoService;
    }

    @GetMapping
    public Object listar(Authentication authentication) {
        return notificacaoService.listar(authentication.getName());
    }

    @PutMapping("/ler")
    public void marcarComoLidas(Authentication authentication) {
        notificacaoService.marcarComoLidas(authentication.getName());
    }
}
