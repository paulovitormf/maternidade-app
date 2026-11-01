import { describe, expect, it, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import JornadaDesenvolvimento from './JornadaDesenvolvimento';
import api from '../services/api';

describe('JornadaDesenvolvimento Component', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  it('deve listar marcos do desenvolvimento retornados pela API', async () => {
    const marcosMock = [
      {
        idJornada: 1,
        titulo: 'Primeiro Sorriso',
        descricao: 'O bebê responde a estímulos visuais.',
        idadeMinMeses: 2,
        categoria: 'Social',
      },
      {
        idJornada: 2,
        titulo: 'Sentar sem apoio',
        descricao: 'Equilíbrio e fortalecimento do tronco.',
        idadeMinMeses: 6,
        categoria: 'Motor',
      },
    ];

    vi.spyOn(api, 'get').mockResolvedValueOnce({ data: marcosMock });

    render(
      <MemoryRouter>
        <JornadaDesenvolvimento />
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(screen.getByText('Primeiro Sorriso')).toBeInTheDocument();
      expect(screen.getByText('Sentar sem apoio')).toBeInTheDocument();
      expect(screen.getByText(/O bebê responde a estímulos visuais/i)).toBeInTheDocument();
    });
  });
});
