package br.com.maternidade.services;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
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

    @Test
    @DisplayName("Deve cadastrar gestação com trigêmeos ou mais e detalhe bivitelino")
    void deveCadastrarGestacaoTrigemeosOuMais() {
        LocalDate ultimaMestruacao = LocalDate.now().minusWeeks(6);
        Usuario usuario = usuario(1, 0);
        GestacaoDTO dto = new GestacaoDTO(
                ultimaMestruacao, 6, "TRIGEMEOS_OU_MAIS", "BIVITELINO", true);
        when(usuarioRepository.findByEmail("maria@example.com")).thenReturn(Optional.of(usuario));
        when(usuarioRepository.save(any(Usuario.class))).thenAnswer(invocation -> invocation.getArgument(0));
        when(gestacaoRepository.save(any(Gestacao.class))).thenAnswer(invocation -> invocation.getArgument(0));

        Gestacao gestacao = gestacaoService.cadastrarGestacao(dto, "maria@example.com");

        assertThat(gestacao.getTipoGestacao()).isEqualTo("TRIGEMEOS_OU_MAIS");
        assertThat(gestacao.getTipoGestacaoDetalhe()).isEqualTo("BIVITELINO");
    }

    @Test
    @DisplayName("Deve aceitar tipo AINDA_NAO_SEI sem detalhe")
    void deveCadastrarTipoAindaNaoSeiSemDetalhe() {
        LocalDate ultimaMestruacao = LocalDate.now().minusWeeks(4);
        Usuario usuario = usuario(1, 0);
        GestacaoDTO dto = new GestacaoDTO(
                ultimaMestruacao, 4, "AINDA_NAO_SEI", null, false);
        when(usuarioRepository.findByEmail("maria@example.com")).thenReturn(Optional.of(usuario));
        when(usuarioRepository.save(any(Usuario.class))).thenAnswer(invocation -> invocation.getArgument(0));
        when(gestacaoRepository.save(any(Gestacao.class))).thenAnswer(invocation -> invocation.getArgument(0));

        Gestacao gestacao = gestacaoService.cadastrarGestacao(dto, "maria@example.com");

        assertThat(gestacao.getTipoGestacao()).isEqualTo("AINDA_NAO_SEI");
        assertThat(gestacao.getTipoGestacaoDetalhe()).isNull();
    }

    @Test
    @DisplayName("Deve rejeitar detalhe quando gestação é única")
    void deveRejeitarDetalheQuandoGestacaoUnica() {
        LocalDate ultimaMestruacao = LocalDate.now().minusWeeks(4);
        Usuario usuario = usuario(1, 0);
        GestacaoDTO dto = new GestacaoDTO(
                ultimaMestruacao, 4, "UNICA", "UNIVITELINO", true);
        when(usuarioRepository.findByEmail("maria@example.com")).thenReturn(Optional.of(usuario));

        assertThatThrownBy(() -> gestacaoService.cadastrarGestacao(dto, "maria@example.com"))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessage("O detalhe só se aplica a gestações múltiplas.");
    }

    @Test
    @DisplayName("Deve rejeitar idade gestacional menor que zero ou maior que 42")
    void deveRejeitarIdadeGestacionalInvalida() {
        LocalDate ultimaMestruacao = LocalDate.now().minusWeeks(4);
        GestacaoDTO dtoMenor = new GestacaoDTO(ultimaMestruacao, -1, "UNICA", null, true);
        GestacaoDTO dtoMaior = new GestacaoDTO(ultimaMestruacao, 43, "UNICA", null, true);

        assertThatThrownBy(() -> gestacaoService.cadastrarGestacao(dtoMenor, "maria@example.com"))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessage("A idade gestacional deve estar entre 0 e 42 semanas.");

        assertThatThrownBy(() -> gestacaoService.cadastrarGestacao(dtoMaior, "maria@example.com"))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessage("A idade gestacional deve estar entre 0 e 42 semanas.");
    }

    @Test
    @DisplayName("Deve rejeitar cadastro quando dto ou email autenticado for nulo ou vazio")
    void deveRejeitarCadastroSemDtoOuEmail() {
        assertThatThrownBy(() -> gestacaoService.cadastrarGestacao(null, "maria@example.com"))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessage("Usuário autenticado é obrigatório.");

        assertThatThrownBy(() -> gestacaoService.cadastrarGestacao(new GestacaoDTO(LocalDate.now(), null, "UNICA", null, false), null))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessage("Usuário autenticado é obrigatório.");

        assertThatThrownBy(() -> gestacaoService.cadastrarGestacao(new GestacaoDTO(LocalDate.now(), null, "UNICA", null, false), "  "))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessage("Usuário autenticado é obrigatório.");
    }

    @Test
    @DisplayName("Deve rejeitar cadastro quando DUM for nula")
    void deveRejeitarCadastroComDumNula() {
        GestacaoDTO dto = new GestacaoDTO(null, 10, "UNICA", null, false);
        assertThatThrownBy(() -> gestacaoService.cadastrarGestacao(dto, "maria@example.com"))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessage("DUM é obrigatória.");
    }

    @Test
    @DisplayName("Deve atualizar gestação com sucesso")
    void deveAtualizarGestacaoComSucesso() {
        Usuario usuario = usuario(7, 1);
        Gestacao existente = new Gestacao();
        existente.setIdGestacao(10);
        existente.setUsuario(usuario);
        existente.setUltimaMestruacao(LocalDate.now().minusWeeks(10));

        when(usuarioRepository.findByEmail("maria@example.com")).thenReturn(Optional.of(usuario));
        when(gestacaoRepository.findById(10)).thenReturn(Optional.of(existente));
        when(gestacaoRepository.save(any(Gestacao.class))).thenAnswer(invocation -> invocation.getArgument(0));

        LocalDate novaDum = LocalDate.now().minusWeeks(14);
        GestacaoDTO dto = new GestacaoDTO(novaDum, 14, "UNICA", null, true);

        Gestacao atualizada = gestacaoService.atualizarGestacao(10, dto, "maria@example.com");

        assertThat(atualizada.getIdadeGestacional()).isEqualTo(14);
        assertThat(atualizada.getUltimaMestruacao()).isEqualTo(novaDum);
        assertThat(atualizada.getPreNatal()).isTrue();
        verify(gestacaoRepository).save(existente);
    }

    @Test
    @DisplayName("Deve impedir atualização de gestação pertencente a outro usuário")
    void deveImpedirAtualizacaoDeGestacaoDeOutroUsuario() {
        Usuario usuario = usuario(7, 1);
        Usuario outroUsuario = usuario(8, 1);

        Gestacao existente = new Gestacao();
        existente.setIdGestacao(10);
        existente.setUsuario(outroUsuario);

        when(usuarioRepository.findByEmail("maria@example.com")).thenReturn(Optional.of(usuario));
        when(gestacaoRepository.findById(10)).thenReturn(Optional.of(existente));

        GestacaoDTO dto = new GestacaoDTO(LocalDate.now().minusWeeks(14), 14, "UNICA", null, true);

        assertThatThrownBy(() -> gestacaoService.atualizarGestacao(10, dto, "maria@example.com"))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessage("Gestação não encontrada.");
        verify(gestacaoRepository, never()).save(any(Gestacao.class));
    }

    @Test
    @DisplayName("Deve excluir gestação própria e atualizar quantidade")
    void deveExcluirGestacaoPropria() {
        Usuario usuario = usuario(7, 2);
        Gestacao gestacao = new Gestacao();
        gestacao.setIdGestacao(10);
        gestacao.setUsuario(usuario);
        when(usuarioRepository.findByEmail("maria@example.com")).thenReturn(Optional.of(usuario));
        when(gestacaoRepository.findById(10)).thenReturn(Optional.of(gestacao));

        gestacaoService.excluirGestacao(10, "maria@example.com");

        assertThat(usuario.getQntGestacao()).isEqualTo(1);
        verify(usuarioRepository).save(usuario);
        verify(gestacaoRepository).delete(gestacao);
    }

    @Test
    @DisplayName("Deve impedir exclusão de gestação pertencente a outro usuário")
    void deveImpedirExclusaoDeGestacaoDeOutroUsuario() {
        Usuario usuario = usuario(7, 1);
        Gestacao gestacao = new Gestacao();
        gestacao.setIdGestacao(10);
        gestacao.setUsuario(usuario(8, 1));
        when(usuarioRepository.findByEmail("maria@example.com")).thenReturn(Optional.of(usuario));
        when(gestacaoRepository.findById(10)).thenReturn(Optional.of(gestacao));

        assertThatThrownBy(() -> gestacaoService.excluirGestacao(10, "maria@example.com"))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessage("Gestação não encontrada.");
        verify(usuarioRepository, never()).save(any(Usuario.class));
        verify(gestacaoRepository, never()).delete(any(Gestacao.class));
    }

    @Test
    @DisplayName("Deve listar gestações ordenadas por usuário")
    void deveListarPorUsuario() {
        Gestacao g1 = new Gestacao();
        when(gestacaoRepository.findByUsuarioIdUsuarioOrderByUltimaMestruacaoDesc(7))
                .thenReturn(List.of(g1));

        List<Gestacao> lista = gestacaoService.listarPorUsuario(7);

        assertThat(lista).containsExactly(g1);
    }

    @Test
    @DisplayName("Deve buscar gestação mais recente por usuário")
    void deveBuscarMaisRecentePorUsuario() {
        Gestacao g1 = new Gestacao();
        when(gestacaoRepository.findFirstByUsuarioIdUsuarioOrderByIdGestacaoDesc(7))
                .thenReturn(Optional.of(g1));

        Gestacao resultado = gestacaoService.buscarMaisRecentePorUsuario(7);

        assertThat(resultado).isSameAs(g1);
    }

    @Test
    @DisplayName("Deve lançar erro ao buscar gestação mais recente quando não existir")
    void deveLancarErroAoBuscarMaisRecenteInexistente() {
        when(gestacaoRepository.findFirstByUsuarioIdUsuarioOrderByIdGestacaoDesc(7))
                .thenReturn(Optional.empty());

        assertThatThrownBy(() -> gestacaoService.buscarMaisRecentePorUsuario(7))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessage("Nenhuma gestação cadastrada para o usuário ID: 7");
    }

    private Usuario usuario(Integer id, Integer quantidadeGestacoes) {
        Usuario usuario = new Usuario();
        usuario.setIdUsuario(id);
        usuario.setEmail("maria@example.com");
        usuario.setQntGestacao(quantidadeGestacoes);
        return usuario;
    }
}
