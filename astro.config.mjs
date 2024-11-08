// @ts-check
import { defineConfig } from "astro/config";

import react from "@astrojs/react";
import tsconfigPaths from "vite-tsconfig-paths";
import vercel from "@astrojs/vercel/serverless";

const ReactCompilerConfig = {
  target: "18",
};

// https://astro.build/config
export default defineConfig({
  integrations: [
    react({
      babel: {
        plugins: [["babel-plugin-react-compiler", ReactCompilerConfig]],
      },
    }),
  ],
  vite: {
    plugins: [tsconfigPaths()],
  },
  output: "server",
  adapter: vercel()
});
