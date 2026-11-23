package br.com.maternidade.dto;

import java.time.LocalDateTime;
import java.util.List;

public class ForumDtos {
    public record Categoria(Integer id, String nome, String descricao, long discussoes) {}
    public record CriarTopico(Integer categoriaId, String titulo, String conteudo) {}
    public record CriarResposta(String conteudo) {}
    public record Resposta(Long id, String conteudo, String autor, LocalDateTime dataCriacao) {}
    public record Topico(Long id, Integer categoriaId, String categoria, String titulo, String conteudo,
                         String autor, boolean fixado, String status, LocalDateTime dataCriacao,
                         LocalDateTime dataAtualizacao, long respostas, long curtidas,
                         boolean curtidoPeloUsuario, List<Resposta> ultimasRespostas) {}
    public record Curtida(long curtidas, boolean curtido) {}
}
