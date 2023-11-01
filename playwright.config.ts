import { defineConfig } from "@playwright/test";

import dotenv from "dotenv";
dotenv.config();

export default defineConfig({
  testDir: "./tests",
  use: {
    trace: "off",
  },

  projects: [
    {
      timeout: 900000,
    },
  ],
});
