export function resolveApiBaseUrl(value?: string): string {
  const configuredUrl = value?.trim();
  if (!configuredUrl) {
    throw new Error('VITE_API_URL não está configurada.');
  }
  return configuredUrl;
}
