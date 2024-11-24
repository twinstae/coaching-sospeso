// @ts-check
import { defineConfig } from "astro/config";

import react from "@astrojs/react";
import tsconfigPaths from "vite-tsconfig-paths";
import vercel from "@astrojs/vercel/serverless";
import sitemap from "@astrojs/sitemap";

const ReactCompilerConfig = {
  target: "18",
};

// https://astro.build/config
export default defineConfig({
  integrations: [
    react({
      babel: {
        plugins: import.meta.vitest
          ? [["babel-plugin-react-compiler", ReactCompilerConfig]]
          : undefined,
      },
    }),
    sitemap({
      filter: (pageUrl) => {
        const excludePatterns = ["/admin/", "/payment/"];
        // pageUrl 에 excludePatterns 중 하나라도 포함되면 false 반환
        return !excludePatterns.some((pattern) => pageUrl.includes(pattern));
      },
      // 정적 페이지 추가
      customPages: [
        "/",
        "/terms/privacy",
        "/terms/usage",
      ],
    }),
  ],
  vite: {
    plugins: [tsconfigPaths()],
  },
  output: "server",
  adapter: vercel(),
});
