import swc from 'unplugin-swc';
import { defineConfig } from 'vitest/config';
import { resolve } from 'path';

export default defineConfig({
  test: {
    globals: true,
    root: './',
    include: ['src/**/*.spec.ts'],
    exclude: ['**/node_modules/**', '**/dist/**', '**/*.controller.spec.ts'],
    coverage: {
      provider: 'v8',
      all: false,
      include: ['src/**/*.ts'],
      exclude: [
        'src/**/*.spec.ts',
        'src/**/*.module.ts',
        'src/generated/**',
        'src/main.ts',
        'src/types/**',
        'src/**/*.dto.ts',
        'src/**/*.decorator.ts',
        'src/**/*.event.ts',
        'src/**/*.queries.ts',
      ],
    },
  },
  plugins: [
    swc.vite({
      module: { type: 'es6' },
    }),
  ],
  resolve: {
    alias: {
      src: resolve(__dirname, './src'),
    },
  },
});
