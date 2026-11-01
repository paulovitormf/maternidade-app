package br.com.maternidade.services;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.List;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.util.ReflectionTestUtils;

import br.com.maternidade.model.JornadaDesenvolvimento;
import br.com.maternidade.repository.JornadaDesenvolvimentoRepository;

@ExtendWith(MockitoExtension.class)
class JornadaDesenvolvimentoServiceTest {

    @Mock
    private JornadaDesenvolvimentoRepository repository;

    @InjectMocks
    private JornadaDesenvolvimentoService service;

    @Test
    @DisplayName("Deve listar marcos ordenados por idade mínima em meses e título")
    void deveListarMarcosOrdenados() {
        JornadaDesenvolvimento marco1 = new JornadaDesenvolvimento();
        ReflectionTestUtils.setField(marco1, "idJornada", 1);
        ReflectionTestUtils.setField(marco1, "titulo", "Primeiro Sorriso");
        ReflectionTestUtils.setField(marco1, "idadeMinMeses", 2);

        JornadaDesenvolvimento marco2 = new JornadaDesenvolvimento();
        ReflectionTestUtils.setField(marco2, "idJornada", 2);
        ReflectionTestUtils.setField(marco2, "titulo", "Segurar Objetos");
        ReflectionTestUtils.setField(marco2, "idadeMinMeses", 4);

        when(repository.findAllByOrderByIdadeMinMesesAscTituloAsc()).thenReturn(List.of(marco1, marco2));

        List<JornadaDesenvolvimento> resultado = service.listar();

        assertThat(resultado).hasSize(2);
        assertThat(resultado.get(0).getTitulo()).isEqualTo("Primeiro Sorriso");
        assertThat(resultado.get(0).getIdJornada()).isEqualTo(1);
        assertThat(resultado.get(0).getIdadeMinMeses()).isEqualTo(2);
        verify(repository).findAllByOrderByIdadeMinMesesAscTituloAsc();
    }
}
