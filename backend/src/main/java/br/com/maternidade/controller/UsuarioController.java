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
import br.com.maternidade.dto.UsuarioBuscaDTO;
import org.springframework.security.core.Authentication;
import java.util.List;
import java.util.Map;
import br.com.maternidade.dto.ReenviarVerificacaoDTO;
import br.com.maternidade.dto.VerificarEmailDTO;
import br.com.maternidade.services.EmailDeliveryException;
import br.com.maternidade.services.EmailNaoVerificadoException;
import br.com.maternidade.services.EmailVerificacaoService;

@RestController
@RequestMapping("/api/usuarios")
public class UsuarioController {

    private final UsuarioService usuarioService;
    private final JwtService jwtService;
    private final EmailVerificacaoService emailVerificacaoService;

    public UsuarioController(
            UsuarioService usuarioService,
            JwtService jwtService,
            EmailVerificacaoService emailVerificacaoService) {
        this.usuarioService = usuarioService;
        this.jwtService = jwtService;
        this.emailVerificacaoService = emailVerificacaoService;
    }

    @PostMapping
    public ResponseEntity<?> cadastrar(@RequestBody UsuarioCadastroDTO dto) {
        try {
            return ResponseEntity.status(HttpStatus.CREATED).body(UsuarioPublicoDTO.from(usuarioService.cadastrarUsuario(dto)));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (EmailDeliveryException e) {
            return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE).body("Não foi possível enviar o e-mail de verificação. Tente novamente.");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Erro ao processar o cadastro.");
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginDTO dto) {
        try {
            if (dto == null) {
                throw new IllegalArgumentException("E-mail ou senha inválidos.");
            }
            var usuario = usuarioService.autenticar(dto.email(), dto.senha());
            return ResponseEntity.ok(new LoginRespostaDTO(
                    jwtService.generateToken(usuario.getEmail()),
                    UsuarioPublicoDTO.from(usuario)));
        }
        catch (EmailNaoVerificadoException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(Map.of("codigo", "EMAIL_NAO_VERIFICADO", "mensagem", e.getMessage()));
        }
        catch (IllegalArgumentException e) { return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(e.getMessage()); }
    }

    @PostMapping("/verificar-email")
    public ResponseEntity<?> verificarEmail(@RequestBody VerificarEmailDTO dto) {
        try {
            if (dto == null || !emailVerificacaoService.verificarCodigo(dto.email(), dto.codigo())) {
                return ResponseEntity.badRequest().body("Código inválido ou expirado.");
            }
            return ResponseEntity.ok(Map.of("mensagem", "E-mail verificado com sucesso."));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/reenviar-verificacao")
    public ResponseEntity<?> reenviarVerificacao(@RequestBody ReenviarVerificacaoDTO dto) {
        try {
            if (dto == null) {
                return ResponseEntity.badRequest().body("E-mail inválido.");
            }
            emailVerificacaoService.reenviarCodigo(dto.email());
            return ResponseEntity.ok(Map.of(
                    "mensagem", "Se houver uma conta pendente e o reenvio estiver disponível, enviaremos um novo código."));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (EmailDeliveryException e) {
            return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE)
                    .body("Não foi possível enviar o e-mail de verificação. Tente novamente.");
        }
    }

    @GetMapping("/busca")
    public ResponseEntity<?> buscarResponsaveis(@RequestParam String q, Authentication authentication) {
        try {
            List<UsuarioBuscaDTO> usuarios = usuarioService.buscarResponsaveis(q, authentication.getName());
            return ResponseEntity.ok(usuarios);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}