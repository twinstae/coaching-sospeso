import { defineConfig } from 'vitest/config'
import { config } from "dotenv";
import react from '@vitejs/plugin-react';
import tsconfigPaths from "vite-tsconfig-paths";
import svgr from "vite-plugin-svgr";

const { parsed } = config({ path: ".env" });
export default defineConfig({
  root: "./",
  optimizeDeps: {
    include: ["@vitest/coverage-istanbul"],
  },
  define: {
    "import.meta.env": parsed ?? {},
  },
  plugins: [react() as any, tsconfigPaths(), svgr()],
  test: {
    pool: "vmThreads",
    poolOptions: {
      useAtomics: true,
    },
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
