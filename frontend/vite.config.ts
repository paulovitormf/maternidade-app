import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { existsSync, readFileSync } from 'node:fs';
import { loadEnv } from 'vite';

function readFallbackEnv(): Record<string, string> {
  const file = new URL('../.env.example', import.meta.url);
  if (!existsSync(file)) {
    return {};
  }

  return Object.fromEntries(
    readFileSync(file, 'utf8')
      .split(/\r?\n/)
      .filter((line) => line && !line.startsWith('#') && line.includes('='))
      .map((line) => {
        const [key, ...value] = line.split('=');
        return [key.trim(), value.join('=').trim()];
      }),
  );
}

export default defineConfig(({ mode }) => {
  const env = { ...readFallbackEnv(), ...loadEnv(mode, '..', '') };

  return {
    plugins: [react()],
    envDir: '..',
    define: {
      'import.meta.env.VITE_API_URL': JSON.stringify(env.VITE_API_URL),
    },
    server: {
      port: Number(env.FRONTEND_PORT),
    },
  };
});