import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import api from '../services/api';
import Calendario from './Calendario';

describe('Calendario', () => {
  beforeEach(() => {
    localStorage.clear();
    localStorage.setItem('id_usuario', '1');
    vi.restoreAllMocks();
  });

  it('lista eventos individuais e permite abrir o formulário', async () => {
    vi.spyOn(api, 'get').mockImplementation((url) => {
      if (url === '/criancas') return Promise.resolve({ data: [{ idCrianca: 7, nome: 'Sofia', podeEditar: true }] });
      if (url.includes('/gestacoes/')) return Promise.reject({ isAxiosError: true, response: { status: 404 } });
      if (url === '/registros/usuario/1') return Promise.resolve({ data: [{
        id_registro: 9,
        id_crianca: 7,
        nome_crianca: 'Sofia',
        id_gestacao: null,
        tipo: 'CONSULTA',
        titulo: 'Pediatra',
        descricao: 'Consulta de rotina',
        data_registro: '2026-12-10',
        horario: '14:30',
        confirmado: false,
        pode_editar: true,
        local_evento: 'Clínica',
        profissional: 'Dra. Ana',
        responsavel_nome: 'Maria',
      }] });
      return Promise.resolve({ data: [] });
    });

    render(<MemoryRouter><Calendario /></MemoryRouter>);

    await waitFor(() => expect(screen.getByText('Pediatra')).toBeInTheDocument());
    expect(screen.getByText('Local: Clínica')).toBeInTheDocument();
    expect(screen.getByText('Profissional: Dra. Ana')).toBeInTheDocument();
  });
});
