package br.com.maternidade.services;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.time.LocalDate;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import br.com.maternidade.dto.UsuarioCadastroDTO;
import br.com.maternidade.model.Gestacao;
import br.com.maternidade.model.Usuario;
import br.com.maternidade.repository.GestacaoRepository;
import br.com.maternidade.repository.UsuarioRepository;

@ExtendWith(MockitoExtension.class)
class UsuarioServiceTest {

    @Mock
    private UsuarioRepository usuarioRepository;

    @Mock
    private GestacaoRepository gestacaoRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    private UsuarioService usuarioService;

    @BeforeEach
    void setUp() {
        usuarioService = new UsuarioService(usuarioRepository, gestacaoRepository, passwordEncoder);
    }

    @Test
    void deveCadastrarUsuarioComEmailNormalizadoESenhaCriptografada() {
        UsuarioCadastroDTO dto = usuarioDto("Maria", " MARIA@EXAMPLE.COM ", "senha-segura");
        when(usuarioRepository.existsByEmail("maria@example.com")).thenReturn(false);
        when(passwordEncoder.encode("senha-segura")).thenReturn("senha-criptografada");
        when(usuarioRepository.save(any(Usuario.class))).thenAnswer(invocation -> invocation.getArgument(0));

        Usuario usuario = usuarioService.cadastrarUsuario(dto);

        assertThat(usuario.getNome()).isEqualTo("Maria");
        assertThat(usuario.getEmail()).isEqualTo("maria@example.com");
        assertThat(usuario.getSenha()).isEqualTo("senha-criptografada");
        assertThat(usuario.getQntGestacao()).isZero();
        verify(usuarioRepository).existsByEmail("maria@example.com");
        verify(passwordEncoder).encode("senha-segura");
    }

    @Test
    void deveCadastrarGestacaoEAtualizarQuantidadeDeGestacoes() {
        LocalDate ultimaMestruacao = LocalDate.now().minusWeeks(10);
        UsuarioCadastroDTO dto = new UsuarioCadastroDTO(
                new UsuarioCadastroDTO.UsuarioData(
                        "Maria", "maria@example.com", "senha-segura", null, null, 0),
                new UsuarioCadastroDTO.GestacaoData(
                        ultimaMestruacao, 10, "UNICA", true));
        when(usuarioRepository.existsByEmail("maria@example.com")).thenReturn(false);
        when(passwordEncoder.encode("senha-segura")).thenReturn("senha-criptografada");
        when(usuarioRepository.save(any(Usuario.class))).thenAnswer(invocation -> invocation.getArgument(0));

        Usuario usuario = usuarioService.cadastrarUsuario(dto);

        ArgumentCaptor<Gestacao> gestacaoCaptor = ArgumentCaptor.forClass(Gestacao.class);
        verify(gestacaoRepository).save(gestacaoCaptor.capture());
        Gestacao gestacao = gestacaoCaptor.getValue();

        assertThat(usuario.getQntGestacao()).isEqualTo(1);
        assertThat(gestacao.getUsuario()).isSameAs(usuario);
        assertThat(gestacao.getUltimaMestruacao()).isEqualTo(ultimaMestruacao);
        assertThat(gestacao.getIdadeGestacional()).isEqualTo(10);
        assertThat(gestacao.getDataParto()).isEqualTo(ultimaMestruacao.plusDays(280));
    }

    @Test
    void deveRejeitarCadastroSemDadosObrigatorios() {
        UsuarioCadastroDTO dto = new UsuarioCadastroDTO(null, null);

        assertThatThrownBy(() -> usuarioService.cadastrarUsuario(dto))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessage("Nome, e-mail e senha são obrigatórios.");
        verify(usuarioRepository, never()).save(any(Usuario.class));
    }

    @Test
    void deveRejeitarSenhaComMenosDeOitoCaracteres() {
        UsuarioCadastroDTO dto = usuarioDto("Maria", "maria@example.com", "1234567");

        assertThatThrownBy(() -> usuarioService.cadastrarUsuario(dto))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessage("A senha deve ter pelo menos 8 caracteres.");
        verify(usuarioRepository, never()).existsByEmail(any(String.class));
    }

    @Test
    void deveRejeitarEmailInvalido() {
        UsuarioCadastroDTO dto = usuarioDto("Maria", "maria", "senha-segura");

        assertThatThrownBy(() -> usuarioService.cadastrarUsuario(dto))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessage("E-mail inválido.");
        verify(usuarioRepository, never()).existsByEmail(any(String.class));
    }

    @Test
    void deveRejeitarEmailDuplicado() {
        UsuarioCadastroDTO dto = usuarioDto("Maria", "maria@example.com", "senha-segura");
        when(usuarioRepository.existsByEmail("maria@example.com")).thenReturn(true);

        assertThatThrownBy(() -> usuarioService.cadastrarUsuario(dto))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessage("E-mail já cadastrado no sistema.");
        verify(passwordEncoder, never()).encode(any(String.class));
        verify(usuarioRepository, never()).save(any(Usuario.class));
    }

    @Test
    void deveAutenticarUsuarioComEmailNormalizado() {
        Usuario usuario = new Usuario();
        usuario.setEmail("maria@example.com");
        usuario.setSenha("senha-criptografada");
        when(usuarioRepository.findByEmail("maria@example.com")).thenReturn(Optional.of(usuario));
        when(passwordEncoder.matches("senha-segura", "senha-criptografada")).thenReturn(true);

        Usuario usuarioAutenticado = usuarioService.autenticar(" MARIA@EXAMPLE.COM ", "senha-segura");

        assertThat(usuarioAutenticado).isSameAs(usuario);
        verify(usuarioRepository).findByEmail("maria@example.com");
        verify(passwordEncoder).matches("senha-segura", "senha-criptografada");
    }

    @Test
    void deveRejeitarLoginComUsuarioInexistente() {
        when(usuarioRepository.findByEmail("maria@example.com")).thenReturn(Optional.empty());

        assertThatThrownBy(() -> usuarioService.autenticar("maria@example.com", "senha-segura"))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessage("E-mail ou senha inválidos.");
        verify(passwordEncoder, never()).matches(any(String.class), any(String.class));
    }

    @Test
    void deveRejeitarLoginComSenhaIncorreta() {
        Usuario usuario = new Usuario();
        usuario.setEmail("maria@example.com");
        usuario.setSenha("senha-criptografada");
        when(usuarioRepository.findByEmail("maria@example.com")).thenReturn(Optional.of(usuario));
        when(passwordEncoder.matches("senha-incorreta", "senha-criptografada")).thenReturn(false);

        assertThatThrownBy(() -> usuarioService.autenticar("maria@example.com", "senha-incorreta"))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessage("E-mail ou senha inválidos.");
    }

    @Test
    void deveRejeitarLoginComCredenciaisNulas() {
        assertThatThrownBy(() -> usuarioService.autenticar(null, null))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessage("E-mail ou senha inválidos.");
        verify(usuarioRepository, never()).findByEmail(any(String.class));
    }

    private UsuarioCadastroDTO usuarioDto(String nome, String email, String senha) {
        return new UsuarioCadastroDTO(
                new UsuarioCadastroDTO.UsuarioData(nome, email, senha, null, null, 0),
                null);
    }
}