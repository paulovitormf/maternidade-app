package br.com.maternidade.services;

import java.util.List;
import java.util.Map;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientException;
import org.springframework.web.util.UriComponentsBuilder;

@Service
public class BrevoEmailSender implements EmailSender {

    private final RestClient restClient;
    private final String apiKey;
    private final String senderEmail;
    private final String senderName;
    private final String frontendUrl;

    public BrevoEmailSender(
            RestClient.Builder restClientBuilder,
            @Value("${app.brevo.api-key:}") String apiKey,
            @Value("${app.brevo.sender-email:}") String senderEmail,
            @Value("${app.brevo.sender-name:Maternidade}") String senderName,
            @Value("${app.frontend-url}") String frontendUrl) {
        this.restClient = restClientBuilder.baseUrl("https://api.brevo.com/v3").build();
        this.apiKey = apiKey;
        this.senderEmail = senderEmail;
        this.senderName = senderName;
        this.frontendUrl = frontendUrl;
    }

    @Override
    public void enviarCodigoVerificacao(String destinatario, String nome, String codigo) {
        if (apiKey.isBlank() || senderEmail.isBlank()) {
            throw new EmailDeliveryException(
                    "Configure BREVO_API_KEY e BREVO_SENDER_EMAIL para enviar e-mails.", null);
        }

        String link = UriComponentsBuilder.fromUriString(frontendUrl.replaceAll("/+$", ""))
                .path("/verificar-email")
                .queryParam("email", destinatario)
                .queryParam("codigo", codigo)
                .build()
                .encode()
                .toUriString();
        String nomeSeguro = escaparHtml(nome);
        String html = """
                <p>Olá, %s!</p>
                <p>Use o código abaixo para confirmar seu e-mail no Maternidade:</p>
                <p style="font-size:28px;font-weight:bold;letter-spacing:6px">%s</p>
                <p>O código expira em 15 minutos.</p>
                <p><a href="%s">Confirmar meu e-mail</a></p>
                """                .formatted(nomeSeguro, codigo, escaparHtml(link));

        Map<String, Object> payload = Map.of(
                "sender", Map.of("name", senderName, "email", senderEmail),
                "to", List.of(Map.of("email", destinatario, "name", nome)),
                "subject", "Confirme seu e-mail - Maternidade",
                "htmlContent", html);

        try {
            restClient.post()
                    .uri("/smtp/email")
                    .header("api-key", apiKey)
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(payload)
                    .retrieve()
                    .toBodilessEntity();
        } catch (RestClientException exception) {
            throw new EmailDeliveryException("Não foi possível enviar o e-mail de verificação.", exception);
        }
    }

    private String escaparHtml(String valor) {
        return valor.replace("&", "&amp;")
                .replace("<", "&lt;")
                .replace(">", "&gt;")
                .replace("\"", "&quot;")
                .replace("'", "&#39;");
    }
}
