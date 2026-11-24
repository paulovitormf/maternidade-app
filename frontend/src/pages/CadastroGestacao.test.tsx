import { describe, expect, it, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import CadastroGestacao from './CadastroGestacao';
import api from '../services/api';
import { APP_TOAST_EVENT } from '../services/toastService';

const mockedNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockedNavigate,
    useLocation: () => ({ state: null }),
  };
});

describe('CadastroGestacao Component', () => {
  beforeEach(() => {
    localStorage.clear();
    localStorage.setItem('id_usuario', '1');
    vi.restoreAllMocks();
    mockedNavigate.mockReset();
  });

  it('deve exibir estado vazio quando o usuário não tiver gestações cadastradas', async () => {
    vi.spyOn(api, 'get').mockResolvedValueOnce({ data: [] });

    render(
      <MemoryRouter>
        <CadastroGestacao />
      </MemoryRouter>,
    );

    expect(screen.getByText(/Carregando suas gestações.../i)).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText(/Nenhuma gestação cadastrada/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Cadastrar primeira gestação/i })).toBeInTheDocument();
    });
  });

  it('deve listar gestações cadastradas separando atuais e anteriores', async () => {
    const gestacoesMock = [
      {
        id_gestacao: 1,
        ultima_mestruacao: '2026-01-01',
        idade_gestacional: 12,
        data_parto: '2099-10-08',
        tipo_gestacao: 'UNICA',
        pre_natal: true,
      },
      {
        id_gestacao: 2,
        ultima_mestruacao: '2020-01-01',
        idade_gestacional: 40,
        data_parto: '2020-10-08',
        tipo_gestacao: 'GEMEOS',
        tipo_gestacao_detalhe: 'BIVITELINO',
        pre_natal: true,
      },
    ];

    vi.spyOn(api, 'get').mockResolvedValueOnce({ data: gestacoesMock });

    render(
      <MemoryRouter>
        <CadastroGestacao />
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(screen.getByText(/Gestação atual/i)).toBeInTheDocument();
      expect(screen.getByText(/Gestações anteriores/i)).toBeInTheDocument();
      expect(screen.getAllByRole('button', { name: /Editar/i })).toHaveLength(2);
    });
  });

  it('deve abrir formulário ao clicar em Cadastrar gestação e salvar registro', async () => {
    vi.spyOn(api, 'get').mockResolvedValue({ data: [] });
    vi.spyOn(api, 'post').mockResolvedValueOnce({ data: { id_gestacao: 10 } });
    const dispatchEvent = vi.spyOn(window, 'dispatchEvent');

    render(
      <MemoryRouter>
        <CadastroGestacao />
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /Cadastrar gestação/i })).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole('button', { name: /Cadastrar gestação/i }));

    expect(screen.getByRole('heading', { name: /Registro da gestação/i })).toBeInTheDocument();

    const dumInput = screen.getByLabelText(/Data da última menstruação/i);
    fireEvent.change(dumInput, { target: { value: '2026-01-01' } });

    expect(screen.getByText(/Data provável do parto:/i)).toBeInTheDocument();

    const submitBtn = screen.getByRole('button', { name: /Salvar dados da gestação/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(api.post).toHaveBeenCalledWith('/gestacoes', expect.objectContaining({
        id_usuario: 1,
        ultima_mestruacao: '2026-01-01',
      }));
    });
    expect(dispatchEvent).toHaveBeenCalledWith(expect.objectContaining({
      type: APP_TOAST_EVENT,
      detail: 'Gestação cadastrada com sucesso!',
    }));
    await waitFor(() => expect(mockedNavigate).toHaveBeenCalledWith('/', { replace: true }));
  });

  it('exclui gestação e registros vinculados após confirmação', async () => {
    let gestacoes = [{
      id_gestacao: 10,
      ultima_mestruacao: '2026-01-01',
      idade_gestacional: 12,
      data_parto: '2099-10-08',
      tipo_gestacao: 'UNICA',
      pre_natal: true,
    }];
    vi.spyOn(api, 'get').mockImplementation(() => Promise.resolve({ data: gestacoes }));
    const excluir = vi.spyOn(api, 'delete').mockImplementation(async () => {
      gestacoes = [];
      return { data: {} };
    });

    render(<MemoryRouter><CadastroGestacao /></MemoryRouter>);

    fireEvent.click(await screen.findByRole('button', { name: 'Editar' }));
    fireEvent.click(await screen.findByRole('button', { name: 'Excluir gestação' }));

    const dialog = await screen.findByRole('dialog', { name: 'Excluir esta gestação?' });
    expect(dialog).toHaveTextContent(/todos os registros vinculados/i);
    expect(excluir).not.toHaveBeenCalled();
    fireEvent.click(screen.getByRole('button', { name: 'Sim, excluir gestação' }));

    await waitFor(() => expect(excluir).toHaveBeenCalledWith('/gestacoes/10'));
    expect(await screen.findByText(/Nenhuma gestação cadastrada/i)).toBeInTheDocument();
  });
});
