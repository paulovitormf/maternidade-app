package br.com.maternidade.services;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import br.com.maternidade.dto.CriancaCadastroDTO;
import br.com.maternidade.model.Crianca;
import br.com.maternidade.repository.CriancaRepository;

@Service
public class CriancaService {

    private final CriancaRepository criancaRepository;

    public CriancaService(CriancaRepository criancaRepository) {
        this.criancaRepository = criancaRepository;
    }

    @Transactional
    public Crianca cadastrarCrianca(CriancaCadastroDTO dto) {
        // 1. Instancia a entidade Crianca
        Crianca crianca = new Crianca();
        crianca.setNome(dto.nome());
        crianca.setDataNascimento(dto.data_nascimento());
        crianca.setHoraNascimento(dto.hora_nascimento());
        crianca.setSexo(dto.sexo());
        crianca.setPesoNascimento(dto.peso_nascimento());
        crianca.setAlturaNascimento(dto.altura_nascimento());
        crianca.setPrevisaoNascimento(dto.previsao_nascimento());
        crianca.setObservacoes(dto.observacoes());

        // 2. Salva a criança no banco de dados MySQL
        Crianca criancaSalva = criancaRepository.save(crianca);

        // TODO: Se houver autenticação (JWT/Session), você pode associar a criança ao usuário ativo
        // na tabela 'usuario_crianca' informando o tipo_relacao (MAE, PAI, RESPONSAVEL).

        return criancaSalva;
    }
}