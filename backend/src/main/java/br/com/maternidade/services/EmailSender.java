package br.com.maternidade.services;

public interface EmailSender {

    void enviarCodigoVerificacao(String destinatario, String nome, String codigo);
}
