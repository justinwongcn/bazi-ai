import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    include: ['src/**/*.test.ts', 'src/**/*.test.tsx', 'src/**/*.spec.ts', 'src/**/*.spec.tsx'],
    exclude: [
      '**/node_modules/**',
      '**/dist/**',
      '**/.trae/**',
      '**/.claude/**',
      '**/.opencode/**',
      '**/.agents/**',
      '**/.{idea,git,cache,output}/**'
    ],
    globals: true,
    environment: 'jsdom'
  }
});
