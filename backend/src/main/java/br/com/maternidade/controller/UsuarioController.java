package br.com.maternidade.controller;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

public class UsuarioController {
    @RestController
@RequestMapping("/maes")
@CrossOrigin(origins = "http://localhost:5173") // Libera requisições do Vite
public class MaeController {
    // Endpoints POST, GET, PUT, DELETE...
}
}
