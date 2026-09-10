package br.com.maternidade.controller;

import br.com.maternidade.model.HelloMessage;
import br.com.maternidade.repository.HelloRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/hello")
public class HelloController {

    private final HelloRepository repository;

    public HelloController(HelloRepository repository) {
        this.repository = repository;
    }

    @GetMapping
    public ResponseEntity<HelloMessage> getHello() {
        return repository.findById(1L)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.ok(
                    new HelloMessage(1L, "Olá Mundo! (Mensagem padrão fallback)")
                ));
    }
}