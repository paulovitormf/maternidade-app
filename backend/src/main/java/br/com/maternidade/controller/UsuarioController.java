package br.com.maternidade.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import br.com.maternidade.dto.UsuarioCadastroDTO;
import br.com.maternidade.dto.LoginDTO;
import br.com.maternidade.dto.UsuarioPublicoDTO;
import br.com.maternidade.dto.LoginRespostaDTO;
import br.com.maternidade.config.JwtService;
import br.com.maternidade.services.UsuarioService;

@RestController
@RequestMapping("/api/usuarios")
public class UsuarioController {

    private final UsuarioService usuarioService;
    private final JwtService jwtService;

    public UsuarioController(UsuarioService usuarioService, JwtService jwtService) {
        this.usuarioService = usuarioService;
        this.jwtService = jwtService;
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
        try {
            var usuario = usuarioService.autenticar(dto.email(), dto.senha());
            return ResponseEntity.ok(new LoginRespostaDTO(
                    jwtService.generateToken(usuario.getEmail()),
                    UsuarioPublicoDTO.from(usuario)));
        }
        catch (IllegalArgumentException e) { return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(e.getMessage()); }
    }
}