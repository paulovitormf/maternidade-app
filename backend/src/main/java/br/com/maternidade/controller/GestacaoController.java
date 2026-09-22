package br.com.maternidade.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import br.com.maternidade.dto.GestacaoDTO;
import br.com.maternidade.services.GestacaoService;

@RestController
@RequestMapping("/api/gestacoes")
@CrossOrigin(origins = "*")
public class GestacaoController {

    private final GestacaoService gestacaoService;

    public GestacaoController(GestacaoService gestacaoService) {
        this.gestacaoService = gestacaoService;
    }

    @PostMapping
    public ResponseEntity<?> cadastrar(@RequestBody GestacaoDTO dto) {
        try {
            var gestacaoSalva = gestacaoService.cadastrarGestacao(dto);
            return ResponseEntity.status(HttpStatus.CREATED).body(gestacaoSalva);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }
}