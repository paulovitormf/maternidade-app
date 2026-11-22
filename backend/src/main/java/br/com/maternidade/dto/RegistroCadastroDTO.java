package br.com.maternidade.dto;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;

public record RegistroCadastroDTO(Integer id_usuario, Integer id_crianca, Integer id_gestacao, String tipo, String titulo, String descricao, BigDecimal valor, String unidade, String dose, Boolean confirmado, LocalDate data_registro, LocalTime horario, String foto_base64) {}
