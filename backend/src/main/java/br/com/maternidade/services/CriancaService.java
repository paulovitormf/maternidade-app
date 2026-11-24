package br.com.maternidade.services;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import br.com.maternidade.dto.CriancaAtualizacaoDTO;
import br.com.maternidade.dto.CriancaCadastroDTO;
import br.com.maternidade.dto.CriancaAcessoDTO;
import br.com.maternidade.dto.CriancaDetalheDTO;
import br.com.maternidade.model.Crianca;
import br.com.maternidade.repository.CriancaRepository;
import br.com.maternidade.repository.UsuarioCriancaRepository;
import br.com.maternidade.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.AccessDeniedException;

@Service
public class CriancaService {

    private final CriancaRepository criancaRepository;
    private final UsuarioCriancaRepository vinculoRepository;
    private final UsuarioRepository usuarioRepository;
    private final NotificacaoService notificacaoService;

    @Autowired
    public CriancaService(CriancaRepository criancaRepository, UsuarioCriancaRepository vinculoRepository,
            UsuarioRepository usuarioRepository, NotificacaoService notificacaoService) {
        this.criancaRepository = criancaRepository;
        this.vinculoRepository = vinculoRepository;
        this.usuarioRepository = usuarioRepository;
        this.notificacaoService = notificacaoService;
    }

    public CriancaService(CriancaRepository criancaRepository, UsuarioCriancaRepository vinculoRepository, UsuarioRepository usuarioRepository) {
        this(criancaRepository, vinculoRepository, usuarioRepository, null);
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

    @Transactional
    public Crianca atualizarCrianca(Integer idCrianca, CriancaAtualizacaoDTO dto, String emailAutenticado) {
        if (idCrianca == null || dto == null || emailAutenticado == null || emailAutenticado.isBlank()) {
            throw new IllegalArgumentException("Criança, dados e usuário autenticado são obrigatórios.");
        }
        if (dto.nome() == null || dto.nome().isBlank()
                || dto.data_nascimento() == null || dto.hora_nascimento() == null) {
            throw new IllegalArgumentException("Nome, data e hora de nascimento são obrigatórios.");
        }
        if (dto.data_nascimento().isAfter(java.time.LocalDate.now())) {
            throw new IllegalArgumentException("A data de nascimento não pode estar no futuro.");
        }
        if ((dto.peso_nascimento() != null && dto.peso_nascimento().signum() < 0)
                || (dto.altura_nascimento() != null && dto.altura_nascimento().signum() < 0)) {
            throw new IllegalArgumentException("Peso e altura não podem ser negativos.");
        }

        var usuario = usuarioRepository.findByEmail(emailAutenticado)
                .orElseThrow(() -> new AccessDeniedException("Usuário autenticado não encontrado."));
        var vinculo = vinculoRepository.findByIdUsuarioAndIdCriancaAndAtivo(
                        usuario.getIdUsuario(), idCrianca, true)
                .orElseThrow(() -> new AccessDeniedException("Você não tem acesso aos dados desta criança."));
        if (!vinculo.isPodeEditar()) {
            throw new AccessDeniedException("Você não tem permissão para editar os dados desta criança.");
        }
        Crianca crianca = criancaRepository.findById(idCrianca)
                .orElseThrow(() -> new IllegalArgumentException("Criança não encontrada."));

        crianca.setNome(dto.nome());
        crianca.setDataNascimento(dto.data_nascimento());
        crianca.setHoraNascimento(dto.hora_nascimento());
        crianca.setSexo(dto.sexo());
        crianca.setPesoNascimento(dto.peso_nascimento());
        crianca.setAlturaNascimento(dto.altura_nascimento());
        crianca.setObservacoes(dto.observacoes());
        return criancaRepository.save(crianca);
    }

    @Transactional
    public void adicionarResponsavel(Integer idCrianca, Integer idResponsavel, String emailAutenticado) {
        if (idCrianca == null || idResponsavel == null || emailAutenticado == null || emailAutenticado.isBlank()) {
            throw new IllegalArgumentException("Criança, responsável e usuário autenticado são obrigatórios.");
        }

        var usuario = usuarioRepository.findByEmail(emailAutenticado)
                .orElseThrow(() -> new IllegalArgumentException("Usuário autenticado não encontrado."));
        boolean eResponsavelPrincipal = vinculoRepository.existsByIdUsuarioAndIdCriancaAndTipoAcessoAndAtivo(
                usuario.getIdUsuario(), idCrianca, "PRINCIPAL", true);
        if (!eResponsavelPrincipal) {
            throw new IllegalArgumentException("Somente o responsável principal pode adicionar outro responsável.");
        }
        if (usuario.getIdUsuario().equals(idResponsavel)) {
            throw new IllegalArgumentException("Você já está vinculado a esta criança.");
        }

        var responsavel = usuarioRepository.findByIdUsuario(idResponsavel)
                .orElseThrow(() -> new IllegalArgumentException("Responsável selecionado não encontrado."));
        if (vinculoRepository.existsByIdUsuarioAndIdCrianca(idResponsavel, idCrianca)) {
            throw new IllegalArgumentException("Este usuário já está vinculado a esta criança.");
        }

        vinculoRepository.save(new br.com.maternidade.model.UsuarioCrianca(
                responsavel.getIdUsuario(), idCrianca, "RESPONSAVEL",
                "RESPONSAVEL", usuario.getIdUsuario(), false));
        if (notificacaoService != null) {
            var crianca = criancaRepository.findById(idCrianca)
                    .orElseThrow(() -> new IllegalArgumentException("Criança não encontrada."));
            notificacaoService.registrarCompartilhamento(
                    usuario.getIdUsuario(), responsavel.getIdUsuario(), idCrianca,
                    usuario.getNome(), crianca.getNome());
        }
    }

    public java.util.List<CriancaAcessoDTO> listarPorUsuario(String emailAutenticado) {
        var usuario = usuarioRepository.findByEmail(emailAutenticado)
                .orElseThrow(() -> new IllegalArgumentException("Usuário autenticado não encontrado."));
        return criancaRepository.findByUsuarioId(usuario.getIdUsuario());
    }
    public java.util.List<Crianca> listarEntidadesPorUsuario(Long idUsuario, String emailAutenticado) {
        var usuario = usuarioRepository.findByEmail(emailAutenticado)
                .orElseThrow(() -> new AccessDeniedException("Usuário autenticado não encontrado."));
        if (!usuario.getIdUsuario().equals(Math.toIntExact(idUsuario))) {
            throw new AccessDeniedException("Você não tem permissão para consultar estas crianças.");
        }
        return criancaRepository.findEntidadesByUsuarioId(usuario.getIdUsuario());
    }

    public CriancaDetalheDTO buscarDetalhe(Integer idCrianca, String emailAutenticado) {
        var usuario = usuarioRepository.findByEmail(emailAutenticado)
                .orElseThrow(() -> new AccessDeniedException("Usuário autenticado não encontrado."));
        var vinculo = vinculoRepository.findByIdUsuarioAndIdCriancaAndAtivo(
                usuario.getIdUsuario(), idCrianca, true)
                .orElseThrow(() -> new AccessDeniedException("Você não tem acesso aos dados desta criança."));
        var crianca = criancaRepository.findById(idCrianca)
                .orElseThrow(() -> new IllegalArgumentException("Criança não encontrada."));
        return CriancaDetalheDTO.from(crianca, vinculo.isPodeEditar());
    }
}
