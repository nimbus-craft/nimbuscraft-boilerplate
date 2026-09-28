import { defineConfig } from 'vitest/config';
import path from 'node:path';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    alias: {
      '@config': path.resolve(import.meta.dirname, './src/config'),
      '@controllers': path.resolve(import.meta.dirname, './src/controllers'),
      '@middlewares': path.resolve(import.meta.dirname, './src/middlewares'),
      '@modules': path.resolve(import.meta.dirname, './src/modules'),
      '@utils': path.resolve(import.meta.dirname, './src/utils'),
      '@routes': path.resolve(import.meta.dirname, './src/routes'),
    },
  },
});
