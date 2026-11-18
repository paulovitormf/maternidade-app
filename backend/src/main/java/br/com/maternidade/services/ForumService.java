package br.com.maternidade.services;

import br.com.maternidade.dto.ForumDtos.*;
import br.com.maternidade.model.*;
import br.com.maternidade.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
public class ForumService {
    private final ForumCategoriaRepository categorias;
    private final ForumTopicoRepository topicos;
    private final ForumRespostaRepository respostas;
    private final ForumTopicoCurtidaRepository curtidas;
    private final UsuarioRepository usuarios;

    public ForumService(ForumCategoriaRepository categorias, ForumTopicoRepository topicos,
                        ForumRespostaRepository respostas, ForumTopicoCurtidaRepository curtidas,
                        UsuarioRepository usuarios) {
        this.categorias = categorias;
        this.topicos = topicos;
        this.respostas = respostas;
        this.curtidas = curtidas;
        this.usuarios = usuarios;
    }

    public List<Categoria> listarCategorias() {
        return categorias.findByAtivoTrueOrderByNomeAsc().stream()
                .map(c -> new Categoria(c.getId(), c.getNome(), c.getDescricao(),
                        topicos.countByCategoriaIdAndStatusNot(c.getId(), "ARQUIVADO")))
                .toList();
    }

    public List<Topico> listarTopicos(Integer categoriaId, String busca, String email) {
        Usuario atual = usuarioPorEmail(email);
        String termo = busca == null || busca.isBlank() ? null : busca.trim();
        return topicos.buscar(categoriaId, termo).stream()
                .map(t -> paraTopico(t, atual)).toList();
    }

    public Topico buscarTopico(Long id, String email) {
        Usuario atual = usuarioPorEmail(email);
        return topicos.findByIdAndStatusNot(id, "ARQUIVADO")
                .map(t -> paraTopico(t, atual))
                .orElseThrow(() -> new IllegalArgumentException("Discussão não encontrada."));
    }

    @Transactional
    public Topico criarTopico(CriarTopico dto, String email) {
        textoObrigatorio(dto.titulo(), "O título", 200);
        textoObrigatorio(dto.conteudo(), "O conteúdo", 5000);
        Usuario usuario = usuarioPorEmail(email);
        ForumCategoria categoria = categorias.findById(dto.categoriaId())
                .filter(ForumCategoria::getAtivo)
                .orElseThrow(() -> new IllegalArgumentException("Categoria não encontrada."));
        ForumTopico salvo = topicos.save(new ForumTopico(categoria, usuario,
                dto.titulo().trim(), dto.conteudo().trim()));
        return paraTopico(salvo, usuario);
    }

    public List<Resposta> listarRespostas(Long topicoId) {
        existeTopico(topicoId);
        return respostas.findByTopicoIdAndStatusOrderByDataCriacaoAsc(topicoId, "ATIVA")
                .stream().map(this::paraResposta).toList();
    }

    @Transactional
    public Resposta criarResposta(Long topicoId, CriarResposta dto, String email) {
        textoObrigatorio(dto.conteudo(), "A resposta", 5000);
        Usuario usuario = usuarioPorEmail(email);
        ForumTopico topico = topicos.findByIdAndStatusNot(topicoId, "ARQUIVADO")
                .orElseThrow(() -> new IllegalArgumentException("Discussão não encontrada."));
        if ("FECHADO".equals(topico.getStatus()))
            throw new IllegalArgumentException("Esta discussão está fechada para respostas.");
        return paraResposta(respostas.save(new ForumResposta(topico, usuario, dto.conteudo().trim())));
    }

    @Transactional
    public Curtida alternarCurtida(Long topicoId, String email) {
        Usuario usuario = usuarioPorEmail(email);
        ForumTopico topico = topicos.findByIdAndStatusNot(topicoId, "ARQUIVADO")
                .orElseThrow(() -> new IllegalArgumentException("Discussão não encontrada."));
        ForumTopicoCurtidaId id = new ForumTopicoCurtidaId(topicoId, usuario.getIdUsuario());
        boolean curtido = curtidas.existsById(id);
        if (curtido) curtidas.deleteById(id);
        else curtidas.save(new ForumTopicoCurtida(topico, usuario));
        return new Curtida(curtidas.countByTopicoId(topicoId), !curtido);
    }

    private Usuario usuarioPorEmail(String email) {
        return usuarios.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("Usuário autenticado não encontrado."));
    }

    private void existeTopico(Long topicoId) {
        topicos.findByIdAndStatusNot(topicoId, "ARQUIVADO")
                .orElseThrow(() -> new IllegalArgumentException("Discussão não encontrada."));
    }

    private Topico paraTopico(ForumTopico topico, Usuario atual) {
        ForumTopicoCurtidaId curtidaId = new ForumTopicoCurtidaId(topico.getId(), atual.getIdUsuario());
        List<Resposta> respostasTopico = respostas
                .findByTopicoIdAndStatusOrderByDataCriacaoAsc(topico.getId(), "ATIVA")
                .stream().limit(3).map(this::paraResposta).toList();
        return new Topico(topico.getId(), topico.getCategoria().getId(), topico.getCategoria().getNome(),
                topico.getTitulo(), topico.getConteudo(), topico.getUsuario().getNome(),
                Boolean.TRUE.equals(topico.getFixado()), topico.getStatus(), topico.getDataCriacao(),
                topico.getDataAtualizacao(), respostas.countByTopicoIdAndStatus(topico.getId(), "ATIVA"),
                curtidas.countByTopicoId(topico.getId()), curtidas.existsById(curtidaId), respostasTopico);
    }

    private Resposta paraResposta(ForumResposta resposta) {
        return new Resposta(resposta.getId(), resposta.getConteudo(),
                resposta.getUsuario().getNome(), resposta.getDataCriacao());
    }

    private void textoObrigatorio(String texto, String campo, int limite) {
        if (texto == null || texto.trim().isEmpty())
            throw new IllegalArgumentException(campo + " é obrigatório.");
        if (texto.trim().length() > limite)
            throw new IllegalArgumentException(campo + " excede o limite de " + limite + " caracteres.");
    }
}
