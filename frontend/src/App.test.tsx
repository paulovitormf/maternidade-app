import { describe, expect, it, vi, beforeEach } from 'vitest';
import { act, render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from './App';
import api from './services/api';
import { mostrarToast } from './services/toastService';

function autenticarUsuario() {
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const payload = btoa(JSON.stringify({ sub: 'maria@example.com', exp: Math.floor(Date.now() / 1000) + 3600 }));
  localStorage.setItem('access_token', `${header}.${payload}.signature`);
  localStorage.setItem('id_usuario', '1');
  localStorage.setItem(
    'usuario_autenticado',
    JSON.stringify({ id_usuario: 1, nome: 'Maria Silva', email: 'maria@example.com' }),
  );
}

function dataLocal(data: Date) {
  return `${data.getFullYear()}-${String(data.getMonth() + 1).padStart(2, '0')}-${String(data.getDate()).padStart(2, '0')}`;
}

describe('App Navigation and Layout', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  it('deve exibir a tela de boas-vindas para usuário não autenticado', () => {
    render(<App />);

    expect(screen.getByText(/Acompanhe sua jornada com mais leveza/i)).toBeInTheDocument();
    const welcome = within(screen.getByRole('main'));
    expect(welcome.getByRole('link', { name: /^Entrar$/i })).toBeInTheDocument();
    expect(welcome.getByRole('link', { name: /Cadastre-se/i })).toBeInTheDocument();
  });

  it('exibe o toast e o remove automaticamente após alguns segundos', () => {
    vi.useFakeTimers();
    try {
      render(<App />);
      act(() => mostrarToast('Conta criada com sucesso!'));

      expect(screen.getByRole('status')).toHaveTextContent('Conta criada com sucesso!');
      act(() => { vi.advanceTimersByTime(4500); });
      expect(screen.queryByText('Conta criada com sucesso!')).not.toBeInTheDocument();
    } finally {
      vi.useRealTimers();
    }
  });

  it('deve exibir o dashboard e menu de perfil para usuário autenticado', async () => {
    autenticarUsuario();

    render(<App />);

    expect(screen.getByText(/Olá, Maria!/i)).toBeInTheDocument();
    expect(screen.getByText(/Sua jornada começa aqui/i)).toBeInTheDocument();

    const notificationTrigger = screen.getByRole('button', { name: /Abrir notificações/i });
    fireEvent.click(notificationTrigger);
    expect(screen.getByText(/Nenhuma notificação nova/i)).toBeInTheDocument();
    fireEvent.click(notificationTrigger);
    await waitFor(() => expect(notificationTrigger).toHaveAttribute('aria-expanded', 'false'));

    const trigger = screen.getByRole('button', { name: /Maria/i });
    fireEvent.click(trigger);

    expect(screen.getByRole('menuitem', { name: /Meu perfil/i })).toBeInTheDocument();
    const sairBtn = screen.getByRole('menuitem', { name: /Sair/i });
    fireEvent.click(sairBtn);

    expect(localStorage.getItem('access_token')).toBeNull();
  });

  it('abre o menu Mais com o perfil no topo e os links da navegação principal', () => {
    autenticarUsuario();
    render(<App />);

    fireEvent.click(screen.getByRole('button', { name: 'Mais' }));

    const menu = screen.getByRole('complementary', { name: 'Menu principal' });
    expect(within(menu).getByRole('link', { name: /Maria Silva.*Meu perfil/ })).toHaveAttribute('href', '/perfil');
    expect(within(menu).getByRole('link', { name: 'Jornada da gestação' })).toBeInTheDocument();
    expect(within(menu).getByRole('link', { name: 'Jornada infantil' })).toBeInTheDocument();
    expect(within(menu).getByRole('link', { name: 'Fóruns' })).toBeInTheDocument();
    expect(within(menu).getByRole('link', { name: 'Artigos' })).toBeInTheDocument();
  });

  it('exibe apenas o próximo compromisso futuro e a fase da gestação ativa', async () => {
    autenticarUsuario();
    const hoje = new Date();
    const ontem = new Date(hoje);
    ontem.setDate(hoje.getDate() - 1);
    const amanha = new Date(hoje);
    amanha.setDate(hoje.getDate() + 1);
    const depois = new Date(hoje);
    depois.setDate(hoje.getDate() + 3);
    const dum = new Date(hoje);
    dum.setDate(hoje.getDate() - 120);

    vi.spyOn(api, 'get').mockImplementation((url) => {
      if (url === '/registros/usuario/1') {
        return Promise.resolve({ data: [
          { tipo: 'CONSULTA', titulo: 'Compromisso passado', confirmado: false, data_registro: dataLocal(ontem) },
          { tipo: 'EXAME', titulo: 'Compromisso mais distante', confirmado: false, data_registro: dataLocal(depois) },
          { tipo: 'CONSULTA', titulo: 'Consulta futura mais próxima', confirmado: false, data_registro: dataLocal(amanha) },
        ] });
      }
      if (url.includes('/gestacoes/')) {
        const dataParto = new Date(dum);
        dataParto.setDate(dum.getDate() + 280);
        return Promise.resolve({ data: { ultima_mestruacao: dataLocal(dum), data_parto: dataLocal(dataParto) } });
      }
      return Promise.resolve({ data: [] });
    });

    render(<App />);

    const resumo = await screen.findByRole('region', { name: 'Resumo da jornada' });
    expect(within(resumo).getByText('Consulta futura mais próxima')).toBeInTheDocument();
    expect(within(resumo).getByText('Fase atual da gestação')).toBeInTheDocument();
    expect(within(resumo).getByText(/Previsão do parto:/)).toBeInTheDocument();
    expect(within(resumo).queryByText('Compromisso passado')).not.toBeInTheDocument();
    expect(within(resumo).queryByText('Compromisso mais distante')).not.toBeInTheDocument();
    expect(screen.queryByText('Crianças cadastradas')).not.toBeInTheDocument();
    expect(screen.queryByText('Vacinas registradas')).not.toBeInTheDocument();
    expect(screen.queryByText('Consultas registradas')).not.toBeInTheDocument();
  });

  it('oculta o resumo quando não há compromisso futuro nem gestação ativa', async () => {
    autenticarUsuario();
    const ontem = new Date();
    ontem.setDate(ontem.getDate() - 1);

    vi.spyOn(api, 'get').mockImplementation((url) => {
      if (url === '/registros/usuario/1') {
        return Promise.resolve({ data: [
          { tipo: 'VACINA', titulo: 'Compromisso concluído', confirmado: true, data_registro: dataLocal(ontem) },
        ] });
      }
      if (url.includes('/gestacoes/')) {
        return Promise.reject({ isAxiosError: true, response: { status: 404 } });
      }
      return Promise.resolve({ data: [] });
    });

    render(<App />);

    await waitFor(() => expect(screen.queryByRole('region', { name: 'Resumo da jornada' })).not.toBeInTheDocument());
    expect(screen.queryByText('Próximo compromisso')).not.toBeInTheDocument();
    expect(screen.queryByText('Fase atual da gestação')).not.toBeInTheDocument();
  });

  it('deve abrir a pagina de artigos e permitir filtrar por categoria', () => {
    autenticarUsuario();

    render(<App />);
    fireEvent.click(screen.getByRole('link', { name: /^Artigos$/ }));

    expect(screen.getByRole('heading', { name: /Artigos & leituras para mães/i })).toBeInTheDocument();
    const mains = screen.getAllByRole('main');
    fireEvent.click(within(mains[mains.length - 1]).getByRole('button', { name: 'Gestação' }));
    expect(screen.getByText('Preparando um espaço emocional para o parto')).toBeInTheDocument();
  });
});
