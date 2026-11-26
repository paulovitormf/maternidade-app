package br.com.maternidade.services;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import br.com.maternidade.model.EmailVerificacao;
import br.com.maternidade.model.Usuario;
import br.com.maternidade.repository.EmailVerificacaoRepository;
import br.com.maternidade.repository.UsuarioRepository;
import java.util.Optional;
import java.util.regex.Pattern;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class EmailVerificacaoServiceTest {

    @Mock
    private EmailVerificacaoRepository verificacaoRepository;

    @Mock
    private UsuarioRepository usuarioRepository;

    @Mock
    private EmailSender emailSender;

    private EmailVerificacaoService service;

    @BeforeEach
    void setUp() {
        service = new EmailVerificacaoService(
                verificacaoRepository, usuarioRepository, emailSender,
                "segredo-de-teste-com-tamanho-suficiente");
    }

    @Test
    void deveEnviarCodigoEValidarOEmailComCodigoDeUsoUnico() {
        Usuario usuario = new Usuario();
        usuario.setEmail("maria@example.com");
        usuario.setNome("Maria");
        when(verificacaoRepository.save(any(EmailVerificacao.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));
        ArgumentCaptor<String> codigoCaptor = ArgumentCaptor.forClass(String.class);

        service.iniciarVerificacao(usuario);

        ArgumentCaptor<EmailVerificacao> verificacaoCaptor = ArgumentCaptor.forClass(EmailVerificacao.class);
        verify(verificacaoRepository).save(verificacaoCaptor.capture());
        verify(emailSender).enviarCodigoVerificacao(
                org.mockito.ArgumentMatchers.eq(usuario.getEmail()),
                org.mockito.ArgumentMatchers.eq(usuario.getNome()),
                codigoCaptor.capture());
        String codigo = codigoCaptor.getValue();
        assertThat(codigo).matches(Pattern.compile("\\d{8}"));
        assertThat(verificacaoCaptor.getValue().getCodigoHash()).isNotEqualTo(codigo);

        when(verificacaoRepository.findByUsuarioEmail(usuario.getEmail()))
                .thenReturn(Optional.of(verificacaoCaptor.getValue()));

        assertThat(service.verificarCodigo(usuario.getEmail(), codigo)).isTrue();
        assertThat(usuario.isEmailVerificado()).isTrue();
        verify(usuarioRepository).save(usuario);
        verify(verificacaoRepository).delete(verificacaoCaptor.getValue());
    }

    @Test
    void devePersistirTentativaQuandoCodigoIncorreto() {
        Usuario usuario = new Usuario();
        usuario.setEmail("maria@example.com");
        EmailVerificacao verificacao = new EmailVerificacao();
        verificacao.setUsuario(usuario);
        verificacao.setCodigoHash("0".repeat(64));
        verificacao.setExpiraEm(java.time.LocalDateTime.now().plusMinutes(10));
        when(verificacaoRepository.findByUsuarioEmail(usuario.getEmail()))
                .thenReturn(Optional.of(verificacao));

        assertThat(service.verificarCodigo(usuario.getEmail(), "12345678")).isFalse();
        assertThat(verificacao.getTentativas()).isEqualTo(1);
        verify(verificacaoRepository).save(verificacao);
    }
}
