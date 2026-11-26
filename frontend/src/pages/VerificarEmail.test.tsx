import { beforeEach, describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import VerificarEmail from './VerificarEmail';
import * as usuarioService from '../services/usuarioService';

describe('VerificarEmail', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('confirma o e-mail usando o código digitado', async () => {
    const confirmar = vi.spyOn(usuarioService, 'verificarEmail').mockResolvedValueOnce({
      mensagem: 'E-mail verificado com sucesso.',
    });

    render(
      <MemoryRouter initialEntries={['/verificar-email?email=maria%40example.com']}>
        <VerificarEmail />
      </MemoryRouter>,
    );

    fireEvent.change(screen.getByLabelText('Código de verificação'), {
      target: { value: '01234567' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Confirmar e-mail' }));

    await waitFor(() => {
      expect(confirmar).toHaveBeenCalledWith({
        email: 'maria@example.com',
        codigo: '01234567',
      });
      expect(screen.getByRole('heading', { name: 'E-mail confirmado!' })).toBeInTheDocument();
    });
  });

  it('valida automaticamente o código recebido pelo link', async () => {
    const confirmar = vi.spyOn(usuarioService, 'verificarEmail').mockResolvedValueOnce({
      mensagem: 'E-mail verificado com sucesso.',
    });

    render(
      <MemoryRouter initialEntries={['/verificar-email?email=maria%40example.com&codigo=01234567']}>
        <VerificarEmail />
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(confirmar).toHaveBeenCalledWith({
        email: 'maria@example.com',
        codigo: '01234567',
      });
      expect(screen.getByRole('heading', { name: 'E-mail confirmado!' })).toBeInTheDocument();
    });
  });
});
