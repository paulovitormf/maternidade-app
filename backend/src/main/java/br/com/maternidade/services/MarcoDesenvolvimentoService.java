package br.com.maternidade.services;

import br.com.maternidade.model.MarcoDesenvolvimento;
import br.com.maternidade.repository.MarcoDesenvolvimentoRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MarcoDesenvolvimentoService {

    private final MarcoDesenvolvimentoRepository repository;

    public MarcoDesenvolvimentoService(MarcoDesenvolvimentoRepository repository) {
        this.repository = repository;
    }

    public List<MarcoDesenvolvimento> listar() {
        return repository.findAllByOrderByIdadeMinMesesAscTituloAsc();
    }
}
