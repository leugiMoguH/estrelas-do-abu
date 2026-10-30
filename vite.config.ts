import { defineConfig } from 'vitest/config';

export default defineConfig({
  base: './',
  build: { target: 'es2022' },
  test: { include: ['tests/{core,content,sim}/**/*.test.ts'], testTimeout: 30_000 },
});
