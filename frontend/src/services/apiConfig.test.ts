import { describe, expect, it } from 'vitest';
import { resolveApiBaseUrl } from './apiConfig';

describe('resolveApiBaseUrl', () => {
  it('preserva o endereço configurado pelo ambiente', () => {
    expect(resolveApiBaseUrl('http://localhost:8080/api')).toBe('http://localhost:8080/api');
  });

  it('não altera barras ou prefixos configurados', () => {
    expect(resolveApiBaseUrl('http://localhost:8080/api/')).toBe('http://localhost:8080/api/');
  });

  it('usa o endereço local padrão', () => {
    expect(resolveApiBaseUrl()).toBe('http://localhost:8080/api');
  });
});
