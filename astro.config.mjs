// @ts-check
import { defineConfig } from "astro/config";

import react from "@astrojs/react";
import vercel from "@astrojs/vercel";
import svgr from "vite-plugin-svgr";

import sentry from "@sentry/astro";

const ReactCompilerConfig = {
  target: "18",
};

/** @type {any} */
const svgrConfig = svgr()

// https://astro.build/config
export default defineConfig({
  output: "server",
  adapter: vercel({}),
  integrations: [
    react({
      babel: {
        plugins: import.meta.vitest
          ? undefined
          : [["babel-plugin-react-compiler", ReactCompilerConfig]],
      },
    }),
    sentry({
      dsn: "https://6e899b9ae9fb445693112299c2c64fcc@glitchtip.life-lifter.com/1",
      tracesSampleRate: 0.01,
    }),
  ],
  vite: {
    plugins: [ 
      svgrConfig
    ],
  }
});
