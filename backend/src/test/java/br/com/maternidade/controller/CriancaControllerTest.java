package br.com.maternidade.controller;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import br.com.maternidade.dto.CriancaAcessoDTO;
import br.com.maternidade.dto.CriancaAtualizacaoDTO;
import br.com.maternidade.dto.CriancaCadastroDTO;
import br.com.maternidade.dto.CriancaDetalheDTO;
import br.com.maternidade.model.Crianca;
import br.com.maternidade.services.CriancaService;

@ExtendWith(MockitoExtension.class)
class CriancaControllerTest {

    @Mock
    private CriancaService criancaService;

    @InjectMocks
    private CriancaController criancaController;

    private MockMvc mockMvc;

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders.standaloneSetup(criancaController).build();
    }

    @Test
    @DisplayName("POST /api/criancas - Deve cadastrar criança com sucesso (201)")
    void deveCadastrarCriancaComSucesso() throws Exception {
        Crianca crianca = new Crianca();
        crianca.setIdCrianca(1);
        crianca.setNome("Lucas");
        crianca.setDataNascimento(LocalDate.of(2025, 5, 10));
        crianca.setHoraNascimento(LocalTime.of(10, 30));

        when(criancaService.cadastrarCrianca(any(CriancaCadastroDTO.class), eq("maria@example.com")))
                .thenReturn(crianca);

        var auth = new UsernamePasswordAuthenticationToken("maria@example.com", null, List.of());

        String json = """
            {
                "nome": "Lucas",
                "data_nascimento": "2025-05-10",
                "hora_nascimento": "10:30:00",
                "sexo": "M",
                "tipo_relacao": "MAE"
            }
        """;

        mockMvc.perform(post("/api/criancas")
                        .principal(auth)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.idCrianca").value(1))
                .andExpect(jsonPath("$.nome").value("Lucas"));
    }

    @Test
    @DisplayName("POST /api/criancas - Deve retornar 400 Bad Request ao falhar validação")
    void deveRetornar400AoFalharCadastro() throws Exception {
        when(criancaService.cadastrarCrianca(any(CriancaCadastroDTO.class), eq("maria@example.com")))
                .thenThrow(new IllegalArgumentException("Nome, data e hora de nascimento são obrigatórios."));

        var auth = new UsernamePasswordAuthenticationToken("maria@example.com", null, List.of());

        String json = """
            {
                "nome": "",
                "data_nascimento": "2025-05-10",
                "hora_nascimento": "10:30:00",
                "tipo_relacao": "MAE"
            }
        """;

        mockMvc.perform(post("/api/criancas")
                        .principal(auth)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$").value("Nome, data e hora de nascimento são obrigatórios."));
    }

    @Test
    @DisplayName("PUT /api/criancas/{id} - Deve atualizar os dados autorizados")
    void deveAtualizarCriancaAutorizada() throws Exception {
        Crianca crianca = new Crianca();
        crianca.setIdCrianca(1);
        crianca.setNome("Lucas atualizado");
        crianca.setDataNascimento(LocalDate.of(2025, 5, 10));
        crianca.setHoraNascimento(LocalTime.of(10, 30));
        when(criancaService.atualizarCrianca(eq(1), any(CriancaAtualizacaoDTO.class), eq("maria@example.com")))
                .thenReturn(crianca);

        var auth = new UsernamePasswordAuthenticationToken("maria@example.com", null, List.of());
        String json = """
            {
                "nome": "Lucas atualizado",
                "data_nascimento": "2025-05-10",
                "hora_nascimento": "10:30:00",
                "sexo": "M"
            }
        """;

        mockMvc.perform(put("/api/criancas/1")
                        .principal(auth)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.idCrianca").value(1))
                .andExpect(jsonPath("$.nome").value("Lucas atualizado"));
    }

    @Test
    @DisplayName("GET /api/criancas - Deve listar crianças com acesso do usuário autenticado (200)")
    void deveListarCriancasComAcesso() throws Exception {
        CriancaAcessoDTO dto = new CriancaAcessoDTO(
                1, "Lucas", LocalDate.of(2025, 5, 10), LocalTime.of(10, 30), "M", "PRINCIPAL", true);

        when(criancaService.listarPorUsuario("maria@example.com")).thenReturn(List.of(dto));

        var auth = new UsernamePasswordAuthenticationToken("maria@example.com", null, List.of());

        mockMvc.perform(get("/api/criancas").principal(auth))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].idCrianca").value(1))
                .andExpect(jsonPath("$[0].nome").value("Lucas"))
                .andExpect(jsonPath("$[0].tipoAcesso").value("PRINCIPAL"))
                .andExpect(jsonPath("$[0].podeEditar").value(true));
    }

    @Test
    @DisplayName("GET /api/criancas/{id} - Deve retornar perfil individual autorizado")
    void deveBuscarPerfilIndividualDaCrianca() throws Exception {
        when(criancaService.buscarDetalhe(7, "maria@example.com"))
                .thenReturn(new CriancaDetalheDTO(
                        7, "Sofia", LocalDate.of(2025, 6, 10), LocalTime.of(8, 30),
                        "F", new BigDecimal("3.20"), new BigDecimal("49.00"),
                        "Nascimento tranquilo.", 17, true));

        var auth = new UsernamePasswordAuthenticationToken("maria@example.com", null, List.of());

        mockMvc.perform(get("/api/criancas/7").principal(auth))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id_crianca").value(7))
                .andExpect(jsonPath("$.nome").value("Sofia"))
                .andExpect(jsonPath("$.idade_meses").value(17))
                .andExpect(jsonPath("$.pode_editar").value(true));
    }

    @Test
    @DisplayName("GET /api/criancas/{id} - Deve negar perfil sem vínculo ativo")
    void deveNegarPerfilSemAcesso() throws Exception {
        org.mockito.Mockito.doThrow(new org.springframework.security.access.AccessDeniedException("Sem acesso."))
                .when(criancaService).buscarDetalhe(7, "maria@example.com");

        var auth = new UsernamePasswordAuthenticationToken("maria@example.com", null, List.of());

        mockMvc.perform(get("/api/criancas/7").principal(auth))
                .andExpect(status().isForbidden())
                .andExpect(jsonPath("$").value("Sem acesso."));
    }

    @Test
    @DisplayName("POST /api/criancas/{id}/responsaveis - Deve adicionar responsável com sucesso (201)")
    void deveAdicionarResponsavelComSucesso() throws Exception {
        doNothing().when(criancaService).adicionarResponsavel(eq(1), eq(5), eq("maria@example.com"));

        var auth = new UsernamePasswordAuthenticationToken("maria@example.com", null, List.of());

        String json = """
            {
                "id_usuario": 5
            }
        """;

        mockMvc.perform(post("/api/criancas/1/responsaveis")
                        .principal(auth)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json))
                .andExpect(status().isCreated());
    }

    @Test
    @DisplayName("POST /api/criancas/{id}/responsaveis - Deve retornar 400 se usuário não for principal")
    void deveRetornar400AoAdicionarSemSerPrincipal() throws Exception {
        org.mockito.Mockito.doThrow(new IllegalArgumentException("Somente o responsável principal pode adicionar outro responsável."))
                .when(criancaService).adicionarResponsavel(eq(1), eq(5), eq("maria@example.com"));

        var auth = new UsernamePasswordAuthenticationToken("maria@example.com", null, List.of());

        String json = """
            {
                "id_usuario": 5
            }
        """;

        mockMvc.perform(post("/api/criancas/1/responsaveis")
                        .principal(auth)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$").value("Somente o responsável principal pode adicionar outro responsável."));
    }
}
