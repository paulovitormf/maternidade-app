package br.com.maternidade.controller;

import br.com.maternidade.model.MarcoDesenvolvimento;
import br.com.maternidade.services.MarcoDesenvolvimentoService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/marcos-desenvolvimento")
public class MarcoDesenvolvimentoController {

    private final MarcoDesenvolvimentoService service;

    public MarcoDesenvolvimentoController(MarcoDesenvolvimentoService service) {
        this.service = service;
    }

    @GetMapping
    public List<MarcoDesenvolvimento> listar() {
        return service.listar();
    }
}
