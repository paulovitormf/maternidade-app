import { describe, expect, it, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import CadastroCrianca from './CadastroCrianca';
import api from '../services/api';

const mockedNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockedNavigate,
    useLocation: () => ({ state: null }),
  };
});

describe('CadastroCrianca Component', () => {
  beforeEach(() => {
    localStorage.clear();
    localStorage.setItem('id_usuario', '1');
    vi.restoreAllMocks();
  });

  it('deve listar estado vazio quando não houver crianças cadastradas', async () => {
    vi.spyOn(api, 'get').mockResolvedValueOnce({ data: [] });

    render(
      <MemoryRouter>
        <CadastroCrianca />
      </MemoryRouter>,
    );

    expect(screen.getByText(/Carregando bebês cadastrados.../i)).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText(/Nenhum bebê cadastrado/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Cadastrar primeiro bebê/i })).toBeInTheDocument();
    });
  });

  it('deve submeter formulário de cadastro de bebê com sucesso', async () => {
    vi.spyOn(api, 'get').mockResolvedValueOnce({ data: [] });
    vi.spyOn(api, 'post').mockResolvedValueOnce({ data: { idCrianca: 1 } });

    render(
      <MemoryRouter>
        <CadastroCrianca />
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /Cadastrar primeiro bebê/i })).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole('button', { name: /Cadastrar primeiro bebê/i }));

    expect(screen.getByRole('heading', { name: /Cadastro do bebê/i })).toBeInTheDocument();

    fireEvent.change(screen.getByPlaceholderText(/Ex.: Clara Silva/i), { target: { value: 'Sofia' } });
    fireEvent.change(screen.getByLabelText(/Data de nascimento/i), { target: { value: '2025-06-10' } });
    fireEvent.change(screen.getByLabelText(/Horário de nascimento/i), { target: { value: '08:30' } });

    fireEvent.click(screen.getByRole('button', { name: /Salvar dados do bebê/i }));

    await waitFor(() => {
      expect(api.post).toHaveBeenCalledWith('/criancas', expect.objectContaining({
        nome: 'Sofia',
        data_nascimento: '2025-06-10',
        hora_nascimento: '08:30:00',
      }));
    });
  });
});
