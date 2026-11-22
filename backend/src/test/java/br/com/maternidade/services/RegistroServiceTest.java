package br.com.maternidade.services;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertSame;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.time.LocalDate;
import java.util.Optional;

import br.com.maternidade.dto.RegistroCadastroDTO;
import br.com.maternidade.model.Crianca;
import br.com.maternidade.model.Registro;
import br.com.maternidade.model.Usuario;
import br.com.maternidade.repository.CriancaRepository;
import br.com.maternidade.repository.GestacaoRepository;
import br.com.maternidade.repository.RegistroRepository;
import br.com.maternidade.repository.UsuarioCriancaRepository;
import br.com.maternidade.repository.UsuarioRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.access.AccessDeniedException;

@ExtendWith(MockitoExtension.class)
class RegistroServiceTest {
    @Mock private RegistroRepository registros;
    @Mock private UsuarioRepository usuarios;
    @Mock private CriancaRepository criancas;
    @Mock private GestacaoRepository gestacoes;
    @Mock private UsuarioCriancaRepository vinculos;
    @InjectMocks private RegistroService service;

    private Usuario usuaria;

    @BeforeEach
    void setUp() {
        usuaria = usuario(1, "mae@example.com");
        when(usuarios.findByEmail("mae@example.com")).thenReturn(Optional.of(usuaria));
    }

    @Test
    void criaRegistroUsandoUsuarioAutenticadoEValidandoVinculoEditavel() {
        Crianca crianca = new Crianca();
        crianca.setIdCrianca(4);
        crianca.setNome("Sofia");
        crianca.setDataNascimento(LocalDate.of(2025, 6, 10));
        when(vinculos.existsByIdUsuarioAndIdCriancaAndAtivoAndPodeEditar(1, 4, true, true))
                .thenReturn(true);
        when(criancas.existsById(4)).thenReturn(true);
        when(criancas.findById(4)).thenReturn(Optional.of(crianca));
        when(registros.save(any(Registro.class))).thenAnswer(invocation -> invocation.getArgument(0));

        Registro salvo = service.criar(dto(999, 4), "mae@example.com");

        assertSame(usuaria, salvo.getUsuario());
        assertSame(crianca, salvo.getCrianca());
        assertEquals("Consulta", salvo.getTitulo());
        verify(registros).save(salvo);
    }

    @Test
    void impedeCriarRegistroParaCriancaSemPermissaoDeEdicao() {
        when(vinculos.existsByIdUsuarioAndIdCriancaAndAtivoAndPodeEditar(1, 4, true, true))
                .thenReturn(false);

        assertThrows(AccessDeniedException.class,
                () -> service.criar(dto(1, 4), "mae@example.com"));

        verify(registros, never()).save(any(Registro.class));
    }

    @Test
    void impedeConsultarRegistrosDeOutroUsuario() {
        assertThrows(AccessDeniedException.class,
                () -> service.listar(2, "mae@example.com"));

        verify(registros, never()).findByUsuarioIdUsuarioOrderByDataRegistroDescHorarioDescCriadoEmDesc(any());
    }

    @Test
    void impedeEditarRegistroCriadoPorOutraPessoa() {
        Usuario outraPessoa = usuario(2, "outra@example.com");
        Registro existente = new Registro();
        existente.setUsuario(outraPessoa);
        when(registros.findById(10L)).thenReturn(Optional.of(existente));

        assertThrows(AccessDeniedException.class,
                () -> service.atualizar(10L, dto(1, 4), "mae@example.com"));

        verify(registros, never()).save(any(Registro.class));
    }

    private static RegistroCadastroDTO dto(Integer idUsuario, Integer idCrianca) {
        return new RegistroCadastroDTO(
                idUsuario, idCrianca, null, "CONSULTA", " Consulta ", null,
                null, null, null, false, LocalDate.of(2026, 11, 20), null, null);
    }

    private static Usuario usuario(Integer id, String email) {
        Usuario usuario = new Usuario();
        usuario.setIdUsuario(id);
        usuario.setEmail(email);
        usuario.setNome("Responsável");
        return usuario;
    }
}
