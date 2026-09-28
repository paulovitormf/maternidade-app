package br.com.maternidade.services;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import br.com.maternidade.dto.CriancaCadastroDTO;
import br.com.maternidade.model.Crianca;
import br.com.maternidade.repository.CriancaRepository;
import br.com.maternidade.repository.UsuarioCriancaRepository;
import br.com.maternidade.repository.UsuarioRepository;

@Service
public class CriancaService {

    private final CriancaRepository criancaRepository;
    private final UsuarioCriancaRepository vinculoRepository;
    private final UsuarioRepository usuarioRepository;

    public CriancaService(CriancaRepository criancaRepository, UsuarioCriancaRepository vinculoRepository, UsuarioRepository usuarioRepository) {
        this.criancaRepository = criancaRepository; this.vinculoRepository = vinculoRepository; this.usuarioRepository = usuarioRepository;
    }

    @Transactional
    public Crianca cadastrarCrianca(CriancaCadastroDTO dto, String emailAutenticado) {
        if (dto == null || emailAutenticado == null || emailAutenticado.isBlank()) {
            throw new IllegalArgumentException("Usuário autenticado é obrigatório.");
        }
        if (dto.nome() == null || dto.nome().isBlank()
                || dto.data_nascimento() == null || dto.hora_nascimento() == null) {
            throw new IllegalArgumentException("Nome, data e hora de nascimento são obrigatórios.");
        }
        if (dto.data_nascimento().isAfter(java.time.LocalDate.now())) {
            throw new IllegalArgumentException("A data de nascimento não pode estar no futuro.");
        }
        if (dto.peso_nascimento() != null && dto.peso_nascimento().signum() < 0
                || dto.altura_nascimento() != null && dto.altura_nascimento().signum() < 0) {
            throw new IllegalArgumentException("Peso e altura não podem ser negativos.");
        }
        if (dto.tipo_relacao() == null || !dto.tipo_relacao().matches("MAE|PAI|RESPONSAVEL")) {
            throw new IllegalArgumentException("Tipo de relação inválido.");
        }
        var usuario = usuarioRepository.findByEmail(emailAutenticado)
                .orElseThrow(() -> new IllegalArgumentException("Usuário autenticado não encontrado."));

        // 1. Instancia a entidade Crianca
        Crianca crianca = new Crianca();
        crianca.setNome(dto.nome());
        crianca.setDataNascimento(dto.data_nascimento());
        crianca.setHoraNascimento(dto.hora_nascimento());
        crianca.setSexo(dto.sexo());
        crianca.setPesoNascimento(dto.peso_nascimento());
        crianca.setAlturaNascimento(dto.altura_nascimento());
        crianca.setObservacoes(dto.observacoes());

        // 2. Salva a criança no banco de dados MySQL
        Crianca criancaSalva = criancaRepository.save(crianca);

        vinculoRepository.save(new br.com.maternidade.model.UsuarioCrianca(
                usuario.getIdUsuario(), criancaSalva.getIdCrianca(), dto.tipo_relacao()));

        return criancaSalva;
    }
}