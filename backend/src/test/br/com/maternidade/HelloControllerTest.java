package test.br.com.maternidade;

import br.com.maternidade.model.HelloMessage;
import br.com.maternidade.repository.HelloRepository;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Optional;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
public class HelloControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private HelloRepository repository;

    @Test
    public void deveRetornarMensagemHello() throws Exception {
        HelloMessage mockMessage = new HelloMessage(1L, "Olá Mundo Teste!");
        Mockito.when(repository.findById(1L)).thenReturn(Optional.of(mockMessage));

        mockMvc.perform(get("/api/hello"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.texto").value("Olá Mundo Teste!"));
    }
}