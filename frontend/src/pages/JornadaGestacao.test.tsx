import { describe, expect, it, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import JornadaGestacao from './JornadaGestacao';
import api from '../services/api';

describe('JornadaGestacao Component', () => {
  beforeEach(() => {
    localStorage.clear();
    localStorage.setItem('id_usuario', '1');
    vi.restoreAllMocks();
  });

  it('deve exibir mensagem quando nenhuma gestação for encontrada (404)', async () => {
    const erro404 = {
      isAxiosError: true,
      response: { status: 404 },
    };
    vi.spyOn(api, 'get').mockRejectedValueOnce(erro404);

    render(
      <MemoryRouter>
        <JornadaGestacao />
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(screen.getByText(/Nenhuma gestação cadastrada/i)).toBeInTheDocument();
      expect(screen.getByText(/Ainda não há uma gestação cadastrada para este usuário./i)).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /Cadastrar gestação/i })).toBeInTheDocument();
    });
  });

  it('deve exibir dados da gestação e linha do tempo de marcos', async () => {
    const gestacaoMock = {
      ultima_mestruacao: '2026-01-01',
      data_parto: '2026-10-08',
    };
    vi.spyOn(api, 'get').mockResolvedValueOnce({ data: gestacaoMock });

    render(
      <MemoryRouter>
        <JornadaGestacao />
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(screen.getByText(/Sua jornada, semana a semana/i)).toBeInTheDocument();
      expect(screen.getByText(/Previsão de parto/i)).toBeInTheDocument();
      expect(screen.getByText(/Progresso estimado/i)).toBeInTheDocument();
    });
  });
});
