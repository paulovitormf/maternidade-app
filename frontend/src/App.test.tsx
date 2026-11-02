import { describe, expect, it, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from './App';

describe('App Navigation and Layout', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  it('deve exibir a tela de boas-vindas para usuário não autenticado', () => {
    render(<App />);

    expect(screen.getByText(/Acompanhe sua jornada com mais leveza/i)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Entrar na minha conta/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Criar cadastro/i })).toBeInTheDocument();
  });

  it('deve exibir o dashboard e menu de perfil para usuário autenticado', () => {
    const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
    const payload = btoa(JSON.stringify({ sub: 'maria@example.com', exp: Math.floor(Date.now() / 1000) + 3600 }));
    const token = `${header}.${payload}.signature`;

    localStorage.setItem('access_token', token);
    localStorage.setItem('id_usuario', '1');
    localStorage.setItem(
      'usuario_autenticado',
      JSON.stringify({ id_usuario: 1, nome: 'Maria Silva', email: 'maria@example.com' }),
    );

    render(<App />);

    expect(screen.getByText(/Olá, Maria!/i)).toBeInTheDocument();
    expect(screen.getByText(/Sua jornada começa aqui/i)).toBeInTheDocument();

    const notificationTrigger = screen.getByRole('button', { name: /Abrir notificações/i });
    fireEvent.click(notificationTrigger);
    expect(screen.getByText(/Nenhuma notificação nova/i)).toBeInTheDocument();
    fireEvent.click(notificationTrigger);
    expect(screen.queryByText(/Nenhuma notificação nova/i)).not.toBeInTheDocument();

    const trigger = screen.getByRole('button', { name: /Maria/i });
    fireEvent.click(trigger);

    expect(screen.getByRole('menuitem', { name: /Meu perfil/i })).toBeInTheDocument();
    const sairBtn = screen.getByRole('menuitem', { name: /Sair/i });
    fireEvent.click(sairBtn);

    expect(localStorage.getItem('access_token')).toBeNull();
  });
});
