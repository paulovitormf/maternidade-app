package br.com.maternidade.services;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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
        usuario.setQntGestacao(dto.usuario().qnt_gestacao());

        // 3. Salva a tupla na tabela 'usuario' do MySQL
        Usuario usuarioSalvo = usuarioRepository.save(usuario);

        // 4. Se houver dados de gestação, salva vinculando ao ID do usuário
        if (dto.gestacao() != null) {
            Gestacao gestacao = new Gestacao();
            gestacao.setUsuario(usuarioSalvo);
            gestacao.setUltimaMestruacao(dto.gestacao().ultima_mestruacao());
            gestacao.setIdadeGestacional(dto.gestacao().idade_gestacional());
            gestacao.setDataParto(dto.gestacao().data_parto());
            gestacao.setTipoGestacao(dto.gestacao().tipo_gestacao());
            gestacao.setPreNatal(dto.gestacao().pre_natal());

            gestacaoRepository.save(gestacao);
        }

        return usuarioSalvo;
    }
}