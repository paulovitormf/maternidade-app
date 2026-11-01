import { describe, expect, it, vi, beforeEach } from 'vitest';
import api from './api';
import { cadastrarUsuario, loginUsuario } from './usuarioService';

describe('usuarioService', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('deve chamar POST /usuarios com os dados do usuário', async () => {
    const payload = {
      usuario: {
        nome: 'Maria Silva',
        email: 'maria@example.com',
        senha: 'senha-segura-123',
      },
    };
    const mockUsuario = { id_usuario: 1, nome: 'Maria Silva', email: 'maria@example.com' };
    vi.spyOn(api, 'post').mockResolvedValueOnce({ data: mockUsuario });

    const resultado = await cadastrarUsuario(payload);

    expect(api.post).toHaveBeenCalledWith('/usuarios', payload);
    expect(resultado).toEqual(mockUsuario);
  });

  it('deve chamar POST /usuarios/login e retornar token com dados do usuário', async () => {
    const credenciais = { email: 'maria@example.com', senha: 'senha-segura-123' };
    const respostaMock = {
      token: 'jwt-token-123',
      usuario: { id_usuario: 1, nome: 'Maria Silva', email: 'maria@example.com' },
    };
    vi.spyOn(api, 'post').mockResolvedValueOnce({ data: respostaMock });

    const resultado = await loginUsuario(credenciais);

    expect(api.post).toHaveBeenCalledWith('/usuarios/login', credenciais);
    expect(resultado).toEqual(respostaMock);
  });
});
