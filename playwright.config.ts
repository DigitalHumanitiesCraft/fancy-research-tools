import { defineConfig } from "@playwright/test";

const port = process.env.E2E_PORT || "4173";
const baseURL = `http://127.0.0.1:${port}`;
export default defineConfig({
  testDir: "./tests/e2e",
  use: { baseURL, channel: process.env.PLAYWRIGHT_CHANNEL, trace: "retain-on-failure" },
  webServer: {
    command: `node node_modules/vite/bin/vite.js preview --host 127.0.0.1 --port ${port} --strictPort`,
    url: baseURL,
    reuseExistingServer: !process.env.CI,
  },
});
