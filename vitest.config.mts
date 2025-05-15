import path from 'path';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    typecheck: {
      enabled: true,
    },
    setupFiles: './src/tests/setup.ts',
    include: ['src/tests/**/*.test.ts'],
    exclude: ['node_modules', 'dist', 'prisma'],
    watch: false,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@prisma': path.resolve(__dirname, './prisma'),
    },
  },
});
