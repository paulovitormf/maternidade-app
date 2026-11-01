package br.com.maternidade.controller;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

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
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import br.com.maternidade.config.JwtService;
import br.com.maternidade.dto.UsuarioBuscaDTO;
import br.com.maternidade.dto.UsuarioCadastroDTO;
import br.com.maternidade.model.Usuario;
import br.com.maternidade.services.UsuarioService;

@ExtendWith(MockitoExtension.class)
class UsuarioControllerTest {

    @Mock
    private UsuarioService usuarioService;

    @Mock
    private JwtService jwtService;

    @InjectMocks
    private UsuarioController usuarioController;

    private MockMvc mockMvc;

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders.standaloneSetup(usuarioController).build();
    }

    @Test
    @DisplayName("POST /api/usuarios - Deve cadastrar usuário com sucesso (201)")
    void deveCadastrarUsuarioComSucesso() throws Exception {
        Usuario usuario = new Usuario();
        usuario.setIdUsuario(1);
        usuario.setNome("Maria Silva");
        usuario.setEmail("maria@example.com");

        when(usuarioService.cadastrarUsuario(any(UsuarioCadastroDTO.class))).thenReturn(usuario);

        String json = """
            {
                "usuario": {
                    "nome": "Maria Silva",
                    "email": "maria@example.com",
                    "senha": "senha-segura-123"
                }
            }
        """;

        mockMvc.perform(post("/api/usuarios")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id_usuario").value(1))
                .andExpect(jsonPath("$.nome").value("Maria Silva"))
                .andExpect(jsonPath("$.email").value("maria@example.com"));
    }

    @Test
    @DisplayName("POST /api/usuarios - Deve retornar 400 Bad Request quando serviço lançar IllegalArgumentException")
    void deveRetornar400AoFalharCadastro() throws Exception {
        when(usuarioService.cadastrarUsuario(any(UsuarioCadastroDTO.class)))
                .thenThrow(new IllegalArgumentException("E-mail já cadastrado no sistema."));

        String json = """
            {
                "usuario": {
                    "nome": "Maria Silva",
                    "email": "maria@example.com",
                    "senha": "senha-segura-123"
                }
            }
        """;

        mockMvc.perform(post("/api/usuarios")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$").value("E-mail já cadastrado no sistema."));
    }

    @Test
    @DisplayName("POST /api/usuarios/login - Deve autenticar com sucesso e retornar token (200)")
    void deveAutenticarComSucesso() throws Exception {
        Usuario usuario = new Usuario();
        usuario.setIdUsuario(1);
        usuario.setNome("Maria Silva");
        usuario.setEmail("maria@example.com");

        when(usuarioService.autenticar("maria@example.com", "senha-segura-123")).thenReturn(usuario);
        when(jwtService.generateToken("maria@example.com")).thenReturn("token-jwt-falso");

        String json = """
            {
                "email": "maria@example.com",
                "senha": "senha-segura-123"
            }
        """;

        mockMvc.perform(post("/api/usuarios/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").value("token-jwt-falso"))
                .andExpect(jsonPath("$.usuario.email").value("maria@example.com"));
    }

    @Test
    @DisplayName("POST /api/usuarios/login - Deve retornar 401 Unauthorized com credenciais incorretas")
    void deveRetornar401ComCredenciaisInvalidas() throws Exception {
        when(usuarioService.autenticar("maria@example.com", "senha-errada"))
                .thenThrow(new IllegalArgumentException("E-mail ou senha inválidos."));

        String json = """
            {
                "email": "maria@example.com",
                "senha": "senha-errada"
            }
        """;

        mockMvc.perform(post("/api/usuarios/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$").value("E-mail ou senha inválidos."));
    }

    @Test
    @DisplayName("GET /api/usuarios/busca - Deve buscar responsáveis com usuário autenticado (200)")
    void deveBuscarResponsaveis() throws Exception {
        UsuarioBuscaDTO buscaDTO = new UsuarioBuscaDTO(2, "Carlos Silva", "c***@example.com");
        when(usuarioService.buscarResponsaveis(eq("Carlos"), eq("maria@example.com")))
                .thenReturn(List.of(buscaDTO));

        var auth = new UsernamePasswordAuthenticationToken("maria@example.com", null, List.of());
        SecurityContextHolder.getContext().setAuthentication(auth);

        mockMvc.perform(get("/api/usuarios/busca")
                        .param("q", "Carlos")
                        .principal(auth))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].nome").value("Carlos Silva"))
                .andExpect(jsonPath("$[0].email_mascarado").value("c***@example.com"));

        SecurityContextHolder.clearContext();
    }
}
