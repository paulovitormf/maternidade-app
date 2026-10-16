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
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.util.ReflectionTestUtils;

import br.com.maternidade.dto.CriancaCadastroDTO;
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