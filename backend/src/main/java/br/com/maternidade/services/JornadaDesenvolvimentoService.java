package br.com.maternidade.services;

import java.util.List;

import org.springframework.stereotype.Service;

import br.com.maternidade.model.JornadaDesenvolvimento;
import br.com.maternidade.repository.JornadaDesenvolvimentoRepository;

@Service
public class JornadaDesenvolvimentoService {

    private final JornadaDesenvolvimentoRepository repository;

    public JornadaDesenvolvimentoService(JornadaDesenvolvimentoRepository repository) {
        this.repository = repository;
    }

    public List<JornadaDesenvolvimento> listar() {
        return repository.findAllByOrderByIdadeMinMesesAscTituloAsc();
    }
}
