package br.com.maternidade.services;

import br.com.maternidade.dto.RegistroCadastroDTO;
import br.com.maternidade.model.Registro;
import br.com.maternidade.repository.CriancaRepository;
import br.com.maternidade.repository.GestacaoRepository;
import br.com.maternidade.repository.RegistroRepository;
import br.com.maternidade.repository.UsuarioRepository;
import br.com.maternidade.repository.UsuarioCriancaRepository;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDate;
import java.util.List;

@Service
public class RegistroService {
    private static final List<String> TIPOS = List.of("VACINA", "PESO", "ALTURA", "INTRODUCAO_ALIMENTAR", "FOTO", "INTERACAO", "PRIMEIRA_PALAVRA", "CONSULTA", "EXAME", "OUTRO");
    private final RegistroRepository registros; private final UsuarioRepository usuarios; private final CriancaRepository criancas; private final GestacaoRepository gestacoes; private final UsuarioCriancaRepository vinculos;
    public RegistroService(RegistroRepository registros, UsuarioRepository usuarios, CriancaRepository criancas, GestacaoRepository gestacoes, UsuarioCriancaRepository vinculos) { this.registros = registros; this.usuarios = usuarios; this.criancas = criancas; this.gestacoes = gestacoes; this.vinculos = vinculos; }

    @Transactional(readOnly = true)
    public Integer idUsuarioAutenticado(String emailAutenticado) {
        return buscarUsuario(emailAutenticado).getIdUsuario();
    }

    @Transactional
    public Registro criar(RegistroCadastroDTO dto, String emailAutenticado) {
        validar(dto);
        var usuario = buscarUsuario(emailAutenticado);
        Registro registro = new Registro();
        registro.setUsuario(usuario);
        aplicarDados(registro, dto, usuario.getIdUsuario());
        return registros.save(registro);
    }

    @Transactional(readOnly = true)
    public List<Registro> listar(Integer idUsuario, String emailAutenticado) {
        var usuario = buscarUsuario(emailAutenticado);
        if (!usuario.getIdUsuario().equals(idUsuario)) {
            throw new AccessDeniedException("Você não tem permissão para consultar estes registros.");
        }
        return registros.findByUsuarioIdUsuarioOrderByDataRegistroDescHorarioDescCriadoEmDesc(idUsuario);
    }

    @Transactional(readOnly = true)
    public List<Registro> listarPorCrianca(Integer idCrianca, String emailAutenticado) {
        var usuario = buscarUsuario(emailAutenticado);
        validarAcessoCrianca(usuario.getIdUsuario(), idCrianca, false);
        return registros.findByCriancaIdCriancaOrderByDataRegistroDescHorarioDescCriadoEmDesc(idCrianca);
    }

    @Transactional
    public Registro atualizar(Long idRegistro, RegistroCadastroDTO dto, String emailAutenticado) {
        validar(dto);
        var usuario = buscarUsuario(emailAutenticado);
        Registro registro = buscarRegistroDoUsuario(idRegistro, usuario.getIdUsuario());
        aplicarDados(registro, dto, usuario.getIdUsuario());
        return registros.save(registro);
    }

    @Transactional
    public void excluir(Long idRegistro, String emailAutenticado) {
        var usuario = buscarUsuario(emailAutenticado);
        Registro registro = buscarRegistroDoUsuario(idRegistro, usuario.getIdUsuario());
        registros.delete(registro);
    }

    private br.com.maternidade.model.Usuario buscarUsuario(String emailAutenticado) {
        if (emailAutenticado == null || emailAutenticado.isBlank()) {
            throw new AccessDeniedException("Usuário autenticado é obrigatório.");
        }
        return usuarios.findByEmail(emailAutenticado)
                .orElseThrow(() -> new AccessDeniedException("Usuário autenticado não encontrado."));
    }

    private Registro buscarRegistroDoUsuario(Long idRegistro, Integer idUsuario) {
        Registro registro = registros.findById(idRegistro)
                .orElseThrow(() -> new IllegalArgumentException("Registro não encontrado."));
        if (!registro.getUsuario().getIdUsuario().equals(idUsuario)) {
            throw new AccessDeniedException("Você não tem permissão para alterar este registro.");
        }
        return registro;
    }

    private void validar(RegistroCadastroDTO dto) {
        if (dto == null || dto.tipo() == null || !TIPOS.contains(dto.tipo())
                || dto.titulo() == null || dto.titulo().isBlank()
                || dto.data_registro() == null) {
            throw new IllegalArgumentException("Tipo, título e data são obrigatórios.");
        }
        if ((dto.id_crianca() == null) == (dto.id_gestacao() == null)) {
            throw new IllegalArgumentException("Vincule o registro a uma criança ou gestação.");
        }
    }

    private void aplicarDados(Registro registro, RegistroCadastroDTO dto, Integer idUsuario) {
        if (dto.id_crianca() != null) {
            validarAcessoCrianca(idUsuario, dto.id_crianca(), true);
            registro.setCrianca(criancas.findById(dto.id_crianca())
                    .orElseThrow(() -> new IllegalArgumentException("Criança não encontrada.")));
            registro.setGestacao(null);
        } else {
            var gestacao = gestacoes.findById(dto.id_gestacao())
                    .orElseThrow(() -> new IllegalArgumentException("Gestação não encontrada."));
            if (!gestacao.getUsuario().getIdUsuario().equals(idUsuario)) {
                throw new AccessDeniedException("Você não tem permissão para registrar dados nesta gestação.");
            }
            registro.setGestacao(gestacao);
            registro.setCrianca(null);
        }

        registro.setTipo(dto.tipo());
        registro.setTitulo(dto.titulo().trim());
        registro.setDescricao(dto.descricao());
        registro.setValor(dto.valor());
        registro.setUnidade(dto.unidade());
        registro.setDose(dto.dose());
        registro.setConfirmado(Boolean.TRUE.equals(dto.confirmado()));
        registro.setDataRegistro(dto.data_registro());
        registro.setHorario(dto.horario());
        registro.setFotoBase64(dto.foto_base64());
    }

    private void validarAcessoCrianca(Integer idUsuario, Integer idCrianca, boolean exigeEdicao) {
        boolean autorizado = exigeEdicao
                ? vinculos.existsByIdUsuarioAndIdCriancaAndAtivoAndPodeEditar(
                        idUsuario, idCrianca, true, true)
                : vinculos.existsByIdUsuarioAndIdCriancaAndAtivo(
                        idUsuario, idCrianca, true);
        if (!autorizado) {
            throw new AccessDeniedException(exigeEdicao
                    ? "Você não tem permissão para editar os dados desta criança."
                    : "Você não tem acesso aos dados desta criança.");
        }
        if (!criancas.existsById(idCrianca)) {
            throw new IllegalArgumentException("Criança não encontrada.");
        }
    }
}
