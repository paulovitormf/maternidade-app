package br.com.maternidade.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import br.com.maternidade.dto.CriancaCadastroDTO;
import br.com.maternidade.services.CriancaService;

@RestController
@RequestMapping("/api/criancas")
public class CriancaController {

    private final CriancaService criancaService;

    public CriancaController(CriancaService criancaService) {
        this.criancaService = criancaService;
    }

    @PostMapping
    public ResponseEntity<?> cadastrar(@RequestBody CriancaCadastroDTO dto) {
        try {
            var criancaSalva = criancaService.cadastrarCrianca(dto);
            return ResponseEntity.status(HttpStatus.CREATED).body(criancaSalva);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }
}