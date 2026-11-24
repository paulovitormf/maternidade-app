package br.com.maternidade.services;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.util.ReflectionTestUtils;

import br.com.maternidade.dto.CriancaCadastroDTO;
import br.com.maternidade.dto.CriancaAtualizacaoDTO;
import br.com.maternidade.dto.CriancaAcessoDTO;
import br.com.maternidade.model.Crianca;
import br.com.maternidade.model.Usuario;
import br.com.maternidade.model.UsuarioCrianca;
import br.com.maternidade.repository.CriancaRepository;
import br.com.maternidade.repository.UsuarioCriancaRepository;
import br.com.maternidade.repository.UsuarioRepository;

@ExtendWith(MockitoExtension.class)
class CriancaServiceTest {

    @Mock
    private CriancaRepository criancaRepository;

    @Mock
    private UsuarioCriancaRepository vinculoRepository;

    @Mock
    private UsuarioRepository usuarioRepository;

    private CriancaService criancaService;

    @BeforeEach
    void setUp() {
        criancaService = new CriancaService(criancaRepository, vinculoRepository, usuarioRepository);
    }

    @Test
    void deveCadastrarCriancaECriarVinculoComUsuario() {
        Usuario usuario = usuario(10);
        CriancaCadastroDTO dto = criancaDto("Ana", "MAE");
        when(usuarioRepository.findByEmail("maria@example.com")).thenReturn(Optional.of(usuario));
        when(criancaRepository.save(any(Crianca.class))).thenAnswer(invocation -> {
            Crianca crianca = invocation.getArgument(0);
            crianca.setIdCrianca(20);
            return crianca;
        });

        Crianca crianca = criancaService.cadastrarCrianca(dto, "maria@example.com");

        assertThat(crianca.getIdCrianca()).isEqualTo(20);
        assertThat(crianca.getNome()).isEqualTo("Ana");
        assertThat(crianca.getDataNascimento()).isEqualTo(dto.data_nascimento());
        assertThat(crianca.getHoraNascimento()).isEqualTo(dto.hora_nascimento());
        assertThat(crianca.getPesoNascimento()).isEqualByComparingTo(dto.peso_nascimento());
        assertThat(crianca.getAlturaNascimento()).isEqualByComparingTo(dto.altura_nascimento());

        ArgumentCaptor<UsuarioCrianca> vinculoCaptor = ArgumentCaptor.forClass(UsuarioCrianca.class);
        verify(vinculoRepository).save(vinculoCaptor.capture());
        UsuarioCrianca vinculo = vinculoCaptor.getValue();
        assertThat(ReflectionTestUtils.getField(vinculo, "idUsuario")).isEqualTo(10);
        assertThat(ReflectionTestUtils.getField(vinculo, "idCrianca")).isEqualTo(20);
        assertThat(ReflectionTestUtils.getField(vinculo, "tipoRelacao")).isEqualTo("MAE");
    }

    @Test
    void deveRejeitarCadastroDeCriancaSemDadosObrigatorios() {
        CriancaCadastroDTO dto = new CriancaCadastroDTO(
                null, LocalDate.now().minusDays(1), LocalTime.NOON, "F", null, null, null, "MAE");

        assertThatThrownBy(() -> criancaService.cadastrarCrianca(dto, "maria@example.com"))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessage("Nome, data e hora de nascimento são obrigatórios.");
        verify(usuarioRepository, never()).findByEmail(any(String.class));
    }

    @Test
    void deveRejeitarDataDeNascimentoNoFuturo() {
        CriancaCadastroDTO dto = new CriancaCadastroDTO(
            "Ana", LocalDate.now().plusDays(1), LocalTime.NOON, "F",
            new BigDecimal("3.25"), new BigDecimal("0.50"), "Nascimento saudável", "MAE");

        assertThatThrownBy(() -> criancaService.cadastrarCrianca(dto, "maria@example.com"))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessage("A data de nascimento não pode estar no futuro.");
        verify(usuarioRepository, never()).findByEmail(any(String.class));
    }

    @Test
    void deveRejeitarPesoNegativo() {
        CriancaCadastroDTO dto = new CriancaCadastroDTO(
                "Ana", LocalDate.now().minusDays(1), LocalTime.NOON, "F",
                new BigDecimal("-0.10"), new BigDecimal("0.50"), null, "MAE");

        assertThatThrownBy(() -> criancaService.cadastrarCrianca(dto, "maria@example.com"))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessage("Peso e altura não podem ser negativos.");
        verify(usuarioRepository, never()).findByEmail(any(String.class));
    }

    @Test
    void deveRejeitarTipoDeRelacaoInvalido() {
        CriancaCadastroDTO dto = criancaDto("Ana", "IRMA");

        assertThatThrownBy(() -> criancaService.cadastrarCrianca(dto, "maria@example.com"))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessage("Tipo de relação inválido.");
        verify(usuarioRepository, never()).findByEmail(any(String.class));
    }

    @Test
    void deveAtualizarCriancaParaUsuarioComPermissao() {
        Usuario usuario = usuario(10);
        UsuarioCrianca vinculo = new UsuarioCrianca(10, 20, "RESPONSAVEL", "RESPONSAVEL", 11, true);
        Crianca crianca = new Crianca();
        crianca.setIdCrianca(20);
        crianca.setNome("Ana");
        when(usuarioRepository.findByEmail("maria@example.com")).thenReturn(Optional.of(usuario));
        when(vinculoRepository.findByIdUsuarioAndIdCriancaAndAtivo(10, 20, true))
                .thenReturn(Optional.of(vinculo));
        when(criancaRepository.findById(20)).thenReturn(Optional.of(crianca));
        when(criancaRepository.save(any(Crianca.class))).thenAnswer(invocation -> invocation.getArgument(0));
        CriancaAtualizacaoDTO dto = new CriancaAtualizacaoDTO(
                "Ana atualizada", LocalDate.now().minusMonths(3), LocalTime.of(9, 15),
                "F", new BigDecimal("3.40"), new BigDecimal("50.00"), "Observação atualizada");

        Crianca resultado = criancaService.atualizarCrianca(20, dto, "maria@example.com");

        assertThat(resultado.getNome()).isEqualTo("Ana atualizada");
        assertThat(resultado.getHoraNascimento()).isEqualTo(LocalTime.of(9, 15));
        assertThat(resultado.getObservacoes()).isEqualTo("Observação atualizada");
        verify(criancaRepository).save(crianca);
    }

    @Test
    void deveImpedirEdicaoPorResponsavelSemPermissao() {
        Usuario usuario = usuario(10);
        UsuarioCrianca vinculo = new UsuarioCrianca(10, 20, "RESPONSAVEL", "RESPONSAVEL", 11, false);
        when(usuarioRepository.findByEmail("maria@example.com")).thenReturn(Optional.of(usuario));
        when(vinculoRepository.findByIdUsuarioAndIdCriancaAndAtivo(10, 20, true))
                .thenReturn(Optional.of(vinculo));
        CriancaAtualizacaoDTO dto = new CriancaAtualizacaoDTO(
                "Ana atualizada", LocalDate.now().minusMonths(3), LocalTime.NOON,
                "F", null, null, null);

        assertThatThrownBy(() -> criancaService.atualizarCrianca(20, dto, "maria@example.com"))
                .isInstanceOf(org.springframework.security.access.AccessDeniedException.class)
                .hasMessage("Você não tem permissão para editar os dados desta criança.");
        verify(criancaRepository, never()).findById(20);
        verify(criancaRepository, never()).save(any(Crianca.class));
    }

    @Test
    void deveExcluirCriancaParaResponsavelComPermissao() {
        Usuario usuario = usuario(10);
        UsuarioCrianca vinculo = new UsuarioCrianca(10, 20, "RESPONSAVEL", "RESPONSAVEL", 11, true);
        Crianca crianca = new Crianca();
        crianca.setIdCrianca(20);
        when(usuarioRepository.findByEmail("maria@example.com")).thenReturn(Optional.of(usuario));
        when(vinculoRepository.findByIdUsuarioAndIdCriancaAndAtivo(10, 20, true))
                .thenReturn(Optional.of(vinculo));
        when(criancaRepository.findById(20)).thenReturn(Optional.of(crianca));

        criancaService.excluirCrianca(20, "maria@example.com");

        verify(criancaRepository).delete(crianca);
    }

    @Test
    void deveImpedirExclusaoPorResponsavelSemPermissao() {
        Usuario usuario = usuario(10);
        UsuarioCrianca vinculo = new UsuarioCrianca(10, 20, "RESPONSAVEL", "RESPONSAVEL", 11, false);
        when(usuarioRepository.findByEmail("maria@example.com")).thenReturn(Optional.of(usuario));
        when(vinculoRepository.findByIdUsuarioAndIdCriancaAndAtivo(10, 20, true))
                .thenReturn(Optional.of(vinculo));

        assertThatThrownBy(() -> criancaService.excluirCrianca(20, "maria@example.com"))
                .isInstanceOf(org.springframework.security.access.AccessDeniedException.class)
                .hasMessage("Você não tem permissão para excluir os dados desta criança.");
        verify(criancaRepository, never()).findById(20);
        verify(criancaRepository, never()).delete(any(Crianca.class));
    }

    @Test
    void deveAdicionarResponsavelAoPerfilDaCriancaCriadaPeloUsuario() {
        Usuario usuario = usuario(10);
        Usuario responsavel = usuario(11);
        when(usuarioRepository.findByEmail("maria@example.com")).thenReturn(Optional.of(usuario));
        when(vinculoRepository.existsByIdUsuarioAndIdCriancaAndTipoAcessoAndAtivo(10, 20, "PRINCIPAL", true))
                .thenReturn(true);
        when(usuarioRepository.findByIdUsuario(11)).thenReturn(Optional.of(responsavel));
        when(vinculoRepository.existsByIdUsuarioAndIdCrianca(11, 20)).thenReturn(false);

        criancaService.adicionarResponsavel(20, 11, "maria@example.com");

        ArgumentCaptor<UsuarioCrianca> vinculoCaptor = ArgumentCaptor.forClass(UsuarioCrianca.class);
        verify(vinculoRepository).save(vinculoCaptor.capture());
        UsuarioCrianca vinculo = vinculoCaptor.getValue();
        assertThat(ReflectionTestUtils.getField(vinculo, "idUsuario")).isEqualTo(11);
        assertThat(ReflectionTestUtils.getField(vinculo, "idCrianca")).isEqualTo(20);
        assertThat(ReflectionTestUtils.getField(vinculo, "tipoRelacao")).isEqualTo("RESPONSAVEL");
        assertThat(ReflectionTestUtils.getField(vinculo, "tipoAcesso")).isEqualTo("RESPONSAVEL");
        assertThat(ReflectionTestUtils.getField(vinculo, "concedidoPor")).isEqualTo(10);
        assertThat(ReflectionTestUtils.getField(vinculo, "podeEditar")).isEqualTo(false);
    }

    @Test
    void deveImpedirUsuarioSemVinculoPrincipalDeAdicionarResponsavel() {
        Usuario usuario = usuario(10);
        when(usuarioRepository.findByEmail("maria@example.com")).thenReturn(Optional.of(usuario));
        when(vinculoRepository.existsByIdUsuarioAndIdCriancaAndTipoAcessoAndAtivo(10, 20, "PRINCIPAL", true))
                .thenReturn(false);

        assertThatThrownBy(() -> criancaService.adicionarResponsavel(20, 11, "maria@example.com"))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessage("Somente o responsável principal pode adicionar outro responsável.");
        verify(vinculoRepository, never()).save(any(UsuarioCrianca.class));
    }

    @Test
    void deveRetornarPermissaoDeAcessoDaCriancaNaListagem() {
        Usuario usuario = usuario(11);
        CriancaAcessoDTO crianca = new CriancaAcessoDTO(
                20, "Ana", LocalDate.now().minusDays(1), LocalTime.NOON, "F", "RESPONSAVEL", false);
        when(usuarioRepository.findByEmail("maria@example.com")).thenReturn(Optional.of(usuario));
        when(criancaRepository.findByUsuarioId(11)).thenReturn(List.of(crianca));

        var resultado = criancaService.listarPorUsuario("maria@example.com");

        assertThat(resultado).containsExactly(crianca);
        assertThat(resultado.get(0).tipoAcesso()).isEqualTo("RESPONSAVEL");
        assertThat(resultado.get(0).podeEditar()).isFalse();
    }

    @Test
    void deveImpedirAdicionarUsuarioQueJaEstaVinculado() {
        Usuario usuario = usuario(10);
        Usuario responsavel = usuario(11);
        when(usuarioRepository.findByEmail("maria@example.com")).thenReturn(Optional.of(usuario));
        when(vinculoRepository.existsByIdUsuarioAndIdCriancaAndTipoAcessoAndAtivo(10, 20, "PRINCIPAL", true))
                .thenReturn(true);
        when(usuarioRepository.findByIdUsuario(11)).thenReturn(Optional.of(responsavel));
        when(vinculoRepository.existsByIdUsuarioAndIdCrianca(11, 20)).thenReturn(true);

        assertThatThrownBy(() -> criancaService.adicionarResponsavel(20, 11, "maria@example.com"))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessage("Este usuário já está vinculado a esta criança.");
        verify(vinculoRepository, never()).save(any(UsuarioCrianca.class));
    }

    private CriancaCadastroDTO criancaDto(String nome, String tipoRelacao) {
        return new CriancaCadastroDTO(
                nome, LocalDate.now().minusDays(1), LocalTime.NOON, "F",
                new BigDecimal("3.25"), new BigDecimal("0.50"), "Nascimento saudável", tipoRelacao);
    }

    private Usuario usuario(Integer id) {
        Usuario usuario = new Usuario();
        usuario.setIdUsuario(id);
        usuario.setEmail("maria@example.com");
        return usuario;
    }
}