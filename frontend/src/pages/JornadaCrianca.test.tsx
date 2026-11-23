import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import api from '../services/api';
import JornadaCrianca from './JornadaCrianca';

describe('JornadaCrianca', () => {
  beforeEach(() => {
    localStorage.clear();
    localStorage.setItem('id_usuario', '1');
    vi.restoreAllMocks();
  });

  it('permite abrir o registro de um marco observado', async () => {
    vi.spyOn(api, 'get').mockImplementation((url) => {
      if (url === '/criancas/usuario/1') return Promise.resolve({ data: [{
        id_crianca: 7,
        nome: 'Sofia',
        data_nascimento: '2025-06-10',
        peso_nascimento: 3.2,
        altura_nascimento: 49,
      }] });
      if (url === '/registros/crianca/7') return Promise.resolve({ data: [] });
      return Promise.resolve({ data: [] });
    });

    render(<MemoryRouter><JornadaCrianca faixa="bebe" /></MemoryRouter>);

    await waitFor(() => expect(screen.getByText('Jornada de Sofia')).toBeInTheDocument());
    const botoes = screen.getAllByRole('button', { name: /Marcar como observado/i });
    fireEvent.click(botoes[0]);
    expect(await screen.findByText('Marco observado')).toBeInTheDocument();
    expect(screen.getByLabelText(/Quando aconteceu/i)).toBeInTheDocument();
  });
});
