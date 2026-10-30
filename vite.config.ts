import { defineConfig } from 'vitest/config';

export default defineConfig({
  base: './',
  build: {
    target: 'es2022',
    rollupOptions: {
      input: {
        main: 'index.html',
        previewA: 'preview/a/index.html',
        previewB: 'preview/b/index.html',
        previewC: 'preview/c/index.html',
        previewD: 'preview/d/index.html',
      },
    },
  },
  test: { include: ['tests/{core,content,sim}/**/*.test.ts'], testTimeout: 30_000 },
});
