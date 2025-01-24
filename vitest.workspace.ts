import { defineWorkspace } from "vitest/config";

export default defineWorkspace([
  {
    extends: "./vitest.config.ts",
    test: {
      setupFiles: "./setupTests.ts",
      include: [
        "src/components/**/*.test.{ts,tsx}",
        "src/shared/**/*.test.{ts,tsx}",
        "src/routing/**/*.test.{ts,tsx}",
      ],
      name: "browser",
      css: true,
      browser: {
        enabled: true,
        name: "chromium",
        headless: true,
        provider: "playwright",
      },
    },
  },
  {
    extends: "./vitest.config.ts",
    test: {
      include: [
        "src/actions/**/*.test.ts",
        "src/services/**/*.test.ts",
        "src/sospeso/**/*.test.ts",
        "src/accounting/**/*.test.ts",
        "src/auth/**/*.test.ts",
        "src/pages/api/**/*.test.ts",
        "src/pages/sitemap/*.test.ts",
        "src/payment/**/*.test.ts",
        "src/user/**/*.test.ts",
        "src/*.test.ts",
      ],
      name: "unit",
      environment: "node",
    },
  },
]);
