import { defineConfig } from '@playwright/test';
export default defineConfig({
  testDir: './tests/extension',
  timeout: 45000,
  workers: 1,
  outputDir: 'test-results/extension',
  reporter: [['list']],
  use: { trace: 'retain-on-failure', screenshot: 'only-on-failure' },
});
