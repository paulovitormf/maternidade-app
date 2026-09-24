package br.com.maternidade.services;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDate;

import br.com.maternidade.dto.UsuarioCadastroDTO;
import br.com.maternidade.model.Gestacao;
import br.com.maternidade.model.Usuario;
import br.com.maternidade.repository.GestacaoRepository;
import br.com.maternidade.repository.UsuarioRepository;

@Service
public class UsuarioService {

    private final UsuarioRepository usuarioRepository;
    private final GestacaoRepository gestacaoRepository;
    private final PasswordEncoder passwordEncoder;

    public UsuarioService(
            UsuarioRepository usuarioRepository, 
            GestacaoRepository gestacaoRepository, 
            PasswordEncoder passwordEncoder) {
        this.usuarioRepository = usuarioRepository;
        this.gestacaoRepository = gestacaoRepository;
        this.passwordEncoder = passwordEncoder;
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
        // 1. Valida se o e-mail já existe
        if (usuarioRepository.existsByEmail(dto.usuario().email())) {
            throw new IllegalArgumentException("E-mail já cadastrado no sistema.");
        }

        // 2. Instancia o usuário e criptografa a senha usando BCrypt
        Usuario usuario = new Usuario();
        usuario.setNome(dto.usuario().nome());
        usuario.setEmail(dto.usuario().email());
        
        // 🔒 CRIPTOGRAFIA DA SENHA AQUI
        String senhaCriptografada = passwordEncoder.encode(dto.usuario().senha());
        usuario.setSenha(senhaCriptografada);

        usuario.setDataNascimento(dto.usuario().data_nascimento());
        usuario.setTelefone(dto.usuario().telefone());
        usuario.setQntGestacao(Math.max(0, dto.usuario().qnt_gestacao() == null
                ? 0 : dto.usuario().qnt_gestacao()));

        // 3. Salva a tupla na tabela 'usuario' do MySQL
        Usuario usuarioSalvo = usuarioRepository.save(usuario);

        // 4. Se houver dados de gestação, salva vinculando ao ID do usuário
        if (dto.gestacao() != null) {
            if (dto.gestacao().ultima_mestruacao() == null
                    || dto.gestacao().ultima_mestruacao().isAfter(LocalDate.now())) {
                throw new IllegalArgumentException("A DUM é obrigatória e não pode estar no futuro.");
            }
            if (dto.gestacao().idade_gestacional() != null
                    && (dto.gestacao().idade_gestacional() < 0
                    || dto.gestacao().idade_gestacional() > 42)) {
                throw new IllegalArgumentException("A idade gestacional deve estar entre 0 e 42 semanas.");
            }
            Gestacao gestacao = new Gestacao();
            gestacao.setUsuario(usuarioSalvo);
            gestacao.setUltimaMestruacao(dto.gestacao().ultima_mestruacao());
            gestacao.setIdadeGestacional(dto.gestacao().idade_gestacional());
            gestacao.setDataParto(dto.gestacao().ultima_mestruacao().plusDays(280));
            gestacao.setTipoGestacao(dto.gestacao().tipo_gestacao());
            gestacao.setPreNatal(dto.gestacao().pre_natal());

            gestacaoRepository.save(gestacao);
            usuario.setQntGestacao(usuario.getQntGestacao() + 1);
            usuarioRepository.save(usuario);
        }

        return usuarioSalvo;
    }

    public Usuario autenticar(String email, String senha) {
        if (email == null || senha == null) throw new IllegalArgumentException("E-mail ou senha inválidos.");
        Usuario usuario = usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("E-mail ou senha inválidos."));
        if (!passwordEncoder.matches(senha, usuario.getSenha())) throw new IllegalArgumentException("E-mail ou senha inválidos.");
        return usuario;
    }
}