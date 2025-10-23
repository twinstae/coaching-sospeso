import { defineConfig } from 'vitest/config'
import { config } from "dotenv";
import react from '@vitejs/plugin-react';
import tsconfigPaths from "vite-tsconfig-paths";
import svgr from "vite-plugin-svgr";
import { playwright } from '@vitest/browser-playwright';
import path from 'node:path';

const { parsed } = config({ path: ".env" });
export default defineConfig({
  root: "./",
  optimizeDeps: {
    include: ["@vitest/coverage-istanbul"],
  },
  define: {
    "import.meta.env": parsed ?? {},
  },
  plugins: [tsconfigPaths(), react() as any, svgr()],
  resolve: {
    alias: [
      { find: "@", replacement: path.resolve(__dirname, "src") },
    ],
  },
  test: {
    globals: true,
    projects:  [
      {
        extends: true,
        test: {
          setupFiles: "./setupTests.ts",
          include: [
            "src/components/**/*.test.{ts,tsx}",
            "src/shared/**/*.test.{ts,tsx}",
            "src/routing/**/*.test.{ts,tsx}",
          ],
          name: "browser",
          css: true,
          retry: 3,
          browser: {
            enabled: true,
            headless: true,
            provider: playwright({
              launchOptions: {}
            }) as any,
            instances: [
              {
                browser: 'chromium',
              },
            ],
          },
        },
      },
      {
        extends: true,
        test: {
          include: [
            "src/accounting/**/*.test.ts",
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
    ],
    coverage: {
      enabled: false,
      provider: "istanbul",
      exclude: [
        "coverage/**",
        "dist/**",
        "**/[.]**",
        "packages/*/test?(s)/**",
        "**/*.d.ts",
        "**/virtual:*",
        "**/__x00__*",
        "**/\x00*",
        "cypress/**",
        "test?(s)/**",
        "test?(-*).?(c|m)[jt]s?(x)",
        "**/*{.,-}{test,spec}?(-d).?(c|m)[jt]s?(x)",
        "**/__tests__/**",
        "**/{karma,rollup,webpack,vite,vitest,jest,ava,babel,nyc,cypress,tsup,build,astro,playwright}.config.*",
        "**/vitest.{workspace,projects}.[jt]s?(on)",
        "**/.{eslint,mocha,prettier}rc.{?(c|m)js,yml}",
        "drizzle.config.ts",
        "src/stories/**",
        "src/siheom/**",
        "src/pages/**",
        "src/layouts/**",
        "src/astro/**",
        "src/adapters/**",
        "src/lib/**",
        "src/middleware/**",
        "src/shared/email",
      ],
    },
  },
});
