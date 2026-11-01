package br.com.maternidade.controller;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.time.LocalDate;
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

import br.com.maternidade.dto.GestacaoDTO;
import br.com.maternidade.model.Gestacao;
import br.com.maternidade.model.Usuario;
import br.com.maternidade.services.GestacaoService;

@ExtendWith(MockitoExtension.class)
class GestacaoControllerTest {

    @Mock
    private GestacaoService gestacaoService;

    @InjectMocks
    private GestacaoController gestacaoController;

    private MockMvc mockMvc;

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders.standaloneSetup(gestacaoController).build();
    }

    @Test
    @DisplayName("POST /api/gestacoes - Deve cadastrar gestação com sucesso (201)")
    void deveCadastrarGestacaoComSucesso() throws Exception {
        Usuario usuario = new Usuario();
        usuario.setIdUsuario(1);

        Gestacao gestacao = new Gestacao();
        gestacao.setIdGestacao(10);
        gestacao.setUsuario(usuario);
        gestacao.setUltimaMestruacao(LocalDate.of(2026, 1, 1));
        gestacao.setIdadeGestacional(12);
        gestacao.setDataParto(LocalDate.of(2026, 10, 8));
        gestacao.setTipoGestacao("UNICA");

        when(gestacaoService.cadastrarGestacao(any(GestacaoDTO.class), eq("maria@example.com")))
                .thenReturn(gestacao);

        var auth = new UsernamePasswordAuthenticationToken("maria@example.com", null, List.of());

        String json = """
            {
                "ultima_mestruacao": "2026-01-01",
                "idade_gestacional": 12,
                "tipo_gestacao": "UNICA",
                "pre_natal": true
            }
        """;

        mockMvc.perform(post("/api/gestacoes")
                        .principal(auth)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id_gestacao").value(10))
                .andExpect(jsonPath("$.tipo_gestacao").value("UNICA"));
    }

    @Test
    @DisplayName("POST /api/gestacoes - Deve retornar 400 Bad Request ao falhar validação")
    void deveRetornar400AoFalharCadastro() throws Exception {
        when(gestacaoService.cadastrarGestacao(any(GestacaoDTO.class), eq("maria@example.com")))
                .thenThrow(new IllegalArgumentException("A DUM não pode estar no futuro."));

        var auth = new UsernamePasswordAuthenticationToken("maria@example.com", null, List.of());

        String json = """
            {
                "ultima_mestruacao": "2027-01-01",
                "idade_gestacional": 12,
                "tipo_gestacao": "UNICA",
                "pre_natal": true
            }
        """;

        mockMvc.perform(post("/api/gestacoes")
                        .principal(auth)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$").value("A DUM não pode estar no futuro."));
    }

    @Test
    @DisplayName("GET /api/gestacoes - Deve listar gestações do usuário autenticado (200)")
    void deveListarGestacoesDoUsuario() throws Exception {
        Usuario usuario = new Usuario();
        usuario.setIdUsuario(1);

        Gestacao gestacao = new Gestacao();
        gestacao.setIdGestacao(10);
        gestacao.setUsuario(usuario);
        gestacao.setUltimaMestruacao(LocalDate.of(2026, 1, 1));
        gestacao.setIdadeGestacional(12);
        gestacao.setDataParto(LocalDate.of(2026, 10, 8));
        gestacao.setTipoGestacao("UNICA");

        when(gestacaoService.buscarUsuarioAutenticado("maria@example.com")).thenReturn(usuario);
        when(gestacaoService.listarPorUsuario(1)).thenReturn(List.of(gestacao));

        var auth = new UsernamePasswordAuthenticationToken("maria@example.com", null, List.of());

        mockMvc.perform(get("/api/gestacoes").principal(auth))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id_gestacao").value(10))
                .andExpect(jsonPath("$[0].tipo_gestacao").value("UNICA"));
    }

    @Test
    @DisplayName("PUT /api/gestacoes/{id} - Deve atualizar gestação com sucesso (200)")
    void deveAtualizarGestacaoComSucesso() throws Exception {
        Usuario usuario = new Usuario();
        usuario.setIdUsuario(1);

        Gestacao gestacao = new Gestacao();
        gestacao.setIdGestacao(10);
        gestacao.setUsuario(usuario);
        gestacao.setUltimaMestruacao(LocalDate.of(2026, 1, 1));
        gestacao.setIdadeGestacional(14);
        gestacao.setDataParto(LocalDate.of(2026, 10, 8));
        gestacao.setTipoGestacao("GEMEOS");

        when(gestacaoService.atualizarGestacao(eq(10), any(GestacaoDTO.class), eq("maria@example.com")))
                .thenReturn(gestacao);

        var auth = new UsernamePasswordAuthenticationToken("maria@example.com", null, List.of());

        String json = """
            {
                "ultima_mestruacao": "2026-01-01",
                "idade_gestacional": 14,
                "tipo_gestacao": "GEMEOS",
                "tipo_gestacao_detalhe": "UNIVITELINO",
                "pre_natal": true
            }
        """;

        mockMvc.perform(put("/api/gestacoes/10")
                        .principal(auth)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id_gestacao").value(10))
                .andExpect(jsonPath("$.tipo_gestacao").value("GEMEOS"));
    }

    @Test
    @DisplayName("PUT /api/gestacoes/{id} - Deve retornar 400 se gestação não pertencer ao usuário")
    void deveRetornar400SeGestacaoNaoPertencerAoUsuario() throws Exception {
        when(gestacaoService.atualizarGestacao(eq(10), any(GestacaoDTO.class), eq("maria@example.com")))
                .thenThrow(new IllegalArgumentException("Gestação não encontrada."));

        var auth = new UsernamePasswordAuthenticationToken("maria@example.com", null, List.of());

        String json = """
            {
                "ultima_mestruacao": "2026-01-01",
                "idade_gestacional": 14,
                "tipo_gestacao": "UNICA"
            }
        """;

        mockMvc.perform(put("/api/gestacoes/10")
                        .principal(auth)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$").value("Gestação não encontrada."));
    }
}
