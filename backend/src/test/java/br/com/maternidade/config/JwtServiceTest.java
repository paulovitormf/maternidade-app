package br.com.maternidade.config;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.security.SignatureException;

class JwtServiceTest {

    private static final String SECRET_VALIDO = "segredo-super-secreto-com-mais-de-32-caracteres-12345";
    private JwtService jwtService;

    @BeforeEach
    void setUp() {
        jwtService = new JwtService(SECRET_VALIDO, 60_000L); // 1 minuto
    }

    @Test
    @DisplayName("Deve gerar token e extrair email do subject com sucesso")
    void deveGerarETrazerSubject() {
        String email = "maria@example.com";
        String token = jwtService.generateToken(email);

        assertThat(token).isNotBlank();
        assertThat(jwtService.extractSubject(token)).isEqualTo(email);
    }

    @Test
    @DisplayName("Deve falhar ao inicializar JwtService com segredo menor que 32 caracteres")
    void deveRejeitarSegredoCurto() {
        assertThatThrownBy(() -> new JwtService("curto", 60_000L))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessage("JWT_SECRET deve ter pelo menos 32 caracteres.");
    }

    @Test
    @DisplayName("Deve lançar exceção ao extrair subject de token expirado")
    void deveLancarExcecaoTokenExpirado() {
        JwtService expiradoService = new JwtService(SECRET_VALIDO, -1000L); // expirado no passado
        String token = expiradoService.generateToken("maria@example.com");

        assertThatThrownBy(() -> jwtService.extractSubject(token))
                .isInstanceOf(ExpiredJwtException.class);
    }

    @Test
    @DisplayName("Deve lançar exceção ao extrair subject de token inválido")
    void deveLancarExcecaoTokenInvalido() {
        assertThatThrownBy(() -> jwtService.extractSubject("token.invalido.aqui"))
                .isInstanceOf(Exception.class);
    }

    @Test
    @DisplayName("Deve lançar exceção ao extrair subject assinado com segredo diferente")
    void deveLancarExcecaoSegredoDiferente() {
        JwtService outroService = new JwtService("outro-segredo-super-secreto-com-mais-de-32-caracteres-xyz", 60_000L);
        String token = outroService.generateToken("maria@example.com");

        assertThatThrownBy(() -> jwtService.extractSubject(token))
                .isInstanceOf(SignatureException.class);
    }
}
