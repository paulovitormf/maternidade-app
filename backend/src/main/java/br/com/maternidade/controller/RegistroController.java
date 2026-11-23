package br.com.maternidade.controller;

import br.com.maternidade.dto.RegistroCadastroDTO;
import br.com.maternidade.dto.RegistroPublicoDTO;
import br.com.maternidade.services.RegistroService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/registros")
public class RegistroController {
    private final RegistroService service;

    public RegistroController(RegistroService service) {
        this.service = service;
    }

    @GetMapping("/usuario/{idUsuario}")
    public ResponseEntity<?> listar(
            @PathVariable Integer idUsuario,
            Authentication authentication) {
        try {
            Integer idAtual = service.idUsuarioAutenticado(authentication.getName());
            return ResponseEntity.ok(service.listar(idUsuario, authentication.getName()).stream()
                    .map(registro -> RegistroPublicoDTO.from(registro, idAtual))
                    .toList());
        } catch (AccessDeniedException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(e.getMessage());
        }
    }

    @GetMapping("/crianca/{idCrianca}")
    public ResponseEntity<?> listarPorCrianca(
            @PathVariable Integer idCrianca,
            Authentication authentication) {
        try {
            Integer idAtual = service.idUsuarioAutenticado(authentication.getName());
            return ResponseEntity.ok(service.listarPorCrianca(idCrianca, authentication.getName()).stream()
                    .map(registro -> RegistroPublicoDTO.from(registro, idAtual))
                    .toList());
        } catch (AccessDeniedException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(e.getMessage());
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping
    public ResponseEntity<?> criar(
            @RequestBody RegistroCadastroDTO dto,
            Authentication authentication) {
        try {
            Integer idAtual = service.idUsuarioAutenticado(authentication.getName());
            return ResponseEntity.status(HttpStatus.CREATED).body(
                    RegistroPublicoDTO.from(service.criar(dto, authentication.getName()), idAtual));
        } catch (AccessDeniedException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(e.getMessage());
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/{idRegistro}")
    public ResponseEntity<?> atualizar(
            @PathVariable Long idRegistro,
            @RequestBody RegistroCadastroDTO dto,
            Authentication authentication) {
        try {
            Integer idAtual = service.idUsuarioAutenticado(authentication.getName());
            return ResponseEntity.ok(
                    RegistroPublicoDTO.from(service.atualizar(idRegistro, dto, authentication.getName()), idAtual));
        } catch (AccessDeniedException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(e.getMessage());
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/{idRegistro}")
    public ResponseEntity<?> excluir(
            @PathVariable Long idRegistro,
            Authentication authentication) {
        try {
            service.excluir(idRegistro, authentication.getName());
            return ResponseEntity.noContent().build();
        } catch (AccessDeniedException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(e.getMessage());
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }
}
