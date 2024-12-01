// @ts-check
import { defineConfig } from "astro/config";

import react from "@astrojs/react";
import tsconfigPaths from "vite-tsconfig-paths";
import svgr from "vite-plugin-svgr";

import sentry from "@sentry/astro";

import node from "@astrojs/node";

const ReactCompilerConfig = {
  target: "18",
};

// https://astro.build/config
export default defineConfig({
  output: "server",
  adapter: node({
    mode: "standalone"
  }),
  integrations: [
    react({
      babel: {
        plugins: import.meta.vitest
          ? [["babel-plugin-react-compiler", ReactCompilerConfig]]
          : undefined,
      },
    }),
    sentry({
      dsn: "https://6e899b9ae9fb445693112299c2c64fcc@glitchtip.life-lifter.com/1",
      tracesSampleRate: 0.01,
    }),
  ],
  vite: {
    plugins: [tsconfigPaths(), svgr()],
  },
  experimental: {
    serverIslands: true,
    contentLayer: true,
  }
});