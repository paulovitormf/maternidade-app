import { describe, expect, it, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import CadastroUsuario from './CadastroUsuario';
import * as usuarioService from '../services/usuarioService';
import { CONTINUAR_CADASTRO_STORAGE_KEY } from '../services/usuarioService';
const mockedNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockedNavigate,
  };
});

describe('CadastroUsuario Component', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
    mockedNavigate.mockReset();
  });

  it('deve renderizar os campos do formulário de cadastro', () => {
    render(
      <MemoryRouter>
        <CadastroUsuario />
      </MemoryRouter>,
    );

    expect(screen.getByRole('heading', { name: /Crie seu cadastro/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/Nome completo/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/E-mail/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^Senha/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Criar minha conta/i })).toBeInTheDocument();
  });

  it('deve validar se a senha tem pelo menos 8 caracteres', async () => {
    render(
      <MemoryRouter>
        <CadastroUsuario />
      </MemoryRouter>,
    );

    fireEvent.change(screen.getByLabelText(/Nome completo/i), { target: { value: 'Maria' } });
    fireEvent.change(screen.getByLabelText(/E-mail/i), { target: { value: 'maria@example.com' } });
    fireEvent.change(screen.getByLabelText(/^Senha/i), { target: { value: '123' } });
    fireEvent.click(screen.getByRole('button', { name: /Criar minha conta/i }));

    await waitFor(() => {
      expect(screen.getByText('A senha deve ter no mínimo 8 caracteres.')).toBeInTheDocument();
    });
  });

  it('deve cadastrar e encaminhar para a verificação de e-mail', async () => {
    vi.spyOn(usuarioService, 'cadastrarUsuario').mockResolvedValueOnce({
      id_usuario: 1,
      nome: 'Maria Silva',
      email: 'maria@example.com',
    });

    render(
      <MemoryRouter>
        <CadastroUsuario />
      </MemoryRouter>,
    );

    fireEvent.change(screen.getByLabelText(/Nome completo/i), { target: { value: 'Maria Silva' } });
    fireEvent.change(screen.getByLabelText(/E-mail/i), { target: { value: 'maria@example.com' } });
    fireEvent.change(screen.getByLabelText(/Data de nascimento/i), { target: { value: '1995-05-10' } });
    fireEvent.change(screen.getByLabelText(/^Senha/i), { target: { value: 'senha12345' } });
    fireEvent.click(screen.getByRole('button', { name: /Criar minha conta/i }));

    await waitFor(() => {
      expect(usuarioService.cadastrarUsuario).toHaveBeenCalled();
      expect(localStorage.getItem('access_token')).toBeNull();
      expect(localStorage.getItem(CONTINUAR_CADASTRO_STORAGE_KEY)).toBe('true');
      expect(mockedNavigate).toHaveBeenCalledWith('/verificar-email?email=maria%40example.com', { replace: true });
    });
  });
});
