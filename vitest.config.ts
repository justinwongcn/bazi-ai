import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    exclude: [
      '**/node_modules/**',
      '**/dist/**',
      '**/.trae/**',
      '**/.{idea,git,cache,output}/**'
    ],
    globals: true,
    environment: 'jsdom'
  }
});
