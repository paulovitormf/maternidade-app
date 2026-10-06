package br.com.maternidade.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import br.com.maternidade.dto.CriancaCadastroDTO;
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

    @PostMapping
    public ResponseEntity<?> cadastrar(@RequestBody CriancaCadastroDTO dto, Authentication authentication) {
        try {
            var criancaSalva = criancaService.cadastrarCrianca(dto, authentication.getName());
            return ResponseEntity.status(HttpStatus.CREATED).body(criancaSalva);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @GetMapping
    public ResponseEntity<List<br.com.maternidade.model.Crianca>> listar(Authentication authentication) {
        return ResponseEntity.ok(criancaService.listarPorUsuario(authentication.getName()));
    }
}