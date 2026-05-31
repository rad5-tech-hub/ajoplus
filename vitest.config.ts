import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    include: ['src/__tests__/**/*.test.{ts,tsx}'],
    testTimeout: 10000,
    hookTimeout: 10000,
    coverage: {
      provider: 'v8',
      reporter: ['text'],
      exclude: [
        'node_modules/', 'src/test/', '**/*.d.ts',
        'src/main.tsx', 'src/vite-env.d.ts',
        'scripts/', 'public/', 'src/__tests__/'
      ],
    },
    alias: { '@': path.resolve(__dirname, './src') }
  }
});
