package br.com.maternidade.services;

public class EmailNaoVerificadoException extends RuntimeException {

    public EmailNaoVerificadoException() {
        super("Confirme seu e-mail antes de entrar.");
    }
}
