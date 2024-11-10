import { getViteConfig } from "astro/config";

export default getViteConfig({
  root: "./",
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
        "src/routing/navigate.ts",
        "src/adapters/**"
      ],
    },
  },
});
