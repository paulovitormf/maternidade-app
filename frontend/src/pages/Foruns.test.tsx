import { render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import Foruns from './Foruns';
import api from '../services/api';

describe('Fóruns', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('exibe uma data relativa recente para postagens com LocalDateTime em formato de array', async () => {
    vi.spyOn(api, 'get').mockImplementation((url: string) => {
      if (url === '/forum/categorias') {
        return Promise.resolve({
          data: [{ id: 1, nome: 'Gestação', descricao: 'Converse', discussoes: 1 }],
        });
      }
      if (url === '/forum/topicos') {
        const now = new Date();
        return Promise.resolve({
          data: [{
            id: 1,
            categoriaId: 1,
            categoria: 'Gestação',
            titulo: 'Minha primeira postagem',
            conteudo: 'Conteúdo da postagem',
            autor: 'Maria',
            curtidoPeloUsuario: false,
            curtidas: 0,
            respostas: 0,
            fixado: false,
            dataCriacao: [now.getFullYear(), now.getMonth() + 1, now.getDate(), now.getHours(), now.getMinutes(), now.getSeconds()],
            ultimasRespostas: [],
          }],
        });
      }
      return Promise.reject(new Error(`URL não esperada: ${url}`));
    });

    render(
      <MemoryRouter>
        <Foruns />
      </MemoryRouter>,
    );

    await waitFor(() => {
      const titulo = screen.getByText('Minha primeira postagem');
      const card = titulo.closest('article');
      expect(card).not.toBeNull();
      expect(card?.textContent).toMatch(/Por Maria.*agora|Por Maria.*há 0 min/i);
    });
  });
});
