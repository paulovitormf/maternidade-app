package br.com.maternidade.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import br.com.maternidade.dto.GestacaoDTO;
import br.com.maternidade.services.GestacaoService;
import br.com.maternidade.dto.GestacaoPublicaDTO;
import org.springframework.security.core.Authentication;
import java.util.List;

@RestController
@RequestMapping("/api/gestacoes")
public class GestacaoController {

    private final GestacaoService gestacaoService;

    public GestacaoController(GestacaoService gestacaoService) {
        this.gestacaoService = gestacaoService;
    }

    @PostMapping
    public ResponseEntity<?> cadastrar(@RequestBody GestacaoDTO dto, Authentication authentication) {
        try {
            var gestacaoSalva = gestacaoService.cadastrarGestacao(dto, authentication.getName());
            return ResponseEntity.status(HttpStatus.CREATED).body(GestacaoPublicaDTO.from(gestacaoSalva));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @GetMapping
    public ResponseEntity<List<GestacaoPublicaDTO>> listar(Authentication authentication) {
        var usuario = gestacaoService.buscarUsuarioAutenticado(authentication.getName());
        var gestacoes = gestacaoService.listarPorUsuario(usuario.getIdUsuario())
                .stream()
                .map(GestacaoPublicaDTO::from)
                .toList();
        return ResponseEntity.ok(gestacoes);
    }

    @GetMapping("/usuario/{idUsuario}/mais-recente")
    public ResponseEntity<?> buscarMaisRecente(@PathVariable Integer idUsuario) {
        try {
            return ResponseEntity.ok(GestacaoPublicaDTO.from(
                    gestacaoService.buscarMaisRecentePorUsuario(idUsuario)));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    @PutMapping("/{idGestacao}")
    public ResponseEntity<?> atualizar(@PathVariable Integer idGestacao, @RequestBody GestacaoDTO dto, Authentication authentication) {
        try {
            return ResponseEntity.ok(GestacaoPublicaDTO.from(
                    gestacaoService.atualizarGestacao(idGestacao, dto, authentication.getName())));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/{idGestacao}")
    public ResponseEntity<?> excluir(@PathVariable Integer idGestacao, Authentication authentication) {
        try {
            gestacaoService.excluirGestacao(idGestacao, authentication.getName());
            return ResponseEntity.noContent().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
