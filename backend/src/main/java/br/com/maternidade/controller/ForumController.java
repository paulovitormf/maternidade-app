package br.com.maternidade.controller;

import br.com.maternidade.dto.ForumDtos.*;
import br.com.maternidade.services.ForumService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/forum")
public class ForumController {
    private final ForumService service;
    public ForumController(ForumService service) { this.service = service; }

    @GetMapping("/categorias")
    public java.util.List<Categoria> categorias() { return service.listarCategorias(); }

    @GetMapping("/topicos")
    public java.util.List<Topico> topicos(@RequestParam(required=false) Integer categoriaId,
                                          @RequestParam(required=false) String busca,
                                          Authentication authentication) {
        return service.listarTopicos(categoriaId, busca, authentication.getName());
    }

    @GetMapping("/topicos/{id}")
    public Topico topico(@PathVariable Long id, Authentication authentication) {
        return service.buscarTopico(id, authentication.getName());
    }

    @PostMapping("/topicos")
    public ResponseEntity<?> criarTopico(@RequestBody CriarTopico dto, Authentication authentication) {
        try {
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(service.criarTopico(dto, authentication.getName()));
        } catch (IllegalArgumentException e) { return ResponseEntity.badRequest().body(e.getMessage()); }
    }

    @GetMapping("/topicos/{id}/respostas")
    public java.util.List<Resposta> respostas(@PathVariable Long id) { return service.listarRespostas(id); }

    @PostMapping("/topicos/{id}/respostas")
    public ResponseEntity<?> criarResposta(@PathVariable Long id, @RequestBody CriarResposta dto,
                                           Authentication authentication) {
        try {
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(service.criarResposta(id, dto, authentication.getName()));
        } catch (IllegalArgumentException e) { return ResponseEntity.badRequest().body(e.getMessage()); }
    }

    @PutMapping("/topicos/{id}/curtir")
    public Curtida alternarCurtida(@PathVariable Long id, Authentication authentication) {
        return service.alternarCurtida(id, authentication.getName());
    }
}
