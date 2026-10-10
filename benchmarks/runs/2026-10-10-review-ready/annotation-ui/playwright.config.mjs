import { defineConfig } from 'C:/Users/chris/Documents/GitHub/fancy-research-tools/node_modules/@playwright/test/index.mjs';
export default defineConfig({
  testDir: 'C:/Users/chris/Documents/GitHub/fancy-research-tools/tests/e2e',
  testMatch: 'annotation.spec.ts',
  outputDir: './final-results',
  use: { baseURL: 'http://127.0.0.1:4187', trace: 'retain-on-failure' },
  webServer: {
    cwd: 'C:/Users/chris/Documents/GitHub/fancy-research-tools',
    command: 'node node_modules/vite/bin/vite.js --host 127.0.0.1 --port 4187 --strictPort',
    url: 'http://127.0.0.1:4187',
    reuseExistingServer: true,
  },
});
