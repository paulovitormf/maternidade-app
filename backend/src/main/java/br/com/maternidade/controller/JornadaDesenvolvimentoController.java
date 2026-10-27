package br.com.maternidade.controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import br.com.maternidade.model.JornadaDesenvolvimento;
import br.com.maternidade.services.JornadaDesenvolvimentoService;

@RestController
@RequestMapping("/api/jornadas-desenvolvimento")
public class JornadaDesenvolvimentoController {

    private final JornadaDesenvolvimentoService service;

    public JornadaDesenvolvimentoController(JornadaDesenvolvimentoService service) {
        this.service = service;
    }

    @GetMapping
    public List<JornadaDesenvolvimento> listar() {
        return service.listar();
    }
}
