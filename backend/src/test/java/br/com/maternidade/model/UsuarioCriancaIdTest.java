package br.com.maternidade.model;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

class UsuarioCriancaIdTest {

    @Test
    @DisplayName("Deve validar igualdade e hashCode para chaves compostas iguais e diferentes")
    void deveValidarEqualsEHashCode() {
        UsuarioCriancaId id1 = new UsuarioCriancaId(1, 10);
        UsuarioCriancaId id2 = new UsuarioCriancaId(1, 10);
        UsuarioCriancaId id3 = new UsuarioCriancaId(2, 10);
        UsuarioCriancaId id4 = new UsuarioCriancaId(1, 20);

        assertThat(id1).isEqualTo(id2);
        assertThat(id1.hashCode()).isEqualTo(id2.hashCode());

        assertThat(id1).isNotEqualTo(id3);
        assertThat(id1).isNotEqualTo(id4);
        assertThat(id1).isNotEqualTo(null);
        assertThat(id1).isNotEqualTo("outroTipo");

        assertThat(id1.getIdUsuario()).isEqualTo(1);
        assertThat(id1.getIdCrianca()).isEqualTo(10);
    }
}
