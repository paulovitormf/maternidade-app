package br.com.maternidade.services;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import br.com.maternidade.dto.GestacaoDTO;
import br.com.maternidade.model.Gestacao;
import br.com.maternidade.model.Usuario;
import br.com.maternidade.repository.GestacaoRepository;
import br.com.maternidade.repository.UsuarioRepository;

import java.util.List;
import java.time.LocalDate;

@Service
public class GestacaoService {

    private final GestacaoRepository gestacaoRepository;
    private final UsuarioRepository usuarioRepository;

    public GestacaoService(GestacaoRepository gestacaoRepository, UsuarioRepository usuarioRepository) {
        this.gestacaoRepository = gestacaoRepository;
        this.usuarioRepository = usuarioRepository;
    }

    @Transactional
    public Gestacao cadastrarGestacao(GestacaoDTO dto, String emailAutenticado) {
        if (dto == null || emailAutenticado == null || emailAutenticado.isBlank()) {
            throw new IllegalArgumentException("Usuário autenticado é obrigatório.");
        }
        if (dto.ultima_mestruacao() == null) {
            throw new IllegalArgumentException("DUM é obrigatória.");
        }
        if (dto.ultima_mestruacao().isAfter(LocalDate.now())) {
            throw new IllegalArgumentException("A DUM não pode estar no futuro.");
        }

        Integer idadeGestacionalInformada = dto.idade_gestacional();
        Integer idadeGestacionalCalculada = Gestacao.calcularIdadeGestacional(dto.ultima_mestruacao());

        if (idadeGestacionalInformada != null
                && (idadeGestacionalInformada < 0 || idadeGestacionalInformada > 42)) {
            throw new IllegalArgumentException("A idade gestacional deve estar entre 0 e 42 semanas.");
        }

        Usuario usuario = usuarioRepository.findByEmail(emailAutenticado)
                .orElseThrow(() -> new IllegalArgumentException("Usuário autenticado não encontrado."));

        Gestacao gestacao = new Gestacao();
        gestacao.setUsuario(usuario);
        gestacao.setUltimaMestruacao(dto.ultima_mestruacao());
        gestacao.setIdadeGestacional(idadeGestacionalInformada != null ? idadeGestacionalInformada : idadeGestacionalCalculada);
        gestacao.setDataParto(Gestacao.calcularDataParto(dto.ultima_mestruacao()));
        gestacao.setTipoGestacao(dto.tipo_gestacao());
        gestacao.setPreNatal(dto.pre_natal());

        int gestacoesAtuais = usuario.getQntGestacao() != null ? usuario.getQntGestacao() : 0;
        usuario.setQntGestacao(gestacoesAtuais + 1);
        usuarioRepository.save(usuario);

        return gestacaoRepository.save(gestacao);
    }

    public List<Gestacao> listarPorUsuario(Integer idUsuario) {
        return gestacaoRepository.findByUsuarioIdUsuario(idUsuario);
    }

    public Gestacao buscarMaisRecentePorUsuario(Integer idUsuario) {
        return gestacaoRepository.findFirstByUsuarioIdUsuarioOrderByIdGestacaoDesc(idUsuario)
                .orElseThrow(() -> new IllegalArgumentException("Nenhuma gestação cadastrada para o usuário ID: " + idUsuario));
    }
}