import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./app",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 3 : 0,
  reporter: "html",
  use: {
    baseURL: "http://localhost:3000",
    trace: "on-first-retry",
    video: "retain-on-failure",
    // ...devices["Desktop Chrome"],
  },
  webServer: {
    command: "yarn dev",
    url: "http://localhost:3000",
    reuseExistingServer: !process.env.CI,
  },
  timeout: 60 * 1000,
});
