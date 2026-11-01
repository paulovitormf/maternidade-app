package br.com.maternidade.controller;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
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
import org.springframework.test.util.ReflectionTestUtils;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import br.com.maternidade.model.JornadaDesenvolvimento;
import br.com.maternidade.services.JornadaDesenvolvimentoService;

@ExtendWith(MockitoExtension.class)
class JornadaDesenvolvimentoControllerTest {

    @Mock
    private JornadaDesenvolvimentoService service;

    @InjectMocks
    private JornadaDesenvolvimentoController controller;

    private MockMvc mockMvc;

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders.standaloneSetup(controller).build();
    }

    @Test
    @DisplayName("GET /api/jornadas-desenvolvimento - Deve retornar lista de marcos (200)")
    void deveRetornarListaDeMarcos() throws Exception {
        JornadaDesenvolvimento marco = new JornadaDesenvolvimento();
        ReflectionTestUtils.setField(marco, "idJornada", 1);
        ReflectionTestUtils.setField(marco, "titulo", "Primeiros Passos");
        ReflectionTestUtils.setField(marco, "idadeMinMeses", 12);

        when(service.listar()).thenReturn(List.of(marco));

        mockMvc.perform(get("/api/jornadas-desenvolvimento"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].idJornada").value(1))
                .andExpect(jsonPath("$[0].titulo").value("Primeiros Passos"))
                .andExpect(jsonPath("$[0].idadeMinMeses").value(12));
    }
}
