import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import api from '../services/api';
import PerfilBebe from './PerfilBebe';

describe('PerfilBebe', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  it('mostra os dados e o histórico individual da criança selecionada', async () => {
    vi.spyOn(api, 'get').mockImplementation((url) => {
      if (url === '/criancas/7') {
        return Promise.resolve({
          data: {
            id_crianca: 7,
            nome: 'Sofia',
            data_nascimento: '2025-06-10',
            hora_nascimento: '08:30:00',
            sexo: 'F',
            peso_nascimento: 3.2,
            altura_nascimento: 49,
            observacoes: 'Nascimento tranquilo.',
            idade_meses: 17,
            pode_editar: true,
          },
        });
      }
      return Promise.resolve({
        data: [{
          id_registro: 3,
          id_crianca: 7,
          nome_crianca: 'Sofia',
          tipo: 'PESO',
          titulo: 'Peso da consulta',
          valor: 10.1,
          unidade: 'kg',
          confirmado: false,
          data_registro: '2026-11-20',
          pode_editar: true,
        }],
      });
    });

    render(
      <MemoryRouter initialEntries={['/bebes/7']}>
        <Routes>
          <Route path="/bebes/:id" element={<PerfilBebe />} />
        </Routes>
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'Sofia' })).toBeInTheDocument();
    });
    expect(api.get).toHaveBeenCalledWith('/criancas/7');
    expect(api.get).toHaveBeenCalledWith('/registros/crianca/7');
    expect(screen.getByText('Nascimento tranquilo.')).toBeInTheDocument();
    expect(screen.getByText('Peso da consulta')).toBeInTheDocument();
    expect(screen.getAllByText('10,1 kg').length).toBeGreaterThanOrEqual(1);
    expect(screen.getByRole('link', { name: /Adicionar registro/i })).toHaveAttribute(
      'href',
      '/registros?crianca=7',
    );
  });
});
