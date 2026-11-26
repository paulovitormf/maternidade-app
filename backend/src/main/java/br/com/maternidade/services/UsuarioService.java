package br.com.maternidade.services;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDate;
import java.util.List;
import java.util.Locale;

import br.com.maternidade.dto.UsuarioCadastroDTO;
import br.com.maternidade.dto.UsuarioBuscaDTO;
import br.com.maternidade.model.Gestacao;
import br.com.maternidade.model.Usuario;
import br.com.maternidade.repository.GestacaoRepository;
import br.com.maternidade.repository.UsuarioRepository;

@Service
public class UsuarioService {

    private final UsuarioRepository usuarioRepository;
    private final GestacaoRepository gestacaoRepository;
    private final PasswordEncoder passwordEncoder;
    private final EmailVerificacaoService emailVerificacaoService;

    public UsuarioService(
            UsuarioRepository usuarioRepository, 
            GestacaoRepository gestacaoRepository, 
            PasswordEncoder passwordEncoder,
            EmailVerificacaoService emailVerificacaoService) {
        this.usuarioRepository = usuarioRepository;
        this.gestacaoRepository = gestacaoRepository;
        this.passwordEncoder = passwordEncoder;
        this.emailVerificacaoService = emailVerificacaoService;
    }

    @Transactional
    public Usuario cadastrarUsuario(UsuarioCadastroDTO dto) {
        if (dto == null || dto.usuario() == null || dto.usuario().email() == null
                || dto.usuario().email().isBlank() || dto.usuario().senha() == null
                || dto.usuario().senha().isBlank() || dto.usuario().nome() == null
                || dto.usuario().nome().isBlank()) {
            throw new IllegalArgumentException("Nome, e-mail e senha são obrigatórios.");
        }
        if (dto.usuario().senha().length() < 8) {
            throw new IllegalArgumentException("A senha deve ter pelo menos 8 caracteres.");
        }
        String emailNormalizado = dto.usuario().email().trim().toLowerCase(Locale.ROOT);
        if (!emailNormalizado.matches("^[\\w.%+-]+@[\\w.-]+\\.[A-Za-z]{2,63}$")) {
            throw new IllegalArgumentException("E-mail inválido.");
        }
        if (usuarioRepository.existsByEmail(emailNormalizado)) {
            throw new IllegalArgumentException("E-mail já cadastrado no sistema.");
        }

        Usuario usuario = new Usuario();
        usuario.setNome(dto.usuario().nome());
        usuario.setEmail(emailNormalizado);

        String senhaCriptografada = passwordEncoder.encode(dto.usuario().senha());
        usuario.setSenha(senhaCriptografada);

        usuario.setDataNascimento(dto.usuario().data_nascimento());
        usuario.setTelefone(dto.usuario().telefone());
        usuario.setQntGestacao(Math.max(0, dto.usuario().qnt_gestacao() == null ? 0 : dto.usuario().qnt_gestacao()));

        Usuario usuarioSalvo = usuarioRepository.save(usuario);

        if (dto.gestacao() != null) {
            if (dto.gestacao().ultima_mestruacao() == null
                    || dto.gestacao().ultima_mestruacao().isAfter(LocalDate.now())) {
                throw new IllegalArgumentException("A DUM é obrigatória e não pode estar no futuro.");
            }
            Integer idadeInformada = dto.gestacao().idade_gestacional();
            if (idadeInformada != null && (idadeInformada < 0 || idadeInformada > 42)) {
                throw new IllegalArgumentException("A idade gestacional deve estar entre 0 e 42 semanas.");
            }

            Gestacao gestacao = new Gestacao();
            gestacao.setUsuario(usuarioSalvo);
            gestacao.setUltimaMestruacao(dto.gestacao().ultima_mestruacao());
            gestacao.setIdadeGestacional(idadeInformada != null ? idadeInformada : Gestacao.calcularIdadeGestacional(dto.gestacao().ultima_mestruacao()));
            gestacao.setDataParto(Gestacao.calcularDataParto(dto.gestacao().ultima_mestruacao()));
            gestacao.setTipoGestacao(dto.gestacao().tipo_gestacao());
            gestacao.setPreNatal(dto.gestacao().pre_natal());

            gestacaoRepository.save(gestacao);
            usuario.setQntGestacao(usuario.getQntGestacao() + 1);
            usuarioRepository.save(usuario);
        }

        emailVerificacaoService.iniciarVerificacao(usuarioSalvo);
        return usuarioSalvo;
    }

    public Usuario autenticar(String email, String senha) {
        if (email == null || senha == null) throw new IllegalArgumentException("E-mail ou senha inválidos.");
        Usuario usuario = usuarioRepository.findByEmail(email.trim().toLowerCase(Locale.ROOT))
                .orElseThrow(() -> new IllegalArgumentException("E-mail ou senha inválidos."));
        if (!passwordEncoder.matches(senha, usuario.getSenha())) throw new IllegalArgumentException("E-mail ou senha inválidos.");
        if (!usuario.isEmailVerificado()) throw new EmailNaoVerificadoException();
        return usuario;
    }

    public List<UsuarioBuscaDTO> buscarResponsaveis(String nome, String emailAutenticado) {
        if (nome == null || nome.trim().length() < 2) {
            throw new IllegalArgumentException("Digite pelo menos 2 caracteres para buscar.");
        }
        Usuario usuarioAutenticado = usuarioRepository.findByEmail(emailAutenticado)
                .orElseThrow(() -> new IllegalArgumentException("Usuário autenticado não encontrado."));

        return usuarioRepository.findTop8ByNomeContainingIgnoreCaseAndIdUsuarioNotOrderByNomeAsc(
                        nome.trim(), usuarioAutenticado.getIdUsuario())
                .stream()
                .map(usuario -> new UsuarioBuscaDTO(
                        usuario.getIdUsuario(), usuario.getNome(), mascararEmail(usuario.getEmail())))
                .toList();
    }

    private String mascararEmail(String email) {
        int separador = email.indexOf('@');
        if (separador <= 0) {
            return "***";
        }
        return email.charAt(0) + "***" + email.substring(separador);
    }
}