package br.com.maternidade.services;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import br.com.maternidade.dto.GestacaoDTO;
import br.com.maternidade.model.Gestacao;
import br.com.maternidade.model.Usuario;
import br.com.maternidade.repository.GestacaoRepository;
import br.com.maternidade.repository.UsuarioRepository;

import java.util.List;

@Service
public class GestacaoService {

    private final GestacaoRepository gestacaoRepository;
    private final UsuarioRepository usuarioRepository;

    public GestacaoService(GestacaoRepository gestacaoRepository, UsuarioRepository usuarioRepository) {
        this.gestacaoRepository = gestacaoRepository;
        this.usuarioRepository = usuarioRepository;
    }

    @Transactional
    public Gestacao cadastrarGestacao(GestacaoDTO dto) {
        // 1. Busca o usuário (mãe) pelo ID fornecido no DTO
        Usuario usuario = usuarioRepository.findById(dto.id_usuario())
                .orElseThrow(() -> new IllegalArgumentException("Usuário (Mãe) não encontrado com o ID: " + dto.id_usuario()));

        // 2. Cria e popula a entidade Gestacao
        Gestacao gestacao = new Gestacao();
        gestacao.setUsuario(usuario);
        gestacao.setUltimaMestruacao(dto.ultima_mestruacao());
        gestacao.setIdadeGestacional(dto.idade_gestacional());
        gestacao.setDataParto(dto.data_parto());
        gestacao.setTipoGestacao(dto.tipo_gestacao());
        gestacao.setPreNatal(dto.pre_natal());

        // 3. Atualiza o contador de gestações na entidade do Usuário
        int gestacoesAtuais = usuario.getQntGestacao() != null ? usuario.getQntGestacao() : 0;
        usuario.setQntGestacao(gestacoesAtuais + 1);
        usuarioRepository.save(usuario);

        // 4. Salva o registro na tabela 'gestacao' do MySQL
        return gestacaoRepository.save(gestacao);
    }

    public List<Gestacao> listarPorUsuario(Long idUsuario) {
        return gestacaoRepository.findByUsuarioIdUsuario(idUsuario);
    }

    public Gestacao buscarMaisRecentePorUsuario(Long idUsuario) {
        return gestacaoRepository.findFirstByUsuarioIdUsuarioOrderByIdGestacaoDesc(idUsuario)
                .orElseThrow(() -> new IllegalArgumentException("Nenhuma gestação cadastrada para o usuário ID: " + idUsuario));
    }
}