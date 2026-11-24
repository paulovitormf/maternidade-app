import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import Vacinas from './Vacinas';
import api from '../services/api';

describe('Vacinas', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('abre por padrão no calendário materno quando existe uma gestação', async () => {
    vi.spyOn(api, 'get').mockResolvedValueOnce({
      data: [{ id_gestacao: 1 }],
    });

    render(<Vacinas />);

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'Vacinas' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Exportar carteira' })).toBeInTheDocument();
      expect(screen.queryByRole('button', { name: 'Exportar / imprimir carteira' })).not.toBeInTheDocument();
    });
    expect(screen.getByRole('heading', { name: 'Vacinas' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Mãe/i })).toHaveAttribute(
      'aria-pressed',
      'true',
    );
    expect(screen.getByText('Início do pré-natal')).toBeInTheDocument();
    expect(screen.queryByText('Ao nascer')).not.toBeInTheDocument();
  });

  it('alterna para o calendário do bebê', async () => {
    vi.spyOn(api, 'get').mockResolvedValueOnce({
      data: [{ id_gestacao: 1 }],
    });

    render(<Vacinas />);

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /Bebê/i })).toBeInTheDocument();
    });
    fireEvent.click(screen.getByRole('button', { name: /Bebê/i }));

    expect(screen.getByRole('button', { name: /Bebê/i })).toHaveAttribute(
      'aria-pressed',
      'true',
    );
    expect(screen.getByText('Ao nascer')).toBeInTheDocument();
    expect(screen.queryByText('Início do pré-natal')).not.toBeInTheDocument();
  });

  it('não oferece vacinas maternas quando não existe gestação', async () => {
    vi.spyOn(api, 'get').mockResolvedValueOnce({
      data: [],
    });

    render(<Vacinas />);

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'Vacinas' })).toBeInTheDocument();
    });
    expect(screen.queryByRole('button', { name: /Mãe/i })).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Bebê/i })).toHaveAttribute(
      'aria-pressed',
      'true',
    );
    expect(screen.getByText('Ao nascer')).toBeInTheDocument();
  });
});
