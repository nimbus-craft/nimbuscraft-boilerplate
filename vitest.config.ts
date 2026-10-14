import { defineConfig } from 'vitest/config';
import path from 'node:path';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    alias: {
      '@config': path.resolve(import.meta.dirname, './src/config'),
      '@db': path.resolve(import.meta.dirname, './src/db'),
      '@plugins': path.resolve(import.meta.dirname, './src/plugins'),
      '@routes': path.resolve(import.meta.dirname, './src/routes'),
      '@tests': path.resolve(import.meta.dirname, './src/tests'),
      '@': path.resolve(import.meta.dirname, './src'),
    },
    include: ['src/**/*.test.ts'],
    server: {
      deps: {
        inline: ['@fastify/autoload'],
      },
    },
  },
});
