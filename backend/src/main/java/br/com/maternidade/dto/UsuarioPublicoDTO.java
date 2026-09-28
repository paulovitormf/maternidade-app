package br.com.maternidade.dto;
import br.com.maternidade.model.Usuario;
import java.time.LocalDate;
public record UsuarioPublicoDTO(Integer id_usuario, String nome, String email, LocalDate data_nascimento, String telefone, Integer qnt_gestacao) {
    public static UsuarioPublicoDTO from(Usuario u) { return new UsuarioPublicoDTO(u.getIdUsuario(), u.getNome(), u.getEmail(), u.getDataNascimento(), u.getTelefone(), u.getQntGestacao()); }
}
