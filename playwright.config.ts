import { defineConfig, devices } from "@playwright/test";

const PORT = Number(process.env.PLAYWRIGHT_PORT ?? 3001);
const baseURL = `http://localhost:${PORT}`;

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: 1,
  reporter: process.env.CI ? "github" : "list",
  timeout: 60_000,
  expect: { timeout: 10_000 },
  use: {
    baseURL,
    trace: "on-first-retry",
    screenshot: "only-on-failure",
  },
  webServer: process.env.CI
    ? {
        command: `npm run build && npm run start -- -p ${PORT}`,
        url: baseURL,
        reuseExistingServer: false,
        timeout: 180_000,
      }
    : {
        command: `npm run dev -- -p ${PORT}`,
        url: baseURL,
        reuseExistingServer: true,
        timeout: 120_000,
      },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
    {
      name: "mobile-chrome",
      use: { ...devices["Pixel 7"] },
    },
  ],
});
