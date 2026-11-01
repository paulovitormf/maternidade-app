import { describe, expect, it, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Login from './Login';
import * as usuarioService from '../services/usuarioService';

const mockedNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockedNavigate,
  };
});

describe('Login Component', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
    mockedNavigate.mockReset();
  });

  it('deve renderizar campos de login e botão de submit', () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>,
    );

    expect(screen.getByLabelText(/E-mail/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Digite sua senha/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /^Entrar$/i })).toBeInTheDocument();
  });

  it('deve alternar a visibilidade da senha ao clicar no botão de toggle', () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>,
    );

    const senhaInput = screen.getByPlaceholderText(/Digite sua senha/i) as HTMLInputElement;
    expect(senhaInput.type).toBe('password');

    const toggleBtn = screen.getByRole('button', { name: /Mostrar senha/i });
    fireEvent.click(toggleBtn);
    expect(senhaInput.type).toBe('text');

    fireEvent.click(screen.getByRole('button', { name: /Ocultar senha/i }));
    expect(senhaInput.type).toBe('password');
  });

  it('deve logar com sucesso, salvar credenciais no localStorage e redirecionar para a home', async () => {
    const mockResposta = {
      token: 'jwt-123',
      usuario: { id_usuario: 5, nome: 'Maria', email: 'maria@example.com' },
    };
    vi.spyOn(usuarioService, 'loginUsuario').mockResolvedValueOnce(mockResposta);

    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>,
    );

    fireEvent.change(screen.getByLabelText(/E-mail/i), { target: { value: 'maria@example.com' } });
    fireEvent.change(screen.getByPlaceholderText(/Digite sua senha/i), { target: { value: 'senha12345' } });
    fireEvent.click(screen.getByRole('button', { name: /^Entrar$/i }));

    await waitFor(() => {
      expect(usuarioService.loginUsuario).toHaveBeenCalledWith({
        email: 'maria@example.com',
        senha: 'senha12345',
      });
      expect(localStorage.getItem('access_token')).toBe('jwt-123');
      expect(localStorage.getItem('id_usuario')).toBe('5');
      expect(mockedNavigate).toHaveBeenCalledWith('/');
    });
  });

  it('deve exibir mensagem de erro quando o login falhar', async () => {
    const erroAxios = {
      isAxiosError: true,
      response: { data: 'E-mail ou senha inválidos.' },
    };
    vi.spyOn(usuarioService, 'loginUsuario').mockRejectedValueOnce(erroAxios);

    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>,
    );

    fireEvent.change(screen.getByLabelText(/E-mail/i), { target: { value: 'maria@example.com' } });
    fireEvent.change(screen.getByPlaceholderText(/Digite sua senha/i), { target: { value: 'senha-errada' } });
    fireEvent.click(screen.getByRole('button', { name: /^Entrar$/i }));

    await waitFor(() => {
      expect(screen.getByText('E-mail ou senha inválidos.')).toBeInTheDocument();
    });
  });
});
