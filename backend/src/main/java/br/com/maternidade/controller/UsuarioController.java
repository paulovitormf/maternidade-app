package br.com.maternidade.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import br.com.maternidade.dto.UsuarioCadastroDTO;
import br.com.maternidade.dto.LoginDTO;
import br.com.maternidade.dto.UsuarioPublicoDTO;
import br.com.maternidade.services.UsuarioService;

@RestController
@RequestMapping("/api/usuarios")
public class UsuarioController {

    private final UsuarioService usuarioService;

    public UsuarioController(UsuarioService usuarioService) {
        this.usuarioService = usuarioService;
    }

    @PostMapping
    public ResponseEntity<?> cadastrar(@RequestBody UsuarioCadastroDTO dto) {
        try {
            return ResponseEntity.status(HttpStatus.CREATED).body(UsuarioPublicoDTO.from(usuarioService.cadastrarUsuario(dto)));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Erro ao processar o cadastro.");
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginDTO dto) {
        try { return ResponseEntity.ok(UsuarioPublicoDTO.from(usuarioService.autenticar(dto.email(), dto.senha()))); }
        catch (IllegalArgumentException e) { return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(e.getMessage()); }
    }
}