import { defineConfig, devices } from "@playwright/test";

import dotenv from "dotenv";
dotenv.config();

export default defineConfig({
  testDir: "./tests",
  reporter: "html",
  use: {
    trace: "off",
  },

  projects: [
    {
      timeout: 900000,
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
});
