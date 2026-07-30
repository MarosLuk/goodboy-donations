import { fileURLToPath } from 'node:url';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test/setup.ts'],
    include: ['src/**/*.{test,spec}.{ts,tsx}'],
    passWithNoTests: true,
    // lib/env refuses to load without this, and a test run should not depend on
    // whatever happens to sit in a local .env file.
    env: {
      NEXT_PUBLIC_API_BASE_URL: 'https://api.test',
    },
  },
});
