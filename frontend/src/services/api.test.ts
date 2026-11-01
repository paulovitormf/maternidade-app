import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';
import api from './api';

describe('api service and interceptors', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('deve adicionar o token Bearer no header Authorization quando presente no localStorage', () => {
    localStorage.setItem('access_token', 'token-jwt-123');

    const config = { headers: {} as any };
    const handlers = (api.interceptors.request as any).handlers;
    const requestHandler = handlers[0]?.fulfilled;
    const res = requestHandler(config);

    expect(res.headers.Authorization).toBe('Bearer token-jwt-123');
  });

  it('não deve adicionar o header Authorization quando não houver token no localStorage', () => {
    const config = { headers: {} as any };
    const handlers = (api.interceptors.request as any).handlers;
    const requestHandler = handlers[0]?.fulfilled;
    const res = requestHandler(config);

    expect(res.headers.Authorization).toBeUndefined();
  });

  it('deve limpar sessão e emitir evento maternidade-auth-changed em resposta HTTP 401', async () => {
    localStorage.setItem('access_token', 'token-antigo');
    localStorage.setItem('id_usuario', '10');
    localStorage.setItem('usuario_autenticado', '{"id_usuario":10}');

    const eventSpy = vi.fn();
    window.addEventListener('maternidade-auth-changed', eventSpy);

    const assignSpy = vi.fn();
    Object.defineProperty(window, 'location', {
      writable: true,
      value: { pathname: '/painel', assign: assignSpy },
    });

    const handlers = (api.interceptors.response as any).handlers;
    const errorHandler = handlers[0]?.rejected;

    const error = {
      response: { status: 401 },
    };

    await expect(errorHandler(error)).rejects.toEqual(error);

    expect(localStorage.getItem('access_token')).toBeNull();
    expect(localStorage.getItem('id_usuario')).toBeNull();
    expect(localStorage.getItem('usuario_autenticado')).toBeNull();
    expect(eventSpy).toHaveBeenCalledTimes(1);
    expect(assignSpy).toHaveBeenCalledWith('/login');

    window.removeEventListener('maternidade-auth-changed', eventSpy);
  });
});
