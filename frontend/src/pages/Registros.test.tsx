import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import api from '../services/api';
import Registros from './Registros';

describe('Registros', () => {
  beforeEach(() => {
    localStorage.clear();
    localStorage.setItem('id_usuario', '1');
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it('vincula o novo registro à gestação real do usuário', async () => {
    vi.spyOn(api, 'get').mockImplementation((url) => {
      if (url === '/criancas') return Promise.resolve({ data: [] });
      if (url.includes('/registros/')) return Promise.resolve({ data: [] });
      return Promise.resolve({
        data: { id_gestacao: 17, ultima_mestruacao: '2026-01-10' },
      });
    });
    const salvar = vi.spyOn(api, 'post').mockResolvedValue({ data: {} });

    render(<MemoryRouter><Registros /></MemoryRouter>);

    await waitFor(() => {
      expect(screen.getByText('Nenhum registro encontrado')).toBeInTheDocument();
    });
    fireEvent.click(screen.getAllByRole('button', { name: /Adicionar registro/i })[0]);

    expect(screen.getByRole('option', { name: /DUM: 2026-01-10/i })).toHaveValue('gestacao:17');
    expect(screen.queryByRole('option', { name: 'Minha gestação mais recente' })).not.toBeInTheDocument();
    fireEvent.change(screen.getByLabelText('Para quem'), { target: { value: 'gestacao:17' } });
    fireEvent.change(screen.getByLabelText('Título'), { target: { value: 'Consulta de pré-natal' } });
    fireEvent.click(screen.getByRole('button', { name: /Salvar registro/i }));

    await waitFor(() => {
      expect(salvar).toHaveBeenCalledWith('/registros', expect.objectContaining({
        id_usuario: 1,
        id_crianca: null,
        id_gestacao: 17,
        titulo: 'Consulta de pré-natal',
      }));
    });
  }, 10_000);

  it('mostra a mensagem retornada pela API quando o registro não é salvo', async () => {
    vi.spyOn(api, 'get').mockImplementation((url) => {
      if (url === '/criancas') return Promise.resolve({ data: [{ idCrianca: 4, nome: 'Bebê', podeEditar: true }] });
      if (url.includes('/registros/')) return Promise.resolve({ data: [] });
      return Promise.reject({ isAxiosError: true, response: { status: 404 } });
    });
    vi.spyOn(api, 'post').mockRejectedValue({
      isAxiosError: true,
      response: { status: 400, data: 'Criança não encontrada.' },
    });

    render(<MemoryRouter><Registros /></MemoryRouter>);

    await waitFor(() => {
      expect(screen.getByText('Nenhum registro encontrado')).toBeInTheDocument();
    });
    fireEvent.click(screen.getAllByRole('button', { name: /Adicionar registro/i })[0]);
    fireEvent.change(screen.getByLabelText('Para quem'), { target: { value: 'crianca:4' } });
    fireEvent.change(screen.getByLabelText('Título'), { target: { value: 'Consulta' } });
    fireEvent.click(screen.getByRole('button', { name: /Salvar registro/i }));

    expect(await screen.findByRole('alert')).toHaveTextContent('Criança não encontrada.');
  });

  it('mostra na galeria registros de qualquer tipo que tenham foto anexada', async () => {
    vi.spyOn(api, 'get').mockImplementation((url) => {
      if (url === '/criancas') return Promise.resolve({ data: [] });
      if (url.includes('/registros/')) {
        return Promise.resolve({
          data: [{
            id_registro: 8,
            id_crianca: 4,
            nome_crianca: 'Bebê',
            id_gestacao: null,
            tipo: 'VACINA',
            titulo: 'Vacina com foto',
            descricao: 'Registro com imagem anexada',
            confirmado: true,
            data_registro: '2026-11-21',
            foto_base64: 'data:image/png;base64,aGVsbG8=',
          }],
        });
      }
      return Promise.reject({ isAxiosError: true, response: { status: 404 } });
    });

    render(<MemoryRouter><Registros /></MemoryRouter>);

    await waitFor(() => {
      expect(screen.getByText('Vacina com foto')).toBeInTheDocument();
    });
    fireEvent.click(screen.getByRole('button', { name: /Galeria/i }));

    expect(screen.getByText('Vacina com foto')).toBeInTheDocument();
    expect(screen.getByRole('img', { name: 'Vacina com foto' })).toHaveAttribute(
      'src',
      'data:image/png;base64,aGVsbG8=',
    );
  });

  it('permite editar um registro próprio', async () => {
    vi.spyOn(api, 'get').mockImplementation((url) => {
      if (url === '/criancas') return Promise.resolve({ data: [{ idCrianca: 4, nome: 'Bebê', podeEditar: true }] });
      if (url.includes('/registros/')) {
        return Promise.resolve({
          data: [{
            id_registro: 12,
            id_crianca: 4,
            nome_crianca: 'Bebê',
            id_gestacao: null,
            tipo: 'CONSULTA',
            titulo: 'Consulta de rotina',
            descricao: '',
            confirmado: false,
            data_registro: '2026-11-20',
            pode_editar: true,
          }],
        });
      }
      return Promise.reject({ isAxiosError: true, response: { status: 404 } });
    });
    const atualizar = vi.spyOn(api, 'put').mockResolvedValue({ data: {} });

    render(<MemoryRouter><Registros /></MemoryRouter>);

    fireEvent.click(await screen.findByRole('button', { name: /Editar Consulta de rotina/i }));
    fireEvent.change(screen.getByLabelText('Título'), { target: { value: 'Consulta pediátrica' } });
    fireEvent.click(screen.getByRole('button', { name: /Salvar alterações/i }));

    await waitFor(() => {
      expect(atualizar).toHaveBeenCalledWith('/registros/12', expect.objectContaining({
        titulo: 'Consulta pediátrica',
        id_crianca: 4,
      }));
    });
  });

  it('permite excluir um registro próprio após confirmação', async () => {
    vi.spyOn(api, 'get').mockImplementation((url) => {
      if (url === '/criancas') return Promise.resolve({ data: [{ idCrianca: 4, nome: 'Bebê', podeEditar: true }] });
      if (url.includes('/registros/')) {
        return Promise.resolve({
          data: [{
            id_registro: 13,
            id_crianca: 4,
            nome_crianca: 'Bebê',
            id_gestacao: null,
            tipo: 'OUTRO',
            titulo: 'Anotação',
            confirmado: false,
            data_registro: '2026-11-20',
            pode_editar: true,
          }],
        });
      }
      return Promise.reject({ isAxiosError: true, response: { status: 404 } });
    });
    vi.stubGlobal('confirm', vi.fn(() => true));
    const excluir = vi.spyOn(api, 'delete').mockResolvedValue({ data: {} });

    render(<MemoryRouter><Registros /></MemoryRouter>);

    fireEvent.click(await screen.findByRole('button', { name: /Excluir Anotação/i }));

    await waitFor(() => {
      expect(excluir).toHaveBeenCalledWith('/registros/13');
    });
    vi.unstubAllGlobals();
  });
});
