package br.com.maternidade.services;

import br.com.maternidade.model.EmailVerificacao;
import br.com.maternidade.model.Usuario;
import br.com.maternidade.repository.EmailVerificacaoRepository;
import br.com.maternidade.repository.UsuarioRepository;
import java.nio.charset.StandardCharsets;
import java.security.GeneralSecurityException;
import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.util.HexFormat;
import java.util.Locale;
import java.util.Optional;
import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class EmailVerificacaoService {

    private static final int MAX_TENTATIVAS = 5;
    private static final SecureRandom RANDOM = new SecureRandom();

    private final EmailVerificacaoRepository verificacaoRepository;
    private final UsuarioRepository usuarioRepository;
    private final EmailSender emailSender;
    private final String hashSecret;

    public EmailVerificacaoService(
            EmailVerificacaoRepository verificacaoRepository,
            UsuarioRepository usuarioRepository,
            EmailSender emailSender,
            @Value("${app.email-verification.hash-secret}") String hashSecret) {
        this.verificacaoRepository = verificacaoRepository;
        this.usuarioRepository = usuarioRepository;
        this.emailSender = emailSender;
        this.hashSecret = hashSecret;
    }

    @Transactional
    public void iniciarVerificacao(Usuario usuario) {
        enviarNovoCodigo(usuario, null);
    }

    @Transactional
    public void reenviarCodigo(String email) {
        String emailNormalizado = normalizarEmail(email);
        Optional<Usuario> usuarioEncontrado = usuarioRepository.findByEmail(emailNormalizado);
        if (usuarioEncontrado.isEmpty() || usuarioEncontrado.get().isEmailVerificado()) {
            return;
        }

        Usuario usuario = usuarioEncontrado.get();
        EmailVerificacao verificacao = verificacaoRepository.findByUsuarioEmail(emailNormalizado).orElse(null);
        LocalDateTime agora = LocalDateTime.now(ZoneOffset.UTC);
        if (verificacao != null && verificacao.getCriadaEm() != null
                && verificacao.getCriadaEm().isAfter(agora.minusSeconds(60))) {
            return;
        }
        enviarNovoCodigo(usuario, verificacao);
    }

    @Transactional
    public boolean verificarCodigo(String email, String codigo) {
        String emailNormalizado = normalizarEmail(email);
        if (codigo == null || !codigo.matches("\\d{8}")) {
            return false;
        }

        Optional<EmailVerificacao> verificacaoEncontrada = verificacaoRepository.findByUsuarioEmail(emailNormalizado);
        if (verificacaoEncontrada.isEmpty()) {
            return false;
        }

        EmailVerificacao verificacao = verificacaoEncontrada.get();
        LocalDateTime agora = LocalDateTime.now(ZoneOffset.UTC);
        if (verificacao.getTentativas() >= MAX_TENTATIVAS || !verificacao.getExpiraEm().isAfter(agora)) {
            return false;
        }

        if (!java.security.MessageDigest.isEqual(
                hashCodigo(codigo).getBytes(StandardCharsets.US_ASCII),
                verificacao.getCodigoHash().getBytes(StandardCharsets.US_ASCII))) {
            verificacao.setTentativas(verificacao.getTentativas() + 1);
            verificacaoRepository.save(verificacao);
            return false;
        }

        Usuario usuario = verificacao.getUsuario();
        usuario.setEmailVerificado(true);
        usuarioRepository.save(usuario);
        verificacaoRepository.delete(verificacao);
        return true;
    }

    private void enviarNovoCodigo(Usuario usuario, EmailVerificacao verificacao) {
        String codigo = String.format(Locale.ROOT, "%08d", RANDOM.nextInt(100_000_000));
        if (verificacao == null) {
            verificacao = new EmailVerificacao();
            verificacao.setUsuario(usuario);
        }
        verificacao.setCodigoHash(hashCodigo(codigo));
        verificacao.setExpiraEm(LocalDateTime.now(ZoneOffset.UTC).plusMinutes(15));
        verificacao.setTentativas(0);
        verificacaoRepository.save(verificacao);
        emailSender.enviarCodigoVerificacao(usuario.getEmail(), usuario.getNome(), codigo);
    }

    private String normalizarEmail(String email) {
        if (email == null || email.isBlank()) {
            throw new IllegalArgumentException("E-mail inválido.");
        }
        return email.trim().toLowerCase(Locale.ROOT);
    }

    private String hashCodigo(String codigo) {
        try {
            Mac mac = Mac.getInstance("HmacSHA256");
            mac.init(new SecretKeySpec(hashSecret.getBytes(StandardCharsets.UTF_8), "HmacSHA256"));
            return HexFormat.of().formatHex(mac.doFinal(codigo.getBytes(StandardCharsets.UTF_8)));
        } catch (GeneralSecurityException exception) {
            throw new IllegalStateException("Não foi possível proteger o código de verificação.", exception);
        }
    }
}
