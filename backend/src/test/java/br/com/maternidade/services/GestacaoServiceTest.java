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

import br.com.maternidade.dto.GestacaoDTO;
import br.com.maternidade.model.Gestacao;
import br.com.maternidade.model.Usuario;
import br.com.maternidade.repository.GestacaoRepository;
import br.com.maternidade.repository.UsuarioRepository;

@ExtendWith(MockitoExtension.class)
class GestacaoServiceTest {

    @Mock
    private GestacaoRepository gestacaoRepository;

    @Mock
    private UsuarioRepository usuarioRepository;

    private GestacaoService gestacaoService;

    @BeforeEach
    void setUp() {
        gestacaoService = new GestacaoService(gestacaoRepository, usuarioRepository);
    }

    @Test
    void deveCadastrarGestacaoNormalizandoTipoEVinculandoUsuario() {
        LocalDate ultimaMestruacao = LocalDate.now().minusWeeks(12);
        Usuario usuario = usuario(7, 1);
        GestacaoDTO dto = new GestacaoDTO(
                ultimaMestruacao, 12, " gemeos ", " univitelino ", true);
        when(usuarioRepository.findByEmail("maria@example.com")).thenReturn(Optional.of(usuario));
        when(usuarioRepository.save(any(Usuario.class))).thenAnswer(invocation -> invocation.getArgument(0));
        when(gestacaoRepository.save(any(Gestacao.class))).thenAnswer(invocation -> invocation.getArgument(0));

        Gestacao gestacao = gestacaoService.cadastrarGestacao(dto, "maria@example.com");

        assertThat(gestacao.getUsuario()).isSameAs(usuario);
        assertThat(gestacao.getUltimaMestruacao()).isEqualTo(ultimaMestruacao);
        assertThat(gestacao.getIdadeGestacional()).isEqualTo(12);
        assertThat(gestacao.getDataParto()).isEqualTo(ultimaMestruacao.plusDays(280));
        assertThat(gestacao.getTipoGestacao()).isEqualTo("GEMEOS");
        assertThat(gestacao.getTipoGestacaoDetalhe()).isEqualTo("UNIVITELINO");
        assertThat(usuario.getQntGestacao()).isEqualTo(2);
        verify(usuarioRepository).save(usuario);
        verify(gestacaoRepository).save(gestacao);
    }

    @Test
    void deveCalcularIdadeGestacionalQuandoNaoInformada() {
        LocalDate ultimaMestruacao = LocalDate.now().minusWeeks(8);
        Usuario usuario = usuario(7, 0);
        GestacaoDTO dto = new GestacaoDTO(ultimaMestruacao, null, "UNICA", null, false);
        when(usuarioRepository.findByEmail("maria@example.com")).thenReturn(Optional.of(usuario));
        when(usuarioRepository.save(any(Usuario.class))).thenAnswer(invocation -> invocation.getArgument(0));
        when(gestacaoRepository.save(any(Gestacao.class))).thenAnswer(invocation -> invocation.getArgument(0));

        Gestacao gestacao = gestacaoService.cadastrarGestacao(dto, "maria@example.com");

        assertThat(gestacao.getIdadeGestacional()).isEqualTo(8);
        assertThat(usuario.getQntGestacao()).isEqualTo(1);
    }

    @Test
    void deveRejeitarDumNoFuturo() {
        GestacaoDTO dto = new GestacaoDTO(LocalDate.now().plusDays(1), 1, "UNICA", null, true);

        assertThatThrownBy(() -> gestacaoService.cadastrarGestacao(dto, "maria@example.com"))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessage("A DUM não pode estar no futuro.");
        verify(usuarioRepository, never()).findByEmail(any(String.class));
    }

    @Test
    void deveRejeitarTipoDeGestacaoMultiplaSemDetalhe() {
        GestacaoDTO dto = new GestacaoDTO(
                LocalDate.now().minusWeeks(10), 10, "GEMEOS", null, true);
        when(usuarioRepository.findByEmail("maria@example.com"))
                .thenReturn(Optional.of(usuario(7, 0)));

        assertThatThrownBy(() -> gestacaoService.cadastrarGestacao(dto, "maria@example.com"))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessage("Informe o tipo da gestação múltipla.");
        verify(usuarioRepository, never()).save(any(Usuario.class));
        verify(gestacaoRepository, never()).save(any(Gestacao.class));
    }

    @Test
    void deveRejeitarUsuarioAutenticadoInexistente() {
        GestacaoDTO dto = new GestacaoDTO(
                LocalDate.now().minusWeeks(10), 10, "UNICA", null, true);
        when(usuarioRepository.findByEmail("ausente@example.com")).thenReturn(Optional.empty());

        assertThatThrownBy(() -> gestacaoService.cadastrarGestacao(dto, "ausente@example.com"))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessage("Usuário autenticado não encontrado.");
    }

    private Usuario usuario(Integer id, Integer quantidadeGestacoes) {
        Usuario usuario = new Usuario();
        usuario.setIdUsuario(id);
        usuario.setEmail("maria@example.com");
        usuario.setQntGestacao(quantidadeGestacoes);
        return usuario;
    }
}