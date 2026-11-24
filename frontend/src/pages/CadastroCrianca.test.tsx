import { describe, expect, it, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import CadastroCrianca from './CadastroCrianca';
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

describe('CadastroCrianca Component', () => {
  beforeEach(() => {
    localStorage.clear();
    localStorage.setItem('id_usuario', '1');
    vi.restoreAllMocks();
    mockedNavigate.mockReset();
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

  it('abre o perfil individual ao selecionar o nome da criança', async () => {
    vi.spyOn(api, 'get').mockResolvedValueOnce({
      data: [{
        idCrianca: 7,
        nome: 'Sofia',
        dataNascimento: '2025-06-10',
        horaNascimento: '08:30:00',
        tipoAcesso: 'PRINCIPAL',
        podeEditar: true,
      }],
    });

    render(
      <MemoryRouter>
        <CadastroCrianca />
      </MemoryRouter>,
    );

    const link = await screen.findByRole('link', { name: 'Sofia' });
    expect(link).toHaveAttribute('href', '/bebes/7');
    expect(screen.getByRole('link', { name: 'Ver perfil individual' })).toHaveAttribute('href', '/bebes/7');
  });

  it('não mostra editar para outro responsável sem permissão', async () => {
    vi.spyOn(api, 'get').mockResolvedValueOnce({
      data: [{
        idCrianca: 7,
        nome: 'Sofia',
        dataNascimento: '2025-06-10',
        horaNascimento: '08:30:00',
        tipoAcesso: 'RESPONSAVEL',
        podeEditar: false,
      }],
    });

    render(<MemoryRouter><CadastroCrianca /></MemoryRouter>);

    expect(await screen.findByRole('link', { name: 'Sofia' })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Opções de Sofia' })).not.toBeInTheDocument();
  });

  it('permite editar os dados de um bebê cadastrado', async () => {
    const crianca = {
      idCrianca: 7,
      nome: 'Sofia',
      dataNascimento: '2025-06-10',
      horaNascimento: '08:30:00',
      tipoAcesso: 'RESPONSAVEL' as const,
      podeEditar: true,
    };
    vi.spyOn(api, 'get').mockImplementation((url) => {
      if (url === '/criancas') return Promise.resolve({ data: [crianca] });
      if (url === '/criancas/7') {
        return Promise.resolve({ data: {
          id_crianca: 7,
          nome: 'Sofia',
          data_nascimento: '2025-06-10',
          hora_nascimento: '08:30:00',
          sexo: 'F',
          peso_nascimento: 3.2,
          altura_nascimento: 49,
          observacoes: 'Nascimento tranquilo.',
          pode_editar: true,
        } });
      }
      return Promise.resolve({ data: [] });
    });
    const put = vi.spyOn(api, 'put').mockResolvedValue({ data: {} });

    render(<MemoryRouter><CadastroCrianca /></MemoryRouter>);

    fireEvent.click(await screen.findByRole('button', { name: 'Opções de Sofia' }));
    fireEvent.click(screen.getByRole('button', { name: 'Editar bebê' }));
    expect(await screen.findByRole('heading', { name: 'Editar dados do bebê' })).toBeInTheDocument();

    fireEvent.change(screen.getByPlaceholderText(/Ex.: Clara Silva/i), { target: { value: 'Sofia Oliveira' } });
    fireEvent.click(screen.getByRole('button', { name: 'Salvar alterações' }));

    await waitFor(() => {
      expect(put).toHaveBeenCalledWith('/criancas/7', expect.objectContaining({
        nome: 'Sofia Oliveira',
        data_nascimento: '2025-06-10',
        hora_nascimento: '08:30:00',
        sexo: 'F',
      }));
    });
    expect(await screen.findByText('Dados do bebê atualizados com sucesso.')).toBeInTheDocument();
  });

  it('exclui bebê e registros vinculados após confirmação', async () => {
    const crianca = {
      idCrianca: 7,
      nome: 'Sofia',
      dataNascimento: '2025-06-10',
      horaNascimento: '08:30:00',
      tipoAcesso: 'PRINCIPAL' as const,
      podeEditar: true,
    };
    let criancas = [crianca];
    vi.spyOn(api, 'get').mockImplementation((url) => {
      if (url === '/criancas') return Promise.resolve({ data: criancas });
      if (url === '/criancas/7') {
        return Promise.resolve({ data: {
          nome: 'Sofia',
          data_nascimento: '2025-06-10',
          hora_nascimento: '08:30:00',
          sexo: 'F',
          peso_nascimento: 3.2,
          altura_nascimento: 49,
          observacoes: null,
          pode_editar: true,
        } });
      }
      return Promise.resolve({ data: [] });
    });
    const excluir = vi.spyOn(api, 'delete').mockImplementation(async () => {
      criancas = [];
      return { data: {} };
    });

    render(<MemoryRouter><CadastroCrianca /></MemoryRouter>);

    fireEvent.click(await screen.findByRole('button', { name: 'Opções de Sofia' }));
    fireEvent.click(screen.getByRole('button', { name: 'Editar bebê' }));
    fireEvent.click(await screen.findByRole('button', { name: 'Excluir bebê' }));

    const dialog = await screen.findByRole('dialog', { name: 'Excluir o perfil de Sofia?' });
    expect(dialog).toHaveTextContent(/todos os registros vinculados/i);
    expect(excluir).not.toHaveBeenCalled();
    fireEvent.click(screen.getByRole('button', { name: 'Sim, excluir bebê' }));

    await waitFor(() => expect(excluir).toHaveBeenCalledWith('/criancas/7'));
    expect(await screen.findByText(/Nenhum bebê cadastrado/i)).toBeInTheDocument();
  });

  it('deve submeter formulário de cadastro de bebê com sucesso', async () => {
    vi.spyOn(api, 'get').mockResolvedValue({ data: [] });
    vi.spyOn(api, 'post').mockResolvedValueOnce({ data: { idCrianca: 1 } });
    const dispatchEvent = vi.spyOn(window, 'dispatchEvent');

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
    expect(dispatchEvent).toHaveBeenCalledWith(expect.objectContaining({
      type: APP_TOAST_EVENT,
      detail: 'Bebê cadastrado com sucesso!',
    }));
    await waitFor(() => expect(mockedNavigate).toHaveBeenCalledWith('/', { replace: true }));
  });
});
