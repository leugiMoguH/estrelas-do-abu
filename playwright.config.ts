import { defineConfig } from '@playwright/test';

const sizes = [
  { name: 'telemovel-390x844', width: 390, height: 844, hasTouch: true },
  { name: 'tablet-820x1180', width: 820, height: 1180, hasTouch: true },
  { name: 'desktop-1280x800', width: 1280, height: 800, hasTouch: false },
];

export default defineConfig({
  testDir: 'tests/e2e',
  timeout: 90_000,
  retries: 0,
  // Os três viewports correm em série para limitar o consumo de memória.
  workers: 1,
  reporter: [['list']],
  outputDir: 'test-results',
  use: { baseURL: 'http://localhost:4173/' },
  webServer: {
    command: 'npm run build && npm run preview -- --port 4173 --strictPort',
    url: 'http://localhost:4173/',
    reuseExistingServer: true,
    timeout: 120_000,
  },
  projects: sizes.map(({ name, ...viewport }) => ({
    name,
    use: {
      browserName: 'chromium',
      viewport: { width: viewport.width, height: viewport.height },
      hasTouch: viewport.hasTouch,
    },
  })),
});
