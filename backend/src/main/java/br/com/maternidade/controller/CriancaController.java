package br.com.maternidade.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import br.com.maternidade.dto.CriancaCadastroDTO;
import br.com.maternidade.dto.CriancaAtualizacaoDTO;
import br.com.maternidade.dto.ResponsavelCriancaDTO;
import br.com.maternidade.dto.CriancaAcessoDTO;
import br.com.maternidade.dto.CriancaDetalheDTO;
import br.com.maternidade.services.CriancaService;
import org.springframework.security.core.Authentication;
import java.util.List;

@RestController
@RequestMapping("/api/criancas")
public class CriancaController {

    private final CriancaService criancaService;

    public CriancaController(CriancaService criancaService) {
        this.criancaService = criancaService;
    }

    @GetMapping("/usuario/{idUsuario}")
    public ResponseEntity<?> listarPorUsuario(@PathVariable Long idUsuario, Authentication authentication) {
        return ResponseEntity.ok(criancaService.listarEntidadesPorUsuario(idUsuario, authentication.getName()).stream()
            .map(br.com.maternidade.dto.CriancaPublicaDTO::from)
            .toList());
    }

    @GetMapping("/{idCrianca}")
    public ResponseEntity<?> buscarDetalhe(
            @PathVariable Integer idCrianca,
            Authentication authentication) {
        try {
            CriancaDetalheDTO detalhe = criancaService.buscarDetalhe(idCrianca, authentication.getName());
            return ResponseEntity.ok(detalhe);
        } catch (org.springframework.security.access.AccessDeniedException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(e.getMessage());
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping
    public ResponseEntity<?> cadastrar(@RequestBody CriancaCadastroDTO dto, Authentication authentication) {
        try {
            var criancaSalva = criancaService.cadastrarCrianca(dto, authentication.getName());
            return ResponseEntity.status(HttpStatus.CREATED).body(criancaSalva);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @PutMapping("/{idCrianca}")
    public ResponseEntity<?> atualizar(
            @PathVariable Integer idCrianca,
            @RequestBody CriancaAtualizacaoDTO dto,
            Authentication authentication) {
        try {
            return ResponseEntity.ok(criancaService.atualizarCrianca(idCrianca, dto, authentication.getName()));
        } catch (org.springframework.security.access.AccessDeniedException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(e.getMessage());
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/{idCrianca}")
    public ResponseEntity<?> excluir(
            @PathVariable Integer idCrianca,
            Authentication authentication) {
        try {
            criancaService.excluirCrianca(idCrianca, authentication.getName());
            return ResponseEntity.noContent().build();
        } catch (org.springframework.security.access.AccessDeniedException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(e.getMessage());
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping
    public ResponseEntity<List<CriancaAcessoDTO>> listar(Authentication authentication) {
        return ResponseEntity.ok(criancaService.listarPorUsuario(authentication.getName()));
    }

    @PostMapping("/{idCrianca}/responsaveis")
    public ResponseEntity<?> adicionarResponsavel(
            @PathVariable Integer idCrianca,
            @RequestBody ResponsavelCriancaDTO dto,
            Authentication authentication) {
        try {
            criancaService.adicionarResponsavel(
                    idCrianca, dto == null ? null : dto.id_usuario(), authentication.getName());
            return ResponseEntity.status(HttpStatus.CREATED).build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
