export function resolveApiBaseUrl(value?: string): string {
  return value || 'http://localhost:8080/api';
}
